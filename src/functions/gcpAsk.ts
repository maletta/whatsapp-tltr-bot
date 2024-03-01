import { LanguageServiceClient } from '@google-cloud/language';

interface IDocument {
  content: string;
  type: 'PLAIN_TEXT' | 'HTML'; // Escolha o tipo apropriado (PLAIN_TEXT ou HTML)
  language: 'pt';
  language_code: 'pt';
}

async function gcpAsk(text: string, numSentences = 3): Promise<string[]> {
  const languageServiceClient = new LanguageServiceClient();
  const document: IDocument = {
    content: text,
    language_code: 'pt',
    type: 'PLAIN_TEXT',
    language: 'pt',
  };

  // const [response] = await languageServiceClient.annotateText({
  //   document,
  //   features: {
  //     extractSyntax: true,
  //     extractEntities: true,
  //     extractDocumentSentiment: true,
  //     extractEntitySentiment: true,
  //     classifyText: true,
  //   },
  // });
  // Detects the sentiment of the text
  // const [response] = await languageServiceClient.analyzeSentiment({ document });
  // const [annotation] = await languageServiceClient.annotateText({
  //   document,
  //   features: {
  //     // extractDocumentSentiment: true,
  //   },
  // });

  const [response] = await languageServiceClient.annotateText({
    document,
    features: {
      extractSyntax: false,
      extractEntities: false,
      extractDocumentSentiment: false,
      extractEntitySentiment: false,
      classifyText: false,
    },
  });

  console.dir(response, { depth: null });

  // Aqui você pode processar a resposta e extrair os tópicos do texto
  // por exemplo, você pode usar response.entities para obter entidades
  // ou response.sentences para obter as frases principais do texto.

  // Retorna uma lista de tópicos como strings
  return ['Tópico 1', 'Tópico 2', 'Tópico 3'];
}

export { gcpAsk };
