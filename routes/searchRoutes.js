const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');

router.get('/search', isLoggedIn, (req, res) => {
    res.render('search');
})

module.exports = router;