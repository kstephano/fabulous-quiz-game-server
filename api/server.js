const express = require('express');
const cors = require('cors');
const userRoutes = require('./controllers/users')
const lobbyRoutes = require('./controllers/lobbies')

const server = express();
server.use(cors());
server.use(express.json());
server.use('/users', userRoutes)
server.use('/lobbies', lobbyRoutes)

const port = process.env.PORT || 3000;

// Root route
server.get('/', (req, res) => res.send('Hello, world!'))

module.exports = server
