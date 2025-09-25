const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const serviceMessage = require('./services/serviceMessage');

require('dotenv').config();

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);

const allowedOrigins = ['http://localhost:5173', 'https://fuse-phi.vercel.app', 'http://localhost:5174'];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

serviceMessage.SocketConnection(io);

(async () => {
    try {
        server.listen(PORT, () => { console.log("Server started at port " + PORT); });
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
    }
})();