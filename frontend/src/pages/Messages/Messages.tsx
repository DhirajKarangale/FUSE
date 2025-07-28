import React, { useEffect, useState } from "react";

import { useAppSelector } from "../../redux/hookStore";
import { type Message } from "../../models/modelMessage";

import MessageUserList from "./MessageUserList";
import MessageChatBox from "./MessageChatBox";

const Messages = () => {
    const localUser = useAppSelector(state => state.user);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<null | Message>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);


    if (!localUser) return <div className="text-white p-4">Loading data...</div>;;

    return (
        <>
            {/* <div className="flex gap-3 h-full w-full justify-between overflow-hidden">
                {(!isMobile || !selectedMessage) && (
                    <MessageUserList
                        onMessageClick={(user) => setSelectedMessage(user)}
                        isActive={isMobile && selectedMessage !== null} />
                )}

                {selectedMessage && localUser && (
                    <MessageChatBox
                        message={selectedMessage}
                        localUser={localUser}
                        onClose={() => setSelectedMessage(null)} />
                )}
            </div> */}

            <div className="flex h-full w-full">
                <div className={` h-full ${selectedMessage && isMobile ? "hidden" : "block"} ${selectedMessage && !isMobile ? "w-1/3" : "w-full"}`}>
                    <MessageUserList
                        onMessageClick={(user) => setSelectedMessage(user)}
                        isActive={false}
                    />
                </div>
                {selectedMessage && localUser && (
                    <div className={`h-full ${isMobile ? "w-full" : "w-2/3"}`}>
                        <MessageChatBox
                            message={selectedMessage}
                            localUser={localUser}
                            onClose={() => setSelectedMessage(null)}
                        />
                    </div>
                )}
            </div>

        </>
    );
};

export default React.memo(Messages);