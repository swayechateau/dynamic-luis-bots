const express = require('express')
    , router = express.Router()
    , log = require(rootDir+'/models/log')
    , mongoose = require('mongoose')
    , url = require(rootDir+'/lib/mongodb/config');

mongoose.connect(url, { useMongoClient: true},(err) =>{
    if(err){
        console.error("Error! " + err);
    }
});

router.get('/', (req, res, next) =>{
    console.log('Get request for all logs');
    log.find({})
    .exec((err, logs) =>{
        if(err){
            res.send("Error retrieving logs");
        }else{
            res.json(logs);
        }
    })
})

router.get('/:id', (req, res, next) => {
    console.log('Get request for a single log');
    log.findById(req.params.id)
    .exec((err, logs) => {
        if(err){
            res.send("Error retrieving logs");
        }else{
            res.json(logs);
        }
    })
})

router.post('/', (req, res, next) => {
    console.log('Post a log');
    var newlog = new log();
    newlog.userId = req.body.userId;
    newlog.typeId = req.body.typeId;
    newlog.type = req.body.type;
    newlog.info = req.body.info;
    newlog.created = new Date;
    newlog.save((err, insertedlog) => {
        if(err){
            res.send("Error saving log");
        }else{
            res.json(insertedlog);
        }
    });
})
router.put('/:id', (req, res, next) => {
    console.log('Update a setting');
    setting.findByIdAndUpdate(req.params.id,
    {
        $set: {userId: req.body.userId, type: req.body.type, info: req.body.info}
    },
    {
        new: true
    },
    (err, updatedsetting) => {
        if(err){
            res.send("Error updating setting");
        }else{
            res.json(updatedsetting);
        }
    }
    )
})
router.delete('/:id', (req, res, next) =>{
    console.log('Deleting a log');
    log.findByIdAndRemove(req.params.id, (err, deletedlog) =>{
        if(err){
            res.send("Error deleting log");
        }else{
            res.json(deletedlog);
        }
    })
})

module.exports = router;