const { body } = require('express-validator');
const validator = require('validator')

const linkValidator = value => {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error('Please Provide a valid Url')
        }
    }
    return true
}

module.exports = [
    body('name')
        .notEmpty().withMessage('Name Can not be Empty')
        .isLength({ max: 50 }).withMessage('Name can not be more than 50 Chars')
        .trim()
    ,
    body('title')
        .notEmpty().withMessage('Title Can not be Empty')
        .isLength({ max: 100 }).withMessage('Title can not be more than 100 Chars')
        .trim()
    ,
    body('bio')
        .notEmpty().withMessage('Bio Can not be Empty')
        .isLength({ max: 500 }).withMessage('Bio can not be more than 500 Chars')
        .trim()
    ,
    body('website')
        .custom(linkValidator)
    ,
    body('facebook')
        .custom(linkValidator)
    ,
    body('github')
        .custom(linkValidator)
]