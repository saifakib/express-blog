const Profile = require('../models/Profile')
const Flash = require('../utils/Flash')

exports.authorGetController = async (req, res, next) => {
    const userId = req.params.userId

    try {
        const author = await Profile.findOne(
            { user: userId }
        ).populate('posts')

        let bookmarks = []
        if(req.user) {
            let profile =await Profile.findOne({ user : req.user._id })
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }
        return res.render('pages/explorer/author', {
            title: 'Author Page',
             author,
             bookmarks,
            flashMessage: Flash.getMessage(req)
        })
    } catch (e) {
        next
    }
}