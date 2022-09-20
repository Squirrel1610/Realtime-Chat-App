const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

require("dotenv").config();
app.use(cors());

const {formatMessage} = require("./utils/messages");

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    const botName = "ChatCord Bot";

    socket.on("joinRoom", ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        //welcome current user
        //just you can see this meesage
        socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

        //all users but you can't see
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`));
        
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    socket.on("chatMessage", (message) => {
        const user = getCurrentUser(socket.id);
        if(user){
            //all users
            io.to(user.room).emit("message", formatMessage(user.username, message));
        }
    })

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if(user){
            //all users
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})


const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


