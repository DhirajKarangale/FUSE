import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthBG from "./AuthBG"
import AuthUser from './AuthUser';
import AuthSignup from "./AuthSignup"
import AuthCategories from './AuthCategories';
import Loader from "../../components/Loader";
import MessageBar, { type MessageBarHandle } from '../../components/MessageBar';

import { urlUser } from '../../api/APIs';
import { putRequest } from '../../api/APIManager';

import { type User, type UserData } from "../../models/modelUser";
import { setUser } from '../../redux/sliceUser';
import { useAppDispatch, useAppSelector } from '../../redux/hookStore';


function Auth() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    const navigate = useNavigate();
    const msgRef = useRef<MessageBarHandle>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currScreen, setCurrScreen] = useState<string>('Signup');


    function SetUser(userData: User) {
        dispatch(setUser(userData));
    }

    function SetLoader(isLoading: boolean) {
        setIsLoading(isLoading);
    }

    async function SetScreen() {
        if (!user || !user.email) return;

        if (!user.username) {
            setCurrScreen('User');
        }
        else if (!user.categories) {
            setCurrScreen('Categories');
        }
        else {
            const body = {
                userName: user.username,
                about: user.about,
                categories: user.categories
            };
            const { data, error } = await putRequest<UserData>(urlUser, body);
            if (data) navigate('/home')
            else msgRef.current?.ShowMsg(error, 'red')
        }
    }

    useEffect(() => { SetScreen(); }, [user])

    return (
        <>
            {isLoading && <Loader />}

            {currScreen === 'Signup' && <AuthSignup
                ShowMsg={(msg: string, color?: string) => msgRef.current?.ShowMsg(msg, color)}
                SetUser={SetUser}
                SetLoader={SetLoader}
            />}

            {currScreen === 'User' && <AuthUser
                ShowMsg={(msg: string, color?: string) => msgRef.current?.ShowMsg(msg, color)}
                SetUser={SetUser}
                user={user}
            />}

            {currScreen === 'Categories' && <AuthCategories
                ShowMsg={(msg: string, color?: string) => msgRef.current?.ShowMsg(msg, color)}
                SetUser={SetUser}
                user={user}
            />}

            <MessageBar ref={msgRef} />
            <AuthBG />
        </>
    )
}

export default React.memo(Auth);