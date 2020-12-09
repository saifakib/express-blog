const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');


exports.singupGetController = async (req, res, next) => {
    res.render('pages/auth/signup.ejs', {
        title: 'Create User Account',
        error: {}, value: {},
        flashMessage: Flash.getMessage(req)  //here null req
    });
};
exports.singupPostController = async (req, res, next) => {

    const { username, email, password, confirmPassword } = req.body;

    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        req.flash('fail', 'Account get Info invalid !!')
        res.render('pages/auth/signup.ejs',
            {
                title: 'Create User Account',
                error: errors.mapped(),
                value: {
                    username, email, password
                },
                flashMessage: Flash.getMessage(req)
            });
    }


    try {
        const hashPassword = await bcrypt.hash(password, 11);

        let user = new User({
            username,
            email,
            password: hashPassword
        })

        await user.save()
            .then(savedUser => {
                let profile = new Profile({
                    //user : savedUser._id,  not assign its automically defined when user created through Profile model
                    name: savedUser.username,
                    title: 'New User', bio: 'New User',
                    profile_pic: savedUser.profile_pic,
                })
                profile.save()
                    .then(success => {
                        console.log("Also Profile Created")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(error => {
                res.json({ error })
            })

        req.session.isloggedIn = true,
            req.session.user = user,
            req.flash('success', 'User Account Created !!')
        //console.log('user created', createUser);

    } catch (e) {
        next(e)
    }
    // bcrypt.hash(password, 10, (err, hash) => {
    //     if (err) {
    //         console.log(err);
    //         next(err);
    //     } else {
    //         let user = new User({
    //             username,
    //             email,
    //             password: hash
    //         })
    //         user.save()
    //             .then(result => {
    //                 console.log(result);
    //             }).catch(e => {
    //                 console.log(e)
    //                 next(e);
    //             })
    //     }
    // })

    res.render('pages/auth/login.ejs', {
        title: 'Create User Account',
        error: {}, value: {},
        flashMessage: Flash.getMessage(req)
    });
};

exports.loginGetController = (req, res, next) => {
    // let isloggedIn = req.get('Cookie').includes('isloggedIn=true') ? true : false
    // console.log(req.session.isloggedIn, req.session.user);
    res.render('pages/auth/login.ejs', { title: 'User login', error: {}, value: {}, flashMessage: Flash.getMessage(req) });
};
exports.loginPostController = async (req, res, next) => {
    const { email, password } = req.body;


    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        req.flash('fail', 'Account Info invalid !!')
        res.render('pages/auth/login.ejs',
            {
                title: 'User login',
                error: errors.mapped(),
                value: {
                    email, password
                },
                //isloggedIn : false
                flashMessage: Flash.getMessage(req)
            });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // res.json({
            //     message: 'Invalid Credential'
            // })
            req.flash('fail', 'Invalid Creadential')
            res.render('pages/auth/login.ejs', {
                title: 'User login',
                error: {},
                value: {
                    email, password
                },
                flashMessage: Flash.getMessage(req),
            });

        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            // res.json({
            //     message: 'Invalid Credential'
            // })
            req.flash('fail', 'Invalid Creadential')
            res.render('pages/auth/login.ejs', {
                title: 'User login',
                error: {},
                value: {
                    email, password
                },
                flashMessage: Flash.getMessage(req),
            });
        } else {
            req.session.isloggedIn = true,
                req.session.user = user,
                req.flash('success', 'User  login!')
            res.redirect('/dashboard')
        }

        //set session
        // req.session.isloggedIn = true,
        // req.session.user = user
        // req.session.save(err => {
        //     if(err) {
        //         console.log(err)
        //         return next(err)
        //     }
        //     res.redirect('/dashboard')
        // })

        //set cookie
        //res.setHeader('Set-Cookie', 'isloggedIn=true');

        //console.log('login user', user);
        //res.render('pages/auth/login.ejs', { title: 'User login', error: {}, value: {} });

    }
    catch (e) {
        next(e);
    }
};

exports.logoutController = (req, res, next) => {
    req.flash('success', 'Logout!!')
    req.session.destroy(err => {
        if (err) {
            return next(err)
        }
        return res.redirect('/auth/login')
    })
};

exports.changePasswordGetController = async (req, res, next) => {
    res.render('pages/auth/changePassword', {
        title: 'Change Password',
        flashMessage: Flash.getMessage(req)
    });
}

exports.changePasswordPostController = async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body
    if (newPassword !== confirmPassword) {
        req.flash('fail', 'Password mismatch')
        return res.redirect('/auth/changePassword')
    }
    try {

        let match =await bcrypt.compare(currentPassword, req.user.password)
        if (!match) {
            req.flash('fail', 'Invalid Password')
            return res.redirect('/auth/changePassword')
        }
        let hash =await bcrypt.hash(newPassword, 10)
        await User.findOneAndUpdate(
            { _id : req.user._id },
            { $set : { password : hash} }
        )
        req.flash('success','Password has been updated')
        return res.redirect('/auth/changePassword')

    } catch (e) {
        next(e)
    }
}