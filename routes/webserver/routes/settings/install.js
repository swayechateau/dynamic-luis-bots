const express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , api = require(rootDir+'/lib/api/api');
let isNone

router.get('/',ensureAuthenticated,(req, res) =>{


  api.getDepartments()
  .then((response)=>{
    if(response.data < 1 || response.data === 'Error retrieving settings'){
      isNone = true}else{isNone = false}})
  .catch((error)=>{
      console.log(error)
      res.send(error)
  })
    res.render('./pages/setting/install',{
      title: "Site First Setup Configuration - Dimension Data Bot Portal",
      none: isNone
    })
  })

  router.post('/',ensureAuthenticated,(req, res) =>{
    console.log('Generating New Setting')
    if(isNone === false){
      api.postSetting(req.body).then((response)=>{
          res.redirect('/')
      }).catch((error)=>{
          console.log(error)
          res.send(error)
      })
    }else{
      api.postSetting(req.body).then((response)=>{
          return api.postLuisApp(req.body.name)
      }).then((response)=>{
          return api.postDepartment(req.body,response.data)
      }).then((response)=>{
          res.redirect('/')
      }).catch((error)=>{
          console.log(error)
          res.send(error)
      })
    }
});

module.exports = router
