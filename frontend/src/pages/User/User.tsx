import React from "react";
import UserBG from "./UserBG";
import UserContent from "./UserContent";

function User() {
    return (
        <div className="relative w-full h-full overflow-hidden">
            <UserBG />
            <UserContent />
        </div>
    );
}

export default React.memo(User);