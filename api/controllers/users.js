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

router.get('/at/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json({ user });
        res.status(200);
    } catch (err) {
        res.status(500).json({ err });
    }
});

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

//Update User
router.patch('/:id', async (req, res) => {
    try {
        const updatedUser = await User.update(req.body.id, req.body.score)
        res.json(updatedUser)
    } catch(err) {
        res.status(500).json({err})
    }
})

//Delete User
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        console.log(user)
        console.log("Hi")
        await user.destroy()
        console.log("Got here")
        res.status(204).end()
    } catch(err){
        res.status(500).json(err)
    }
})



module.exports = router;
