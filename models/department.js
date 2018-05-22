const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const departmentSchema = new Schema({
        friendlyName:{type: String},
        name:{type: String, unique: true},
        sparkAccessToken:{type: String, default:''},
        microsoftBotAppId: {type: String, default:''},
        microsoftBotAppPass: {type: String, default:''},
        luisAppId: String,
        luisAppVer: String,
        luisStagingState: Boolean,
        luisPubDate: { type: Date},
        analyticsId: {type: String, default:''},
        confluence: {type: String, default:''},
        botName:{type: String, lowercase: true},
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now }
    });

module.exports = mongoose.model('department', departmentSchema, 'departments');
