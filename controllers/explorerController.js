const moment = require('moment')
const Flash = require('../utils/Flash')
const Post = require('../models/Post')
const Profile = require('../models/Profile')

function genDate(days) {
    let date = moment().subtract(days,'days')
    return date.toDate()
}
function generateFileObj(filter) {
    let fileObj = {}
    let order = 1

    switch(filter) {
        case 'week' : {
            fileObj = {
                createdAt : {
                    $gt : genDate(7)
                }
            }
            order = -1
            break
        }
        case 'month' : {
            fileObj = {
                createdAt : {
                    $gt : genDate(30)
                }
            }
            order = -1
            break
        }
        case 'all' : {
            order = -1
            break
        }
    }
    return {
        fileObj,
        order
    }
}

exports.explorerGetController = async(req , res, next) => {
    let filter = req.query.filter || 'latest'
    let { fileObj, order  } = generateFileObj(filter.toLowerCase())
    let currentPage = parseInt(req.query.page)  || 1
    let itemPage = 6
    try{
        let posts =await Post.find(fileObj)
            .populate('author','username')
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            .skip(( currentPage * itemPage ) - itemPage )
            .limit(itemPage)

        let totalPosts = await Post.countDocuments()
        let totalPage = totalPosts / itemPage

        let bookmarks = []
        if(req.user) {
            let profile =await Profile.findOne({ user : req.user._id })
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/explorer', {
            title : 'Explore Posts',
            filter,
            posts,
            currentPage,
            totalPage,
            bookmarks,
            flashMessage : Flash.getMessage(req) 
        })
    } catch(e) {
        next(e)
    }
}

exports.singlePostGetController = async (req,res,next) => {
    let { postId } = req.params
    try {
        let post =await Post.findById(postId)
        .populate('author','username profile_pic')
        .populate({
            path : 'comments',
            populate : {
                path : 'user',
                select : 'username profile_pic'
            }
        })
        .populate({
            path : 'comments',
            populate : {
                path : 'replies.user',
                select : 'username profile_pic'
            }
        })
        
        if (!post) {
            let error = new Error('404 page not found')
            error.status = 404
            throw error
        }
        let bookmarks = []
        if(req.user) {
            let profile =await Profile.findOne({ user : req.user._id })
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }
        res.render('pages/explorer/singlePage', {
            title : post.title,
            post,
            bookmarks,
            flashMessage : Flash.getMessage(req) 
        })

    } catch(e) {
        next(e)
    }
}