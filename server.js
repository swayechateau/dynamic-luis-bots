//Require Modules (node_modules folder)
const express = require('express');
const builder = require('botbuilder');
const apiRequest = require('request');
//Set up Restify Server
var port = process.env.port || process.env.PORT || 3030;
var server = express();
server.listen(port, function(){
    console.log('%s listening to %s',server.name, port);
});
//connect to database
var mysql = require('mariasql');
var query
var con = new mysql ({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_pass,
  db: process.env.db_name
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
    console.log()
    var question = session.message.text;
    var respond;
    switch (question){
        case "hi":
            respond = "You what mate!";
            session.send(respond);
          break;
        case "weather":
            var owm_url = `http://api.openweathermap.org/data/2.5/weather?q=london&appid=0b4e754c3b566bef49e7b7d1922f95e8`
      
        apiRequest(owm_url, function (err, response, body) {
          if(err){
            console.log('error:', err);
          } else {
            console.log('body:', body);
            let request = JSON.parse(body);
            for(var item of request.weather) {
            console.log('item: ', [item.id]);
            var weatherInfo = [item.main];
            var weatherDesc = [item.desciption];
            //console.log(queryInfo);
          }
            var degrees = request.main.temp - 273.15;
            respond = "It's "+ parseFloat(Math.round(degrees * 100) / 100).toFixed(2) +" °C, with a chance of "+weatherInfo+", "+weatherDesc+" in "+request.name+"!";
            console.log(respond)
            session.send(respond);
          }
        });
          break;
        default:
        con.query('SELECT * FROM general WHERE keyword = ?',[question], function(err, rows) {
            if (err)
              throw err;
              console.dir(rows);
          
          for(var item of rows) {
            console.log('item: ', [item.id]);
            var queryInfo = [item.info];
            //console.log(queryInfo);
          }
          //queryInfo = [item.keyword] ;
            respond =  " info: "+queryInfo;
        })
            //respond = "You said: " + question;
            console.log(session.send(respond));
          break;
    }
   /* if(question == "hi"){
        respond = "You what mate!";
    }else{
        respond = "You said: " + question;
    } */
    
});


