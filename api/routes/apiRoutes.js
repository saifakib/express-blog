const route = require('express').Router();
const { isAuthenticated } = require('../../middleware/authMiddleware')

const {
    commentPostController,
    replayCommentPostController
} = require('../controllers/commentController')

const {
    dislikeGetController,
    likeGetController
} = require('../controllers/likedislikeController')

const { bookmarksGetController } = require('../controllers/bookmarksController')

route.post('/:postId/comment', isAuthenticated, commentPostController)
route.post('/comment/:commentId/replies', isAuthenticated, replayCommentPostController)

route.get('/likes/:postId', isAuthenticated, likeGetController)
route.get('/dislikes/:postId', isAuthenticated, dislikeGetController)

route.get('/bookmarks/:postId', isAuthenticated, bookmarksGetController)

module.exports = route