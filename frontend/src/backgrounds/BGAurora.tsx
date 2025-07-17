import React from "react";
import Squares from "../reactbits/Squares/Squares";

function BGAurora() {
    return (
        <Squares
            speed={0.5}
            squareSize={40}
            direction='down'
            borderColor='#fff'
            hoverFillColor='#060010'
        />
    );
}

export default React.memo(BGAurora);