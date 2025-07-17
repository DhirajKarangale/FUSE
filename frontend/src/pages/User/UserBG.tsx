import React from "react";
import Aurora from '../../reactbits/Aurora/Aurora';

function UserBG() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
        </div>
    );
}

export default React.memo(UserBG);