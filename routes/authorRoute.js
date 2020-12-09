const route = require('express').Router()

const {  authorGetController } = require('../controllers/authorController')

route.get('/:userId', authorGetController)

module.exports = route