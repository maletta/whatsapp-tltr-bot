import { Message, MessageTypes } from 'whatsapp-web.js';

async function isMessageToBot(message: Message): Promise<boolean> {
  const mentions = await message.getMentions();

  return (
    mentions.length === 1 &&
    mentions.some((mention) => mention.isMe && mention.isMyContact)
  );
}

const isTimestampBetween = {
  sixHours: (timestamp: number) =>
    new Date().getTime() - new Date(timestamp * 1000).getTime() <=
    6 * 60 * 1000,
  fourHours: (timestamp: number) =>
    new Date().getTime() - new Date(timestamp * 1000).getTime() <=
    4 * 60 * 1000,
  twoHours: (timestamp: number) =>
    new Date().getTime() - new Date(timestamp * 1000).getTime() <=
    2 * 60 * 1000,
  oneHours: (timestamp: number) =>
    new Date().getTime() - new Date(timestamp * 1000).getTime() <=
    1 * 60 * 1000,
  thirtyMinutes: (timestamp: number) =>
    new Date().getTime() - new Date(timestamp * 1000).getTime() <= 30 * 1000,
};

function concatMessages(
  mensagens: Message[],
  { maxTokens = 3800 } = {},
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

async function filterMessagesByHour(messages: Message[]): Promise<Message[]> {
  const chat = await messages[0].getChat();

  const allMessages: Message[] = await chat
    .fetchMessages({
      limit: 1000,
    })
    .then((foundMessages) => {
      return foundMessages.filter(
        (msg) =>
          msg.type === MessageTypes.TEXT &&
          isTimestampBetween.oneHours(msg.timestamp),
      );
    });

  return allMessages;
}

export {
  isMessageToBot,
  concatMessages,
  isTimestampBetween,
  filterMessagesByHour,
};
