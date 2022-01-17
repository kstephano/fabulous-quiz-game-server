const express = require('express');
const router = express.Router();

const Users = require('../models/user')

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await Users.all
        res.json({users})
    } catch(err) {
        res.status(500).json({err})
    }
})

router.get('/leaderboard', async (req, res) => {
    try{
        const users = await Users.leaderboard
        res.json({users})
    }
    catch(err) {
        res.status(500).json({err})
    }
})



// Create User
router.post('/', async (req, res) => {
    try {
        const user = await Users.create(req.body.username, req.body.score, req.body.game_id)
        res.json(user)
    } catch(err) {
        res.status(404).json({err})
    }
})



module.exports = router;
