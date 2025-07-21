import React, { useEffect, useRef, useState, useCallback } from "react";

import { urlPostUser } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";

import { useAppDispatch } from '../../redux/hookStore';
import { type PostData, getInitialPosts } from "../../models/modelPosts";
import { setMessage } from '../../redux/sliceMessageBar';

import PostCard from "../../components/PostCard";
import SkeletonPost from "../../components/SkeletonPost";

type UserPost = {
    userId: number;
}

function UserPost({ userId }: UserPost) {
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [postData, setPostData] = useState<PostData>(getInitialPosts());

    const observer = useRef<IntersectionObserver | null>(null);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading || !hasMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    setPage(prev => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    async function GetPosts(currentPage: number) {
        setLoading(true);

        let url = `${urlPostUser}?userId=${userId}&page=${currentPage}`;
        const { data, error } = await getRequest<PostData>(url);

        if (data) {
            if (currentPage === 1) {
                setPostData(data);
            } else {
                setPostData({
                    ...data,
                    posts: [...postData.posts, ...data.posts],
                });
            }

            setHasMore(data.posts.length > 0);
        } else {
            ShowMsg(error, 'red');
        }

        setLoading(false);
    }

    function ShowMsg(msg: string, color?: string) {
        dispatch(setMessage({ message: msg, color: color }))
    }

    useEffect(() => {
        GetPosts(page);
    }, [userId]);

    return (
        <section className="bg-white/5 border border-white/10 rounded-2xl mt-6 p-4 sm:p-6 max-w-5xl mx-auto backdrop-blur-md shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4 px-2">Your Posts</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {postData.posts.map((post, index) => {
                    const isLast = index === postData.posts.length - 1;
                    return (
                        <div key={post.id} ref={isLast ? lastPostRef : null}>
                            <PostCard post={post} isUser={true} />
                        </div>
                    );
                })}
            </div>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {[...Array(2)].map((_, idx) => <SkeletonPost key={idx} />)}
                </div>
            )}

            {!loading && postData.posts.length === 0 && (
                <p className="text-center text-sm text-white/40 py-4">
                    User doesn't have any posts.
                </p>
            )}

            {!hasMore && !loading && postData.posts.length > 0 && (
                <p className="text-center text-sm text-white/40 py-4">🎉 You've reached the end!</p>
            )}
        </section>
    );
}

export default React.memo(UserPost);