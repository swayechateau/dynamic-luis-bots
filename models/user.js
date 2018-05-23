const mongoose = require('mongoose')
    , Schema = mongoose.Schema

    , userSchema = new Schema({
        disabled: Boolean,
        email:{type: String, lowercase: true, unique: true},
        name: String,
        azureOid: {type: String, unique: true},
        password: String,
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now }
    });
    // generating a hash
    userSchema.methods.generateHash = (password)=>{
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    userSchema.methods.validPassword = (password)=> {
        return bcrypt.compareSync(password, this.local.password);
    };
module.exports = mongoose.model('user', userSchema, 'users');
