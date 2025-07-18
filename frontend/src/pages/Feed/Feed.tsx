import React, { useEffect, useRef, useCallback } from "react";
import PostCard from "../../components/PostCard";
import SkeletonPost from "../../components/SkeletonPost";
import MessageBar, { type MessageBarHandle } from '../../components/MessageBar';

import { urlPost } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { useAppDispatch, useAppSelector } from '../../redux/hookStore';
import { setPostData } from "../../redux/sliceFeedPost";
import { type PostData } from "../../models/modelPosts";

function Feed() {
    const dispatch = useAppDispatch();
    const postData = useAppSelector(state => state.feedPost);
    const user = useAppSelector(state => state.user);
    const msgRef = useRef<MessageBarHandle>(null);

    const observer = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef(false);

    const hasMore = postData.currPage < postData.totalPages - 1;

    const ShowMsg = (msg: string, color?: string) => {
        msgRef.current?.ShowMsg(msg, color);
    };

    const loadPosts = useCallback(async (page: number) => {
        if (loadingRef.current) return;
        loadingRef.current = true;

        const { data, error } = await getRequest<PostData>(
            `${urlPost}?categories=${user.categories}&page=${page}`
        );

        if (data) {
            dispatch(setPostData({
                posts: page === 0 ? data.posts : [...postData.posts, ...data.posts],
                currPage: page,
                totalPages: data.totalPages,
            }));
        } else {
            ShowMsg(error || "Failed to load posts", "red");
        }

        loadingRef.current = false;
    }, [dispatch, postData.posts, user.categories]);

    useEffect(() => {
        loadPosts(0);
    }, []);

    const lastPostRef = useCallback((node: HTMLDivElement | null) => {
        if (loadingRef.current || !hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadPosts(postData.currPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [hasMore, loadPosts, postData.currPage]);

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

            {loadingRef.current && [...Array(3)].map((_, i) => (
                <SkeletonPost key={i} />
            ))}

            {!hasMore && postData.currPage !== -1 && (
                <p className="text-center text-sm text-white/40 py-4">
                    🎉 You've reached the end!
                </p>
            )}

            <MessageBar ref={msgRef} />
        </>
    );
}

export default React.memo(Feed);
