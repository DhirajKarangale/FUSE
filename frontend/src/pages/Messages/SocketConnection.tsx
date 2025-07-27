import { useEffect } from "react";
import socket from "./socket";
import { type Message } from "../../models/modelMessage";

import { useAppSelector } from "../../redux/hookStore";

function SocketConnection() {
    const user = useAppSelector(state => state.user);

    useEffect(() => {
        if (!user) return;
        socket.emit('register_user', user.id);
    }, [user])

    useEffect(() => {
        const handleReceive = (roomMsg: Message) => {
            console.log('Received: ', roomMsg);
        };

        socket.on('receive_message', handleReceive);
        return () => { socket.off('receive_message', handleReceive); };
    }, []);

    return null;
}

export default SocketConnection;