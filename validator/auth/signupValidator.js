const { body } = require('express-validator');
const User = require('../../models/User');

module.exports = [
    body('username')
        .isLength({
            min: 2,
            max: 15
        }).withMessage('Username must be between 2 to 15 chars')
        .custom(async username => {
            let user = await User.findOne({ username })
            if (user) {
                return Promise.reject(`${username} allready used`);
            }
            return true
        })
        .trim()
    ,
    body('email')
        .notEmpty().withMessage('Please provide a valid email')
        .custom(async email => {
            let user = await User.findOne({ email })
            if (user) {
                return Promise.reject('Email allready used');
            }
            //return true
        })
        .normalizeEmail()
    ,
    body('password')
        .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
    ,
    body('confirmPassword')
        .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
        .custom((confirmpassword, { req }) => {
            if (confirmpassword !== req.body.password) {
                throw new Error('Password does not match');
            }
            return true
        })

]