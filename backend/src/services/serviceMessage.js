// const db = require('./db'); 

function serviceMessage(io) {
    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);

        socket.on('join_room', ({ senderId, receiverId }) => {
            const roomName = getRoomName(senderId, receiverId);
            socket.join(roomName);
            console.log(`User ${senderId} joined room: ${roomName}`);
        });

        socket.on('send_message', (data) => {
            const { senderId, receiverId, message, timestamp } = data;
            const roomName = getRoomName(senderId, receiverId);

            console.log(`Message in room ${roomName}:`, message);

            // await db.query('INSERT INTO ...', [senderId, receiverId, message, timestamp]);

            socket.to(roomName).emit('receive_message', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

function getRoomName(user1, user2) {
    return [user1, user2].sort().join('_');
}

module.exports = serviceMessage;