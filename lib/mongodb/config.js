var mongoose = require('mongoose')
    , config = require('../config')
    , dbhost = process.env.dbHost || "lechateaux.uk"
    , dbport = process.env.dbPort || "2254"
    , dbuser = process.env.dbUser+":"
    , dbpass = process.env.dbPass+"@";

  if(dbuser == "undefined:"){dbuser=""};
  if(dbpass == "undefined@"){dbpass=""};
//config.set.conectionString || 
var url = `mongodb://${dbuser+dbpass+dbhost}:${dbport}/ddbot`
module.exports = url
