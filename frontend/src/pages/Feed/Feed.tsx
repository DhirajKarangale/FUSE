import React, { useState } from "react";

import FeedBG from "./FeedBG";

import { urlPost } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { type Posts, getInitialPosts } from "../../models/modelPosts";

function Feed() {
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
        <div className="relative w-full h-full">
            {/* <FeedBG /> */}
            <div className="text-white text-center text-3xl">
                ---------------Feed---------------
            </div>
        </div>
    );
}

export default React.memo(Feed);