import { useEffect } from "react";
import socket from "./socket";

import { routeMessages } from "../../utils/Routes";

import { setMessage } from "../../redux/sliceMessages";
import { setMessageBar } from "../../redux/sliceMessageBar";
import { useAppDispatch, useAppSelector } from "../../redux/hookStore";

import { type Message } from "../../models/modelMessage";

import GetMessage from "../../utils/MessagesManager";

function SocketConnection() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    function SetMessage(username: string, msg: string) {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith(routeMessages)) return;
        
        const receivedMsg = msg.length > 50 ? msg.slice(0, 50) + '...' : msg;
        const message = `${GetMessage('messageReceived')}${username}: ${receivedMsg}`;
        dispatch(setMessageBar({ message, color: 'yellow' }))
    }

    function ReceiveMessage(message: Message) {
        console.log('Received messages: ', message);
        SetMessage(message.sender_username, message.message);
        dispatch(setMessage(message))
    };

    useEffect(() => {
        if (!user) return;
        socket.emit('register_user', user.id);
    }, [user])

    useEffect(() => {
        socket.on('receive_message', ReceiveMessage);
        return () => { socket.off('receive_message', ReceiveMessage); };
    }, []);

    return null;
}

export default SocketConnection;