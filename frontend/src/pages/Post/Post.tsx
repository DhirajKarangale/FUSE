import React, { useState } from "react";

import PostBG from "./PostBG";

import { urlPost } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { type Posts, getInitialPosts } from "../../models/modelPosts";

function Post() {
    // const [posts, setPosts] = useState<Posts>(getInitialPosts());


    // async function GetPosts() {
    //     const { data, error } = await getRequest<Posts>(urlPost);
    //     if (data) {
    //         setPosts(data);
    //     }
    //     else {
    //         console.log(error);
    //     }
    // }


    return (
        <div className="relative w-full h-full overflow-hidden">
            <PostBG />
            <h1>---------------Post---------------</h1>
        </div>
    );
}

export default React.memo(Post);