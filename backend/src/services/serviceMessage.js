const modelMessage = require('../model/modelMessage');

function SocketConnection(io) {
    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);

        socket.on('join_room', ({ senderId, receiverId }) => {
            const roomName = GetRoomName(senderId, receiverId);
            socket.join(roomName);
            console.log(`User ${senderId} joined room: ${roomName}`);
        });

        socket.on('send_message', (data) => {
            const { senderId, receiverId, message, timestamp } = data;
            const roomName = GetRoomName(senderId, receiverId);

            console.log(`Message in room ${roomName}:`, message);

            // await db.query('INSERT INTO ...', [senderId, receiverId, message, timestamp]);

            socket.to(roomName).emit('receive_message', data);
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

module.exports = { SearchUser, SocketConnection };