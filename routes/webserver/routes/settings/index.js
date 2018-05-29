const express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , api = require(rootDir+'/lib/api/api');

router.get('/',ensureAuthenticated,(req, res) =>{
  let setting, log, departments;
  api.getSettings()
  .then((settingResponse) => {
     setting = settingResponse.data[0];return api.getDepartments()})
  .then((departmentResponse)=>{
    departments = departmentResponse.data;
    res.render('./pages/setting/index',{
      title: "Site Configuration - Dimension Data Bot Portal",
      user:req.user,
      confid: setting._id,
      skPlaceholder: setting.subscriptionKey,
      skValue: setting.subscriptionKey,
      bkPlaceholder: setting.bingApiKey,
      bkValue: setting.bingApiKey,
      bingStatus: setting.bingSpellCheckEnabled,
      luisRegion: setting.luisRegion,
      departmentsData: departments,
      logsData: log
    })
  })
  .catch((error)=>console.log(error))

});

router.post('/',ensureAuthenticated,(req, res) =>{
  if(req.body.bingStatus === 'Enabled'){
    bingStatus = true
  }else{
    bingStatus = false
  }
  api.putSetting(req.body,bingStatus).then((response)=>{
    console.log(response)
    res.json(response)
  }).catch((error)=>{
    console.log(error)
    res.json(error)
  })

});

module.exports = router
