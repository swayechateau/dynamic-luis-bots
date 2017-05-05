
// server.js
// where your node app starts

// init project
var express = require('express');
// setup a new database
var Datastore = require('nedb'), 
    // Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
    db = new Datastore({ filename: '.data/datafile', autoload: true });
var app = express();
var requestify = require('requestify')
var ovh = require('ovh')({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  consumerKey: process.env.CONSUMER_KEY
});

var sendAlerteSMS = function() {
  ovh.request('GET', '/sms/', function (err, serviceName) {
       if(err) {
        console.log(err, serviceName);
       }
       else {
         console.log("My account SMS is " + serviceName);

         // Send a simple SMS with a short number using your serviceName
         ovh.request('POST', '/sms/' + serviceName + '/jobs/', {
           message: 'Alerte rouge! EPFL a changé.',
           senderForResponse: true,
           noStopClause:true,
           receivers: ['+33677359104', '+33668010601']
           }, function (errsend, result) {
            console.log(errsend, result);
         });
       }
     });
}

var sendMail = function() {

    const message = "ALERTE!!! <br>"+
                    "Il y a eu une modification sur la page : https://www.fmel.ch/fr/pas-encore-locataire/obtenir-une-chambre/inscriptions";

    let poolConfig = {
        pool: true,
        host: 'in-v3.mailjet.com',
        port: 587,
        auth: {
            user: 'ded7a94bd6008dc54f8612eb86d3fe18',
            pass: '676d0558f86ecc2dedcde37f7cb18b4b'
        }
      };
      const nodemailer = require('nodemailer');
      let transporter = nodemailer.createTransport(poolConfig);
      // verify connection configuration
      transporter.verify(function(error, success) {
         if (error) {
              console.log(error);
         } else {
              console.log('Server is ready to take our messages');
         }
      });

    // setup email data with unicode symbols
    const mailOptions = {
        from: '"Thomas" <tom.vuillemin@gmail.com>', // sender address
        to: ['tom.vuillemin@gmail.com'],// list of receivers
        subject: 'Alerte Logement', // Subject line
        text: 'Alerte logement', // plain text body
        html: message // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });

};

// default user list
var users = [
      {"firstName":"John", "lastName":"Hancock"},
      {"firstName":"Liz",  "lastName":"Smith"},
      {"firstName":"Ahmed","lastName":"Khan"}
    ];


var getPage = function(){
  db.insert({ date:new Date().getTime()/1000,check:true}, function (err, pageAdded) {
    if(err) console.log("There's a problem with the database: ", err);
    else if(pageAdded) console.log("New check inserted in the database");
  });
  requestify.get('https://www.fmel.ch/fr/pas-encore-locataire/obtenir-une-chambre/inscriptions').then(function(response2) {
    // Get the response body
    db.find({page:{ $exists: true } }).sort({ date: -1 }).limit(1).exec(function (err, docs) {
      // docs is [doc3, doc1]
      if(docs[0] == null){
        db.insert({ date:new Date().getTime()/1000,page:response2.getBody()}, function (err, pageAdded) {
          if(err) console.log("There's a problem with the database: ", err);
          else if(pageAdded) console.log("New page inserted in the database");
        });
        sendMail();
        //sendAlerteSMS();
      }else if(docs[0].page!=response2.getBody()){
        //alerte!!
        db.insert({ date:new Date().getTime()/1000,alerte:true}, function (err, pageAdded) {
          if(err) console.log("There's a problem with the database: ", err);
          else if(pageAdded) console.log("New alert inserted in the database");
        });
        db.insert({ date:new Date().getTime()/1000,page:response2.getBody()}, function (err, pageAdded) {
          if(err) console.log("There's a problem with the database: ", err);
          else if(pageAdded) console.log("New page inserted in the database");
        });
        sendMail();
        //sendAlerteSMS();
      }
    });
    /*db.insert({ date:new Date().getTime()/1000,page:response2.getBody()}, function (err, pageAdded) {
      if(err) console.log("There's a problem with the database: ", err);
      else if(pageAdded) console.log("New page inserted in the database");
    });*/
  });
}


setInterval(getPage, 60000);
var getLastPage = function(){
  db.find({}).sort({ date: -1 }).limit(1).exec(function (err, docs) {
    // docs is [doc3, doc1]
    console.log("docs",docs[0].date);
    return docs[0];
  });
}

//console.log("last page : ",getLastPage());
//getPage()
//console.log("ou ", getPage())

db.count({check:{ $exists: true }}, function (err, count) {
  console.log("There are " + count + " checks in the database");
  if(err) console.log("There's a problem with the database: ", err);
  /*
  else if(count<=0){ // empty database so needs populating
    // default users inserted in the database
    db.insert(users, function (err, usersAdded) {
      if(err) console.log("There's a problem with the database: ", err);
      else if(usersAdded) console.log("Default users inserted in the database");
    });
  }
  */
});
db.count({page:{ $exists: true }}, function (err, count) {
  console.log("There are " + count + " pages in the database");
  if(err) console.log("There's a problem with the database: ", err);
});
db.count({alert:{ $exists: true }}, function (err, count) {
  console.log("There are " + count + " alerts in the database");
  if(err) console.log("There's a problem with the database: ", err);
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/users", function (request, response) {
  var dbUsers=[];
  db.find({page:{ $exists: true }}, function (err, users) { // Find all users in the collection
    users.forEach(function(user) {
      //console.log(new Date(user.date*1000))
      dbUsers.push([user.date,user.lastName]); // adds their info to the dbUsers value
    });
    response.send(dbUsers); // sends dbUsers back to the page
  });
});

// creates a new entry in the users collection with the submitted values
app.post("/users", function (request, response) {
  /*db.insert({ firstName: request.query.fName, lastName: request.query.lName}, function (err, userAdded) {
    if(err) console.log("There's a problem with the database: ", err);
    else if(userAdded) console.log("New user inserted in the database");
  });*/
  getPage();
  response.sendStatus(200);
});

// removes entries from users and populates it with default users
app.get("/reset", function (request, response) {
  // removes all entries from the collection
  db.remove({}, { multi: true }, function (err) {
    if(err) console.log("There's a problem with the database: ", err);
    else console.log("Database cleared");
  });
  // default users inserted in the database
  db.insert(users, function (err, usersAdded) {
    if(err) console.log("There's a problem with the database: ", err);
    else if(usersAdded) console.log("Default users inserted in the database");
  });
  response.redirect("/");
});

// removes all entries from the collection
app.get("/clear", function (request, response) {
  db.remove({}, { multi: true }, function (err) {
    if(err) console.log("There's a problem with the database: ", err);
    else console.log("Database cleared");
  });
  response.redirect("/");
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
