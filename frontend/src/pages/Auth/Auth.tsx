import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthUser from './AuthUser';
import AuthSignup from "./AuthSignup"
import AuthCategories from './AuthCategories';
import Loader from "../../components/Loader";

import { urlUser } from '../../api/APIs';
import { putRequest } from '../../api/APIManager';

import { type User, type UserData } from "../../models/modelUser";
import { setUser } from '../../redux/sliceUser';
import { setMessage } from '../../redux/sliceMessageBar';
import { useAppDispatch, useAppSelector } from '../../redux/hookStore';

import { routeFeed } from '../../utils/Routes';


function Auth() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const [isUpdateUser, setIsUpdateUser] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currScreen, setCurrScreen] = useState<string>('Signup');


    function SetUser(userData: User) {
        dispatch(setUser(userData));
    }

    function SetLoader(isLoading: boolean) {
        setIsLoading(isLoading);
    }

    function ShowMsg(msg: string, color?: string) {
        dispatch(setMessage({ message: msg, color: color }))
    }

    async function SetScreen() {
        if (!user || !user.email) return;

        if (!user.username) {
            setCurrScreen('User');
            setIsUpdateUser(true);
        }
        else if (!user.categories || user.categories?.length == 0) {
            setCurrScreen('Categories');
            setIsUpdateUser(true);
        }
        else {
            if (isUpdateUser) {
                const body = {
                    userName: user.username,
                    about: user.about,
                    categories: user.categories
                };

                SetLoader(true);
                const { data, error } = await putRequest<UserData>(urlUser, body);
                SetLoader(false);

                if (data) navigate(routeFeed);
                else ShowMsg(error, 'red')
            }
            else {
                navigate(routeFeed);
            }
        }
    }

    useEffect(() => {
        SetScreen();
    }, [user])

    return (
        <>
            {isLoading && <Loader />}

            {currScreen === 'Signup' && <AuthSignup
                ShowMsg={ShowMsg}
                SetUser={SetUser}
                SetLoader={SetLoader}
            />}

            {currScreen === 'User' && <AuthUser
                ShowMsg={ShowMsg}
                SetUser={SetUser}
                user={user}
            />}

            {currScreen === 'Categories' && <AuthCategories
                ShowMsg={ShowMsg}
                SetUser={SetUser}
                user={user}
            />}
        </>
    )
}

export default React.memo(Auth);