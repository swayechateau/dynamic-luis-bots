const express = require('express')
    , router = express.Router()
    , user = require('./routes/users')
    , permission = require('./routes/permissions')
    , setting = require('./routes/settings')
    , department = require('./routes/departments')
    , intent = require('./routes/intents')
    , log = require('./routes/logs')
    
    router.use('/user', user);
    router.use('/permission', permission);
    router.use('/setting', setting);
    router.use('/department', department);
    router.use('/intent', intent);
    router.use('/log', log);
  
module.exports = router;