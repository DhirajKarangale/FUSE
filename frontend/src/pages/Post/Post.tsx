import React from "react";

function Post() {
    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-3xl">Post</p>
            </div>
        </>
    );
}

export default React.memo(Post);