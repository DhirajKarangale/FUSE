import React, { useState } from "react";

import { urlPost } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { type PostData, getInitialPosts } from "../../models/modelPosts";

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
            <h1>---------------Post---------------</h1>
        </div>
    );
}

export default React.memo(Post);