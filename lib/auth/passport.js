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
  let values;
    api.getUser(id)
    .then((user)=>{ values = user.data; return api.getPermissions(values._id);})
    .then((perms)=>{
      perms.data.forEach((item,index)=>{
        if(item.userId === values._id){
          current = {
            id:values._id,
            azureOid:values.azureOid,
            name:values.name,
            email:values.email,
            disabled:values.disabled,
            created:values.created,
            updated:values.updated,
            perm:{
              id:item._id,
              admin:item.admin,
              wizard:item.wizard,
              department:item.department
            }
          }
          console.log(current)
          return done(null, current);
        }
      })
    }).catch((error)=>done(error,null));
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
      // get all users to check if current user is in db
      var values,found=false;
      api.getUsers().then((users)=>{
        //loop through user array
        if(users.data.length <1){
          console.log('New Admin ')
          return api.postUserAzure(profile._json,true)
          .then((user)=>{return done(null, user.data);})
        }else{
          users.data.forEach((item,index)=>{

            if(profile.oid === item.azureOid){
              console.log('returning user')
              found=true
              return api.putUserAzure(item._id,profile._json)
                .then((user)=>{return done(null, user.data);});
            }
  
            if(item.email === profile._json.preferred_username){
              console.log('first time log on')
              found=true
              // if azure id is present log in user
              return api.putUserAzure(item._id,profile._json)
                .then((user)=>{return done(null, user.data);});
            }
          })
          if(!found){
            console.log('New User ')
            return api.postUserAzure(profile._json,false)
            .then((user)=>{return done(null, user.data);})
          }
        }
      }).catch((error)=>{return done(error, null);})
    });
  }
));

/*
        console.log('New User')
        
        

*/