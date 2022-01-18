const Lobby = require("./models/lobby");
const User = require("./models/user");

const app = require("express")();
const server = require("http").createServer(app);
const io = require('socket.io')(server, { cors: { origin: ["http://localhost:8080"] } });

io.on('connection', socket => {
    console.log("socket connected");
    socket.emit("connected", "socket is connected");

    // on create lobby event
    socket.on("create-lobby", async ({ username, category }) => {
        const lobby = await Lobby.create(category);
        const lobbyId = lobby.id.toString();
        console.log(lobby);
        // create the socket room
        socket.join(lobbyId);
        socket.to(lobbyId).emit("lobby-created", (lobbyId));
        // add host to list of players
        const host = await User.create(username, 0, lobbyId);
        console.log(host);
    });

    socket.on("request-join-lobby", async ({ username, lobbyId }) => {
        console.log(lobbyId)
        console.log(io.sockets.adapter.rooms)
        console.log(typeof `${lobbyId}`)
        console.log(io.sockets.adapter.rooms.has(`${lobbyId}`));
        if (io.sockets.adapter.rooms.has(lobbyId)) {
            console.log("test");
            const players = await User.findByGame(lobbyId);
            // send back entry permission to join room
            socket.emit("entry-permission", { lobbyId, players });
            // join the socket room
            socket.join(lobbyId);
            // add new player to list of players
            const newPlayer = await User.create(username, 0, lobbyId);
            console.log(newPlayer);
            const roomCount = io.sockets.adapter.rooms.get(lobbyId).size;
            // broadcast new player joining
            io.to(lobbyId).emit("new-player-joining", { newPlayer, roomCount });
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

