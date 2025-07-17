import React from "react";
import Aurora from "../../reactbits/Aurora/Aurora";
import Squares from "../../reactbits/Squares/Squares";

function FeedBG() {
    return (
        <div className="fixed inset-0 -z-10">
            {/* <Squares
                speed={0.5}
                squareSize={40}
                direction='down'
                borderColor='#fff'
                hoverFillColor='#060010'
            /> */}

            <Aurora
                colorStops={["#140A50", "#3A1120", "#330C0C"]}
                // colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
        </div>
    );
}

export default React.memo(FeedBG);