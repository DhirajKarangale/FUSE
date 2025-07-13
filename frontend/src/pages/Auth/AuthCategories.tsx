import React, { useState, useEffect } from "react";

import { type User, getInitialUser } from "../../models/modelUser";

type AuthCategoriesProps = {
    ShowMsg: (msg: string, color?: string) => void;
    SetUser: (user: User) => void;
};

function AuthCategories({ ShowMsg, SetUser }: AuthCategoriesProps) {

    const [isStartAnim, setIsStartAnim] = useState<boolean>(false);
    const [isEndAnim, setIsEndAnim] = useState<boolean>(false);

    function ButtonContinue() {
        SetUser(getInitialUser());
        ShowMsg('', '')
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

export default React.memo(AuthCategories);