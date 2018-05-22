var mongoose = require('mongoose')
    , dbhost = process.env.dbHost || "http://lechateaux.uk"
    , dbport = process.env.dbPort || "27017"
    , dbuser = process.env.dbUser+":"
    , dbpass = process.env.dbPass+"@";

  if(dbuser == "undefined:"){dbuser=""};
  if(dbpass == "undefined@"){dbpass=""};

var url = `mongodb://${dbuser+dbpass+dbhost}:${dbport}/ddbot`
module.exports = url
