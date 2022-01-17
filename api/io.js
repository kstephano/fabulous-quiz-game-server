const app = require("express")();
const server = require("http").createServer(app);
const io = require('socket.io')(server, { cors: { origin: ["http://localhost:8080"] } });

io.on('connection', socket => {
    console.log("socket connected");

    socket.on("disconnect", socket => {
        console.log("socket disconnected");
    })
});

module.exports = server;