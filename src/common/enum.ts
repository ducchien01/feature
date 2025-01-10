import { Winicon } from "wini-web-components";

export enum ViewPath {
    Chat = "/chat/:chatId",
    Requests = "/requests",
    Archived = '/archived',
}

export enum ConversationType {
    Private = 1, // chat 1-1
    Group = 2, // group chat
}

export enum ConversatioStatus {
    Online = 1, // chat 1-1
    Offline = 2, // group chat
}

export const emojiMap: Record<string, string> = {
    ":)": "color/emoticons/big-grin", // Hoặc <Winicon src="happy" size="2rem" />
    ":(": "color/emoticons/angry-face",
    ":D": "color/emoticons/bigmouth",
};