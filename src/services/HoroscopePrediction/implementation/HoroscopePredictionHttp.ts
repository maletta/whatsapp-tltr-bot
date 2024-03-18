import { EnumHoroscope } from '@enums/Horoscope';
import { VertexAI } from '@google-cloud/vertexai';

import { IHoroscopePrediction } from '../IHoroscopePrediction';

class HoroscopePredictioHttp implements IHoroscopePrediction {
  async prediction(sign: EnumHoroscope): Promise<string> {
    const projectId = process.env.PROJECT_ID;
    const location = 'us-central1';
    const model = 'gemini-1.0-pro-vision';

    const vertexAI = new VertexAI({ project: projectId, location });

    const generativeVisionModel = vertexAI.getGenerativeModel({ model });

    const prompt = 'O que esperar para o signo: ';

    const promptQuestion = {
      text: `${prompt}${sign}`,
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

    console.log('All response ');
    console.dir(aggregatedResponse, { depth: null });

    console.log('Default response ');
    // Select the text from the response
    const fullTextResponse = aggregatedResponse.candidates[0].content.parts[0];

    // console.dir(fullTextResponse);
    console.dir(fullTextResponse, { depth: null });

    return fullTextResponse.text.replace(/\*\*/g, '*');
  }
}

export { HoroscopePredictioHttp };
