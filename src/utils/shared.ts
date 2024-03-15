import { Message } from 'whatsapp-web.js';

function concatMessages(
  mensagens: Message[],
  { maxTokens = 10000 } = {},
): string[] {
  const mensagensConcatenadas = [];
  let strAtual = '';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < mensagens.length; i++) {
    const msg = mensagens[i].body; // Supondo que 'body' é a propriedade que contém o texto da mensagem

    // Verifica se a adição da próxima mensagem excederá o limite de 3800 caracteres
    if (strAtual.length + msg.length > maxTokens) {
      // Se exceder, adiciona a string atual ao array de mensagens concatenadas
      mensagensConcatenadas.push(strAtual);
      // Começa uma nova string com a mensagem atual
      strAtual = msg;
    } else {
      // Se não exceder, adiciona a mensagem à string atual
      strAtual += msg;
    }
  }

  // Adiciona a última string ao array de mensagens concatenadas
  if (strAtual !== '') {
    mensagensConcatenadas.push(strAtual);
  }

  return mensagensConcatenadas;
}

export { concatMessages };
