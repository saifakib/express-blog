const authRoute = require('./authRoutes');
const dashboardRoute = require('./dashboardRoute');
const  uploadRoute = require('./uploadRoute');
const postRoute = require('./postRoute');
const apiRoute = require('../api/routes/apiRoutes');
const explorerRoute = require('../routes/explorerRoute')
const searchRoute = require('./searchRoute')
const authorRoute = require('./authorRoute')


const routes = [
    {
        path: '/auth',
        handler: authRoute
    },
    {
        path: '/uploads',
        handler: uploadRoute
    },
    {
        path: '/dashboard',
        handler: dashboardRoute
    },
    {
        path: '/post',
        handler: postRoute
    },
    {
        path: '/api',
        handler: apiRoute
    },
    {
        path: '/explorer',
        handler: explorerRoute
    },
    {
        path: '/search',
        handler: searchRoute
    },
    {
        path: '/author',
        handler: authorRoute
    },
    {
        path: '/',
        handler: (req, res) => {
            res.redirect('/explorer')
        }
    }
    // {
    //     path: '*',
    //     handler: (req, res) => {
    //         res.render('error/404.ejs', {  title : '404 Not Found', flashMessage: Flash.getMessage(req)})
    //     }
    // }
]

module.exports = server => {
    routes.forEach(r => {
        if (r.path === '/') {
            server.get(r.path, r.handler)
        } else {
            server.use(r.path, r.handler)
        }
    })
}