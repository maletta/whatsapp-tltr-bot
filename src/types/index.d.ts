// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Client, LocalAuth } from 'whatsapp-web.js';

// declare module 'whatsapp-web.js' {
//   namespace WAWebJS {
//     // eslint-disable-next-line @typescript-eslint/naming-convention
//     export interface GroupMetadata {
//       id: object;
//       creation: number;
//       owner: object;
//       subject: string;
//       subjectTime: number;
//       descTime: number;
//       restrict: boolean;
//       announce: boolean;
//       noFrequentlyForwarded: boolean;
//       ephemeralDuration: number;
//       membershipApprovalMode: boolean;
//       memberAddMode: string;
//       reportToAdminMode: boolean;
//       size: number;
//       support: boolean;
//       suspended: boolean;
//       terminated: boolean;
//       uniqueShortNameMap: object;
//       isLidAddressingMode: boolean;
//       isParentGroup: boolean;
//       isParentGroupClosed: boolean;
//       defaultSubgroup: boolean;
//       generalSubgroup: boolean;
//       generalChatAutoAddDisabled: boolean;
//       allowNonAdminSubGroupCreation: boolean;
//       lastActivityTimestamp: number;
//       lastSeenActivityTimestamp: number;
//       incognito: boolean;
//       participants: Array<object>;
//       pendingParticipants: Array<any>;
//       pastParticipants: Array<any>;
//       membershipApprovalRequests: Array<any>;
//       subgroupSuggestions: Array<any>;
//     }

//     // eslint-disable-next-line @typescript-eslint/naming-convention
//     export interface Chat {
//       // propriedades existentes...
//       archived: boolean;
//       id: ChatId;
//       isGroup: boolean;
//       isReadOnly: boolean;
//       isMuted: boolean;
//       muteExpiration: number;
//       name: string;
//       timestamp: number;
//       unreadCount: number;
//       lastMessage: Message;

//       // propriedades adicionais...
//       groupMetadata: GroupMetadata;
//       pinned: boolean;
//     }
//   }
// }

// export { Client, LocalAuth };
