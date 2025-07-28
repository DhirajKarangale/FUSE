import { useEffect } from "react";
import socket from "./socket";

import { routeMessages } from "../../utils/Routes";

import { setMessage } from "../../redux/sliceMessages";
import { setMessageBar } from "../../redux/sliceMessageBar";
import { useAppDispatch, useAppSelector } from "../../redux/hookStore";

import { type Message } from "../../models/modelMessage";

function SocketConnection() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    function SetMessage(username: string) {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith(routeMessages)) return;

        const message = `Got message from ${username}`;
        dispatch(setMessageBar({ message, color: 'yellow' }))
    }

    function ReceiveMessage(message: Message) {
        console.log('Received messages: ', message);
        SetMessage(message.sender_username);
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