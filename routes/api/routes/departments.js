var express = require('express');
var router = express.Router();
var department = require(rootDir+'/models/department');
var mongoose = require('mongoose')
  , url = require(rootDir+'/lib/mongodb/config')
  , axios = require('axios')

mongoose.Promise= global.Promise;
mongoose.connect(url, { useMongoClient: true},(err) =>{
    if(err){
        console.error("Error! " + err);
    }
});

router.get('/', (req, res, next) =>{
    console.log('Get request for all departments');
    department.find({})
    .exec((err, departments) => {
        if(err){
            res.send("Error retrieving departments");
        }else{
            res.json(departments);
        }
    })
})

router.get('/:id', (req, res, next) =>{
    console.log('Get request for a single department');
    department.findById(req.params.id)
    .exec((err, departments) =>{
        if(err){
            res.send("Error retrieving departments");
        }else{
            res.json(departments);
        }
    })
})

router.post('/', (req, res, next) =>{
    console.log('Post a department');
    var newdepartment = new department();
    newdepartment.friendlyName = req.body.friendlyName;
    newdepartment.name = req.body.name;
    newdepartment.sparkAccessToken = req.body.sparkAccessToken;
    newdepartment.microsoftBotAppID = req.body.appId;
    newdepartment.microsoftBotAppPass = req.body.appPass;
    newdepartment.luisAppId = req.body.luisAppId;
    newdepartment.luisAppVer = req.body.luisAppVer;
    newdepartment.luisState = req.body.luisState;
    newdepartment.analyticsId = req.body.analyticsId;
    newdepartment.confluence = req.body.confluence;
    newdepartment.botName = req.body.botName;
    newdepartment.created = new Date;
    newdepartment.updated = new Date;
    newdepartment.save((err, inserteddepartment) =>{
        if(err){
            consloe.log(res.send("Error saving department"));
        }else{
            console.log(res.json(inserteddepartment));
        }
    });
})

router.put('/:id', (req, res, next) =>{
    console.log('Update a department');
    department.findByIdAndUpdate(req.params.id,
    {
        $set: {
            friendlyName: req.body.friendlyName,
            name: req.body.name,
            sparkAccessToken: req.body.sparkAccessToken,
            microsoftBotAppId: req.body.appId,
            microsoftBotAppPass: req.body.appPass,
            analyticsId: req.body.analyticsId,
            confluence: req.body.confluence,
            botName: req.body.botName,
            updated: new Date
        }
    },
    {
        new: true
    },
    (err, updateddepartment) =>{
        if(err){
            res.send("Error updating department");
        }else{
            res.json(updateddepartment);
        }
    }
    )
})
router.put('/:id/train/', (req, res, next) =>{
    console.log('Update department publish details');
    department.findByIdAndUpdate(req.parms.id,
    {
        $set: {
            luisTrainDate: new Date,
            updated: new Date}
    },
    {
        new: true
    },
    (err, updateddepartment) =>{
        if(err){
            res.send("Error updateding department training details");
        }else{
            res.json(updateddepartment);
        }
    }
    )
})
router.put('/:id/publish/', (req, res, next) =>{
    console.log('Update department publish details');
    department.findByIdAndUpdate(req.params.id,
    {
        $set: {
            luisState: req.body.luisState, 
            luisPubDate: new Date,
            updated: new Date}
    },
    {
        new: true
    },
    (err, updateddepartment) =>{
        if(err){
            res.send("Error updating department publish details");
        }else{
            res.json(updateddepartment);
        }
    }
    )
})

router.delete('/:id', (req, res, next) =>{
    console.log('Deleting a department');
    department.findByIdAndRemove(req.params.id, (err, deleteddepartment) =>{
        if(err){
            res.send("Error deleting department");
        }else{
            res.json(deleteddepartment);
        }
    })
})

module.exports = router;