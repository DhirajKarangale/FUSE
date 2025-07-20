import React, { useEffect, useRef, useState, useCallback } from "react";

import { urlPost } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { setPostData } from "../../redux/sliceFeedPost";

import { useAppDispatch, useAppSelector } from '../../redux/hookStore';
import { type PostData } from "../../models/modelPosts";
import { setMessage } from '../../redux/sliceMessageBar';

import PostCard from "../../components/PostCard";
import SkeletonPost from "../../components/SkeletonPost";

function Feed() {
    const dispatch = useAppDispatch();
    const postData = useAppSelector((state) => state.feedPost);
    const { categories, isLoaded } = useAppSelector((state) => state.user);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

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

        let url = `${urlPost}?page=${currentPage}`;
        if (categories.length > 0) url += `&categories=${categories.join(",")}`;

        const { data, error } = await getRequest<PostData>(url);

        if (data) {
            if (currentPage === 1) {
                dispatch(setPostData(data));
            } else {
                dispatch(setPostData({
                    ...data,
                    posts: [...postData.posts, ...data.posts],
                }));
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
        if (isLoaded) GetPosts(page);
    }, [isLoaded]);

    return (
        <>
            {postData.posts.map((post, index) => {
                const isLast = index === postData.posts.length - 1;
                return (
                    <div key={post.id} ref={isLast ? lastPostRef : null}>
                        <PostCard post={post} />
                    </div>
                );
            })}

            {loading && [...Array(3)].map((_, idx) => <SkeletonPost key={idx} />)}

            {!hasMore && !loading && (
                <p className="text-center text-sm text-white/40 py-4">🎉 You've reached the end!</p>
            )}
        </>
    );
}

export default React.memo(Feed);