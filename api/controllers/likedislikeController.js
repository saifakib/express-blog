const Post = require('../../models//Post')

exports.likeGetController = async (req, res, next) => {
    const { postId } = req.params
    let liked = null
    if (!req.user) {
        return res.status(403).json({
            error: 'Your are not authenticate User'
        })
    }
    const userId = req.user._id
    try {
        let post =await Post.findById(postId)
        if (post.dislikes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'dislikes': userId }},
                { new: true, useFindAndModify: false, useNewUrlParser: true}
            )
        }
        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'likes': userId } },
                { new: true, useFindAndModify: false, useNewUrlParser: true}
            )
            liked = false
        } else {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { 'likes': userId } },
                { new: true, useFindAndModify: false, useNewUrlParser: true}
            )
            liked = true
        }
        let updatedPost = await Post.findById(postId)
        console.log(updatedPost.likes.length)
        return res.status(200).json({
            liked,
            totalLikes : updatedPost.likes.length,
            totalDislikes : updatedPost.dislikes.length,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}


exports.dislikeGetController = async (req, res, next) => {
    const { postId } = req.params
    let disliked = null
    if (!req.user) {
        return res.status(403).json({
            error: 'Your are not authenticate User'
        })
    }
    const userId = req.user._id
    try {
        let post =await Post.findById(postId)
        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'likes': userId } },
                { new: true, useFindAndModify: false, useNewUrlParser: true}
            )
        }
        if (post.dislikes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'dislikes': userId } },
                { new: true, useFindAndModify: false, useNewUrlParser: true}
            )
            disliked = false
        } else {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { 'dislikes': userId } },
                { new: true, useFindAndModify: false, useNewUrlParser: true}
            )
            disliked = true
        }
        let updatedPost = await Post.findById(postId)
        return res.status(200).json({
            disliked,
            totalLikes : updatedPost.likes.length,
            totalDislikes : updatedPost.dislikes.length,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}