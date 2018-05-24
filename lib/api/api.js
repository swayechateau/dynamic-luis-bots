var axios = require ('axios');
var host = 'https://handsomely-barber.glitch.me';
module.exports = {
// Setting API Functions

postSetting: (array, bingStatus)=> {
    return axios.post(`${host}/api/setting/`,{
        subKey: array.subKey,
        luisRegion: array.luisRegion,
        bingStatus:bingStatus
    });
},
getSettings: ()=> {
    return axios.get(`${host}/api/setting/`);
},
getSetting: (id) => {
    return axios.get(`${host}/api/setting/${id}`);
},
putSetting: (array, bingStatus) =>{
    return axios.put(`${host}/api/setting/${array.id}`,{
        subKey: array.subKey,
        luisRegion: array.luisRegion,
        bingKey: array.bingKey,
        bingStatus:bingStatus
    });
},
deleteSetting: (id)=>{
    return axios.delete(`${host}/api/setting/${id}`);
},
//Department
getDepartments:()=>{
    return axios.get(`${host}/api/department/`);
},
getDepartment:(id)=>{
    return axios.get(`${host}/api/department/${id}`);
},
postDepartment:(array, luisId) =>{
    return axios.post(`${host}/api/department/`,{
        friendlyName: array.name,
        name: array.name.replace(/\s/g, ''),
        sparkAccessToken: array.sparkAccessToken,
        appId: array.microsoftAppId,
        appPass: array.microsoftAppPass,
        luisAppId:luisId,
        luisAppVer:'1.0',
        analyticsId: '',
        confluence: '',
        botName: array.botName,
    });
},
trainDepartment:(array,id)=>{
    return axios.put(`${host}/api/department/${array.id}/train/`)
},
publishDepartment:(array)=>{
    return axios.put(`${host}/api/department/${array.id}/publish/`,{
        luisState: array.luisState
    })
},
putDepartment:(array)=>{
    return axios.put(`${host}/api/department/${array.id}`,{
        friendlyName: array.friendlyName,
        name: array.friendlyName.replace(/\s/g, ''),
        sparkAccessToken: array.sparkAccessToken,
        appId: array.microsoftAppId,
        appPass: array.microsoftAppPass,
        analyticsId: array.analyticsId,
        confluence: array.confluence,
        botName: array.botName,
        updated:new Date
    });
},
deleteDepartment:(id)=>{
    return axios.delete(`${host}/api/department/${id}`);
},
//Intents
getIntents: ()=>{
    return axios.get(`${host}/api/intent/`);
},
getIntent: (id)=>{
    return axios.get(`${host}/api/intent/${id}`);
},
postIntent: (array, luisId)=>{
    return axios.post(`${host}/api/intent/`,{
      name:array.name.replace(/\s/g, ''),
      friendlyName:array.name,
      department:array.department,
      answer:array.answer,
      disabled:false,
      luisId:luisId,
      created:new Date,
      updated:new Date
    });
},
putIntent: (array)=>{
    return axios.put(`${host}/api/intent/${array.id}`,{
        name:array.name.replace(/\s/g, ''),
        friendlyName:array.name,
        department:array.department,
        answer:array.answer,
        disabled:array.disabled,
        updated:new Date
    });
},
deleteIntent:(id)=>{
    return axios.delete(`${host}/api/intent/${id}`);
},
//User Api
getUsers:()=>{
    return axios.get(`${host}/api/user/`);
},
getUser:(id)=>{
    return axios.get(`${host}/api/user/${id}`);
},
postUser:(array, disabled, bool)=>{
    if(disabled === null){disabled=false}else{disabled=true};
    if(bool === true){array.wizard=array.admin=true};
    return axios.post(`${host}/api/user/`,{
        disabled: disabled,
        email:array.preferred_username,
        name: array.name,
        created:new Date,
        updated:new Date
    }).then((user)=>{
        return axios.post(`${host}/api/permission/`,{
            userId:user.data._id,
            department:array.department,
            wizard:array.wizard,
            admin:array.admin
        }).then((perm)=>{
          return axios.get(`${host}/api/user/${perm.data.userId}`);
        })
    });
},
putUserAzure:(id, array, disabled)=>{
  return axios.put(`${host}/api/user/${id}`,{
    disabled: disabled,
    email:array.preferred_username,
    name: array.name,
    azureOid: array.oid,
    updated:new Date
  })
},
putUser:(id, array, disabled)=>{
    if(disabled === null){array.disabled=false}
    axios.get(`${host}/api/permission`)
    .then((perms)=>{
        perms.data.forEach((item,index)=>{
            if(id === item.userId){
                return axios.put(`${host}/api/persission/${item._id}`,{
                    department:array.department,
                    wizard:array.wizard,
                    admin:array.admin
                }).then((perm)=>{
                    return axios.put(`${host}/api/user/${id}`,{
                    disabled: array.disabled,
                    email:array.preferred_username,
                    name: array.name,
                    azureOid: array.oid,
                    updated:new Date
                })
                })
            }
        })
    });
},
deleteUser:(id)=>{
    axios.get(`${host}/api/persission`)
    .then((perms)=>{
      perms.data.forEach((item,index)=>{
        if(item.userId === id){
            return axios.delete(`${host}/api/persission/${item._id}`).then((perm)=>{
                return axios.delete(`${host}/api/user/${id}`)
            })
        }
      })
    })
},
//permissions Api
getPermissions:()=>{
    return axios.get(`${host}/api/permission/`);
},
getPermission:(id)=>{
    return axios.get(`${host}/api/permission/${id}`);
},
postPermissions:(array)=>{
    return axios.post(`${host}/api/permission/`,{
        userId: array.id,
        wizard: array.superUser,
        department: array.department,
        admin: array.admin,
        created:new Date,
        updated:new Date
    });
},
putPermission:(id, array)=>{
    return axios.put(`${host}/api/user/${id}`,{
        wizard: array.superUser,
        department: array.department,
        admin: array.admin,
        updated:new Date
    });
},
deletePermission:(id)=>{
    return axios.delete(`${host}/api/user/${id}`);
},
//Logs Api
postLog:()=> {
    return axios.post(`${host}/api/log/`);
},
getLogs:()=> {
    return axios.get(`${host}/api/log/`);
},
/*=========
  Luis Api
===========*/
// Luis App
luisTrainStatus: (array)=>{
    return axios.get(`${host}/api/setting/`)
    .then((response)=>{
        console.log(response.data[0])
        return axios.get(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${array.luisAppId}/versions/${array.luisAppVer}/train`,{
        headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},
trainLuisApp: (array)=>{
    return axios.get(`${host}/api/setting/`)
    .then((response)=>{
        console.log(response.data[0].subscriptionKey)
        return axios.post(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${array.luisAppId}/versions/${array.luisAppVer}/train`,{},
        {   headers: {
                'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
                'Content-Type': 'application/json'
            }
        })
    })
},
publishLuisApp:(array) =>{
    let publishBool;
    if(array.luisState === 'Staging'){publishBool=true}else{publishBool=false}
    return axios.get('${host}/api/setting/')
    .then((response)=>{
        return axios.post(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${array.luisAppId}/publish`,{
            "versionId": array.luisAppVer,
            "isStaging": publishBool,
            "region": response.data[0].luisRegion
        },{headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},
postLuisApp:(name) =>{
    return axios.get(`${host}/api/setting/`)
    .then((response)=>{
        console.log('sending to luis')
        return axios.post(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/`,
        {
            name: name.replace(/\s/g, ''),
            description: `This is the ${name} application`,
            culture: "en-us",
            usageScenario: "",
            domain: "",
            initialVersionId: "1.0"

        },{headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},
putLuisApp: (name, id) =>{
    return axios.get(`${host}/api/setting/`)
    .then((response)=>{
        console.log('sending to luis')
        return axios.put(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${id}`,
        {
            name: name,
            description: `This is the ${name} Bot Application`,

        },{headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},
deleteLuisApp:(id) =>{
    return axios.get(`${host}/api/setting/`).then((response)=>{
        console.log('sending to luis')
    return axios.delete(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${id}`,
        {headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},

// Luis App Intents
postLuisIntent:(array,name)=>{
    return axios.get(`${host}/api/setting/`).then((response)=>{
        console.log('processing post intent api to luis')
    return axios.post(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${array.luisAppId}/versions/${array.luisAppVer}/intents/`,
        {name:name},{headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},
putLuisIntent:(array,id,name)=>{
    return axios.get(`${host}/api/setting/`).then((response)=>{
        console.log('processing post intent api to luis')
    return axios.post(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${array.luisAppId}/versions/${array.luisAppVer}/intents/${id}`,
        {name:name},{headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},
deleteLuisIntent:(array, id)=>{
    return axios.get(`${host}/api/setting/`).then((response)=>{
        console.log('processing delete intent api from luis')
    return axios.delete(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${array.luisAppId}/versions/${array.luisAppVer}/intents/${id}`,
        {headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},
// Luis Utterances
getLuisIntentUtterance:(array)=>{
    return axios.get(`${host}/api/setting/`).then((response)=>{
        console.log('sending to luis')
    return axios.get(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${array.luisAppId}/versions/${array.luisAppVer}/examples/`,
           { headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},
postLuisIntentUtterance:(array, utt)=>{
    console.log(utt)
    return axios.get(`${host}/api/setting/`).then((response)=>{
        console.log('sending utterance to luis')
    return axios.post(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${array.luisAppId}/versions/${array.luisAppVer}/example/`,
        {text: utt.newUtt,intentName: utt.name},
           { headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},
deleteLuisIntentUtterance:(array, id)=>{
    return axios.get(`${host}/api/setting/`).then((response)=>{
        console.log('sending to luis')
    return axios.delete(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${array.luisAppId}/versions/${array.luisAppVer}/examples/${id}`,
        {headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
},
// Luis Modals
getLuisAppIntents:(array)=>{
    return axios.get(`${host}/api/setting/`).then((response)=>{
        console.log('getting intents from luis')
    return axios.get(`https://${response.data[0].luisRegion}.api.cognitive.microsoft.com/luis/api/v2.0/apps/${array.luisAppId}/versions/${array.luisAppVer}/models`,
        {headers: {
            'Ocp-Apim-Subscription-Key': response.data[0].subscriptionKey,
            'Content-Type': 'application/json'
        }})
    })
}
}
