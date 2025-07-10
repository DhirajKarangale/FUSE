export interface User {
    id: number;
    username: string;
    email: string;
    about: string;
    image_url: string;
    categories: string;
    deactivation: string;
    created_at: string;
    posts: string;
}

export const getInitialUser = (): User => ({
    id: 0,
    username: '',
    email: '',
    about: '',
    image_url: '',
    categories: '',
    deactivation: '',
    created_at: '',
    posts: '',
});
