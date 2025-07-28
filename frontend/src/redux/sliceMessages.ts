import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Message, getInitialMessage } from "../models/modelMessage";

const initialState = getInitialMessage();

const sliceMessage = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessage(_state, action: PayloadAction<Message>) {
            return action.payload;
        }
    },
});

export const { setMessage } = sliceMessage.actions;
export default sliceMessage.reducer;