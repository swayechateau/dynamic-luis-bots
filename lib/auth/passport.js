/******************************************************************************
 * Set up passport in the app
 ******************************************************************************/
const config = require('./azure')
    , passport = require('passport')
    , OIDCStrategy = require('passport-azure-ad').OIDCStrategy
    , api = require('../api/api')
//-----------------------------------------------------------------------------
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.  Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
//-----------------------------------------------------------------------------

// used to serialize the user for the session
passport.serializeUser((user, done)=> {
    done(null, user._id);
});

// used to deserialize the user
passport.deserializeUser((id, done)=> {
    api.getUser(id).then((user)=>done(null,user.data))
    .catch((error)=>done(error,null));
});

//-----------------------------------------------------------------------------
// Use the OIDCStrategy within Passport.
//
// Strategies in passport require a `verify` function, which accepts credentials
// (in this case, the `oid` claim in id_token), and invoke a callback to find
// the corresponding user object.
//
// The following are the accepted prototypes for the `verify` function
// (1) function(iss, sub, done)
// (2) function(iss, sub, profile, done)
// (3) function(iss, sub, profile, access_token, refresh_token, done)
// (4) function(iss, sub, profile, access_token, refresh_token, params, done)
// (5) function(iss, sub, profile, jwtClaims, access_token, refresh_token, params, done)
// (6) prototype (1)-(5) with an additional `req` parameter as the first parameter
//
// To do prototype (6), passReqToCallback must be set to true in the config.
//-----------------------------------------------------------------------------
passport.use(new OIDCStrategy({
    identityMetadata: config.creds.identityMetadata,
    clientID: config.creds.clientID,
    responseType: config.creds.responseType,
    responseMode: config.creds.responseMode,
    redirectUrl: config.creds.redirectUrl,
    allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
    clientSecret: config.creds.clientSecret,
    validateIssuer: config.creds.validateIssuer,
    isB2C: config.creds.isB2C,
    issuer: config.creds.issuer,
    passReqToCallback: config.creds.passReqToCallback,
    scope: config.creds.scope,
    loggingLevel: config.creds.loggingLevel,
    nonceLifetime: config.creds.nonceLifetime,
    nonceMaxAmount: config.creds.nonceMaxAmount,
    useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
    cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
    clockSkew: config.creds.clockSkew,
  },(iss, sub, profile, accessToken, refreshToken, done)=>{
    if (!profile.oid) {
      return done(new Error("No id found"), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(()=> {
      console.log(profile._json.preferred_username);
      api.getUsers().then((users)=>{
        users.data.forEach((item,index)=>{
          if(profile.oid === item.azureOid){
            console.log('returning user')
            if(item.disabled === true){
              return api.putUserAzure(item._id,profile._json,false)
              .then((user)=>{return done(null, user.data, true);});
            }
            return api.putUserAzure(item._id,profile._json,false)
              .then((user)=>{return done(null, user.data, false);});
          }else if(item.email === profile._json.preferred_username){
            console.log('first time log on')
            // if azure id is present log in user
            if(item.disabled === true){
              return api.putUserAzure(item._id,profile._json,true)
                .then((user)=>{return done(null, user.data);});
            }
            return api.putUserAzure(item._id,profile._json,false)
              .then((user)=>{return done(null, user.data);});
          }
        })
          console.log('New User')
        var bool=false, disabled=true;
        //if(users.data.length <1){bool=true,disabled=false}else{bool=false, disabled=true}
        return api.postUser(profile._json,disabled,bool)
          .then((user)=>{return done(null, user.data);})
          
      }).catch((error)=>{return done(error, null);})
    });
  }
));
