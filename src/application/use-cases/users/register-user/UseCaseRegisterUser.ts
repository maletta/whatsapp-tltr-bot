import { ChatEntity } from 'domain/entities/chats/ChatEntity';
import { UserEntity } from 'domain/entities/users/UserEntity';
import { IChatsRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { IUsersRepository } from 'domain/interfaces/repositories/users/IUserRepository';
import { PoolClient } from 'pg';
import { PostgresConnection } from 'src/database/data-source/postgres/PostgresConnection';
import { container, inject, injectable } from 'tsyringe';
import { Message } from 'whatsapp-web.js';
import { UseCaseRegisterUserDetails } from '../register-user-details/UseCaseRegisterUserDetails';
import { UsersDetailsEntity } from 'domain/entities/users/UserDetailsEntity';

@injectable()
class UseCaseRegisterUser {
  constructor(
    @inject('ChatsRepository')
    private chatsRepository: IChatsRepository<PoolClient>,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository<PoolClient>,
    @inject('PostgresConnection')
    private database: PostgresConnection,
  ) {}

  public async execute(
    message: Message,
  ): Promise<[UserEntity, UsersDetailsEntity] | null> {
    const completedRegistrationForm = message.body;

    const connection = await this.database.getConnection();
    this.chatsRepository.setConnection(connection);
    this.usersRepository.setConnection(connection);

    try {
      // procura chat na base ou cadastra
      const chat = await this.findChat(message);

      if (chat === null) {
        console.log('chat não encontrado');
        return null;
      }

      // busca por usuário na base ou cadastra
      const user = await this.findOrCreateUser(message);

      if (user === null) {
        console.log('user não encontrado');
        return null;
      }

      // registra os detalhes do usuário
      const useCaseRegisterUserDetails = container.resolve(
        UseCaseRegisterUserDetails,
      );

      const userDetails = await useCaseRegisterUserDetails.execute(
        completedRegistrationForm,
        user,
        chat,
      );

      if (userDetails === null) {
        console.log('user details não registrado');
        return null;
      }

      // retorna as respostas

      return [user, userDetails];
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      this.database.release();
    }
  }

  private async findChat(message: Message): Promise<ChatEntity | null> {
    const chat = await message.getChat();
    const whatsAppRegistry = message.from;
    if (!chat.isGroup) {
      return null;
    }
    const chatFound =
      await this.chatsRepository.findByWhatsAppRegistry(whatsAppRegistry);
    return chatFound;
  }

  private async findOrCreateUser(message: Message): Promise<UserEntity | null> {
    const userWhatsAppRegistry = message.author!;
    const userContact = await message.getContact();

    const userFound =
      await this.usersRepository.findByWhatsAppRegistry(userWhatsAppRegistry);

    if (userFound !== null && userFound !== undefined) {
      return userFound;
    }

    const createdUser = await this.usersRepository.create({
      cellphone: userContact.number,
      infoName: userContact.pushname,
      whatsappRegistry: userWhatsAppRegistry,
    });

    return createdUser;
  }
}

export { UseCaseRegisterUser };
