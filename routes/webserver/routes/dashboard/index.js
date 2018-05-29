const express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , api = require(rootDir+'/lib/api/api')

router.get('/',ensureAuthenticated,(req, res) =>{
  api.getSettings().then((setting)=>{
    console.log(setting.data)
    if(setting.data < 1 || setting.data === 'Error retrieving settings'){
      res.redirect('/install')
    }else{
      res.render('pages/dashboard/index',{title: "Dashboard | Dimension Data Bot Portal",user:req.user})
    }
  }).catch((error)=>{console.log(error)})
});

router.get('/alerts',ensureAuthenticated,(req, res) =>{
  res.render('pages/dashboard/alerts',{title: "Dashboard - Alerts | Dimension Data Bot Portal", user:req.user})
});

module.exports = router
