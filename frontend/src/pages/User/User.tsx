import React from "react";
import UserPost from "./UserPost";
import UserSection from "./UserSection";

function User() {
    return (
        <>
            <UserSection />
            <UserPost />
        </>
    );
}

export default React.memo(User);