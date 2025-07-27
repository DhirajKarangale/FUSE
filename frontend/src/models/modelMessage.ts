export interface MessageData {
    messages: Message[];
    currPage: number;
    totalPages: number;
}

export interface Message {
    id: number;
    message: string;
    media_url: string,
    created_at: string;
    isSend: boolean;
}

export interface MessageSent {
    senderId: number;
    receiverId: number;
    message: string;
    media_url: string,
    created_at: string;
}

export interface MessageUserData {
    users: MessageUser[];
    currPage: number;
    totalPages: number;
}

export interface MessageUser {
    id: number;
    username: string;
    image_url: string;
    message: string;
    created_at: string;
}