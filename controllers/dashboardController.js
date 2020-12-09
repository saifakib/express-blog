const Flash = require('../utils/Flash');
const Profile = require('../models/Profile');
const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');
const  errorFormatter = require('../utils/validationErrorFormatter');

exports.dashboardController = async (req, res, next ) => {
    
    try{
        const profile =await Profile.findOne({ user : req.user._id });
        if(profile) {
            return res.render('pages/dashboard/dashboard.ejs', { title : 'My Dashboard ', flashMessage : Flash.getMessage(req) });
        }

        return res.render('pages/dashboard/create_profile.ejs', { title : 'Create Profile ',error:{}, flashMessage : Flash.getMessage(req) });
    } catch(e) {
        next(e);
    }
}

exports.createProfileGetController = async (req, res, next) => {
    try{
        const profile =await Profile.findOne({  user: req.user._id });
        if(profile) {
            res.redirect('/dashboard/edit-profile');
        }

        res.render('pages/dashboard/create_profile.ejs', { title: 'Create Profile', error:{}, flashMessage : Flash.getMessage(req) } )
    } catch(e) {
        next(e);
    }
}

exports.createProfilePostController =async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if(!errors.isEmpty()) {
        req.flash('fail','Account Info Incorrect')
        res.render('pages/dashboard/create_profile.ejs', {
            title: 'Create Profile',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }
    try{ 
        const {
            name,
            title,
            bio,
            website,
            facebook,
            github
        } = req.body
    
        const _id = req.user._id;                                      //if we dont use profile before now it could be used new profile
        await Profile.findOneAndUpdate(                 //acually its a updated
            {user: _id},
            {$set: {
                name,
                title,
                bio,
                links : {
                    website,
                    facebook,
                    github
                }
            }}
            )          
        .then(success => {
            return res.render('pages/dashboard/dashboard.ejs', { title : 'My Dashboard ', flashMessage : Flash.getMessage(req) });
        })
        .catch(e => {
            next(e)
        })
    }catch(e) {
        next(e)
    }
}

exports.editProfileGetController =async (req, res, next) => {
    try{
        const profile =await Profile.findOne({  user: req.user._id });
        if(profile) {
            
            res.render('pages/dashboard/edit_profile.ejs', { title: 'Edit Profile', profile: profile, error:{}, flashMessage : Flash.getMessage(req) } )
        }
        //here should be redirect here to create profile but below its a wrong way 
        res.render('pages/dashboard/create_profile.ejs', { title: 'Create Profile', error:{}, flashMessage : Flash.getMessage(req) } )
    } catch(e) {
        next(e);
    }
}

exports.editProfilePostController =async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if(!errors.isEmpty()) {
        req.flash('fail','Profile Info Incorrect')
        res.render('pages/dashboard/edit_profile.ejs', {
            title: 'Edit Profile',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }
    try{ 
        const profile = {
            name,
            title,
            bio,
            website,
            facebook,
            github
        } = req.body
    
        const _id = req.user._id;                                 
        await Profile.findOneAndUpdate(
            {user: _id},
            {$set:  profile},
            { new:true }
            )          
        .then(success => {
            req.flash('success','Profile Update Successfully !!!!')
            return res.render('pages/dashboard/dashboard.ejs', { title : 'My Dashboard ', flashMessage : Flash.getMessage(req) });
        })
        .catch(e => {
            next(e)
        })
    }catch(e) {
        next(e)
    }
}

exports.bookmarkController = async (req,res,next) => {
    try{
        let profile =await Profile.findOne({ user : req.user._id })
        .populate({
            path : 'bookmarks',
            model : 'Post',
            select : 'title thumbnail'
        })
        // res.status(201).json({
        //     profile
        // })
        return res.render('pages/dashboard/bookmarks',{
            title : 'Bookmarks',
            flashMessage : Flash.getMessage(req),
            posts: profile.bookmarks
        })
    } catch(e) {
        next(e)
    }
}

exports.commentController = async(req,res,next)=>{
    try{
        let profile =await Profile.findOne({ user : req.user._id })
        let comments = await Comment.find({ post : { $in : profile.posts }})
            .populate({
                path : 'post',
                select : 'title'
            })
            .populate({
                path : 'user',
                select : 'username profile_pic'
            })
            .populate({
                path : 'replies.user',
                select : 'username profile_pic'
            })

            return res.render('pages/dashboard/comments',{
                title : ' My Comment Page',
                flashMessage : Flash.getMessage(req),
                comments
            })
        
    } catch(e) {
        next(e)
    }
}

