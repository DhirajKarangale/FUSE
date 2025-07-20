import React, { useState, useMemo, useCallback } from "react";
import { type Post } from "../models/modelPosts";
import { Heart, MessageCircle } from "lucide-react";

import ProfilePlaceholder from "../assets/images/ProfilePlaceholder.png";
import MediaPlaceholder from "../assets/images/MediaPlaceholder.png";

type Props = {
    post: Post;
};

function PostCard({ post }: Props) {
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [mediaLoaded, setImageLoaded] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const createdAt = new Date(post.created_at).toLocaleDateString();
    const hasImage = !!post.media_url;
    const isTrimmed = useMemo(() => post.post_body.length > 500, [post.post_body]);

    const handleToggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <div className="select-none w-full max-w-xl mx-auto my-6 px-4 sm:px-6 py-6 rounded-2xl bg-black/25 backdrop-blur-sm shadow-lg text-white pointer-events-auto relative overflow-hidden border border-white/10 transition-all duration-500 ease-in-out">

            <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10">
                    {!profileLoaded && (
                        <img
                            src={ProfilePlaceholder}
                            alt="placeholder"
                            className="absolute w-full h-full rounded-full object-cover border border-white/20 transition-opacity duration-500 opacity-100"
                        />
                    )}

                    <img
                        loading="lazy"
                        src={(post.user_image_url ?? undefined) || ProfilePlaceholder}
                        alt={post.username}
                        onLoad={() => setProfileLoaded(true)}
                        className={`w-full h-full rounded-full object-cover border border-white/20 transition-opacity duration-500 ${profileLoaded ? "opacity-100" : "opacity-0"}`}
                    />
                </div>


                <div>
                    <div className="font-semibold text-base select-text">{post.username}</div>
                    <div className="text-sm text-white/60">{createdAt}</div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-3 select-text">{post.post_title}</h2>

            {hasImage && (
                <div className="w-full h-50 mb-4 rounded-lg border border-white/20 overflow-hidden relative bg-white/5">
                    {!mediaLoaded && (
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
                        className={`w-full h-full object-cover transition-opacity duration-500 ${mediaLoaded ? "opacity-100" : "opacity-0"}`}
                    />
                </div>
            )}

            <div className="mb-4">
                {isExpanded || !isTrimmed ? (
                    <div className="custom-scroll text-white/90 text-sm leading-relaxed max-h-48 overflow-y-auto pr-1 select-text break-words whitespace-pre-wrap overflow-x-hidden scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                        {post.post_body}
                    </div>
                ) : (
                    <p className="text-white/90 text-sm leading-relaxed select-text break-words line-clamp-5">
                        {post.post_body}
                    </p>
                )}
                {isTrimmed && (
                    <button
                        onClick={handleToggleExpand}
                        className="text-cyan-400 text-sm mt-1 hover:underline"
                    >
                        {isExpanded ? "Show Less" : "More"}
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-white/10">
                <div className="flex gap-4">
                    <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-200">
                        <Heart className="w-4 h-4" /> <span>0</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-200">
                        <MessageCircle className="w-4 h-4" /> <span>0</span>
                    </button>
                </div>
                <span className="text-white/50 text-xs select-text">{post.category}</span>
            </div>
        </div>
    );

}

export default React.memo(PostCard);