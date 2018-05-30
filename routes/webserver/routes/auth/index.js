const express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , azureConfig = require(rootDir+'/lib/auth/azure')
    require(rootDir+'/lib/auth/passport')

router.get('/',(req, res) =>{
    res.render('pages/auth/login',{
      title: "Login - Dimension Data Bot Portal",
      //message: req.flash('loginMessage')
    })
  })
// sso ===================================
router.get('/sso',(req, res, next)=> {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        resourceURL: azureConfig.resourceURL,    // optional. Provide a value if you want to specify the resource.
        customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
        failureRedirect: '/auth'
      }
    )(req, res, next);
  },(req, res)=> {
    console.log('Login was called Bot-Framework');

    res.redirect('/');
});
// openid GET returnURL=========================
router.get('/openid/return',(req, res, next)=> {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        failureRedirect: '/auth'
      }
    )(req, res, next);
  },
  (req, res)=> {
    console.log('We received a return from AzureAD.');

    res.redirect('/');
  });

// openid POST returnURL=========================
router.post('/openid/return',(req, res, next)=> {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        failureRedirect: '/auth'
      }
    )(req, res, next);
  },
  (req, res)=> {
    console.log('We received a return from AzureAD.');

    res.redirect('/');
  });
// LOGOUT ================================
router.get('/logout', (req, res)=>{
  if(req.user){
    req.session.destroy((err)=> {
      res.redirect(azureConfig.destroySessionUrl);
      req.logOut();
    });
  }else{
    res.render('pages/auth/logout',{
      title: "Logged Out - Dimension Data Bot Portal"
    })
  }
  
});

module.exports = router
