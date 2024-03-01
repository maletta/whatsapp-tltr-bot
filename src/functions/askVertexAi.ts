import { VertexAI } from '@google-cloud/vertexai'; // Importe a classe correta

async function createNonStreamingMultipartContent(messages: string) {
  const projectId = process.env.PROJECT_ID;
  const location = 'us-central1';
  const model = 'gemini-1.0-pro-vision';
  // image = 'gs://generativeai-downloads/images/scones.jpg',
  // mimeType = 'image/jpeg',
  // Initialize Vertex with your Cloud project and location
  const vertexAI = new VertexAI({ project: projectId, location });

  // Instantiate the model
  const generativeVisionModel = vertexAI.getGenerativeModel({
    model,
  });

  // For images, the SDK supports both Google Cloud Storage URI and base64 strings
  // const filePart = {
  //   fileData: {
  //     fileUri: image,
  //     mimeType,
  //   },
  // };

  const textPart = {
    // text: 'O que significa a cor azul',
    text: `Resuma as mensagens dessa conversa em tópicos dos assuntos mais relevantes: ${messages}`,
  };

  const request = {
    // contents: [{ role: 'user', parts: [filePart, textPart] }],
    contents: [{ role: 'user', parts: [textPart] }],
  };

  console.log('Prompt Text:');
  console.log(request.contents[0].parts[0].text);

  console.log('Non-Streaming Response Text:');
  // Create the response stream
  const responseStream =
    await generativeVisionModel.generateContentStream(request);

  // Wait for the response stream to complete
  const aggregatedResponse = await responseStream.response;

  // console.dir(aggregatedResponse, { depth: null });

  // Select the text from the response
  const fullTextResponse = aggregatedResponse.candidates[0].content.parts[0];

  console.log(fullTextResponse);

  return fullTextResponse.text;
}
export { createNonStreamingMultipartContent };
