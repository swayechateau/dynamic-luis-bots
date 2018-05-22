const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const settingSchema = new Schema({
        subscriptionKey: { type: String, unique: true},
        bingApiKey: String,
        bingSpellCheckEnabled:{ type: Boolean, default: false },
        luisRegion: String,
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now }
    });

module.exports = mongoose.model('setting', settingSchema, 'config');
