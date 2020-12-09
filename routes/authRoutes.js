const router = require('express').Router();
const authController = require('../controllers/authController');
const signupValidation = require('../validator/auth/signupValidator');
const loginValidation = require('../validator/auth/loginValidator');

//middleware
const { isAuthenticated, isUnauthenticated } = require('../middleware/authMiddleware')


router.get('/signup', isUnauthenticated, authController.singupGetController);
router.post('/signup', signupValidation, authController.singupPostController);

router.get('/login', isUnauthenticated, authController.loginGetController);
router.post('/login', loginValidation, authController.loginPostController);

router.get('/changePassword', isAuthenticated, authController.changePasswordGetController);
router.post('/changePassword', isAuthenticated, authController.changePasswordPostController)

router.get('/logout', authController.logoutController);

module.exports = router;


