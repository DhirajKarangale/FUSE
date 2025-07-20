import { configureStore } from "@reduxjs/toolkit";
import sliceUser from './sliceUser';
import sliceFeedPost from './sliceFeedPost';
import sliceMessageBar from './sliceMessageBar';

export const store = configureStore({
    reducer: {
        user: sliceUser,
        feedPost: sliceFeedPost,
        messageBar: sliceMessageBar,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;