import React from "react";

function Popular() {
    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-3xl">Popular</p>
            </div>
        </>
    );
}

export default React.memo(Popular);