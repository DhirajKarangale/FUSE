import React, { useEffect, useRef, useState } from "react";
import { X, Send, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { urlMessages } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { type MessageUser, type Message, type MessageData } from "../../models/modelMessage";

import MediaPlaceholder from "../../assets/images/MediaPlaceholder.png";
import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.png";

interface MessageChatBoxProps {
    user: MessageUser;
    onClose: () => void;
}

const MAX_CHARS = 300;

const MessageChatBox = ({ onClose, user }: MessageChatBoxProps) => {
    const [profileLoaded, setProfileLoaded] = useState<boolean>(false);
    const [messageLoading, setMessageLoading] = useState<boolean>(false);
    const [mediaLoadedMap, setMediaLoadedMap] = useState<Record<number, boolean>>({});
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [currPage, setCurrPage] = useState<number>(1);
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
        if (page > totalPages || messageLoading) return;

        setMessageLoading(true);
        const { data } = await getRequest<MessageData>(`${urlMessages}?userId=${user.id}&page=${page}`);
        setTimeout(() => { setMessageLoading(false); }, 100);
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

    function MediaLoad(userId: number) {
        setMediaLoadedMap((prev) => ({ ...prev, [userId]: true }));
    };

    function MessageSkeleton({ isSend }: { isSend: boolean }) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${isSend ? "justify-end" : "justify-start"} px-2`}>
                <div
                    className={`max-w-xs w-[70%] sm:w-[60%] p-3 rounded-2xl animate-pulse ${isSend ? "bg-cyan-800 rounded-br-none" : "bg-white/10 rounded-bl-none"}`}>
                    {/* <div className="h-3 bg-white/30 rounded w-4/5 mb-2" /> */}
                    <div className="h-3 bg-white/20 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
            </motion.div>
        );
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = async () => {

            const scroll = -container.scrollTop;
            const height = container.scrollHeight - container.clientHeight - 400;
            if (scroll >= height) await Fetch(currPage + 1);
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
                    className="flex-1 overflow-y-auto px-4 py-3 flex flex-col-reverse space-y-reverse space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

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

                                    {message.media_url && <div className="w-full aspect-video my-2 rounded-lg border border-white/20 overflow-hidden relative bg-white/5">
                                        {!mediaLoadedMap[message.id] && (
                                            <img
                                                src={MediaPlaceholder}
                                                alt="placeholder"
                                                className="w-full h-full object-cover absolute top-0 left-0"
                                            />
                                        )}
                                        <motion.img
                                            loading="lazy"
                                            src={message.media_url}
                                            alt="post"
                                            onLoad={() => MediaLoad(message.id)}
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={mediaLoadedMap[message.id] ? { scale: 1, opacity: 1 } : {}}
                                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                            className={`w-full h-full object-cover transition-opacity duration-500 ${mediaLoadedMap[message.id] ? "opacity-100" : "opacity-0"}`}
                                        />
                                    </div>}

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

                    {/* {messageLoading && (
                        <div className="w-full flex justify-center py-2">
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs text-white/70">
                                Loading messages...
                            </motion.div>
                        </div>
                    )} */}

                    {messageLoading && (
                        <>
                            {[...Array(3)].map((_, idx) => (
                                <MessageSkeleton key={idx} isSend={idx % 2 === 0} />
                            ))}
                        </>
                    )}

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