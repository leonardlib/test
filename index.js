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

    evluateMessage(senderId, messageText);
}

/**
 * Function to evaluate the request message and prepare a response message
 * @param recipientId
 * @param message
 */
function evluateMessage(recipientId, message) {
    var responseMessageText = '';
    var type = 'message';
    
    if (contains(message, 'help')) {
        responseMessageText = "Be patient, we're working on this ;)";
    } else if (contains(message, 'image')) {
        responseMessageText = '';
        type = 'image';
    } else {
        responseMessageText = "Sorry, I'm new at this :("
    }

    sendResponseMessageAPI(recipientId, responseMessageText, type);
}

/**
 * Function to send the response message
 * @param recipientId
 * @param responseMessageText
 * @param type
 */
function sendResponseMessageAPI(recipientId, responseMessageText, type) {
    var json = '';

    if (type == 'message') json = generateResponseMessageData(recipientId, responseMessageText);
    else if (type == 'image') json = generateResponseImageData(recipientId);

    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: process.env.APP_TOKEN
        },
        method: 'POST',
        json: json
    }, function (error, response, data) {
        if (error) {
            console.log("Message wasn't send");
        } else {
            console.log("Message was send");
        }
    });
}

/**
 * Function to generate the response message body
 * @param recipientId
 * @param responseMessageText
 * @returns {{recipient: {id: *}, message: {text: *}}}
 */
function generateResponseMessageData(recipientId, responseMessageText) {
    return {
        recipient: {
            id: recipientId
        },
        message: {
            text: responseMessageText
        }
    };
}

/**
 * Function to generate the response image message body
 * @param recipientId
 * @returns {{recipient: {id: *}, message: {attachment: {type: string, payload: {url: string}}}}}
 */
function generateResponseImageData(recipientId) {
    //Is better with an API to serve images
    return {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: 'image',
                payload: {
                    url: 'http://i.imgur.com/SOFXhd6.jpg'
                }
            }
        }
    };
}

/**
 * Function to search a word inside a text
 * @param text
 * @param word
 * @returns {boolean}
 */
function contains(text, word) {
    return (text.indexOf(word) > -1);
}