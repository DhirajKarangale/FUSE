import React, { useState, useEffect } from 'react';

import GetMessage from "../../utils/MessagesManager";

import { type User } from "../../models/modelUser";

type AuthUserProps = {
    ShowMsg: (msg: string, color?: string) => void;
    SetUser: (user: User) => void;
    user: User;
};

function AuthUser({ ShowMsg, SetUser, user }: AuthUserProps) {
    const [about, setAbout] = useState<string>(user.username);
    const [username, setUsername] = useState<string>(user.about);
    const [isStartAnim, setIsStartAnim] = useState<boolean>(false);
    const [isEndAnim, setIsEndAnim] = useState<boolean>(false);

    function Validate() {
        if (!username) {
            ShowMsg(GetMessage('usernameMandatory'), 'red');
            return false;
        }

        if (username.length < 2) {
            ShowMsg(GetMessage('usernameLess'), 'red');
            return false;
        }

        if (username.length > 20) {
            ShowMsg(GetMessage('usernameMore'), 'red');
            return false;
        }

        return true;
    }

    function ButtonContinue() {
        if (!Validate()) return;

        const updatedUser = {
            ...user,
            about,
            username
        }
        setIsEndAnim(true);

        setTimeout(() => { SetUser(updatedUser); }, 500);
    }

    useEffect(() => {
        setTimeout(() => { setIsStartAnim(true); }, 5);
    }, [])

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">

            <div className={`w-82 px-6 pt-6 pb-6 rounded-2xl bg-black/25 backdrop-blur-sm
                            pointer-events-auto shadow-lg relative overflow-hidden
                            transform transition-all duration-1000 ease-in-out
                            ${isEndAnim ? "opacity-0 -translate-x-full" : isStartAnim ? "opacity-100 translate-y-0" : "opacity-0 translate-x-full"}`}>


                <div className="px-1">
                    <label htmlFor="username" className="block text-white text-lg font-semibold mb-2">
                        Enter Your Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        onChange={(e: any) => setUsername(e.target.value)}
                        placeholder="jaadu"
                        className='w-full p-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400'
                    />
                </div>

                <div className="px-1 mt-4">
                    <label htmlFor="about" className="block text-white text-lg font-semibold mb-2">
                        About
                    </label>
                    <textarea
                        id="about"
                        onChange={(e: any) => setAbout(e.target.value)}
                        placeholder="I am an Alien"
                        value={about}
                        rows={5}
                        className='w-full max-h-48 p-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 overflow-y-auto custom-scroll resize-none'
                    />
                </div>

                <div className="px-1 mt-6 flex justify-between items-center">
                    <button
                        onClick={ButtonContinue}
                        className={`bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg`}>
                        Continue
                    </button>
                </div>

            </div>

        </div>
    );
}

export default React.memo(AuthUser);