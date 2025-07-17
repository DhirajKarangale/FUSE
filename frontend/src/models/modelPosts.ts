export interface Post {
    user_id: number;
    post_title: string;
    post_body: string;
    media_url: string;
    created_at: string;
    category: string;
    username: string;
    user_image_url: string | null;
}

export interface Posts {
    posts: Post[];
    currPage: number;
    totalPages: number;
}

export const getInitialPosts = (): Posts => ({
    posts: [],
    currPage: 1,
    totalPages: 1,
});