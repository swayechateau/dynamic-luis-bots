var express = require('express')
    , router = express.Router()
    , api = require('./api/index')
    , bot = require('./bot/index')
    , webserver = require('./webserver/index');
    
// index page
router.use('/', webserver);
router.use('/api', api);
router.use('/bot', bot);

// define the 404 page route (leave last)
router.get('*', (req, res)=>{res.status(404).render('./pages/error/404');});
module.exports = router;
