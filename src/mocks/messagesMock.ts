import { Message, MessageTypes } from 'whatsapp-web.js';

export const createMessageMock = (
  body: string,
  timestamp = new Date(),
): Message => {
  const mocked: Message = {
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
    body,
    type: MessageTypes.TEXT, // 'chat',
    timestamp: Math.round(timestamp.getTime() / 1000), // 1709321705,
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

  return mocked;
};

export const genericMessageMock: Message = {
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
