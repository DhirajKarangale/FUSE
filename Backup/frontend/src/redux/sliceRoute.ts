import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface RouteState {
    route: string;
}

const initialState: RouteState = {
    route: '/',
};

const sliceRoute = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<RouteState>) {
            return action.payload;
        },
        clearUser() {
            return { route: '/' };
        },
    },
});

export const { setUser, clearUser } = sliceRoute.actions;
export default sliceRoute.reducer;