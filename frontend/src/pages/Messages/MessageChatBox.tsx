import React, { useEffect, useRef, useState } from "react";
import { X, Send, Paperclip } from "lucide-react";
import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.png";
import { motion, AnimatePresence } from "framer-motion";

import { urlMessages } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { type MessageUser, type Message, type MessageData } from "../../models/modelMessage";

interface MessageChatBoxProps {
    user: MessageUser;
    onClose: () => void;
}

const MAX_CHARS = 300;

const MessageChatBox = ({ onClose, user }: MessageChatBoxProps) => {
    const [profileLoaded, setProfileLoaded] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [currPage, setCurrPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [messages, setMessages] = useState<Message[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    function formatTimestamp(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            day: "2-digit",
            month: "short",
        });
    }

    async function Fetch(page: number) {
        if (page > totalPages) return;

        const { data } = await getRequest<MessageData>(`${urlMessages}?userId=${user.id}&page=${page}`);
        if (!data) return;

        setMessages(prev => {
            const existingIds = new Set(prev.map(msg => msg.id));
            const newMessages = data.messages
                .filter(msg => !existingIds.has(msg.id));
            return [...prev, ...newMessages];
        });

        setTotalPages(data.totalPages);
        setCurrPage(data.currPage);
    }

    function toggleExpand(index: number) {
        const newSet = new Set(expanded);
        newSet.has(index) ? newSet.delete(index) : newSet.add(index);
        setExpanded(newSet);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = async () => {
            console.log('Scroll : ', container.scrollTop);
            console.log('Width : ', container.scrollWidth);

            if (container.scrollTop <= - container.scrollWidth) {
                await Fetch(currPage + 1);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [currPage, totalPages, messages]);


    useEffect(() => {
        Fetch(0);
    }, []);

    useEffect(() => {
        if (currPage === 0 && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [messages]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="chatbox"
                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 100 }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
                className="w-full max-w-[520px] h-full flex flex-col bg-black/25 backdrop-blur-md shadow-2xl rounded-l-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10 shrink-0">
                    <motion.button
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}>
                        <div className="relative w-9 h-9 shrink-0">
                            {!profileLoaded && (
                                <img
                                    alt="User"
                                    className="absolute w-full h-full rounded-full object-cover border border-white/20"
                                    src={ProfilePlaceholder}
                                />
                            )}
                            {user.image_url && <img
                                loading="lazy"
                                src={user.image_url}
                                alt={user.username}
                                onLoad={() => setProfileLoaded(true)}
                                className={`w-full h-full rounded-full object-cover border border-white/20 transition-opacity duration-500 ${profileLoaded ? "opacity-100" : "opacity-0"}`}
                            />}
                        </div>

                        <div className="text-sm sm:text-base font-semibold text-white">
                            {user.username}
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-1 rounded hover:bg-white/10 transition">
                        <X className="w-5 h-5 text-white" />
                    </motion.button>
                </div>

                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto px-4 py-3 flex flex-col-reverse space-y-reverse space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                >
                    <AnimatePresence initial={false}>
                        {messages.reverse().map((message) => {
                            const isLong = message.message.length > MAX_CHARS;
                            const isExpanded = expanded.has(message.id);
                            const displayText = isExpanded || !isLong
                                ? message.message
                                : message.message.slice(0, MAX_CHARS) + "...";

                            return (
                                <motion.div
                                    key={message.id}
                                    layout="position"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 18 }}
                                    className={`rounded-lg px-3 py-2 max-w-xs break-words relative ${message.isSend
                                        ? "bg-cyan-500 text-white self-end ml-auto"
                                        : "bg-white/10 text-white"
                                        }`}>
                                    <div className="text-sm whitespace-pre-wrap break-words">
                                        {displayText}
                                    </div>

                                    {isLong && (
                                        <button
                                            onClick={() => toggleExpand(message.id)}
                                            className="mt-1 underline text-xs text-white/70 hover:text-white"
                                        >
                                            {isExpanded ? "Show less" : "More"}
                                        </button>
                                    )}

                                    <div
                                        className={`mt-1 text-[10px] ${message.isSend ? "text-white text-right" : "text-white/60 text-left"}`}>
                                        {formatTimestamp(message.created_at)}
                                    </div>

                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

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
                        className="p-2 rounded hover:bg-white/10 transition">
                        <Send className="w-5 h-5 text-white" />
                    </motion.button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default React.memo(MessageChatBox);