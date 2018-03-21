//Require Modules (node_modules folder)
const express = require('express');
const builder = require('botbuilder');
var port = process.env.PORT || 8080
//Set up Express Server
var server = express();
server.listen(port, function(){
    console.log('%s listening to %s',server.name, port);
});
// Set up Connector
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});
// Listen for messages from users 
server.post('/api/v1/messages', connector.listen());


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    var question = session.message.text;
    var respond;
    if(question == "hi"){
        respond = "You what mate!";
    }else{
        respond = "You said: " + question;
    }
    
    session.send(respond);
});