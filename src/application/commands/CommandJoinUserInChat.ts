/* eslint-disable no-underscore-dangle */
import { IChat } from 'common/CustomTypes';
import { Client, Contact, GroupNotification } from 'whatsapp-web.js';

import { IGroupNotificationCommand } from './interfaces/ICommand';
import { GroupsManager } from 'domain/entities/group-manager/GroupsManager';
import { UseCaseListCommands } from 'application/use-cases/chats/list-commands/UseCaseListCommands';
import { container } from 'tsyringe';
import { UseCaseFindOrCreateGroupChat } from 'application/use-cases/chats/find-or-create-group-chat/UseCaseFindOrCreateGroupChat';
import { ChatEntity } from 'domain/entities/chats/ChatEntity';
import { OrderQuestionsByEnum } from 'application/services/chats/order-questions-by-enum/OrderQuestionsByEnum';
import { QuestionEntity } from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { EnumPrivateCommands, EnumPublicCommands } from 'domain/enums/Commands';
import { UseCaseFindQuestionByChat } from 'application/use-cases/users/find-question-by-chat/UseCaseFindQuestionByChat';

// Refatorar send-registration-form para apenas retornar registration forms
// e ser aproveitado no lugar de UseCaseFindQuestionByChat
class CommandJoinUserInChat implements IGroupNotificationCommand {
  private groups: GroupsManager;
  private prefix: string;

  constructor(prefix: string, groups: GroupsManager) {
    this.prefix = prefix;
    this.groups = groups;
  }

  async execute(
    client: Client,
    groupNotification: GroupNotification,
  ): Promise<void> {
    console.log('Command Join User In Chat - execute ');
    console.log(
      'message',
      groupNotification.body,
      groupNotification.recipientIds,
    );

    const newUsersContact = await groupNotification.getRecipients();

    const botIsNewUser = newUsersContact.filter((user) => user.isMe).length > 0;

    if (botIsNewUser) {
      const useCaseListCommands = new UseCaseListCommands();
      const commandList = useCaseListCommands.execute(this.prefix);

      const autoPresentationMessage = [
        `😺 Olá eu sou o \`\`\`Cat-bot\`\`\`, prrazer em conheces vocês, miaw`,
        commandList,
      ];
      await client.sendMessage(
        groupNotification.chatId,
        autoPresentationMessage.join('\n'),
      );
    }

    const newUsersExceptMe = newUsersContact.filter((user) => !user.isMe);

    if (newUsersExceptMe.length === 0) {
      return;
    }

    const chatEntity = await this.findOrCreateGroupChat(
      client,
      groupNotification,
    );

    if (chatEntity === null) {
      return;
    }

    const questions = await this.hasChatQuestions(chatEntity);
    const haveQuestions = questions !== null && questions.length > 0;

    newUsersExceptMe.forEach(async (user) => {
      const presentation = this.messageToNewMember(user, haveQuestions);
      const mentions = [`${user.id.user}@${user.id.server}`];

      try {
        await client.sendMessage(groupNotification.chatId, presentation, {
          mentions,
        });

        if (haveQuestions) {
          const formRegister = this.getPresentationFormToNewMember(questions);
          await client.sendMessage(groupNotification.chatId, formRegister, {
            mentions,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  private async findOrCreateGroupChat(
    client: Client,
    groupNotification: GroupNotification,
  ): Promise<ChatEntity | null> {
    try {
      const useCaseFindOrCreateGroupChat = container.resolve(
        UseCaseFindOrCreateGroupChat,
      );

      const chatWhatsApp = (await client.getChatById(
        groupNotification.chatId,
      )) as IChat;

      if (!chatWhatsApp.isGroup) {
        return null;
      }

      const chatCreatedOrFound =
        useCaseFindOrCreateGroupChat.execute(chatWhatsApp);

      return chatCreatedOrFound;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private async hasChatQuestions(
    chat: ChatEntity,
  ): Promise<QuestionEntity[] | null> {
    try {
      const useCaseFindQuestions = container.resolve(UseCaseFindQuestionByChat);
      const questions = await useCaseFindQuestions.execute(chat);
      return questions;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private messageToNewMember(contact: Contact, haveQuestions: boolean): string {
    const response: string[] = [
      `Miaw, é uma prrazer receberr você no grupo @${contact.id.user} 🐾😸 \n`,
    ];

    if (haveQuestions) {
      response.push('Por favor, não esqueça de preencher a ficha de cadastro.');
      response.push(
        `comando: ${this.prefix}${EnumPublicCommands['PRESENTATION']}`,
      );
    }

    return response.join('\n');
  }

  private getPresentationFormToNewMember(questions: QuestionEntity[]): string {
    const orderQuestionsByEum = new OrderQuestionsByEnum();
    const orderedQuestions = orderQuestionsByEum
      .execute(questions)
      .map(({ question }) => question)
      .join('\n');

    return `${this.prefix}${EnumPrivateCommands.REGISTER}\n${orderedQuestions}`;
  }
}

export { CommandJoinUserInChat };
