/* eslint-disable @typescript-eslint/no-explicit-any */
interface IParticipant {
  server: string;
  user: string;
  _serialized: string;
}

interface IId {
  fromMe: boolean;
  remote: string;
  id: string;
  participant: IParticipant;
  _serialized: string;
}

interface IFrom {
  server: string;
  user: string;
  _serialized: string;
}

interface ITo {
  server: string;
  user: string;
  _serialized: string;
}

interface IAuthor {
  server: string;
  user: string;
  _serialized: string;
}

interface IMessageData {
  id: IId;
  rowId: number;
  viewed: boolean;
  body: string;
  type: string;
  t: number;
  from: IFrom;
  to: ITo;
  author: IAuthor;
  self: string;
  ack: number;
  invis: boolean;
  star: boolean;
  kicNotified: boolean;
  interactiveAnnotations: any[];
  deprecatedMms3Url: string;
  directPath: string;
  mimetype: string;
  duration: string;
  filehash: string;
  encFilehash: string;
  size: number;
  mediaKey: string;
  mediaKeyTimestamp: number;
  isGif: boolean;
  gifAttribution: number;
  isViewOnce: boolean;
  width: number;
  height: number;
  staticUrl: string;
  isFromTemplate: boolean;
  pollOptions: any[];
  pollInvalidated: boolean;
  latestEditMsgKey: any;
  latestEditSenderTimestampMs: any;
  broadcast: boolean;
  mentionedJidList: any[];
  groupMentions: any[];
  isVcardOverMmsDocument: boolean;
  hasReaction: boolean;
  ephemeralDuration: any;
  disappearingModeInitiator: string;
  disappearingModeTrigger: string;
  productHeaderImageRejected: boolean;
  lastPlaybackProgress: number;
  isDynamicReplyButtonsMsg: boolean;
  isCarouselCard: boolean;
  parentMsgId: any;
  isMdHistoryMsg: boolean;
  stickerSentTs: number;
  isAvatar: boolean;
  lastUpdateFromServerTs: number;
  invokedBotWid: any;
  botTargetSenderJid: any;
  bizBotType: any;
  botResponseTargetId: any;
  botPluginType: any;
  botPluginReferenceIndex: any;
  botPluginSearchProvider: any;
  botPluginSearchUrl: any;
  botPluginMaybeParent: boolean;
  botReelPluginThumbnailCdnUrl: any;
  botMsgBodyType: any;
  requiresDirectConnection: any;
  bizContentPlaceholderType: any;
  hostedBizEncStateMismatch: boolean;
  senderOrRecipientAccountTypeHosted: boolean;
  placeholderCreatedWhenAccountIsHosted: boolean;
  links: any[];
}

interface IMessageRaw {
  _data: IMessageData;
  mediaKey: string;
  id: IId;
  ack: number;
  hasMedia: boolean;
  body: string;
  type: string;
  timestamp: number;
  from: string;
  to: string;
  author: string;
  deviceType: string;
  isForwarded?: any;
  forwardingScore: number;
  isStatus: boolean;
  isStarred: boolean;
  broadcast: boolean;
  fromMe: boolean;
  hasQuotedMsg: boolean;
  hasReaction: boolean;
  duration: string;
  location?: any;
  vCards: any[];
  inviteV4?: any;
  mentionedIds: any[];
  groupMentions: any[];
  orderId?: any;
  token?: any;
  isGif: boolean;
  isEphemeral?: any;
  links: any[];
}

export { IMessageRaw };
