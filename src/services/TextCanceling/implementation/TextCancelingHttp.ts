import { VertexAI } from '@google-cloud/vertexai';

import { ITextCanceling } from '../ITextCanceling';

class TextCancenlingHttp implements ITextCanceling {
  async canceling(prompt: string, message: string): Promise<string | null> {
    const projectId = process.env.PROJECT_ID;
    const location = 'us-central1';
    // const model = 'gemini-1.0-pro-vision';
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

    try {
      // Create the response stream
      const responseStream =
        await generativeVisionModel.generateContentStream(request);

      // Wait for the response stream to complete
      const aggregatedResponse = await responseStream.response;

      console.dir(aggregatedResponse, { depth: null });

      // Select the text from the response
      const fullTextResponse =
        aggregatedResponse.candidates[0].content.parts[0];

      // console.dir(fullTextResponse);
      console.dir(fullTextResponse, { depth: null });

      const responseWithoutAsteristc = fullTextResponse.text.replace(
        /\*\*/g,
        '*',
      );
      return responseWithoutAsteristc.length > 0
        ? responseWithoutAsteristc
        : null;
    } catch (error) {
      console.log('Error on  generate content stream from generative api');
      console.log(error);
      return null;
    }
  }
}

export { TextCancenlingHttp };
