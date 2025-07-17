import React from "react";
import UserContent from "./UserContent";

function User() {
    return (
        <div className="relative w-full h-full overflow-hidden">
            <UserContent />
        </div>
    );
}

export default React.memo(User);