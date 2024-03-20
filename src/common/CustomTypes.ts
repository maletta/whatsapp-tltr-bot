/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type Chat,
  type ContactId,
  type GroupParticipant,
  type ChatId,
  Message,
} from 'whatsapp-web.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IGroupMetadata {
  id: ChatId;
  creation: number;
  owner: ContactId;
  subject: string;
  subjectTime: number;
  descTime: number;
  restrict: boolean;
  announce: boolean;
  noFrequentlyForwarded: boolean;
  ephemeralDuration: number;
  membershipApprovalMode: boolean;
  memberAddMode: string;
  reportToAdminMode: boolean;
  size: number;
  support: boolean;
  suspended: boolean;
  terminated: boolean;
  uniqueShortNameMap: object;
  isLidAddressingMode: boolean;
  isParentGroup: boolean;
  isParentGroupClosed: boolean;
  defaultSubgroup: boolean;
  generalSubgroup: boolean;
  generalChatAutoAddDisabled: boolean;
  allowNonAdminSubGroupCreation: boolean;
  lastActivityTimestamp: number;
  lastSeenActivityTimestamp: number;
  incognito: boolean;
  participants: Array<GroupParticipant>;
  pendingParticipants: Array<GroupParticipant>;
  pastParticipants: Array<GroupParticipant>;
  membershipApprovalRequests: Array<any>;
  subgroupSuggestions: Array<any>;
}

interface IGroupChat extends Chat {
  isGroup: true;
  pinned: boolean;
  groupMetadata: IGroupMetadata;
}

interface INonGroupChat extends Chat {
  isGroup: false;
  pinned: boolean;
}

export type IChat = IGroupChat | INonGroupChat;

export type IMessage = Message & { caption?: string };
