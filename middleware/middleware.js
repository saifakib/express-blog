const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var flash = require('connect-flash');
const path = require('path');


//IMPORT MIDDLEWARE
const { bindUserWithRequest } = require('./authMiddleware');
const setlocals = require('./setLocals');

const MONGODB_URI = 'mongodb://localhost:27017/test'
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    expires  : 1000 * 60 * 60 * 2
})

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET',
        resave: false,
        saveUninitialized: false,
        // cookie: {
        //     maxAge: 60 * 60 * 2 * 1000
        // },
        store: store,
    }),
    flash(),
    bindUserWithRequest(),
    setlocals()
]

module.exports = server => {
    middleware.forEach(m => {
        server.use(m)
    })
}