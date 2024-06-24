const groupNotification1 = {
  id: {
    fromMe: false,
    remote: '120363030123458888@g.us',
    id: '31225194681714680359',
    participant: '5511989791234@c.us', // usuário que adicinou no grupo ou quem entrou pelo lin
    _serialized:
      'false_120363030123456789@g.us_31225194681714680359_5511989791234@c.us',
  },
  body: '',
  type: 'invite', // evento de entrar por link
  timestamp: 1714680359,
  chatId: '120363030123456789@g.us', // registro único de cada chat
  author: undefined,
  recipientIds: ['5511989791234@c.us'], // array usuários que entraram
};

const groupNotification2 = {
  id: {
    fromMe: false,
    remote: '120363030123458888@g.us',
    id: '18428342191714680173',
    participant: '5511982659999@c.us',
    _serialized:
      'false_120363030123458888@g.us_18428342191714680173_5511982659999@c.us',
  },
  body: '',
  type: 'add',
  timestamp: 1714680173,
  chatId: '120363030123458888@g.us',
  author: '5511986293165@c.us',
  recipientIds: ['5511982659999@c.us'],
};
