const Post = require('../models/Post')
const Profile = require('../models/Profile')
const Flash = require('../utils/Flash')

exports.searchPostGetController = async (req, res, next) => {
    let { term } = req.query
    let currentPage = parseInt(req.query.page) || 1
    let itemPage = 1

    try {
        let posts = await Post.find({
             $text : {
                $search : term
            }
        })
        .skip( (currentPage * itemPage ) - itemPage )
        .limit( itemPage )
        
        let totalPost =await Post.countDocuments({
            $text : {
                $search : term
            }
        })
        let totalPage = totalPost / itemPage

        let bookmarks = []
        if(req.user) {
            let profile =await Profile.findOne({ user : req.user._id })
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }
        
        return res.render('pages/explorer/searchPost', {
            title : `Result for ${term} `,
            searchTerm : term,
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