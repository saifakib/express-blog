const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const { uploadProfilePicsController, removeProfilePicController, postImageUploadController } = require('../controllers/uploadController');
const uploadProfileMiddleware = require('../middleware/uploadProfileMiddleware');
const upload = require('../middleware/uploadMiddleware');
router.post('/profilePics',  isAuthenticated, uploadProfileMiddleware.single('profilePics'), uploadProfilePicsController);
router.get('/remove/profilePics',isAuthenticated, removeProfilePicController);

router.post('/postImage',isAuthenticated, upload.single('post-image'),postImageUploadController)
module.exports = router;