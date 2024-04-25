import { IChatRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { PoolClient } from 'pg';
import { IDataBase } from 'src/database/data-source/interfaces/IDataBase';
import { inject, injectable } from 'tsyringe';
import { Message } from 'whatsapp-web.js';

@injectable()
class UseCaseSendRegistrationForm {
  constructor(
    @inject('ChatRepository')
    private chatRepository: IChatRepository<PoolClient>,
    @inject('IDataBase') private database: IDataBase<PoolClient>,
  ) {}

  public async execute(message: Message) {
    try {
      const client = await this.database.connect();
      await this.chatRepository.setConnection(client);
      const chats = await this.chatRepository.findByWhatsAppId(message.from);
      console.log('found chats', chats);
    } catch (error) {
      console.log(error);
    }
  }
}

export { UseCaseSendRegistrationForm };
