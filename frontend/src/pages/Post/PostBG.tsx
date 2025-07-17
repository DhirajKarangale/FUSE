import React from "react";
import Squares from "../../reactbits/Squares/Squares";

function PostBG() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <Squares
                speed={0.5}
                squareSize={40}
                direction='down'
                borderColor='#271E37'
                hoverFillColor='#060010'
            />
        </div>
    );
}

export default React.memo(PostBG);