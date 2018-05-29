const express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , api = require(rootDir+'/lib/api/api');

    router.get('/',ensureAuthenticated,(req,res)=>{
        console.log('Processing Teams View')
        let users,perm;
        api.getUsers()
        .then((response)=>{
           console.log('Generated user array')
            users=response.data
            return api.getPermissions()})
        .then((response)=>{
            console.log('generated Permissions Array')
            perms=response.data
            return api.getDepartments()})
        .then((response)=>{
            res.render('./pages/team/index',{
              title:'My Team - Dimension Data Bot Portal',
              departments:response.data,
              perms:perms,
              user:req.user,
              users:users
            })
        })
      .catch((error)=>console.log(error))
    })


module.exports = router
