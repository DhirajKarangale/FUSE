import React, { useState, useMemo, useCallback } from "react";
import { type Post } from "../models/modelPosts";
import DateFormat from "../utils/DateFormat";
import { Heart, MessageCircle } from "lucide-react";

import ProfilePlaceholder from "../assets/images/ProfilePlaceholder.png";
import MediaPlaceholder from "../assets/images/MediaPlaceholder.png";

type Props = {
    post: Post;
};

function PostCard({ post }: Props) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const createdAt = useMemo(() => DateFormat(post.created_at), [post.created_at]);
    const hasImage = !!post.media_url;

    const isTrimmed = useMemo(() => post.post_body.length > 500, [post.post_body]);
    const trimmedBody = useMemo(() => {
        return isTrimmed ? post.post_body.slice(0, 500) + "..." : post.post_body;
    }, [post.post_body, isTrimmed]);

    const handleToggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <div className="w-full max-w-xl mx-auto my-6 px-4 sm:px-6 py-6 rounded-2xl bg-black/25 backdrop-blur-sm shadow-lg text-white pointer-events-auto relative overflow-hidden border border-white/10 transition-all duration-500 ease-in-out">

            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={post.user_image_url || ProfilePlaceholder}
                    alt={post.username}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div>
                    <div className="font-semibold text-base">{post.username}</div>
                    <div className="text-sm text-white/60">{createdAt}</div>
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-3">{post.post_title}</h2>

            {/* Media */}
            {hasImage && (
                <div className="w-full h-60 mb-4 rounded-lg border border-white/20 overflow-hidden relative bg-white/5">
                    {!imageLoaded && (
                        <img
                            src={MediaPlaceholder}
                            alt="placeholder"
                            className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 opacity-100"
                        />
                    )}
                    <img
                        loading="lazy"
                        src={post.media_url}
                        alt="post"
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                    />
                </div>
            )}

            {/* Body */}
            <p className="text-white/90 text-sm leading-relaxed mb-4">
                {isExpanded || !isTrimmed ? post.post_body : trimmedBody}
                {isTrimmed && (
                    <button
                        onClick={handleToggleExpand}
                        className="text-cyan-400 ml-2 hover:underline"
                    >
                        {isExpanded ? "Show Less" : "More"}
                    </button>
                )}
            </p>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-white/10">
                <div className="flex gap-4">
                    <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-200">
                        <Heart className="w-4 h-4" /> <span>0</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-200">
                        <MessageCircle className="w-4 h-4" /> <span>0</span>
                    </button>
                </div>
                <span className="text-white/50 text-xs">{post.category}</span>
            </div>
        </div>
    );
}

export default React.memo(PostCard);