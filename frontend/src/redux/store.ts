import { configureStore } from "@reduxjs/toolkit";
import sliceUser from './sliceUser';

export const store = configureStore({
    reducer: {
        user: sliceUser
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;