const express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , api = require(rootDir+'/lib/api/api');

    router.get('/',ensureAuthenticated,(req,res)=>{
      let users,perm;
      api.getUsers()
      .then((response)=>{
        users = response.data;return api.getPermissions()
      }).then((response)=>{
        perm=response.data; return api.getDepartments()
      }).then((response)=>{
        res.render('pages/users/index',{
          title:'All Users - Dimension Data Bot Portal',
          user:req.user,
          users:users,
          perms:perm,
          departments:response.data
        })
      }).catch((error)=>res.send(error.response))

    })
    //Post Requests
    router.post('/',(req, res) =>{
      api.postUser(req.body).then((user)=>{
        console.log('User Created')
        res.redirect(`/user/${user.data._id}`)
      }).catch((error)=>{res.send(error)})
    })

    router.get('/:id/',ensureAuthenticated,(req, res) =>{
        let users,perm, depts;
        api.getUser(req.params.id)
        .then((response)=>{
          users = response.data
          return api.getPermissions()
        }).then((response)=>{
          for(i=0; i<response.data.length; i++){
            if(req.params.id === response.data[i].userId){
              perm = response.data[i];
            }
          }
          return api.getDepartments()
        }).then((response)=>{
          depts = response.data
          res.render('pages/users/view',{
            title: `${users.name} | Dimension Data Bot Portal`,
            user:req.user,
            users:users,
            perms:perm,
            dept:depts
          })
        }).catch((error)=>res.send(error.response))
    });

    router.post('/:id',ensureAuthenticated,(req, res) =>{
      console.log(req.body)
      if(req.body.department === null && req.body.wizard ===false){req.body.disabled=true};
       api.getPermissions().then((response)=>{
        response.data.forEach((item,index)=>{
          console.log('searching for user')
          if(req.params.id === item.userId){
          console.log('Posting Permissions')            
            return api.putPermission(item._id, req.body).then((perm)=>{
              console.log('Updating User')
              return api.putUser(item.userId, req.body).then((resp)=>{
                console.log('User Permisions updated')
                console.log(resp.data)
                res.redirect(req.get('referer'))
              })
            })
          }
        })
      }).catch((error)=>{res.send(error)})
    }); 

    router.delete('/:id',ensureAuthenticated,(req,res)=>{
      api.getPermissions().then((perms)=>{
        perms.data.forEach((item,index)=>{
          if(item.userId === req.params.id){
            return api.deletePermission(item._id).then((perm)=>{
              return api.deleteUser(req.params.id).then((resp)=>{
                console.log('User Deleted')
                res.send(`${resp.data.name} Has been Successfully Deleted`)
              })
            })
          }
        })
      }).catch((error)=>{res.send(error)})
    })

module.exports = router
