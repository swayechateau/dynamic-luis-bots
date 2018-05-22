const builder = require('botbuilder'),
      spellService = require('./spell-service'),
      axios = require('axios'),
      api = require(rootDir+'/lib/api/api');

let connector = []
const LuisModelUrl = []
    , bot = []
    , oldBotUrl = []
    , recognizer = [];

function start(router){
    luisModelUrl()
    api.getDepartments().then((departments) => {
        departments.data.forEach((item,index)=>{
            if(item.microsoftBotAppId == 'null'){
                microsoftBotAppId= null,
                microsoftBotAppPass= null
             }else{
                microsoftBotAppId= item.microsoftBotAppId,
                microsoftBotAppPass= item.microsoftBotAppPass
             }
             connector[item._id] = new builder.ChatConnector({
                appId: microsoftBotAppId,
                appPassword: microsoftBotAppPass
             });
            router.get(`/${item._id}/messages`, (req,res)=> {
                res.send(item.name);
            })
            router.post(`/${item._id}/messages`,connector[item._id].listen());
            //oldBotUrl.push("/${item._id}/messages")
        })
    }).catch((error)=>console.log(error))
}
//Populate luisModelUrl
function luisModelUrl(){
    axios.all([axios.get('/api/department'), axios.get('/api/setting')])
    .then(axios.spread((departments, setting)=> {
        let luisRegion = setting.data[0].luisRegion,
            subKey = setting.data[0].subscriptionKey
        console.log(setting.data)
        departments.data.forEach((item,index)=>{
            if(item.luisState === 'Staging'){
                staging = true
            }else{staging = false}
        LuisModelUrl[item._id] =`https://${luisRegion}.api.cognitive.microsoft.com/luis/v2.0/apps/${item.luisAppId}?subscription-key=${subKey}&staging=${staging}`
        console.log(LuisModelUrl[item._id])
        // Both requests are now complete
        })
    })).catch((error)=>console.log(error));
}
function botConnector(){
    api.getDepartments().then((response)=>{
        let microsoftAppId, microsoftAppPass
        response.data.forEach((item,index)=>{
            if (item.microsoftBotAppId === 'null' && item.microsoftBotAppPass === 'null'){
                microsoftAppId = null;
                microsoftAppPass = null;
            }else{
                microsoftAppId = item.microsoftBotAppId;
                microsoftAppPass = item.microsoftBotAppPass;
            }

            connector[item._id] = new builder.ChatConnector({
                appId: microsoftAppId,
                appPassword: microsoftAppPass
            });
        })
    }).catch((error)=>console.log(error))
}

function loadDialog (id) {

    // Create connector and listen for messages
    bot[id] = new builder.UniversalBot(connector[item._id], (session) =>{
        session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
    });
    recognizer[id]= new builder.LuisRecognizer(LuisModelUrl[id]);

    api.getIntents()
    .then((response) => {
        let intents = response.data

        bot[id].recognizer(recognizer[id]);

        intents.forEach(botDialog)
        console.log('api ran')

        function botDialog(item, index) {
            if(item.department === id){
                console.log('matched')
                if(item.disabled == true){
                    bot[id].dialog(item.name, (session) =>{
                    session.endDialog('I am sorry, this feature has been disabled');
                    }).triggerAction({
                        matches: console.log(item.name)
                    })
                }else if(item.entities == true){
                    bot[id].dialog(console.log(item.name), (session) =>{

                    session.endDialog('I am sorry, this feature has yet to be coded, seems my programmer is being lazy');
                    }).triggerAction({
                        matches: item.name
                    })
                }else{
                    let i = random(item.answer)
                    bot[id].dialog(item.name, (session)=> {
                    session.endDialog(item.answer[i]);
                    }).triggerAction({
                        matches: item.name

                    })

                }
            }
        }
    }).catch((error)=>console.log(error))

}

function loadDialogs () {

    axios.get('/api/intent')
    .then((response) => {
        let intents = response.data
        for(let i=0; i < intents.length; i++){
            bot[intents[i].department] = new builder.UniversalBot(connector[intents[i].department], (session) =>{
                session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
            });
            recognizer[intents[i].department]= new builder.LuisRecognizer(LuisModelUrl[intents[i].department]);
            bot[intents[i].department].recognizer(recognizer[intents[i].department]);
        }


        intents.forEach(botDialogs)
        console.log('api ran')

        function botDialogs(item, index) {

            console.log(item)
            if(item.disabled == true){
                bot[item.department].dialog(item.name, (session) =>{
                    session.endDialog('I am sorry, this feature has been disabled');
                }).triggerAction({
                    matches: item.name
                })
                }else if(item.entities == true){
                    bot[item.department].dialog(item.name, (session) =>{

                    session.endDialog('I am sorry, this feature has yet to be coded, seems my programmer is being lazy');
                    }).triggerAction({
                        matches: item.name
                    })
                }else{
                    let i = random(item.answer)
                    bot[item.department].dialog(item.name, (session)=> {
                    session.endDialog(item.answer[i]);
                    }).triggerAction({
                        matches: item.name

                })

            }
        }
    }).catch((error)=>console.log(error))

}

function random(array){
    let randomNumber
    randomNumber = Math.floor(Math.random() * array.length)
    return randomNumber
}

module.exports = {
    connector:connector,
    LuisModelUrl:LuisModelUrl,
    botConnector:botConnector,
    start:start,
    loadDialog:loadDialog,
    loadDialogs:loadDialogs

};
