const User = require('../models/User');
const Profile = require('../models/Profile');
const Resize = require('../utils/Resize');
const path = require('path');
const fs = require('fs');

exports.uploadProfilePicsController = async (Request, Response, Next) => {

    if (Request.file) {

        console.log('checking filename');
        
        console.log(Request.file);
        const filename = (Request.file.fieldname + '_' + Date.now() + '_' + Request.file.originalname);
        const createPath = path.join('public/uploads/' + filename);
        const dbSavingPath = path.join('/uploads/' + filename);
        const fileUpload = new Resize(createPath);

        const filepath = await fileUpload.save(Request.file.buffer)

        const _id = Request.user._id;
        const profile = await Profile.findOne({ user: _id });
        const profilePics = dbSavingPath;

        if (Request.body.filename == '/images/default.jpeg') {
            try {
                if (profile) {
                    await Profile.findOneAndUpdate(
                        { user: _id },
                        { $set: { profile_pic: profilePics } }
                    )
                }

                await User.findByIdAndUpdate(
                    { _id },
                    { $set: { profile_pic: profilePics } }
                ).then(() => {
                    return Response.redirect('/dashboard/create-profile')
                })

            } catch (e) {
                Response.status(500).json({
                    message: 'Something wrong',
                    ProfilePics: Request.user.profile_pic
                })
            }
        } else {
            try {
                fs.unlink(`public${Request.body.filename}`, async (err) => {
                    await Profile.findOneAndUpdate(
                        { user: _id },
                        { $set: { profile_pic: profilePics } }
                    )

                    await User.findByIdAndUpdate(
                        { _id },
                        { $set: { profile_pic: profilePics } }
                    ).then(() => {
                        return Response.redirect('/dashboard/create-profile')
                    })
                })
            } catch (e) {
                Response.status(500).json({
                    message: 'Something wrong',
                    ProfilePics: Request.user.profile_pic
                })
            }
        }

    } else {
        Response.status(500).json({
            message: 'File does not exits',
            ProfilePics: Request.user.profile_pic
        })
    }
}

exports.removeProfilePicController = (Request, Response, Next) => {
    try {
        let defaultProfilePic = '/images/default.jpeg';
        let presentProfilePic = Request.user.profile_pic;
        const _id = Request.user._id;
        fs.unlink(`public${presentProfilePic}`, async (err) => {
            const profile = await Profile.findOne({ user: _id });
            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: _id },
                    { $set: { profile_pic: defaultProfilePic } }
                )
            }
            await User.findByIdAndUpdate(
                { _id },
                { $set: { profile_pic: defaultProfilePic } }
            ).then(() => {
                return Response.redirect('/dashboard/create-profile')
            })
        })
    } catch (err) {
        Next(err)
    }
}

exports.postImageUploadController = (req,res,next) => {
    if(req.file) {
        return res.status(200).json({
            imageUrl : `/uploads/${req.file.filename}`
        })
    }
    return res.status(500).json({
        message: 'Server Error'
    })
}