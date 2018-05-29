const config = require('./lib/config')
global.webhost = config.set.host;
const express = require('express')
    , cookieParser = require('cookie-parser')
    , expressSession = require('express-session')
    , methodOverride = require('method-override')
    , passport = require('passport')
    , path = require('path')
      global.rootDir = path.resolve(__dirname)
      require('./lib/auth/passport')
      global.ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
          res.redirect('/auth');
      }
    , app = express()
    , port = process.env.PORT || 80
    , util = require('util')
    , bunyan = require('bunyan')
    , bodyParser = require('body-parser')
    , routes = require('./routes/index')
    , morgan = require('morgan')

    var log = bunyan.createLogger({
        name: 'Microsoft OIDC Bot Framework Application'
    });

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(morgan('dev')); // log every request to the console

app.use(methodOverride());
app.use(cookieParser());

app.use(expressSession({ secret: 'p&d2Hg@WMa6B!$.R', resave: true, saveUninitialized: false }));

app.use(bodyParser.json());  // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(express.static(__dirname + '/public'));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')))
app.use('/', routes);



app.listen(port)
