const mongoose = require('mongoose')
    , Schema = mongoose.Schema

    , permissionSchema = new Schema({
        userId: { type: String, unique: true },
        wizard: { type: Boolean, default: false },
        department: String,
        admin: { type: Boolean, default: false },
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now }
    });

module.exports = mongoose.model('permission', permissionSchema, 'permissions');