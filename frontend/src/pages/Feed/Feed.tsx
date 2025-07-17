import React, { useEffect, useRef } from "react";

import PostCard from "../../components/PostCard";
import MessageBar, { type MessageBarHandle } from '../../components/MessageBar';

import { urlPost } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { setPostData } from "../../redux/sliceFeedPost";
import { useAppDispatch, useAppSelector } from '../../redux/hookStore';
import { type PostData, } from "../../models/modelPosts";

function Feed() {
    const dispatch = useAppDispatch();
    const postData = useAppSelector((state) => state.feedPost);
    const msgRef = useRef<MessageBarHandle>(null);

    async function GetPosts() {
        const { data, error } = await getRequest<PostData>(urlPost);
        if (data) {
            dispatch(setPostData(data));
        }
        else {
            ShowMsg(error, 'red');
        }
    }

    function ShowMsg(msg: string, color?: string) {
        msgRef.current?.ShowMsg(msg, color);
    }


    useEffect(() => {
        GetPosts();
    }, []);


    return (
        <>
            {postData.posts.map((post) => (<PostCard key={post.id} post={post} />))}
            <MessageBar ref={msgRef} />
        </>
    );
}

export default React.memo(Feed);