import React, { useEffect, useState } from "react";
import socket from "./socket";
import { type MessageUser } from "../../models/modelMessage";

import MessageUserList from "./MessageUserList";
import MessageChatBox from "./MessageChatBox";

// function getRoomName(id1: string, id2: string) {
//     return [id1, id2].sort().join('_');
// }

const Messages = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [selectedUser, setSelectedUser] = useState<null | MessageUser>(null);



    // const [senderId, setSenderId] = useState('');
    // const [receiverId, setReceiverId] = useState('');
    // const [message, setMessage] = useState('');

    // const [currentRoom, setCurrentRoom] = useState('');
    // const [messages, setMessages] = useState<{ [room: string]: Message[] }>({});

    // useEffect(() => {
    //     if (!senderId || !receiverId) return;

    //     const room = getRoomName(senderId, receiverId);
    //     setCurrentRoom(room);
    //     socket.emit('join_room', { senderId, receiverId });
    // }, [senderId, receiverId]);

    // const sendMessage = () => {
    //     if (!message.trim()) return;

    //     const msg: Message = {
    //         senderId,
    //         receiverId,
    //         message,
    //         media_url: '',
    //         timestamp: new Date().toISOString(),
    //     };

    //     socket.emit('send_message', msg);

    //     setMessages(prev => {
    //         const updated = { ...prev };
    //         const room = getRoomName(senderId, receiverId);
    //         updated[room] = [...(updated[room] || []), msg];
    //         return updated;
    //     });

    //     setMessage('');
    // };

    // useEffect(() => {
    //     const handleReceive = (msg: Message) => {
    //         const room = getRoomName(msg.senderId, msg.receiverId);

    //         setMessages(prev => {
    //             const updated = { ...prev };
    //             updated[room] = [...(updated[room] || []), msg];
    //             return updated;
    //         });
    //     };

    //     socket.on('receive_message', handleReceive);

    //     return () => {
    //         socket.off('receive_message', handleReceive);
    //     };
    // }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        // <div className="max-w-md mx-auto p-4 border rounded-md shadow text-white">
        //     <h2 className="text-xl font-bold mb-2">Chat with {receiverId}</h2>

        //     <div className="mb-4 h-64 overflow-y-auto border p-2 bg-gray-50 text-black">
        //         {(messages[currentRoom] || []).map((msg, i) => (
        //             <div key={i} className={`p-2 mb-1 rounded ${msg.senderId === senderId ? 'bg-blue-200 text-right' : 'bg-gray-300 text-left'}`}>
        //                 {msg.message}
        //             </div>
        //         ))}
        //     </div>

        //     <div className="flex gap-2">
        //         <input
        //             type="text"
        //             className="flex-1 p-2 border rounded"
        //             value={message}
        //             onChange={(e) => setMessage(e.target.value)}
        //             placeholder="Type your message"
        //         />
        //         <button
        //             className="bg-blue-500 text-white px-4 py-2 rounded"
        //             onClick={sendMessage}>
        //             Send
        //         </button>
        //     </div>

        //     <div className="flex gap-2 mt-4">
        //         <input
        //             type="text"
        //             className="flex-1 p-2 border rounded"
        //             value={senderId}
        //             onChange={(e) => setSenderId(e.target.value)}
        //             placeholder="Your ID"
        //         />
        //         <input
        //             type="text"
        //             className="flex-1 p-2 border rounded"
        //             value={receiverId}
        //             onChange={(e) => setReceiverId(e.target.value)}
        //             placeholder="Chat with"
        //         />
        //     </div>
        // </div>

        <>
            <div className="flex h-full w-full justify-between overflow-hidden">
                {(!isMobile || !selectedUser) && (
                    <MessageUserList onUserClick={(user) => setSelectedUser(user)} />
                )}

                {(selectedUser) && (
                    <MessageChatBox
                        user={selectedUser}
                        onClose={() => setSelectedUser(null)} />
                )}
            </div>
        </>
    );
};

export default React.memo(Messages);