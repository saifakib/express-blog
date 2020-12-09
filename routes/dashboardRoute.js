const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware')
const Flash = require('../utils/Flash');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const profileValidator = require('../validator/dashboard/profileValidator');

const { 
    dashboardController,
    createProfileGetController,
    createProfilePostController,
    editProfilePostController,
    editProfileGetController,
    bookmarkController,
    commentController
} = require('../controllers/dashboardController');



router.get('/bookmarks', isAuthenticated, bookmarkController );
router.get('/comments', isAuthenticated, commentController );

//-----> Profile Start<------//
router.get('/create-profile', isAuthenticated, createProfileGetController);
router.post('/create-profile', isAuthenticated,profileValidator, createProfilePostController);

router.get('/edit-profile', isAuthenticated, editProfileGetController);
router.post('/edit-profile', isAuthenticated, profileValidator, editProfilePostController);
//-----> Profile End <------//


router.get('/uploadTest', isAuthenticated, (req,res,next)=>{
    res.render('pages/dashboard/uploadTest.ejs', {title : 'Uploader Test',flashMessage : Flash.getMessage(req)})
});
router.post('/uploadTest', uploadMiddleware.single('my-file'),(req, res, next) => {
    if(req.file) {
        req.flash('success', 'File Uploaded !!')
        console.log(req.file);
    }
    res.redirect('/dashboard/ uploadTest')
})

router.get('/', isAuthenticated, dashboardController );

module.exports = router;