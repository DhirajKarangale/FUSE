import React from "react";
import UserSection from "./UserSection";

function User() {
    return (
        <>
            <UserSection />
        </>
    );
}

export default React.memo(User);