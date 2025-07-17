import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { type PostData, getInitialPosts } from '../models/modelPosts';

const initialState = getInitialPosts();

const sliceFeedPost = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setPostData(_state, action: PayloadAction<PostData>) {
            return action.payload;
        },
        clearPostData() {
            return getInitialPosts();
        },
    },
});

export const { setPostData, clearPostData } = sliceFeedPost.actions;
export default sliceFeedPost.reducer;