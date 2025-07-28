const modelMessage = require('../model/modelMessage');
const userSocketMap = new Map();

function SocketConnection(io) {
    io.on('connection', (socket) => {

        socket.on('register_user', (userId) => {
            userSocketMap.set(userId, socket.id);
        });

        socket.on('send_message', async (data) => {
            const { sender_id, receiver_id, message, media_url, created_at } = data;

            const receiverSocketId = userSocketMap.get(receiver_id);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receive_message', data);
            } else {
                console.log(`Receiver ${receiver_id} is offline. Message saved to DB.`);
            }

            await modelMessage.StoreMessage(sender_id, receiver_id, message, media_url, created_at);
        });

        socket.on('disconnect', () => {
            for (const [userId, id] of userSocketMap.entries()) {
                if (id === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
        });
    });
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