import React from "react";

function UserContent() {
    return (
        <div className="relative w-full h-full overflow-y-auto p-8 space-y-8">
            <h1 className="text-white text-3xl text-center">---------User---------------</h1>
            {[...Array(5)].map((_, i) => (
                <p key={i} className="text-white text-lg text-center">
                    Dummy content line {i + 1}
                </p>
            ))}
        </div>
    );
}

export default React.memo(UserContent);