import React from "react";

function User() {
    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-3xl">User</p>
            </div>
        </>
    );
}

export default React.memo(User);