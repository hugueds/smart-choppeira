const express = require('express');
const router = express.Router();
const path = require('path');
// const socketServer = require('../socketServer')

router.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../public') });
});

router.get('/reload', (req, res, next) => {
    // let io = socketServer.io();
    // io.emit('reload');
    res.send('reloading pages');
});


module.exports = router;