import React, { useState } from "react";

import GetMessage from "../../utils/MessagesManager";
import CategoriesSection from "../../components/CategoriesSection";

import { setMessage } from "../../redux/sliceMessageBar";
import { setLoader } from "../../redux/sliceLoader";
import { useAppDispatch } from "../../redux/hookStore";

import { urlPost } from "../../api/APIs";
import { postRequest } from "../../api/APIManager";

import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function AddPost() {
    const CLOUD_NAME = "dfamljkyo";
    const UPLOAD_PRESET = "changexl";
    const inputStyleClass = "w-full p-3 text-sm sm:text-base rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400";

    const dispatch = useAppDispatch();

    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [fieldValues, setFieldValues] = useState({
        postTitle: '',
        postBody: '',
        mediaURL: ''
    });

    function ShowMsg(message: string, color: string) {
        dispatch(setMessage({ message, color }));
    }

    function ShowLoader(isLoading: boolean) {
        dispatch(setLoader({ isLoading }));
    }

    function SelectMedia(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => { setMediaPreview(reader.result as string); };
        reader.readAsDataURL(file);
    };

    function ValidateData() {
        if (!fieldValues.postTitle) {
            ShowMsg(GetMessage('postTitleMust'), 'red');
            return false;
        }
        if (fieldValues.postTitle.length < 3) {
            ShowMsg(GetMessage('postTitleLess'), 'red');
            return false;
        }
        if (fieldValues.postTitle.length > 250) {
            ShowMsg(GetMessage('postTitleGreater'), 'red');
            return false;
        }

        if (fieldValues.postBody) {
            if (fieldValues.postBody.length < 20) {
                ShowMsg(GetMessage('postBodyLess'), 'red');
                return false;
            }
            if (fieldValues.postBody.length > 10000) {
                ShowMsg(GetMessage('postBodyGreater'), 'red');
                return false;
            }
        }

        if (selectedCategories.length != 1) {
            ShowMsg(GetMessage('categorySelectOne'), 'red');
            return false;
        }

        return true;
    }

    function ValidateFile(file: File) {
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            ShowMsg("Only JPG, PNG or WEBP images are allowed", "red");
            return false;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            ShowMsg(GetMessage('postImageSize'), "red");
            return false;
        }

        return true;
    }

    async function UploadMedia(file: File) {
        if (!ValidateFile(file)) return null;

        const formData = new FormData();
        formData.append("folder", "fuse");
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            });

            const dataImageUpload = await res.json();
            console.log('Coud: ', dataImageUpload);
            return dataImageUpload.secure_url;

        } catch (err) {
            console.log('Uploading fail: ', err);
            return null;
        }
    }

    function ClearAllFields() {
        setFieldValues({
            postTitle: '',
            postBody: '',
            mediaURL: '',
        });
        setMediaPreview(null);
        setSelectedFile(null);
        setSelectedCategories([]);
    }

    async function ButtonAddPost() {
        ShowLoader(true);

        if (!ValidateData()) {
            ShowLoader(false);
            return;
        }

        let uploadedMediaURL = '';

        if (selectedFile) {
            const url = await UploadMedia(selectedFile);
            if (url) {
                uploadedMediaURL = url;
            } else {
                ShowMsg(GetMessage('mediaUploadFail'), "red");
                ShowLoader(false);
                return;
            }
        }

        const body = {
            postTitle: fieldValues.postTitle,
            category: selectedCategories[0],
            ...(fieldValues.postBody?.trim() ? { postBody: fieldValues.postBody } : {}),
            ...(uploadedMediaURL?.trim() ? { mediaURL: uploadedMediaURL } : {}),
        };

        const { data, error } = await postRequest<string>(urlPost, body);
        if (data) ShowMsg(data, 'green');
        else ShowMsg(error, 'red');

        ShowLoader(false);
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center z-1 pointer-events-none select-none px-2 sm:px-0">
            <AnimatePresence>
                <motion.div
                    key="add-post"
                    initial={{ opacity: 0, y: -100, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -100, scale: 0.7 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-[90%] sm:w-[700px] max-h-[85vh] sm:max-h-[100vh] rounded-2xl bg-black/30 backdrop-blur-md pointer-events-auto shadow-xl relative overflow-hidden flex flex-col">

                    <div className="overflow-y-auto p-4 sm:p-6 space-y-4 custom-scroll">

                        <div>

                            <label htmlFor="title" className="block text-white text-base sm:text-lg font-semibold mb-2">
                                Title
                            </label>

                            <input
                                type="text"
                                id="title"
                                placeholder="Bad Post"
                                value={fieldValues.postTitle}
                                className={inputStyleClass}
                                onChange={(e) => setFieldValues({ ...fieldValues, postTitle: e.target.value })}
                            />

                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="block text-white text-base sm:text-lg font-semibold">
                                {mediaPreview ? "Uploaded Media" : "Upload Media"}
                            </label>

                            {!mediaPreview ? (
                                <>
                                    <label
                                        htmlFor="media-upload"
                                        className="cursor-pointer w-full bg-white/10 hover:bg-white/20 text-white text-sm text-center py-3 rounded-md border border-white/20 transition-all duration-200">
                                        Click to upload an media
                                    </label>

                                    <input
                                        type="file"
                                        id="media-upload"
                                        accept="image/*"
                                        onChange={SelectMedia}
                                        className="hidden"
                                    />
                                </>
                            ) : (
                                <div className="relative w-full">
                                    <img
                                        src={mediaPreview}
                                        alt="Preview"
                                        className="w-full max-h-60 object-contain rounded-md border border-white/20"
                                    />

                                    <button
                                        onClick={() => setMediaPreview(null)}
                                        className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>

                            <label htmlFor="body" className="block text-white text-base sm:text-lg font-semibold mb-2">
                                Description
                            </label>

                            <textarea
                                name="body"
                                id="body"
                                rows={5}
                                placeholder="Don't deserve Description"
                                value={fieldValues.postBody}
                                className={`${inputStyleClass} max-h-48 overflow-y-auto resize-none custom-scroll`}
                                onChange={(e) => setFieldValues({ ...fieldValues, postBody: e.target.value })}
                            />

                        </div>

                        <div className="w-full max-w-[100vw] sm:max-w-4xl h-[40vh] relative overflow-hidden flex flex-col">
                            <label htmlFor="Category" className="block text-white text-base sm:text-lg font-semibold mb-2">
                                Category
                            </label>

                            <CategoriesSection
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                onError={(msg: string) => ShowMsg(msg, 'red')}
                                singleSelect={true} />
                        </div>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 p-4 border-t border-white/10 bg-black/20">
                        <button
                            className="w-full sm:w-1/2 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition border border-white/20"
                            onClick={ClearAllFields}>
                            Clear All
                        </button>

                        <button
                            className="w-full sm:w-1/2 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-medium transition"
                            onClick={ButtonAddPost}>
                            Add Post
                        </button>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );

}

export default React.memo(AddPost);