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
        const games = await Lobby.findByCategory(req.params.category)
        res.json(games)
    } catch(err) {
        res.status(404).json({err})
    }
})

// Create Game
router.post('/', async (req, res) => {
    try {
        const game = await Lobby.create(req.body.category, req.body.rounds, req.body.difficulty)
        res.json(game)
    } catch(err) {
        res.status(404).json({err})
    }
})

//delete
router.delete('/:id', async (req, res) => {
    try {
        const lobby = await Lobby.findByID(req.params.id)
        console.log(lobby)
        await lobby.destroy()
        res.status(204).end()
    } catch(err){
        res.status(500).json({err})
    }
})


module.exports = router;
