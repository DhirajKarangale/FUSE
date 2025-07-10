import { configureStore } from "@reduxjs/toolkit";
import sliceRoute from './sliceRoute';

export const store = configureStore({
    reducer: {
        route: sliceRoute
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;