const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const intentSchema = new Schema({
    name: String ,
    friendlyName: String ,
    luisId: String,
    answer:Array,
    department: String,
    disabled: { type: String, default: 'false' },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('intent', intentSchema, 'intents');
