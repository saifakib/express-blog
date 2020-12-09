const { Schema, model } = require('mongoose');
const valid = require('validator');
// const Profile = require('./Profile');

const userSchema = new Schema({
    username : {
        type : String,
        trim : true,
        maxlength : 15,
        required : true
    },

    email : {
        type : String,
        trim : true,
        required : true,
        unique : true,
        validate : {
            validator : ( v ) =>{
                return valid.isEmail(v)
            },
            message : "${v} is not valid email"
        }
    },

    password : {
        type: String,
        required: true
    },

    profile : {
        type : Schema.Types.ObjectId,
        ref : 'Profile'
    },
    
    profile_pic : {
        type : String,
        default : '/images/default.jpeg'
    }
},{
    timestamps : true
})

const User = model('User', userSchema);
module.exports = User