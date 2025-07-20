import { configureStore } from "@reduxjs/toolkit";
import sliceUser from './sliceUser';
import sliceFeedPost from './sliceFeedPost';
import sliceMessageBar from './sliceMessageBar';
import sliceLoader from './sliceLoader'

export const store = configureStore({
    reducer: {
        user: sliceUser,
        feedPost: sliceFeedPost,
        messageBar: sliceMessageBar,
        loader: sliceLoader
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;