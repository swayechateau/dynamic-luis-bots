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
      //global.user = {id:'5afcce86fb860e4dcc59a977', name:'Swaye Chateau', perm:{admin:false, wizard:true,department:'5abea0315abfbb0b50afdc0e'}}
    , app = express()
    , port = process.env.PORT || 80
    , util = require('util')
    , bunyan = require('bunyan')
    , bodyParser = require('body-parser')
    , routes = require('./routes/index')
    , morgan = require('morgan')

    /*, azureConfig = require(rootDir+'/lib/auth/azure')
    , passport = require('passport')
    , OIDCStrategy = require('passport-azure-ad').OIDCStrategy;*/
    var log = bunyan.createLogger({
        name: 'Microsoft OIDC Bot Framework Application'
    });

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(morgan('dev')); // log every request to the console

app.use(methodOverride());
app.use(cookieParser());

app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));

app.use(bodyParser.json());  // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(express.static(__dirname + '/public'));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')))
app.use('/', routes);



app.listen(port)
