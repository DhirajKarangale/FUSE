import React, { useState } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.png";

const users = [
    {
        id: 1,
        name: "John Doe",
        lastMessage: "Hey, how's it going?",
        lastDate: "Jul 25",
        image: ProfilePlaceholder,
    },
    {
        id: 2,
        name: "Jane Smith",
        lastMessage: "Let's meet tomorrow!",
        lastDate: "Jul 24",
        image: ProfilePlaceholder,
    },
    {
        id: 3,
        name: "Emily Watson",
        lastMessage: "Check this out 👀",
        lastDate: "Jul 22",
        image: ProfilePlaceholder,
    },
    // add more...
];

interface MessageUserListProps {
    onUserClick: () => void;
}

function MessageUserList({ onUserClick }: MessageUserListProps) {
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full max-w-sm h-full bg-black/25 backdrop-blur-md shadow-xl flex flex-col">
            {/* Header - Search Box */}
            <div className="sm:px-4 sm:py-3 px-1 py-1 border-b border-white/10 bg-black/30">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/50" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none"
                    />
                </div>
            </div>

            {/* Scrollable User List */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent bg-black/20 border-t border-white/10 rounded-b-lg">
                <AnimatePresence>
                    {filteredUsers.length === 0 ? (
                        <motion.div
                            className="text-white/60 text-center mt-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            No users found.
                        </motion.div>
                    ) : (
                        filteredUsers.map((user) => (
                            <motion.div
                                key={user.id + user.name}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer select-none"
                                // onClick={() => console.log("Open chat with", user.name)}
                                onClick={onUserClick}
                            >
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-medium truncate">
                                            {user.name}
                                        </span>
                                        <span className="text-xs text-white/50 whitespace-nowrap">
                                            {user.lastDate}
                                        </span>
                                    </div>
                                    <span className="text-sm text-white/60 truncate">
                                        {user.lastMessage}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>

                {/* Spacer to avoid last user being too close to bottom */}
                <div className="h-4" />
            </div>
        </div>
    );
}

export default React.memo(MessageUserList);
