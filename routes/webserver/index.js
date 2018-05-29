const express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , api = require(rootDir+'/lib/api/api')
	  , auth = require('./routes/auth/index')
    , config = require('./routes/settings/index')
    , dashboard = require('./routes/dashboard/index')
    , install = require('./routes/settings/install')
    , department = require('./routes/departments/index')
    , team = require('./routes/team/index')
    , intents = require('./routes/intents/index')
    , user = require('./routes/user/index')
    , guide = require('./routes/guides/index');
    router.get('/',ensureAuthenticated,(req,res)=>res.redirect('/dashboard'))
	  //Auth
    router.use('/auth', auth);
    // Home page
    router.use('/dashboard', dashboard);
    // Department Management page
    router.use('/department/', department);
    //Setting Install
    router.use('/install/', install);
    // Config page
    router.use('/portal-config/', config);
    // Department Management page
    router.use('/team/', team);
    // Users page
    router.use('/user/', user);
    // intents page
    router.use('/intents/', intents);
    // Bot Framework User Guide page
    router.use('/guide/', guide);

module.exports = router;
