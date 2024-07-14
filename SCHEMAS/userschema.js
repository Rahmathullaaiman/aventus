const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email:{
        type:String,
    require:true,
     unique:true,
valdator(value){
            if(!validator.isEmail(value))
            {throw new Error('invalid Email')}
        }
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String
    },
    profile: {
        type: String
    },
    otp: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    }
});

const users = mongoose.model('users', userSchema);

module.exports = users;
