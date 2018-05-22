const express = require('express')
    , router = express.Router()
    , permission = require(rootDir+'/models/permission')
    , mongoose = require('mongoose')
    , url = require(rootDir+'/lib/mongodb/config');

mongoose.connect(url, { useMongoClient: true},(err) =>{
    if(err){
        console.error("Error! " + err);
    }
});

router.get('/', (req, res, next) =>{
    console.log('Get request for all permissions');
    permission.find({})
    .exec((err, permissions) =>{
        if(err){
            res.send("Error retrieving permissions");
        }else{
            res.json(permissions);
        }
    })
})

router.get('/:id', (req, res, next) => {
    console.log('Get request for a single permission');
    permission.findById(req.params.id)
    .exec((err, permissions) => {
        if(err){
            res.send("Error retrieving permissions");
        }else{
            res.json(permissions);
        }
    })
})

router.post('/', (req, res, next) => {
    console.log('Post a permission');
    var newpermission = new permission();
    newpermission.userId = req.body.userId;
    newpermission.wizard = req.body.wizard;
    newpermission.department = req.body.department;
    newpermission.admin = req.body.admin;
    newpermission.created = new Date ;
    newpermission.save((err, insertedpermission) => {
        if(err){
            res.send("Error saving permission");
        }else{
            res.json(insertedpermission);
        }
    });
})

router.put('/:id', (req, res, next) => {
    console.log('Update a permission');
    permission.findByIdAndUpdate(req.params.id,
    {
        $set: {
            wizard: req.body.wizard,
            department: req.body.department,
            admin: req.body.admin,
            updated: new Date 
        }
    },
    {
        new: true
    },
    (err, updatedpermission) => {
        if(err){
            res.send("Error updating permission");
        }else{
            res.json(updatedpermission);
        }
    }
    )
})

router.delete('/:id', (req, res, next) => {
    console.log('Deleting a permission');
    permission.findByIdAndRemove(req.params.id, (err, deletedpermission) => {
        if(err){
            res.send("Error deleting permission");
        }else{
            res.json(deletedpermission);
        }
    })
})

module.exports = router;