const { Schema, model } = require('mongoose');
const User = require('./User');
const Post = require('./Post');

const userProfile = new Schema({

    user : {
        type : Schema.Types.ObjectId,
        ref : User,
        required : true
    },

    name:{
        type : String,
        required : true,
        trim:true,
        maxlength:50
    },

    title : {
        type : String,
        trim : true,
        required : true,
        maxlength : 100
    },

    bio : {
        type : String,
        trim : true,
        required : true,
        maxlength : 500
    },

    profile_pic : String,

    links : {
        website : String,
        facebook : String,
        github : String
    },

    posts : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Post'
        }
    ],

    bookmarks : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Post'
        }
    ]
}, { timestamps : true })

const Profile = model('Profile', userProfile);
module.exports = Profile;