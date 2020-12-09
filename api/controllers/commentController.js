const Post = require('../../models/Post')
const Comment = require('../../models/Comment')

exports.commentPostController = async(req, res, next) => {
    const { postId } = req.params
    const { body } = req.body
    
    if(!req.user) {
        return res.status(403).json({
            error : 'Your are not authenticate User'
        })
    }
    let comment = new Comment({
        post : postId,
        user : req.user._id,
        body,
        replies : []
    })
    try{
        let createComment = await comment.save()
        await Post.findByIdAndUpdate(
            { _id : postId },
            {$push : { 'comments' : createComment._id}}
        )
        let commentJSON = await Comment.findById(createComment._id).populate({
            path : 'user',
            select : 'profile_pic username'
        })
        
        return res.status(201).json(commentJSON)
    }catch(err) {
        console.log(err)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}

exports.replayCommentPostController = async(req, res,next) => {
    const { commentId } = req.params
    const { body } = req.body
    
    if(!req.user) {
        return res.status(403).json({
            error : 'Your are not authenticate User'
        })
    }
    let reply = {
        body,
        user : req.user._id
    }
    try{
        await Comment.findByIdAndUpdate(
            { _id : commentId},
            {$push : { 'replies' : reply }}
        )
        res.status(201).json({
            ...reply,
            profilePics : req.user.profile_pic
        })
    }catch(err) {
        console.log(err)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}