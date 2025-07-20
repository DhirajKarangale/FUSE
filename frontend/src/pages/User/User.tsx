import React from "react";
import { useNavigate } from 'react-router-dom';

import { type User, type UserData } from "../../models/modelUser";
import { setUser, clearUser } from '../../redux/sliceUser';
import { setLoader } from '../../redux/sliceLoader';
import { setMessage } from '../../redux/sliceMessageBar';
import { useAppDispatch, useAppSelector } from '../../redux/hookStore';

import { routeAuth } from '../../utils/Routes';

import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.png";

function User() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(clearUser());
        dispatch(setMessage({ message: "Logged out successfully", color: "orange" }));
        navigate(routeAuth);
    }

    return (
        <>
            <div className="w-full max-w-2xl mx-auto bg-black/50 text-white rounded-2xl shadow-lg p-6 mt-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">{user.username}</h2>
                        <p className="text-sm text-gray-300">{user.email}</p>
                    </div>
                    <img
                        src={user.image_url || ProfilePlaceholder}
                        alt="User"
                        className="w-20 h-20 rounded-full border-2 border-white object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = ProfilePlaceholder }}
                    />
                </div>

                <div className="custom-scroll max-h-40 overflow-y-auto rounded-lg bg-white/5 p-4 text-sm text-gray-200 border border-white/10">
                    {user.about || 'No about info provided.'}
                </div>

                <hr className="border-white/10" />

                <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Joined on {new Date(user.created_at).toLocaleDateString()}</span>
                    <button
                        className="text-red-400 hover:text-red-300 transition-all"
                        onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}

export default React.memo(User);