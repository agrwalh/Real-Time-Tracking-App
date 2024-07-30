const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const users = {};

io.on("connection", (socket) => {
    console.log("connected");

    users[socket.id] = socket;

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
