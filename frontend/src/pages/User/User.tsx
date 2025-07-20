import React from "react";

import { type User } from "../../models/modelUser";
import { setUser, clearUser } from '../../redux/sliceUser';
import { setLoader } from '../../redux/sliceLoader';
import { setMessage } from '../../redux/sliceMessageBar';
import { useAppDispatch, useAppSelector } from '../../redux/hookStore';

import UserSection from "./UserSection";


function User() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    function ShowMsg(message: string, color?: string) {
        dispatch(setMessage({ message, color }));
    }

    function ShowLoader(isLoading: boolean) {
        dispatch(setLoader({ isLoading }));
    }

    function SetUser(user: User) {
        dispatch(setUser(user));
    }

    function ClearUser() {
        dispatch(clearUser());
    }

    return (
        <>
            <UserSection
                ShowMsg={ShowMsg}
                ShowLoader={ShowLoader}
                SetUser={SetUser}
                ClearUser={ClearUser}
                user={user}
            />
        </>
    );
}

export default React.memo(User);