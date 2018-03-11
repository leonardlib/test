//Dependencies imports
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var env = require('node-env-file');

env('.env');
var app = express();
app.use(bodyParser.json());

//Listener port
app.listen(8000, function () {
    console.log('Server is active on port 8000');
});

/*------------------------------------------------ Routes ------------------------------------------------------------*/
app.get('/', function (req, res) {
    res.send('Welcome!');
});

//Server validation
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] == process.env.WEBHOOK_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send("You don't have access!");
    }
});

//Get message request data
app.post('/webhook', function (req, res) {
    var data = req.body;

    if (data.object == 'page') {
        data.entry.forEach(function (entry) {
            entry.messaging.forEach(function (messageEvent) {
                if (messageEvent.message) {
                    getMessageData(messageEvent);
                }
            });
        });

        res.sendStatus(200);
    }
});

/*-------------------------------------------- Functions -------------------------------------------------------------*/
/**
 * Function to get data from a message
 * @param event
 */
function getMessageData(event) {
    var senderId = event.sender.id;
    var messageText = event.message.text;
}