const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware')
const postValidator = require('../validator/dashboard/post/postValidator')
const upload = require('../middleware/uploadPostMiddleware');

const {
    getAllPost,
    createPostController,
    createPostPostController,
    editPostupdateGetController,
    editPostupdatePostController,
    deletePostController
} = require('../controllers/postController')


//-----> Post Start <------//
router.get('/', isAuthenticated, getAllPost);
router.get('/:id');
router.get('/create', isAuthenticated, createPostController);
router.post('/create', isAuthenticated, upload.single('post-thumnail'), postValidator, createPostPostController);

router.get('/update/:postId', isAuthenticated, postValidator, editPostupdateGetController);
router.post('/update/:postId', isAuthenticated, upload.single('post-thumnail'), postValidator, editPostupdatePostController);

router.get('/delete/:postId', isAuthenticated, deletePostController)

//-----> Post End <------//

module.exports = router;