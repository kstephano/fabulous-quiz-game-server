const Lobby = require("./models/lobby");
const User = require("./models/user");
const { getQuestions } = require('./helpers/requests');
const { isAllPlayersLoaded, disconnectedPlayerIds } = require('./helpers/index');

const app = require("express")();
const server = require("http").createServer(app);
const io = require('socket.io')(server, { cors: { origin: ["http://localhost:8080"] } });

io.on('connection', socket => {
    console.log("socket connected");
    socket.emit("connected", "socket is connected");

    // on create lobby event
    socket.on("create-lobby", async ({ username, numOfQuestions, categoryId, difficulty, roundLimit }) => {
        try {
            const lobby = await Lobby.create(categoryId, numOfQuestions, difficulty.toLowerCase(), roundLimit);
            console.log(lobby);
            const lobbyId = lobby.id.toString();
            // create the socket room
            socket.join(lobbyId);
            // add host to list of players
            const host = await User.create(username, null, lobbyId);
            console.log(host);
            io.to(lobbyId).emit("lobby-created", { host });
        } catch(err) {
            console.log(`Error creating lobby: ${err}`);
        }
    });

    // on join lobby event
    socket.on("request-join-lobby", async ({ username, lobbyId }) => {
        try {
            // check is room exists for given lobby id
            if (io.sockets.adapter.rooms.has(lobbyId)) {
                // check if room is full (10 or more connections)
                if (io.sockets.adapter.rooms.get(lobbyId).size < 10) {
                    const existingPlayers = await User.findByGame(lobbyId);
                    const newPlayer = await User.create(username, null, lobbyId);
                    // send back entry permission to join room
                    socket.emit("entry-permission", { lobbyId, existingPlayers, newPlayer });
                    // join the socket room
                    socket.join(lobbyId);
                    // add new player to local state of each player
                    io.to(lobbyId).emit("add-new-player", { newPlayer });
                    // herald the new player to other players
                    socket.to(lobbyId).emit("herald-new-player", { newPlayer });
                } else {
                    socket.emit("lobby-is-full");
                }
            } else {
                socket.emit("lobby-id-invalid");
            }
        } catch (err) {
            console.log(`Error joining lobby: ${err}`);
        }
    });

    // host loads game
    socket.on("host-load-game", async ({ lobbyId }) => {
        try {
            // send the players to the Game page
            console.log(lobbyId);
            socket.to(lobbyId.toString()).emit("loading-game");
            const players = await User.findByGame(lobbyId);
            const lobby = await Lobby.findByID(lobbyId);
            const questions = await getQuestions(lobby.rounds, lobby.category, lobby.difficulty);

            io.to(lobbyId.toString()).emit("host-finished-loading", { lobby, players, questions });
        } catch (err) {
            console.log(`Error loading game: ${err}`);
        }
    });

    socket.on("host-start-game", async ({ lobby, questions }) => {
        console.log(lobby);
        let questionsIndex = 0;
        let numOfQuestions = lobby.rounds;
        const lobbyId = lobby.id.toString();

        // function that returns a promise that runs the round countdown
        const roundCountDownPromise = () => {
            return (new Promise((resolve, reject) => {
                let count = lobby.roundLimit;
                // countdown timer for each round
                const roundCountdown = setInterval(() => {
                    // console.log("question: " + numOfQuestions + " counter: " + count);
                    io.to(lobbyId).emit("counter", { count });
                    count--;
                    if (count === 0) {
                        io.to(lobbyId).emit("new-round");
                        clearInterval(roundCountdown);
                        numOfQuestions--;
                        resolve(numOfQuestions);
                    }
                }, 1000);
            }));
        }

        // loop to generate the rounds of questions
        while (numOfQuestions > 0) {
            let currentQuestion = questions[questionsIndex];
            let currentRound = lobby.rounds - numOfQuestions + 1;
            questionsIndex++;
            io.to(lobbyId).emit("new-round", { currentRound, currentQuestion });
            numOfQuestions = await roundCountDownPromise();
        }
        
        io.to(lobbyId).emit("game-finished");
    });

    socket.on("upload-score", async ({ player, score, rounds }) => {
        try {
            console.log(player);
            const lobbyId = player.lobby_id.toString();
            const scorePercentage = Math.floor(score / rounds * 100);
        
            await User.update(player.id, scorePercentage);
            
            const loadPromise = new Promise(async (resolve, reject) => {
                setTimeout(async () => {
                    const playersInLobby = await User.findByGame(lobbyId);
                    if (isAllPlayersLoaded(playersInLobby)) {
                        io.to(lobbyId).emit("upload-done");
                        resolve({ playplayersInLobbyers: playersInLobby, isDisconnected: false });
                    } else {
                        resolve({ playersInLobby: playersInLobby, isDisconnected: true });
                    }
                }, 1000);
            });
            const { playersInLobby, isDisconnected } = await loadPromise;
            console.log(isDisconnected);

            if (isDisconnected) {
                // if not all have loaded purge the players with null score
                const ids = disconnectedPlayerIds(playersInLobby);
                // loop through ids of disconnected players and delete from db
                for (let i = 0; i < ids.length; i++) {
                    User.destroy(ids[0]);
                    console.log("user deleted");
                }
                io.to(lobbyId).emit("upload-done");
            }
        } catch (err) {
            console.log(`Error uploading score: ${err}`);
        }
    })
 
    // player leaves the lobby
    socket.on("leave-lobby", async ({ lobbyId, player, isHost }) => {
        try {
            console.log(lobbyId.toString());
            console.log(player);
            // delete lobby if last person leaves
            console.log(io.sockets.adapter.rooms.get(lobbyId.toString()).size);
            if (io.sockets.adapter.rooms.get(lobbyId.toString()).size === 1) {
                const deleteMsg = await Lobby.destroy(lobbyId);
                console.log(deleteMsg);
            }
            await User.destroy(player.id);
            io.to(lobbyId.toString()).emit("player-left", { player });

            if (isHost) {
                try {
                    const players = await User.findByGame(lobbyId.toString());
                    const newHost = players.find(p => p.id !== player.id);
                    console.log(newHost);
                    io.to(lobbyId.toString()).emit("host-left", { newHost });
                } catch (err) {
                    console.log(err);
                }
            } 
            socket.leave(lobbyId.toString());
        } catch (err) {
            console.log(`Error leaving lobby: ${err}`);
        }
    });

    // socket gets disconnected
    socket.on("disconnect", () => {
        console.log("socket disconnected");
    });
});

module.exports = io;

