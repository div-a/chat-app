const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
var cors = require('cors')
var userHelper = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

//static folder
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors);

io.on('connection', socket => {
    console.log('connection')
    socket.on('joinRoom', ({ username, room }) => {
        const user = userHelper.userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit("message", "Welcome to the room");
        socket.broadcast
            .to(user.room)
            .emit("message", `${username} has joined the room`);
    });

    socket.on('chatMessage', (msg) => {
        const user = userHelper.getCurrentUser(socket.id);
        io.to(user.room).emit("message", { user: "user", msg });
    });

    socket.on('disconnect', () => {
        const user = userHelper.userLeaves(socket.id);

        if (user) {
            io.to(user.room).emit("message", `${username} has left the room`);
        }

    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));