import { useEffect, useRef, useState } from 'react';

import './Auth.css'

import AuthBG from "./AuthBG"
import AuthSignup from "./AuthSignup"

import { type UserData } from "../../models/modelUser";

import MessageBar, { type MessageBarHandle } from '../../components/MessageBar';

import { setUser, clearUser } from '../../redux/sliceUser';
import { useAppDispatch, useAppSelector } from '../../redux/hookStore';


export default function Auth() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const msgRef = useRef<MessageBarHandle>(null);
    const [nextScreen, setNextScreen] = useState<string>('');

    useEffect(() => {
        NextScreen(nextScreen);
    }, [nextScreen])

    function SetUser(userData: UserData) {
        dispatch(setUser(userData.user));
    }

    function NextScreen(currScreen: string) {
        if (currScreen == 'SignUp') {
            console.log('NextScreen: ', user);
        }
    }

    function SetNextScreen(currScreen: string) {
        setNextScreen(currScreen);
    }

    return (
        <>
            <AuthSignup ShowMsg={(msg: string, color?: string) => msgRef.current?.ShowMsg(msg, color)}
                SetUser={SetUser}
                SetNextScreen={SetNextScreen}
            />
            <MessageBar ref={msgRef} />
            <AuthBG />
        </>
    )
}




// --------------------------- Form Demo ---------------------------------

// import { type User, getInitialUser } from '../models/modelUser';
// const { register, handleSubmit } = useForm<User>({
//   defaultValues: getInitialUser(),
// });