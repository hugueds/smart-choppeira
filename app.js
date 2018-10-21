const express = require('express');
const app = express();
const path = require('path');
const index = require('./routes/index');
const admin = require('./routes/admin');

app.use('/', index);
app.use('/admin', admin);

app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
