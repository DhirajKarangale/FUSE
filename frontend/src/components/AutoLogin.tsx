import React, { useEffect } from "react";
import { type User } from "../models/modelUser";
import { setUser } from '../redux/sliceUser';
import { useAppDispatch } from '../redux/hookStore';

import { urlUser } from "../api/APIs";
import { getRequest } from "../api/APIManager";

function AutoLogin() {
    const dispatch = useAppDispatch();

    async function fetchUser() {
        const { data } = await getRequest<User>(urlUser);
        if (data) dispatch(setUser(data));
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return null;
}

export default React.memo(AutoLogin);