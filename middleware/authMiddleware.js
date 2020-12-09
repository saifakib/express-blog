const User = require('../models/User');

exports.bindUserWithRequest = () => {
    return async (req, res, next ) => {
        if( !req.session.isloggedIn ) {
            console.log('req.session.isloggedin not defined')
            return next()
        }

        try {
            let user = await User.findById(req.session.user._id);
            req.user = user;
            next();

        } catch(e) {
            next(e)
        }
    }
}

 exports.isAuthenticated = (req, res, next) => {
     if(!req.session.isloggedIn) {
         return res.redirect('/auth/login')
     }
     next()
 }


 exports.isUnauthenticated = (req, res, next) => {
    if(req.session.isloggedIn) {
        return res.redirect('/dashboard')
    }
    next()
}