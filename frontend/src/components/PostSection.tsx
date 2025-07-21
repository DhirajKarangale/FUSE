import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { getRequest } from "../api/APIManager";
import { type PostData, getInitialPosts } from "../models/modelPosts";
import PostCard from "./PostCard";
import SkeletonPost from "./SkeletonPost";

type PostSectionProps = {
    baseUrl: string;
    isUserPost: boolean;
};

const PostSection: React.FC<PostSectionProps> = ({ baseUrl, isUserPost }) => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [postData, setPostData] = useState<PostData>(getInitialPosts());
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchPosts = async (page: number) => {
        let url = baseUrl.includes("?") ? `${baseUrl}&page=${page}` : `${baseUrl}?page=${page}`;
        const { data, error } = await getRequest<PostData>(url);
        if (error || !data) return null;
        return data;
    };

    const lastPostRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || !hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const postVariants: Variants = {
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.05,
                type: "spring",
                stiffness: 120,
                damping: 20,
            },
        }),
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.9,
            transition: { duration: 0.3 },
        },
    };

    useEffect(() => {
        setPage(1);
        setPostData(getInitialPosts());
        setHasMore(true);
    }, [baseUrl]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await fetchPosts(page);
            if (data) {
                setPostData((prev) => ({
                    ...data,
                    posts: page === 1 ? data.posts : [...prev.posts, ...data.posts],
                }));
                setHasMore(data.posts.length > 0);
            }
            setLoading(false);
        })();
    }, [baseUrl, page]);

    return (
        <>
            <AnimatePresence>
                {postData.posts.map((post, index) => {
                    const isLast = index === postData.posts.length - 1;
                    return (
                        <motion.div
                            key={post.id}
                            ref={isLast ? lastPostRef : null}
                            custom={index}
                            variants={postVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <PostCard post={post} isUser={isUserPost} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {loading && (
                <div className="mt-4 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <SkeletonPost key={i} />
                    ))}
                </div>
            )}

            {!loading && !hasMore && (
                <p className="text-center text-sm text-white/40 py-4">🎉 You've reached the end!</p>
            )}
        </>
    );
};

export default React.memo(PostSection);