//Dependencies imports
var express = require('express');
var body_parser = require('body-parser');
var request = require('request');
var env = require('node-env-file');

env('.env');
var app = express();
app.use(body_parser.json());

//Listener port
app.listen(8000, function () {
    console.log('Server is active on port 8000');
});

//Routes
app.get('/', function (req, res) {
    res.send('Welcome!');
});
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === process.env.WEBHOOK_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send("You don't have access!");
    }
});