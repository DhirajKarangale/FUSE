import React, { useEffect } from "react";
import { type User } from "../models/modelUser";

import { setUser } from '../redux/sliceUser';
import { setLoader } from "../redux/sliceLoader";

import { useAppDispatch } from '../redux/hookStore';

import { routeMaintenance } from "../utils/Routes";
import { urlUser } from "../api/APIs";
import { getRequest } from "../api/APIManager";

function AutoLogin() {
  const dispatch = useAppDispatch();

  async function fetchUser() {
    if (window.location.pathname.startsWith(routeMaintenance)) return;

    dispatch(setLoader({ isLoading: true }));

    const { data } = await getRequest<User>(urlUser);

    if (data) {
      dispatch(setUser(data));
    }

    dispatch(setLoader({ isLoading: false }));
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return null;
}

export default React.memo(AutoLogin);