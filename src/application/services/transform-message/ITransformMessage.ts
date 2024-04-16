/**
 * Transforms a raw message into a batch of messages
 */

type RawMessages = Record<string, any>;

type CreateBatchOptions = { maxTokens: number };

abstract class ITransformMessage<T extends RawMessages> {
  abstract createBatchOfMessages(
    messages: T[],
    options: Partial<CreateBatchOptions>,
  ): string[];

  static removeMentionsAndCommands(message: string): string {
    return message.replace(/[@!]\w+/g, '');
  }
}

export { ITransformMessage };
