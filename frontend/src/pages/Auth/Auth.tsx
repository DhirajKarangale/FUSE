import React, { useEffect, useState, useRef } from 'react';

import AuthBG from "./AuthBG"
import AuthUser from './AuthUser';
import AuthSignup from "./AuthSignup"
import AuthCategories from './AuthCategories';
import Loader from "../../components/Loader";
import MessageBar, { type MessageBarHandle } from '../../components/MessageBar';

import { type User } from "../../models/modelUser";
import { setUser } from '../../redux/sliceUser';
import { useAppDispatch, useAppSelector } from '../../redux/hookStore';


function Auth() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    const msgRef = useRef<MessageBarHandle>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currScreen, setCurrScreen] = useState<string>('Categories');


    function SetUser(userData: User) {
        dispatch(setUser(userData));
    }

    function SetLoader(isLoading: boolean) {
        setIsLoading(isLoading);
    }

    function SetScreen() {
        if (!user || !user.email) return;

        if (!user.username) {
            setCurrScreen('User');
            console.log('Set User');
        }
        else if (!user.categories) {
            setCurrScreen('Categories');
            console.log('Set Categories');
        }
        else {

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
            />}

            <MessageBar ref={msgRef} />
            <AuthBG />
        </>
    )
}

export default React.memo(Auth);