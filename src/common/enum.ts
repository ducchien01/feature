export enum ViewPath {
    Chat = "/chat/:chatId",
    Requests = "/requests",
    Archived = '/archived',
}

export enum ConversationType {
    Private = 1, // chat 1-1
    Group = 2, // group chat
}