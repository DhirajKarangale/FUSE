import React, { useEffect, useState, useRef, useCallback } from "react";
import { Search as SearchIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { urlUserSearch, urlMessageUserSearch } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { type MessageUser, type MessageUserData } from "../../models/modelMessage";

import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.png";

const pageSize = 10;

interface MessageUserListProps {
    onUserClick: (user: MessageUser) => void;
}

function MessageUserList({ onUserClick }: MessageUserListProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [cachedUsers, setCachedUsers] = useState<MessageUser[]>([]);
    const [searchUsers, setSearchUsers] = useState<MessageUser[]>([]);
    const [currPage, setCurrPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [profileLoadedMap, setProfileLoadedMap] = useState<Record<number, boolean>>({});

    const listRef = useRef<HTMLDivElement | null>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const usersToRender = isSearchMode ? searchUsers : cachedUsers;

    const fetchUsers = useCallback(async (page: number) => {
        setLoading(true);
        const url = isSearchMode
            ? `${urlUserSearch}?term=${encodeURIComponent(searchTerm)}&page=${page}&size=${pageSize}`
            : `${urlMessageUserSearch}?page=${page}&size=${pageSize}`;
        const { data } = await getRequest<MessageUserData>(url);
        if (!data) return;

        if (isSearchMode) {
            setSearchUsers((prev) => {
                const existingIds = new Set(prev.map((u) => u.id));
                const newUsers = data.users.filter((u) => !existingIds.has(u.id));
                return [...prev, ...newUsers];
            });
        } else {
            setCachedUsers((prev) => {
                const existingIds = new Set(prev.map((u) => u.id));
                const newUsers = data.users.filter((u) => !existingIds.has(u.id));
                return [...prev, ...newUsers];
            });
        }

        setCurrPage(data.currPage);
        setTotalPages(data.totalPages);
        setLoading(false);
    }, [isSearchMode, searchTerm]);

    function ImageLoad(userId: number) {
        setProfileLoadedMap((prev) => ({ ...prev, [userId]: true }));
    };

    function UserClick(user: MessageUser) {
        if (isSearchMode) {
            setCachedUsers((prev) => {
                const exists = prev.some((u) => u.id === user.id);
                return exists ? prev : [user, ...prev];
            });
        }
        onUserClick(user);
    };

    function Scroll() {
        const el = listRef.current;
        if (!el || loading) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && currPage < totalPages) {
            fetchUsers(currPage);
        }
    };


    useEffect(() => {
        fetchUsers(0);
    }, [isSearchMode, fetchUsers]);

    useEffect(() => {
        if (searchTerm.trim()) {
            setIsSearchMode(true);
            setSearchUsers([]);
            setCurrPage(0);
            setTotalPages(1);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                fetchUsers(0);
            }, 500);
        } else {
            setIsSearchMode(false);
            setSearchUsers([]);
            setCurrPage(0);
            setTotalPages(1);
        }
    }, [searchTerm]);

    useEffect(() => {
        const el = listRef.current;
        if (el) el.addEventListener("scroll", Scroll);
        return () => el?.removeEventListener("scroll", Scroll);
    }, [currPage, totalPages, loading]);


    return (
        <div className="w-full h-full flex flex-col pb-7">
            <div className="sm:px-4 sm:py-3 px-1 py-1 border-b border-white/10 bg-black/30">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-white/50" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none"
                    />
                </div>
            </div>

            <div
                key={isSearchMode ? "search" : "cached"}
                ref={listRef}
                className="flex-1 overflow-y-auto px-2 py-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent bg-black/20 border-t border-white/10 rounded-b-lg">
                <AnimatePresence initial={false}>
                    {usersToRender.length === 0 && !loading ? (
                        <motion.div
                            className="text-white/60 text-center mt-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            No users found.
                        </motion.div>
                    ) : (
                        usersToRender.map((user) => (
                            <motion.div
                                key={user.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                whileHover={{ scale: 1, backgroundColor: "rgba(255,255,255,0.05)" }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer select-none bg-white/10 backdrop-blur-md shadow-xl"
                                onClick={() => UserClick(user)}>

                                <div className="relative w-9 h-9 shrink-0">
                                    {!profileLoadedMap[user.id] && (
                                        <img
                                            src={ProfilePlaceholder}
                                            alt="placeholder"
                                            className="absolute w-full h-full rounded-full object-cover border border-white/20"
                                        />
                                    )}
                                    {user.image_url && (
                                        <img
                                            loading="lazy"
                                            src={user.image_url}
                                            alt={user.username}
                                            onLoad={() => ImageLoad(user.id)}
                                            className={`w-full h-full rounded-full object-cover border border-white/20 transition-opacity duration-500 ${profileLoadedMap[user.id] ? "opacity-100" : "opacity-0"}`}
                                        />
                                    )}
                                </div>

                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-medium truncate">
                                            {user.username}
                                        </span>
                                        {user.created_at && <span className="text-xs text-white/50 whitespace-nowrap">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>}
                                    </div>
                                    <span className="text-sm text-white/60 truncate">
                                        {user.message}
                                    </span>
                                </div>

                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
                {loading && <div className="text-white/50 text-sm text-center py-4">Loading...</div>}
            </div>

        </div>
    );
}

export default React.memo(MessageUserList);