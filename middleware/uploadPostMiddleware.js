const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination : (req, file , cb) => {
        cb(null, 'public/uploads')
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
    }
})

const  upload = multer({
    storage : storage,
    limits:{
        fileSize: 1024*1024*5
    },
    fileFilter: (req,file,cb)=>{
        const types = /jpeg|jpg|png|gif/;
        const extname = types.test(path.extname(file.originalname));
        const mintype = types.test(file.mimetype);
        if(extname && mintype) {
            cb(null,true)
        } else{
            cb(new Error('Only Support Images'))
        }
    }
})

module.exports = upload;