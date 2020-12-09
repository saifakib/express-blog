require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');
const Flash = require('./utils/Flash');

const server = express();

const setRoutes = require('./routes/routes');
const setMiddleware = require('./middleware/middleware');


// DB_USERNAME  = process.env.DB_USERNAME;
// DB_PASSWORD = process.env.DB_PASSWORD;
// const MLap = `mongodb://${DB_USERNAME}:${config.get('db_password')}@ds221003.mlab.com:21003/practiseexpress`;
//const MONGODB_URI = 'mongodb://saif:akibfci86@ds221003.mlab.com:21003/practiseexpress';   //Mlab
const MONGODB_URI = 'mongodb://localhost:27017/test'

//view setup
server.set('view engine', 'ejs')
server.set('views', 'views')

//config 
console.log(config.get('contact.phone'));



// console.log(process.env.NODE_ENV)   //show envirnment
// console.log(server.get('env'));
// if(server.get('env').toLowerCase() === 'development') {
//     server.use(morgan('dev'))
// }

setMiddleware(server);
setRoutes(server);


//404 error get('*');
server.use((req, res, next) => {
    let error = new Error('404 Not Found')
    error.status = 404
    next(error)
})

//Error handler
server.use((error, req, res, next) => {
    if(error.status === 404) {
        res.render('error/404.ejs', {  title : '404 Page Not Found', flashMessage: Flash.getMessage(req)})
    } else {
        console.log(error);
        res.render('error/500.ejs', {  title : '500 Internal  Server Error', flashMessage: Flash.getMessage(req)})
    }
})

const PORT = process.env.PORT || 4000;

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(chalk.blue.bold('Server running on this ') +  chalk.red(`${PORT}`));
        })
    })
    .catch(e => {
        console.log(e)
    })
