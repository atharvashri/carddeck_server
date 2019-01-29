'use strict';
var http = require('http'); // needed to integrate with ws package for mock web socket server.
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var httpServer = http.createServer(app);

//Testing code for CORS

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Access-Control-Request-Method, Accept, Access-Control-Request-Headers, Authorization, authorization");
    next();
});

var UserController = require('./controllers/userController')
app.use('/user', new UserController(__dirname))


httpServer.listen(8080, function () {
    console.log('Server started on port: ' + httpServer.address().port);
});