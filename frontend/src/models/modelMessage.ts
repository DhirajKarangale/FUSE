export interface Message {
    senderId: string;
    receiverId: string;
    message: string;
    media_url: string;
    timestamp: string;
}

export interface MessageUserData {
    users: MessageUser[];
    currPage: number;
    totalPages: number;
}

export interface MessageUser {
    id: number;
    username: string;
    image_url: number;
    message: string;
    created_at: string;
}