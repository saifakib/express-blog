const { body } = require('express-validator')
//const cheerio = require('cheerio')
module.exports = [
    body('title')
    .notEmpty().withMessage('Title Can not be Empty')
    .isLength({ min:0 , max: 100 }).withMessage('Title must be under 100 chars')
    .trim()
    ,
    body('body')
    .notEmpty().withMessage('Body can not be empty')
    // .custom(value =>{
    //    let $ = cheerio.load(value)       //when install cheerio package also when use tinymce
    //    let text = $.text();

    //     if(text.length > 5000) {
    //         throw new Error('Body must be under 5000 chars')
    //     }
    // })
    .isLength({ max: 5000 }).withMessage('Body must be under 5000 chars')
    ,
    body('tags')
    .notEmpty().withMessage('Tags can not be empty')
]