import { VertexAI } from '@google-cloud/vertexai';

import { ITextSummarize } from '../ITextSummarize';

class TextSummarizeHttp implements ITextSummarize {
  async summarize(text: string): Promise<string> {
    const projectId = process.env.PROJECT_ID;
    const location = 'us-central1';
    const model = 'gemini-1.0-pro-vision';

    const vertexAI = new VertexAI({ project: projectId, location });

    const generativeVisionModel = vertexAI.getGenerativeModel({ model });

    const promptQuestion =
      'Resuma as mensagens dessas conversas realizadas em um chat de grupo do whatsapp em tópicos dos assuntos mais relevantes:';
    const prompt = {
      text: `${promptQuestion} ${text}`,
    };

    const request = {
      // contents: [{ role: 'user', parts: [filePart, textPart] }],
      contents: [{ role: 'user', parts: [prompt] }],
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

    return fullTextResponse.text;
  }
}

export { TextSummarizeHttp };
