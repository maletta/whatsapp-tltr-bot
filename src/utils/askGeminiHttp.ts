/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';

interface IPart {
  text: string;
}
interface IContent {
  role: string;
  parts: IPart[];
}
interface ISafetyRating {
  category: string;
  probability: string;
  probabilityScore: number;
  severity: string;
  severityScore: number;
}

interface IUsageMetadata {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
}

interface ICandidate {
  content: IContent;
  safetyRatings: ISafetyRating[];
  finishReason?: string; // Optional property
}

interface IApiResponse {
  candidates: ICandidate[];
  usageMetadata?: IUsageMetadata;
}

function getResponseText(responses: IApiResponse[]): string {
  // Verifique se o array de respostas está vazio
  if (!responses || !responses.length) {
    return '';
  }

  // Concatene o texto de todas as respostas
  let text = '';
  for (const response of responses) {
    // Verifique se a resposta contém candidatos
    if (!response.candidates || !response.candidates.length) {
      continue;
    }

    for (const candidate of response.candidates) {
      for (const part of candidate.content.parts) {
        text += part.text;
      }
    }
  }

  // Remova caracteres de nova linha finais
  text = text.trim();

  return text;
}

async function getAccessToken() {
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform', // Escopo necessário para acessar a API
  });

  const token = await auth.getAccessToken();
  // console.log('Bearer Token:', token);

  return token;
}

async function makeRequest() {
  try {
    const projectId = process.env.PROJECT_ID;
    const accessToken = await getAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8',
    };

    const requsestJson = {
      contents: [
        {
          role: 'user',
          parts: {
            text: 'o que é azul',
          },
        },
      ],
      // safety_settings: {
      //   category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      //   threshold: 'BLOCK_LOW_AND_ABOVE',
      // },
      // generation_config: {
      //   temperature: 0.6,
      //   topP: 1.0,
      //   maxOutputTokens: 8192,
      // },
    };

    const url =
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}` +
      `/locations/us-central1/publishers/google/models/` +
      `gemini-1.0-pro-vision:streamGenerateContent`;

    const response = await axios.post<IApiResponse[]>(url, requsestJson, {
      headers,
    });

    console.dir(response.data, { depth: null });

    const joined = getResponseText(response.data);

    console.log(joined);
    return joined;
  } catch (error) {
    console.error('Erro:', error);

    throw new Error(`Erro make request ${error}`);
  }
}

export { getAccessToken, makeRequest };
