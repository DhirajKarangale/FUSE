import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Save, X } from "lucide-react";

import { urlUser, urlUserImageDelete } from "../../api/APIs";
import { getRequest, putRequest, deleteRequest } from "../../api/APIManager";

import { type User } from "../../models/modelUser";
import { setUser, clearUser } from '../../redux/sliceUser';
import { setLoader } from '../../redux/sliceLoader';
import { setMessage } from '../../redux/sliceMessageBar';
import { useAppDispatch, useAppSelector } from '../../redux/hookStore';

import { routeFeed, routeAuth } from '../../utils/Routes';
import GetMessage from "../../utils/MessagesManager";
import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.png";

type UserSectionProps = {
    userId: number
}

function UserSection({ userId }: UserSectionProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    type EditableField = "username" | "email" | "about";

    const localUser = useAppSelector((state) => state.user);

    const [user, setUserData] = useState<User | null>(null);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [editField, setEditField] = useState<EditableField | null>(null);

    const prevImageUrlRef = useRef<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const CLOUD_NAME = "dfamljkyo";
    const UPLOAD_PRESET = "changexl";
    const isLocalUser = userId === localUser.id;

    const [fieldValues, setFieldValues] = useState({
        username: user?.username,
        email: user?.email,
        about: user?.about || ''
    });


    function ShowMsg(message: string, color?: string) {
        dispatch(setMessage({ message, color }));
    }

    function ShowLoader(isLoading: boolean) {
        dispatch(setLoader({ isLoading }));
    }

    function SetUser(user: User) {
        dispatch(setUser(user));
    }

    function ClearUser() {
        dispatch(clearUser());
    }

    function ValidateFile(file: File) {
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            ShowMsg("Only JPG, PNG or WEBP images are allowed", "red");
            return false;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            ShowMsg(GetMessage('imageSize'), "red");
            return false;
        }

        return true;
    }

    async function DeleteImage(oldImage: string) {
        if (!oldImage) return;

        const publicId = GetPublicId(oldImage);
        if (!publicId) return;

        await deleteRequest(urlUserImageDelete, { publicId });
    }

    function GetPublicId(imageUrl: string): string | null {
        if (!imageUrl) return null;
        const parts = imageUrl.split('/');
        const fileWithExt = parts[parts.length - 1];
        const publicId = fileWithExt.split('.')[0];
        return `fuse/${publicId}`;
    }

    function ButtonSetEditingField(field: EditableField) {
        if (!isLocalUser) return;
        setEditField(field);
    }

    function ButtonCancel() {
        setEditField(null);
        setFieldValues({
            username: user?.username,
            email: user?.email,
            about: user?.about || ''
        });
    }

    function ButtonLogout() {
        ClearUser();
        ShowMsg(GetMessage('logoutSuccess'), 'orange');
        navigate(routeAuth);
    }

    async function ButtonSave(field: EditableField) {
        const body: Partial<User> = {};
        const value = fieldValues[field];

        if (!value) return;

        if (field === "username") {
            if (value.length < 2) return ShowMsg(GetMessage('usernameLess'), "red");
            if (value.length > 20) return ShowMsg(GetMessage('usernameMore'), "red");
            body.username = fieldValues.username;
        }

        if (field === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return ShowMsg(GetMessage('emailInvalid'), "red");
            body.email = fieldValues.email;
        }

        if (field === "about") {
            if (value.length < 5) return ShowMsg(GetMessage('aboutLess'), "red");
            if (value.length > 500) return ShowMsg(GetMessage('aboutMore'), "red");
            body.about = fieldValues.about;
        }

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

    async function UploadImage(e: React.ChangeEvent<HTMLInputElement>) {
        if (!isLocalUser || !user) return;

        const file = e.target.files?.[0];
        if (!file) return;

        if (!ValidateFile(file)) return;

        const formData = new FormData();
        formData.append("folder", "fuse");
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);


        try {
            ShowLoader(true);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            });

            const dataImageUpload = await res.json();
            if (!dataImageUpload.secure_url) throw new Error("Upload failed");

            const oldImage = user.image_url;

            const body: Partial<User> = { image_url: dataImageUpload.secure_url };
            const { data, error } = await putRequest<User>(urlUser, body);

            await DeleteImage(oldImage);

            if (data) {
                SetUser(data);
                ShowMsg(GetMessage('imageSuccess'), "green");
            } else {
                ShowMsg(error, "red");
            }
        } catch (err) {
            ShowMsg("Failed to upload image", "red");
        } finally {
            ShowLoader(false);
        }
    }

    useEffect(() => {
        const prevImageUrl = prevImageUrlRef.current;
        const currentImageUrl = localUser.image_url;

        if (userId === localUser.id) {
            setUserData(localUser);
            if (currentImageUrl !== prevImageUrl) {
                setImageLoaded(false);
                prevImageUrlRef.current = currentImageUrl;
            }
            return;
        }

        async function fetchUser() {
            ShowLoader(true);
            const { data, error } = await getRequest<User>(`${urlUser}?id=${userId}`);
            if (data) {
                setUserData(data);
                if (data.image_url !== prevImageUrl) {
                    setImageLoaded(false);
                    prevImageUrlRef.current = data.image_url;
                }
            } else {
                ShowMsg(error, 'red');
                navigate(routeFeed);
            }
            ShowLoader(false);
        }

        fetchUser();
    }, [localUser, userId]);

    useEffect(() => {
        setFieldValues({
            username: user?.username,
            email: user?.email,
            about: user?.about || '',
        });
    }, [user]);

    if (!user) return null;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 mt-5">
            <div className="w-full max-w-2xl mx-auto bg-black/50 backdrop-blur-sm text-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 select-none">

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">

                    <div className="flex flex-col gap-1 w-full">

                        <div className="flex items-center gap-2 h-[32px] w-full">
                            {editField === "username" ? (
                                <>
                                    <input
                                        className="bg-white/10 text-white text-xl sm:text-2xl font-bold rounded h-full py-1 px-2 focus:outline-none w-full sm:max-w-[80%]"
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
                                    className="text-2xl font-bold cursor-pointer w-full h-full flex items-center select-text"
                                    onClick={() => ButtonSetEditingField("username")}>
                                    {user.username}
                                </h2>
                            )}
                        </div>

                        <div className="flex items-center gap-2 h-[32px] w-full">
                            {editField === "email" ? (
                                <>
                                    <input
                                        className="bg-white/10 text-sm text-gray-200 rounded h-full py-1 px-2 focus:outline-none w-full sm:max-w-[80%]"
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
                                    className="text-sm text-gray-300 cursor-pointer w-full h-full flex items-center select-text"
                                    onClick={() => ButtonSetEditingField("email")}>
                                    {user.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="relative w-24 h-24 sm:w-20 sm:h-20 flex-shrink-0">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={UploadImage}
                        />

                        <div className="relative w-20 h-20">
                            {(!imageLoaded) && (
                                <img
                                    src={ProfilePlaceholder}
                                    alt="Placeholder"
                                    className="w-full h-full rounded-full border-2 border-cyan-200 object-cover absolute top-0 left-0"
                                />
                            )}

                            <img
                                loading="lazy"
                                src={user.image_url || ""}
                                alt="User"
                                onLoad={() => setImageLoaded(true)}
                                className={`w-full h-full rounded-full border-2 border-cyan-200 object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"} cursor-pointer`}
                                onClick={() => { if (isLocalUser) fileInputRef.current?.click() }}
                            />
                        </div>

                    </div>

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
                            className="custom-scroll max-h-40 overflow-y-auto rounded-lg bg-white/5 p-4 text-sm text-gray-200 border border-white/10 cursor-pointer select-text break-words"
                            onClick={() => ButtonSetEditingField("about")}>
                            {user.about || 'No about info provided.'}
                        </div>
                    )}

                </>

                <hr className="border-white/10" />

                <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Joined on {new Date(user.created_at).toLocaleDateString()}</span>
                    {isLocalUser && <button
                        className="text-red-400 hover:text-red-300 transition-all"
                        onClick={ButtonLogout}>
                        Logout
                    </button>}
                </div>

            </div>
        </div>
    );
}

export default React.memo(UserSection);