const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const Chat = require('../models/chat');

router.get('/messages', isLoggedIn, (req, res) => {
    res.render('chatPage', {user: req.user});
})

router.get('/allmessages', isLoggedIn, async (req, res) => {
    const allmessages = await Chat.find({});

    res.json(allmessages);
})

module.exports = router;