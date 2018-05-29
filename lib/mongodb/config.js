var mongoose = require('mongoose')
    , config = require('../config')
    , dbhost = process.env.dbHost || "10.0.0.29"
    , dbport = process.env.dbPort || "27017"
    , dbuser = process.env.dbUser+":"
    , dbpass = process.env.dbPass+"@";

  if(dbuser == "undefined:"){dbuser=""};
  if(dbpass == "undefined@"){dbpass=""};

var url = config.set.conectionString || `mongodb://${dbuser+dbpass+dbhost}:${dbport}/ddbot`
module.exports = url
