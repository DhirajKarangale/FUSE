export interface MessageData {
    messages: Message[];
    currPage: number;
    totalPages: number;
}

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
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