const app = require("express")();
const server = require("http").createServer(app);
const io = require('socket.io')(server, { cors: { origin: ["http://localhost:8080"] } });

io.on('connection', socket => {
    console.log("socket connected");
    socket.emit("connected", "socket is connected");
    const players = [];

    // on create lobby event
    socket.on("create-lobby", ({ username, lobbyId }) => {
        // create the socket room
        socket.join(lobbyId);
        socket.to(lobbyId).emit(`lobby-created", "Lobby created by ${username}`);
        // add host to list of players
        players.push(username);
    });

    socket.on("request-join-lobby", ({ username, lobbyId }) => {
        if (io.sockets.adapter.rooms.has(lobbyId)) {
            // send back entry permission to join room
            socket.emit("entry-permission", lobbyId);
            // join the socket room
            socket.join(lobbyId);
            // add host to list of players
            players.push(username);
            const roomCount = io.sockets.adapter.rooms.get(lobbyId).size;
            // broadcast new player joining
            io.to(lobbyId).emit("new-player-joining", { username, lobbyId, roomCount });
        } else {
            socket.emit("lobby-id-invalid")
        }
    })

    // socket gets disconnected
    socket.on("disconnect", socket => {
        console.log("socket disconnected");
    });
});

module.exports = io;

//Questions API

//npm install axios

//const axios = require('axios');

// async function getInformation() {
//   const amount = req.body.amount //any multiple up to 50
//   const category = req.body.category //must be a number from 1-32 - number corresponds to correct category
//   const difficulty = req.body.difficulty //must be easy, medium or hard
//   const type = req.body.type //must be boolean or multiple
//   try {
//     const response = await axios.get('https://opentdb.com/api.php?amount={amount}&category={category}&difficulty={difficulty}&type=multiple');
//     console.log(response);
//      return response
//   } catch (error) {
//     console.error(error);
//   }
// }

