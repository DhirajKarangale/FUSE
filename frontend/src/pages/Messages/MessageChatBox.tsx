import React, { useEffect, useRef, useState } from "react";
import { X, Send, Paperclip } from "lucide-react";
import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.png";
import { motion, AnimatePresence } from "framer-motion";

import { type MessageUser } from "../../models/modelMessage";

interface MessageChatBoxProps {
    user: MessageUser;
    onClose: () => void;
}

const MAX_CHARS = 300;

const MessageChatBox = ({ onClose, user }: MessageChatBoxProps) => {
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const prevMessageCount = useRef<number>(0);

    const initialMessages = Array.from({ length: 50 }).map((_, idx) => ({
        id: idx,
        text:
            idx % 6 === 0
                ? "This is a really long test message meant to show how truncation and expansion animations work. ".repeat(10)
                : `Quick msg ${idx + 1}`,
    }));

    const [messageList, setMessageList] = useState(initialMessages);

    useEffect(() => {
        if (messageList.length > prevMessageCount.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        prevMessageCount.current = messageList.length;
    }, [messageList]);

    const toggleExpand = (index: number) => {
        const newSet = new Set(expanded);
        newSet.has(index) ? newSet.delete(index) : newSet.add(index);
        setExpanded(newSet);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="chatbox"
                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 100 }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
                className="w-full max-w-[520px] h-full flex flex-col bg-black/25 backdrop-blur-md shadow-2xl rounded-l-xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10 shrink-0">
                    <motion.button
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <img
                            src={ProfilePlaceholder}
                            alt="User"
                            width={36}
                            height={36}
                            className="rounded-full"
                        />
                        <div className="text-sm sm:text-base font-semibold text-white">
                            {user.username}
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-1 rounded hover:bg-white/10 transition"
                    >
                        <X className="w-5 h-5 text-white" />
                    </motion.button>
                </div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    <AnimatePresence initial={false}>
                        {messageList.map((msg, idx) => {
                            const isLong = msg.text.length > MAX_CHARS;
                            const isExpanded = expanded.has(idx);
                            const displayText = isExpanded || !isLong
                                ? msg.text
                                : msg.text.slice(0, MAX_CHARS) + "...";

                            return (
                                <motion.div
                                    key={msg.id}
                                    layout="position"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 18 }}
                                    className={`rounded-lg px-3 py-2 max-w-xs break-words relative ${idx % 2 === 0
                                        ? "bg-white/10 text-white"
                                        : "bg-cyan-500 text-white self-end ml-auto"
                                        }`}
                                >
                                    <div className="text-sm whitespace-pre-wrap break-words">
                                        {displayText}
                                    </div>

                                    {isLong && (
                                        <button
                                            onClick={() => toggleExpand(idx)}
                                            className="mt-1 underline text-xs text-white/70 hover:text-white"
                                        >
                                            {isExpanded ? "Show less" : "More"}
                                        </button>
                                    )}
                                </motion.div>
                            );
                        })}

                        <div ref={messagesEndRef} />
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-black/30 border-t border-white/10 flex items-center gap-2 shrink-0 rounded-b-xl border-b border-white/10">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded hover:bg-white/10 transition"
                    >
                        <Paperclip className="w-5 h-5 text-white" />
                    </motion.button>
                    <textarea
                        rows={1}
                        placeholder="Type a message"
                        className="flex-1 resize-none bg-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none"
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded hover:bg-white/10 transition"
                    >
                        <Send className="w-5 h-5 text-white" />
                    </motion.button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default React.memo(MessageChatBox);
