import { LanguageServiceClient } from '@google-cloud/language';

async function gcpAsk(text: string): Promise<string[]> {
  const languageServiceClient = new LanguageServiceClient();
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  const [response] = await languageServiceClient.annotateText({
    document,
    features: {
      extractSyntax: true,
      extractEntities: true,
      extractDocumentSentiment: true,
      extractEntitySentiment: true,
      classifyText: true,
    },
  });

  // Aqui você pode processar a resposta e extrair os tópicos do texto
  // por exemplo, você pode usar response.entities para obter entidades
  // ou response.sentences para obter as frases principais do texto.

  // Retorna uma lista de tópicos como strings
  return ['Tópico 1', 'Tópico 2', 'Tópico 3'];
}

export { gcpAsk };
