const Profile = require('../../models/Profile')

exports.bookmarksGetController = async(req, res, next) => {
    const { postId } = req.params
    let bookmarks = null
    if (!req.user) {
        return res.status(403).json({
            error: 'Your are not authenticate User'
        })
    }
    const userId = req.user._id
    try{
        const profile =await Profile.findOne({ user : userId })
        if(profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate(
                { user : userId },
                { $pull : { 'bookmarks' : postId }}
            )
            bookmark = false
        } else {
            await Profile.findOneAndUpdate(
                { user : userId },
                { $push : { 'bookmarks' : postId }}
            )
            bookmark = true
        }
        return res.status(200).json({
            bookmark
        })
    }catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}