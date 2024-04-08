import { Message } from 'whatsapp-web.js';

class UseCaseRegisterUser {
  public async handle(message: Message): Promise<void> {
    const presentation = message.body;
  }
}

export { UseCaseRegisterUser };
