import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Save, X } from "lucide-react";

import { urlUser } from "../../api/APIs";
import { putRequest } from "../../api/APIManager";

import { type User } from "../../models/modelUser";
import { routeAuth } from '../../utils/Routes';
import GetMessage from "../../utils/MessagesManager";
import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.png";

type UserDataProps = {
    ShowMsg: (msg: string, color?: string) => void;
    ShowLoader: (isLoading: boolean) => void;
    SetUser: (user: User) => void;
    ClearUser: () => void;
    user: User;
}

function UserSection({ ShowMsg, ShowLoader, SetUser, ClearUser, user }: UserDataProps) {
    const navigate = useNavigate();
    const [editField, setEditField] = useState<"username" | "email" | "about" | null>(null);

    const [fieldValues, setFieldValues] = useState({
        username: user.username,
        email: user.email,
        about: user.about || ''
    });

    function ButtonCancel() {
        setEditField(null);
        setFieldValues({
            username: user.username,
            email: user.email,
            about: user.about || ''
        });
    }

    async function ButtonSave(field: "username" | "email" | "about") {
        const body: Partial<User> = {};

        if (field === "username") body.username = fieldValues.username;
        if (field === "email") body.email = fieldValues.email;
        if (field === "about") body.about = fieldValues.about;

        ShowLoader(true);
        const { data, error } = await putRequest<User>(urlUser, body);
        if (data) {
            SetUser(data);
            ShowMsg(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`, "green");
            setEditField(null);
        }
        else {
            ShowMsg(error, 'red');
        }

        ShowLoader(false);
    }

    function ButtonLogout() {
        ClearUser();
        ShowMsg(GetMessage('logoutSuccess'), 'orange');
        navigate(routeAuth);
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-black/50 backdrop-blur-sm text-white rounded-2xl shadow-lg p-6 mt-5 space-y-4">

            <div className="flex items-center justify-between">

                <div className="flex flex-col gap-1 w-full">

                    <div className="flex items-center gap-2 h-[32px] w-full">
                        {editField === "username" ? (
                            <>
                                <input
                                    className="bg-white/10 text-white text-2xl font-bold rounded h-full py-1 pl-2 focus:outline-none w-full max-w-[80%]"
                                    style={{ lineHeight: "1", fontSize: "1.5rem" }}
                                    value={fieldValues.username}
                                    onChange={(e) =>
                                        setFieldValues({ ...fieldValues, username: e.target.value })
                                    }
                                />
                                <button onClick={() => ButtonSave("username")}>
                                    <Save size={18} />
                                </button>
                                <button onClick={ButtonCancel}>
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <h2
                                className="text-2xl font-bold cursor-pointer w-full h-full flex items-center"
                                onClick={() => setEditField("username")}>
                                {user.username}
                            </h2>
                        )}
                    </div>

                    <div className="flex items-center gap-2 h-[32px] w-full">
                        {editField === "email" ? (
                            <>
                                <input
                                    className="bg-white/10 text-sm text-gray-200 rounded h-full py-1 pl-2 focus:outline-none w-full max-w-[80%]"
                                    style={{ fontSize: "0.875rem", lineHeight: "1" }}
                                    value={fieldValues.email}
                                    onChange={(e) =>
                                        setFieldValues({ ...fieldValues, email: e.target.value })
                                    }
                                />
                                <button onClick={() => ButtonSave("email")}>
                                    <Save size={18} />
                                </button>
                                <button onClick={ButtonCancel}>
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <p
                                className="text-sm text-gray-300 cursor-pointer w-full h-full flex items-center"
                                onClick={() => setEditField("email")}>
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>

                <img
                    src={user.image_url || ProfilePlaceholder}
                    alt="User"
                    className="w-20 h-20 rounded-full border-2 border-white object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = ProfilePlaceholder }}
                />
            </div>

            <>
                {editField === "about" ? (
                    <div className="relative">
                        <textarea
                            className="custom-scroll w-full bg-white/10 text-sm text-gray-200 rounded p-3 h-32 resize-none focus:outline-none"
                            value={fieldValues.about || ""}
                            onChange={(e) =>
                                setFieldValues({ ...fieldValues, about: e.target.value })
                            }
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button onClick={() => ButtonSave("about")}>
                                <Save size={18} />
                            </button>
                            <button onClick={ButtonCancel}>
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="custom-scroll max-h-40 overflow-y-auto rounded-lg bg-white/5 p-4 text-sm text-gray-200 border border-white/10 cursor-pointer"
                        onClick={() => setEditField("about")}>
                        {user.about || 'No about info provided.'}
                    </div>
                )}

            </>

            <hr className="border-white/10" />

            <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Joined on {new Date(user.created_at).toLocaleDateString()}</span>
                <button
                    className="text-red-400 hover:text-red-300 transition-all"
                    onClick={ButtonLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default React.memo(UserSection);