import './components.css';

import React, { useState, useImperativeHandle, forwardRef, useRef } from "react";

export type MessageBarHandle = {
    showMsg: (message: string, color?: string) => void;
};

const MessageBar = forwardRef<MessageBarHandle>((_, ref) => {
    const [msg, setMsg] = useState('');
    const [msgColor, setMsgColor] = useState('white');
    const [animationKey, setAnimationKey] = useState(0);
    const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useImperativeHandle(ref, () => ({
        showMsg(message: string, color: string = 'white') {
            setMsg(message);
            setMsgColor(color);
            setAnimationKey(prev => prev + 1); 

            if (msgTimer.current) clearTimeout(msgTimer.current);
            if (!message) return;

            msgTimer.current = setTimeout(() => {
                setMsg('');
            }, 3000);
        }
    }));

    if (!msg) return null;

    return (
        <div className="fixed bottom-16 w-full flex justify-center pointer-events-none z-50">
            <div key={animationKey} className="MessageBar bg-black/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 shadow-md">
                <p className="text-center text-lg font-bold text-white select-none" style={{ color: msgColor }}>
                    {msg}
                </p>
            </div>
        </div>
    );
});

export default React.memo(MessageBar);