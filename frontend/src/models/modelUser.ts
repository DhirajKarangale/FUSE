export interface UserData {
    user: User;
    token: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    about: string;
    image_url: string;
    categories: string[];
    deactivation: string;
    created_at: string;
    posts: number[];
    isLoaded: boolean;
}

export const getInitialUser = (): User => ({
    id: '',
    username: '',
    email: '',
    about: '',
    image_url: '',
    categories: [],
    deactivation: '',
    created_at: '',
    posts: [],
    isLoaded: false,
});