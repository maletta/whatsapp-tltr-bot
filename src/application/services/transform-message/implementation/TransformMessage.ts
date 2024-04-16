import { Message } from 'whatsapp-web.js';
import { CreateBatchOptions, ITransformMessage } from '../ITransformMessage';

interface IMessageMapped {
  userId: string;
  body: string;
  timestamp: number;
}

type FunctionTransformer = (args: string) => string;
class TransformMessages extends ITransformMessage<Message> {
  createBatchOfMessages(messages: Message[]): string[] {
    throw new Error('Method not implemented.');
  }
  public static createBatchOfMessages(
    messages: Message[],
    options: Partial<CreateBatchOptions>,
  ): string[] {
    const maxTokens = options.maxTokens || 1000;
    const messagesBatches = [];
    let currentString = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < messages.length; i++) {
      const messageMapped = TransformMessages.mapFields(messages[i], [
        ITransformMessage.removeMentionsAndCommands,
      ]);

      const messageStringfy = JSON.stringify(messageMapped);

      // Verifica se a adição da próxima mensagem excederá o limite de 3800 caracteres
      if (currentString.length + messageStringfy.length > maxTokens) {
        // Se exceder, adiciona a string atual ao array de mensagens concatenadas
        messagesBatches.push(`${currentString}`);
        // Começa uma nova string com a mensagem atual
        currentString = messageStringfy;
      } else {
        // Se não exceder, adiciona a mensagem à string atual
        currentString += `,${messageStringfy}`;
      }
    }

    // Adiciona a última string ao array de mensagens concatenadas
    if (currentString !== '') {
      messagesBatches.push(currentString);
    }

    return messagesBatches;
  }

  private static mapFields = (
    message: Message,
    transformers: FunctionTransformer[],
  ): IMessageMapped => ({
    body: transformers.reduce((acc, transform) => transform(message.body), ''),
    userId: message.id.id,
    timestamp: message.timestamp,
  });
}

export { TransformMessages };
