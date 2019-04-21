var express = require('express');
var app = express();
var db = require('./db');
var  authController = require('./auth/AuthController');
app.use('/api/auth', authController)

var UserController = require('./user/UserController');
app.use('/users', UserController);

module.exports = app;