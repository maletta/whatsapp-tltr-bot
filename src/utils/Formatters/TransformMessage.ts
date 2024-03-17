import { Message } from 'whatsapp-web.js';

class TransformMessages {
  public static createBatchOfMessages(
    messages: Message[],
    { maxTokens = 10000 } = {},
  ): string[] {
    const messagesBatches = [];
    let currentString = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < messages.length; i++) {
      const msg = TransformMessages.removeMentionsAndCommands(messages[i].body); // Supondo que 'body' é a propriedade que contém o texto da mensagem

      // Verifica se a adição da próxima mensagem excederá o limite de 3800 caracteres
      if (currentString.length + msg.length > maxTokens) {
        // Se exceder, adiciona a string atual ao array de mensagens concatenadas
        messagesBatches.push(`${currentString}`);
        // Começa uma nova string com a mensagem atual
        currentString = msg;
      } else {
        // Se não exceder, adiciona a mensagem à string atual
        currentString += `;${msg}`;
      }
    }

    // Adiciona a última string ao array de mensagens concatenadas
    if (currentString !== '') {
      messagesBatches.push(currentString);
    }

    return messagesBatches;
  }

  public static removeMentionsAndCommands(message: string): string {
    return message.replace(/[@!]\w+/g, '');
  }
}

export { TransformMessages };
