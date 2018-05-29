const mongoose = require('mongoose')
    , Schema = mongoose.Schema

    , userSchema = new Schema({
        disabled: {type: Boolean},
        email:{type: String, lowercase: true, unique: true},
        name: String,
        azureOid: {type: String, unique: true},
        password: String,
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now }
    });

module.exports = mongoose.model('user', userSchema, 'users');
