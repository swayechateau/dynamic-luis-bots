const express = require('express')
    , router = express.Router()
    , user = require(rootDir+'/models/user')
    , mongoose = require('mongoose')
    , url = require(rootDir+'/lib/mongodb/config');

mongoose.connect(url, { useMongoClient: true},(err) => {
  console.log(url)
    if(err){
        console.error("Error! " + err);
    }
});

router.get('/', (req, res, next) => {
    console.log('Get request for all users');
    user.find({})
    .exec((err, users) => {
        if(err){
            res.send("Error retrieving users");
        }else{
            res.json(users);
        }
    })
})

router.get('/:id', (req, res, next) => {
    console.log('Get request for a single user');
    user.findById(req.params.id)
    .exec((err, users) => {
        if(err){
            res.send("Error retrieving users");
        }else{
            res.json(users);
        }
    })
})

router.post('/', (req, res, next) => {
    console.log('Post a user');
    var newuser = new user();
    newuser.disabled = req.body.disabled
    newuser.email = req.body.email;
    newuser.name = req.body.name;
    newuser.azureOid = req.body.azureOid;
    newuser.password = req.body.pass
    newuser.created = new Date;
    newuser.save((err, inserteduser) => {
        if(err){
            res.send("Error saving user");
        }else{
            res.json(inserteduser);
        }
    });
})
router.put('/:id/azure', (req, res, next) => {
    console.log('Update a user');
    user.findByIdAndUpdate(req.params.id,
    {
        $set: {
            email: req.body.email,
            name: req.body.name,
            azureOid: req.body.azureOid,
            updated: new Date,
        }
    },
    {
        new: true
    },
    (err, updateduser) => {
        if(err){
            res.send("Error updating user");
        }else{
            res.json(updateduser);
        }
    }
    )
})
router.put('/:id', (req, res, next) => {
    console.log('Update a user');
    user.findByIdAndUpdate(req.params.id,
    {
        $set: {
            disabled: req.body.disabled,
            email: req.body.email,
            name: req.body.name,
            updated: new Date,
        }
    },
    {
        new: true
    },
    (err, updateduser) => {
        if(err){
            res.send("Error updating user");
        }else{
            res.json(updateduser);
        }
    }
    )
})

router.delete('/:id', (req, res, next) => {
    console.log('Deleting a user');
    user.findByIdAndRemove(req.params.id, (err, deleteduser) => {
        if(err){
            res.send("Error deleting user");
        }else{
            res.json(deleteduser);
        }
    })
})

module.exports = router;
