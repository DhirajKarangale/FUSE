import { configureStore } from "@reduxjs/toolkit";
import sliceUser from './sliceUser';
import sliceFeedPost from './sliceFeedPost'

export const store = configureStore({
    reducer: {
        user: sliceUser,
        feedPost: sliceFeedPost
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;