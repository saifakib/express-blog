const multer = require('multer');
const path = require('path');


const uploadProfileMiddleware = multer({
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter : (req, file, cb) => {
        const types = /jpeg|jpg|png|gif/;
        const extname = types.test(path.extname(file.originalname).toLowerCase());
        const mimetype = types.test(file.mimetype);

        if(extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only Support Images'))
        }
    }
})

module.exports = uploadProfileMiddleware;