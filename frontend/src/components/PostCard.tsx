import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

import { urlPostLike } from "../api/APIs";
import { putRequest } from "../api/APIManager";
import { type Post } from "../models/modelPosts";

import ProfilePlaceholder from "../assets/images/ProfilePlaceholder.png";
import MediaPlaceholder from "../assets/images/MediaPlaceholder.png";

import CommentSection from "./CommentSection";

type Props = {
    post: Post;
    isUser: boolean;
};

function PostCard({ post, isUser }: Props) {
    const [profileLoaded, setProfileLoaded] = useState<boolean>(false);
    const [mediaLoaded, setMediaLoaded] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(post.isLiked);
    const [likes, setLikes] = useState<number>(post.likes);

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<number>(post.comments);
    const [isCommented, setIsCommented] = useState<boolean>(post.isCommented);

    const navigate = useNavigate();
    const createdAt = useMemo(() => new Date(post.created_at).toLocaleDateString(), [post.created_at]);
    const hasImage = !!post.media_url;
    const isTrimmed = useMemo(() => post.post_body?.length > 500, [post.post_body]);

    const handleToggleExpand = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    async function Like() {

        const orgLikes = likes;
        const orgIsLiked = isLiked;

        setIsLiked(!orgIsLiked);
        setLikes(orgIsLiked ? orgLikes - 1 : orgLikes + 1);

        const { error } = await putRequest(`${urlPostLike}?id=${post.id}`);
        if (error) {
            setLikes(orgLikes);
            setIsLiked(orgIsLiked);
        }
    }

    function UpdateComment(isUserComment: boolean, amount: number) {
        setIsCommented(isUserComment);
        setComments(Number(comments) + amount);
    }

    return (
        <motion.div
            layout
            className="select-none w-full max-w-full sm:max-w-xl mx-auto my-4 px-4 sm:px-6 py-4 sm:py-6 rounded-2xl bg-black/25 backdrop-blur-sm shadow-lg text-white relative border border-white/10">
            {!isUser && (
                <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => navigate(`/user/${post.user_id}`)}>
                    <div className="relative w-10 h-10 shrink-0">
                        {!profileLoaded && (
                            <img
                                src={ProfilePlaceholder}
                                alt="placeholder"
                                className="absolute w-full h-full rounded-full object-cover border border-white/20"
                            />
                        )}
                        <img
                            loading="lazy"
                            src={post.user_image_url || ProfilePlaceholder}
                            alt={post.username}
                            onLoad={() => setProfileLoaded(true)}
                            className={`w-full h-full rounded-full object-cover border border-white/20 transition-opacity duration-500 ${profileLoaded ? "opacity-100" : "opacity-0"
                                }`}
                        />
                    </div>

                    <div>
                        <div className="font-semibold text-base">{post.username}</div>
                        <div className="text-sm text-white/60">{createdAt}</div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h2 className="text-lg sm:text-xl font-semibold leading-snug whitespace-pre-wrap break-words break-all">{post.post_title}</h2>
                {isUser && <div className="text-sm text-white/60">{createdAt}</div>}
            </div>

            {hasImage && (
                <div className="w-full aspect-video mb-4 rounded-lg border border-white/20 overflow-hidden relative bg-white/5">
                    {!mediaLoaded && (
                        <img
                            src={MediaPlaceholder}
                            alt="placeholder"
                            className="w-full h-full object-cover absolute top-0 left-0"
                        />
                    )}
                    <motion.img
                        loading="lazy"
                        src={post.media_url}
                        alt="post"
                        onLoad={() => setMediaLoaded(true)}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={mediaLoaded ? { scale: 1, opacity: 1 } : {}}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${mediaLoaded ? "opacity-100" : "opacity-0"
                            }`}
                    />
                </div>
            )}

            <div className="relative">
                {isExpanded ? (
                    <div className="custom-scroll text-white/90 text-sm leading-relaxed break-words whitespace-pre-wrap pr-1 h-30 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                        {post.post_body}
                    </div>
                ) : (
                    <p className="text-white/90 text-sm leading-relaxed break-words line-clamp-[5] h-30 overflow-hidden">
                        {post.post_body}
                    </p>
                )}

                {isTrimmed && (
                    <button
                        onClick={handleToggleExpand}
                        className="text-cyan-400 text-sm hover:underline">
                        {isExpanded ? "Show Less" : "More"}
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between text-sm mt-4 pt-4 border-t border-white/10 gap-y-2">
                <div className="flex gap-4">
                    <motion.button className={`flex items-center gap-1 transition-colors duration-200 ${isLiked ? 'text-red-500' : 'hover:text-red-400'}`}
                        onClick={Like}
                        whileTap={{ scale: 1.2 }}
                        whileHover={{ scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}>
                        <Heart className={`w-4 h-4 transition-all duration-200 ${isLiked ? "fill-red-500" : "fill-transparent"}`} /> <span>{likes}</span>
                    </motion.button>
                    <motion.button className={`flex items-center gap-1 transition-colors duration-200 ${isCommented ? 'text-cyan-500' : 'hover:text-cyan-400'}`}
                        onClick={() => setShowComments(prev => !prev)}
                        whileTap={{ scale: 1.2 }}
                        whileHover={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}>
                        <MessageCircle className={`w-4 h-4 transition-all duration-200 ${isCommented ? "fill-cyan-500" : "fill-transparent"}`} /> <span>{comments}</span>
                    </motion.button>
                </div>
                <span className="text-white/50 text-xs break-all">{post.category}</span>
            </div>

            {showComments && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <CommentSection
                        postId={post.id}
                        onClose={() => setShowComments(false)}
                        UpdateComment={UpdateComment} />
                </motion.div>
            )}

        </motion.div>
    );
}

export default React.memo(PostCard);