const express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , api = require(rootDir+'/lib/api/api');

    router.get('/',ensureAuthenticated,(req, res) =>{
      console.log('Refreshing department bots intent list and loading all intents');
      let departments
      api.getDepartments()
      .then((response)=>{
        departments= response.data
        return api.getIntents()
      })
      .then((response) => {
        res.render('pages/intents/index',{
          title: "Intents | Dimension Data Bot Portal",
          user:req.user,
          intentsData:response.data,
          departments:departments
        })
      })
      .catch((error) => {
        console.log(error);
      });

    });

    //Post Requests
    router.post('/',ensureAuthenticated,(req, res) =>{

      api.getDepartment(req.body.department)
      .then((response) =>{
        console.log('sending new intent to luis')
        console.log(response.data)
        return api.postLuisIntent(response.data, req.body.name.replace(/\s/g, ''))
      }).then((response)=>{
        console.log('succesfully sent intent to luis')
        console.log(response)
        return api.postIntent(req.body, response.data)
      }).then((response)=>{
        console.log('success ');
        res.redirect(`/intents/${response.data._id}`)
        //res.send(response.data._id)
      })
      .catch((error) => {
        console.log(error);
        res.send(error)
      });

    })

    router.get('/:id/',ensureAuthenticated,(req, res) =>{
      let departments, intent
      api.getDepartments()
      .then((response)=>{
        departments=response.data
        return api.getIntent(req.params.id)
      }).then((response)=>{
        intent = response.data
        for(let i=0; i<departments.length; i++){
          if(intent.department == departments[i]._id){
            return api.getLuisIntentUtterance(departments[i])
          }
        }
      }).then((response)=>{
        console.log(response.data);
        res.render('pages/intents/view',{
          title: `Intents - ${intent.friendlyName} | Dimension Data Bot Portal`,
          user:req.user,
          intent:intent,
          departments:departments,
          utterance: response.data
        })
      }).catch((error) => console.log(error));

    });
    router.delete('/:id',(req,res)=>{
      let intent
      console.log('Delete Intent sent')
      api.getIntent(req.params.id)
      .then((response)=>{
        intent = response.data
        return api.getDepartment(intent.department)
      })
      .then((response)=>{
        return api.deleteLuisIntent(response.data, intent.luisId)
      })
      .then((response)=>{
        return api.deleteIntent(intent._id)
      })
      .then((response)=>{
        res.send(`${response.data.name} Has been sucessfully Deleted`)
      })
      .catch((error)=>console.log(error))
    })

    router.post('/:id/',ensureAuthenticated,(req, res) =>{
      console.log('update intent sent')
      let oldIntent,oldDepartment;
      api.getIntent(req.params.id)
      .then((response)=>{
        oldIntent = response.data
        return api.getDepartment(oldIntent.department)
      }).then((response)=>{
        oldDepartment = response.data
        if(req.body.department !== oldDepartment._id){
          console.log(oldDepartment)
          return api.deleteLuisIntent(oldDepartment,oldIntent.luisId)
          .then((response)=>{
            return api.deleteIntent(oldIntent._id)
          })
          .then((response)=>{
            return api.getDepartment(req.body.department)
          })
          .then((response)=>{
            return api.postLuisIntent(response.data,req.body.name)
          })
          .then((response)=>{
            return api.postIntent(req.body, response.data)
          })
        }else if(req.body.name !==oldIntent.name){
          console.log('updating intent on luis')
          return api.putLuisIntent(oldDepartment,oldIntent.luisId,req.body.name)
          .then((response)=>{
            if(req.body.newUtt !== ''){
              return api.postLuisIntentUtterance(oldDepartment,req.body)
              .then((response)=>{
                return api.putIntent(req.body)
              })
            } else{
              return api.putIntent(req.body)
            }
          })
        }else{
          if(req.body.newUtt !== ''){
            return api.postLuisIntentUtterance(oldDepartment, req.body)
            .then((response)=>{
              return api.putIntent(req.body)
            })
          } else{
            return api.putIntent(req.body)
          }
        }
      })
      .then((response)=>{
        res.redirect(req.get('referer'))
      }).catch((error)=>res.send(error.response.data))

    });
    router.post('/:id/utt',(req, res) =>{
      console.log('update intent utterance sent')
      console.log(req.body)
      let department
      api.getDepartment(req.body.department)
      .then((response)=>{department = response.data;return api.deleteLuisIntentUtterance(department, req.body.id)})
      .then((response)=>{ return api.postLuisIntentUtterance(department, req.body.utt)})
      .then((response)=>{console.log(response.data);res.send('Utterance Updated')})
      .catch((error)=>res.send(error.response))
    });

    router.delete('/:id/utt',(req, res) =>{
      console.log('delete intent utterance sent')
      console.log(req.body)
      api.getDepartment(req.body.department)
      .then((response)=>{return api.deleteLuisIntentUtterance(response.data, req.body.id)})
      .then((response)=>{console.log(response.data);res.send('Utterance Deleted')})
      .catch((error)=>res.send(error.response))
    });

module.exports = router
