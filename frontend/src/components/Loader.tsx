import React, { useEffect, useState } from "react";
import loaderMessages from '../data/loader.json';

function Loader() {
    const [tip, setTip] = useState("");
    const [loadingText, setLoadingText] = useState("Loading");

    useEffect(() => {
        setTip(loaderMessages[Math.floor(Math.random() * loaderMessages.length)]);

        const dots = ["", ".", "..", "..."];
        let index = 0;

        const interval = setInterval(() => {
            setLoadingText(`Loading${dots[index]}`);
            index = (index + 1) % dots.length;
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm text-white px-4">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-xl font-semibold select-none">{loadingText}</p>
            </div>

            <div className="absolute bottom-10 text-center text-sm text-gray-300 italic max-w-md select-none">
                {tip}
            </div>
        </div>
    );
};

export default React.memo(Loader);