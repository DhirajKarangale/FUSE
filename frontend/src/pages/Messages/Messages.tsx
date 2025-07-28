import React, { useEffect, useState } from "react";

import { useAppSelector } from "../../redux/hookStore";
import { type MessageUser } from "../../models/modelMessage";

import MessageUserList from "./MessageUserList";
import MessageChatBox from "./MessageChatBox";

const Messages = () => {
    const localUser = useAppSelector(state => state.user);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedUser, setSelectedUser] = useState<null | MessageUser>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);


    if (!localUser) return <div className="text-white p-4">Loading data...</div>;;

    return (
        <>
            <div className="flex gap-3 h-full w-full justify-between overflow-hidden">
                <MessageUserList
                    onUserClick={(user) => setSelectedUser(user)}
                    isActive={!isMobile || !selectedUser}
                />

                {selectedUser && localUser && (
                    <MessageChatBox
                        message={selectedUser}
                        localUser={localUser}
                        onClose={() => setSelectedUser(null)} />
                )}
            </div>
        </>
    );
};

export default React.memo(Messages);