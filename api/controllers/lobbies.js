const express = require('express');
const router = express.Router();

const Lobby = require('../models/lobby')

// All games
router.get('/', async (req, res) => {
    try {
        const games = await Lobby.all
        res.json({games})
    } catch(err) {
        res.status(500).json({err})
    }
})

// 
router.get('/:category', async (req, res) => {
    try {
        const games = await Lobby.findByCategory(req.params.id)
        res.json(games)
    } catch(err) {
        res.status(404).json({err})
    }
})

// Create Game
router.post('/', async (req, res) => {
    try {
        const game = await Lobby.create(req.body.category)
        res.json(game)
    } catch(err) {
        res.status(404).json({err})
    }
})


module.exports = router;
