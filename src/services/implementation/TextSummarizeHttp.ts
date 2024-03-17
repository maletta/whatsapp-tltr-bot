import { VertexAI } from '@google-cloud/vertexai';
import { ITextSummarize } from '@services/ITextSummarize';

class TextSummarizeHttp implements ITextSummarize {
  async summarize(prompt: string, message: string): Promise<string> {
    const projectId = process.env.PROJECT_ID;
    const location = 'us-central1';
    const model = 'gemini-1.0-pro-vision';

    const vertexAI = new VertexAI({ project: projectId, location });

    const generativeVisionModel = vertexAI.getGenerativeModel({ model });

    const promptQuestion = {
      text: `${prompt}${message}`,
    };

    const request = {
      // contents: [{ role: 'user', parts: [filePart, textPart] }],
      contents: [{ role: 'user', parts: [promptQuestion] }],
    };

    console.log('Prompt Text:');
    console.log(request.contents[0].parts[0].text);
    console.log('Non-Streaming Response Text:');

    // Create the response stream
    const responseStream =
      await generativeVisionModel.generateContentStream(request);

    // Wait for the response stream to complete
    const aggregatedResponse = await responseStream.response;

    // Select the text from the response
    const fullTextResponse = aggregatedResponse.candidates[0].content.parts[0];

    // console.dir(fullTextResponse);
    console.dir(fullTextResponse, { depth: null });

    return fullTextResponse.text.replace(/\*\*/g, '*');
  }

  async summarizeBatch(prompt: string, messages: string[]): Promise<string[]> {
    const firstSummaryPromise: Promise<string>[] = [];
    const finalSummaryPromise: Promise<string>[] = [];

    // Use array method `forEach` instead of a loop for cleaner syntax
    messages.forEach(async (message) => {
      try {
        const summary = this.summarize(prompt, message);
        firstSummaryPromise.push(summary);
      } catch (err) {
        console.error(`Error first summarizeBatch prompt "${prompt}"`);
        console.error(err);
      }
    });

    // Wait for all asynchronous operations to finish before returning
    const summaryResponses = await Promise.all(firstSummaryPromise);

    try {
      const summary = this.summarize(prompt, summaryResponses.join());
      finalSummaryPromise.push(summary);
    } catch (err) {
      console.error(`Error final summarizeBatch prompt "${prompt}"`);
      console.error(err);
    }

    const finalSummaryResponses = await Promise.all(finalSummaryPromise);

    return finalSummaryResponses;
  }
}

export { TextSummarizeHttp };
