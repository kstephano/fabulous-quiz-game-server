const express = require('express');
const router = express.Router();

const User = require('../models/user')

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.all
        res.json({users})
    } catch(err) {
        res.status(500).json({err})
    }
})

router.get('/leaderboard', async (req, res) => {
    try{
        const users = await User.leaderboard
        res.json({users})
        res.status(200)
    }
    catch(err) {
        res.status(500).json({err})
    }
})

router.get('/:lobby_id', async (req, res) => {
    try{
    const users = await User.getScoreList(req.params.lobby_id)
    res.json({users})
    } catch (err) {
        res.status(500).json({err})
    }
})



// Create User
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body.username, req.body.score, req.body.lobby_id)
        res.json(user)
        res.status(201)
    } catch(err) {
        res.status(404).json({err})
    }
})



module.exports = router;
