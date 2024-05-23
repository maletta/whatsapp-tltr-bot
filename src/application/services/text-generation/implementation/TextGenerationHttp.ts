import { VertexAI } from '@google-cloud/vertexai';

import { ITextGeneration } from '../ITextGeneration';
import { BotConfiguration } from 'config/Configuration';

// To do
// verificar erro de mensagem nula, sem a propriedade aninhada text, ou com text vazio
// fazer tentativa de reenvio ao erro

class TextGenerationHttp implements ITextGeneration {
  async generate(prompt: string): Promise<string | null> {
    return this.generateRecursive(prompt, 1);
  }

  async generateBatch(
    prompt: string,
    messages: string[],
  ): Promise<string | null> {
    const firstSummaryPromise: Promise<string | null>[] = [];

    try {
      messages.forEach(async (message) => {
        const summary = this.generate(`${prompt} ${message}`);
        firstSummaryPromise.push(summary);
      });

      const summaryResponses = await Promise.all(firstSummaryPromise);

      return summaryResponses.filter((item) => item !== null).join('\n\n');
    } catch (err) {
      console.error(`Error first summarizeBatch prompt "${prompt}"`);
      console.error(err);
      return null;
    }
  }

  private async generateRecursive(
    prompt: string,
    retry = 1,
  ): Promise<string | null> {
    const projectId = process.env.PROJECT_ID;
    const location = 'us-central1';
    const model = 'gemini-1.0-pro-vision';

    if (!projectId) {
      console.log('Environment variable PROJECT_ID is not defined');
      return null;
    }

    const vertexAI = new VertexAI({ project: projectId, location });

    const generativeVisionModel = await vertexAI.getGenerativeModel({ model });

    const promptQuestion = {
      text: `${prompt}`,
    };

    const request = {
      // contents: [{ role: 'user', parts: [filePart, textPart] }],
      contents: [{ role: 'user', parts: [promptQuestion] }],
    };

    if (BotConfiguration.isDevelopment()) {
      console.log('Prompt Text:');
      console.log(request.contents[0].parts[0].text);
      console.log('Non-Streaming Response Text:');
    }

    // Create the response stream
    try {
      const responseStream =
        await generativeVisionModel.generateContent(request);

      // Wait for the response stream to complete
      const aggregatedResponse = await responseStream.response;
      console.dir('aggregatedResponse', { depth: null });
      console.dir(aggregatedResponse, { depth: null });

      // Select the text from the response
      const fullTextResponse =
        aggregatedResponse.candidates[0].content.parts[0];

      // console.dir(fullTextResponse);
      console.dir(fullTextResponse, { depth: null });

      const responseWithoutAsteristc = fullTextResponse.text?.replace(
        /\*\*/g,
        '*',
      );

      return responseWithoutAsteristc && responseWithoutAsteristc.length > 0
        ? responseWithoutAsteristc
        : null;
    } catch (error) {
      console.log('Error on  generate content stream from generative api');
      console.log(error);
      if (retry > 0) {
        return this.generateRecursive(prompt, retry - 1);
      }

      return null;
    }
  }
}

export { TextGenerationHttp };
