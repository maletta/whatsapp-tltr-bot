import { Message, MessageTypes } from 'whatsapp-web.js';

const mock01 = `

**Nascimento:** Rio de Janeiro, 2 de dezembro de 1825
**Falecimento:** Paris, 5 de dezembro de 1891
**Títulos:** Segundo e último Imperador do Brasil
**Cognomes:** "o Magnânimo"
**Filiação:** Filho mais novo do Imperador Pedro I do Brasil e da Imperatriz Maria Leopoldina da Áustria
**Reinado:** 58 anos (1831-1889)
**Fatos Relevantes:**
* Assumiu o trono aos 5 anos após a abdicação de seu pai.
* Governou durante um período de grande progresso e desenvolvimento para o Brasil.
* Era um grande intelectual e patrono das artes e da ciência.
* Foi fundamental para a abolição da escravidão no Brasil.
* Teve sua monarquia derrubada por um golpe militar em 1889.
* Passou seus últimos anos exilado na Europa.
* Seus restos mortais foram repatriados para o Brasil em 1925.

**Legado:**
* Considerado um dos maiores líderes da história do Brasil.
* Símbolo de estabilidade e progresso durante o Segundo Reinado.
* Figura importante na luta pela abolição da escravidão.
* Inspiração para diversas obras literárias, artísticas e musicais.

**Frases Célebres:**
* "Antes perder a coroa do que a dignidade."
* "O Brasil é um país do futuro."
* "A educação é a base do progresso."

`;

export const messageMock: Message = {
  _data: {
    id: {
      fromMe: false,
      remote: '120363030780077950@g.us',
      id: '1048492BD412C9675C',
      participant: '5511986293165@c.us',
      _serialized:
        'false_120363030780077950@g.us_1048492BD412C9675C_5511986293165@c.us',
    },
    viewed: false,
    body: '@5511964869895 !resumo',
    type: 'chat',
    t: 1709321705,
    notifyName: 'Maletta',
    from: '120363030780077950@g.us',
    to: '5511964869895@c.us',
    author: '5511986293165@c.us',
    self: 'in',
    ack: 1,
    invis: false,
    isNewMsg: true,
    star: false,
    kicNotified: false,
    recvFresh: true,
    isFromTemplate: false,
    thumbnail: '',
    pollInvalidated: false,
    isSentCagPollCreation: false,
    latestEditMsgKey: null,
    latestEditSenderTimestampMs: null,
    mentionedJidList: ['5511964869895@c.us'],
    groupMentions: [],
    isEventCanceled: false,
    isVcardOverMmsDocument: false,
    hasReaction: false,
    ephemeralDuration: 0,
    productHeaderImageRejected: false,
    lastPlaybackProgress: 0,
    isDynamicReplyButtonsMsg: false,
    isCarouselCard: false,
    parentMsgId: null,
    isMdHistoryMsg: false,
    stickerSentTs: 0,
    isAvatar: false,
    lastUpdateFromServerTs: 0,
    invokedBotWid: null,
    bizBotType: null,
    botResponseTargetId: null,
    botPluginType: null,
    botPluginReferenceIndex: null,
    botPluginSearchProvider: null,
    botPluginSearchUrl: null,
    botPluginMaybeParent: false,
    botReelPluginThumbnailCdnUrl: null,
    botMsgBodyType: null,
    requiresDirectConnection: null,
    bizContentPlaceholderType: null,
    hostedBizEncStateMismatch: false,
    senderOrRecipientAccountTypeHosted: false,
    placeholderCreatedWhenAccountIsHosted: false,
    links: [],
  },
  mediaKey: undefined,
  id: {
    fromMe: false,
    remote: '120363030780077950@g.us',
    id: '1048492BD412C9675C',
    // participant: '5511986293165@c.us',
    _serialized:
      'false_120363030780077950@g.us_1048492BD412C9675C_5511986293165@c.us',
  },
  ack: 1,
  hasMedia: false,
  body: '@5511964869895 !resumo',
  type: MessageTypes.TEXT, // 'chat',
  timestamp: 1709321705,
  from: '120363030780077950@g.us',
  to: '5511964869895@c.us',
  author: '5511986293165@c.us',
  deviceType: 'web',
  isForwarded: undefined,
  forwardingScore: 0,
  isStatus: false,
  isStarred: false,
  broadcast: undefined,
  fromMe: false,
  hasQuotedMsg: false,
  hasReaction: false,
  duration: undefined,
  location: undefined,
  vCards: [],
  inviteV4: undefined,
  mentionedIds: ['5511964869895@c.us'] as unknown as Message['mentionedIds'], // ['5511964869895@c.us'],
  orderId: undefined,
  token: undefined,
  isGif: false,
  isEphemeral: undefined,
  links: [],
} as unknown as Message;

export { mock01 };
