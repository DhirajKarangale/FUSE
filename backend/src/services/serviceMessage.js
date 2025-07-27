const modelMessage = require('../model/modelMessage');

function SocketConnection(io) {
    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);

        socket.on('join_room', ({ senderId, receiver_id }) => {
            const roomName = GetRoomName(senderId, receiver_id);
            socket.join(roomName);
            console.log(`User ${senderId} joined room: ${roomName}`);
        });

        socket.on('send_message', async (data) => {
            const { id, sender_id, receiver_id, message, media_url, created_at } = data;
            const roomName = GetRoomName(sender_id, receiver_id);

            console.log(`Message in room ${roomName}:`, message);

            socket.to(roomName).emit('receive_message', data);
            await modelMessage.StoreMessage(sender_id, receiver_id, message, media_url, created_at);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

function GetRoomName(user1, user2) {
    return [user1, user2].sort().join('_');
}

async function SearchUser(userId, page) {
    const pageSize = 10;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelMessage.Search(userId, validPage, pageSize);
}

async function GetMessage(currUserId, userId, page) {
    const pageSize = 20;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelMessage.GetMessage(currUserId, userId, validPage, pageSize);
}

module.exports = { SearchUser, GetMessage, SocketConnection };