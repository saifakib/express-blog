const route = require('express').Router()
const { searchPostGetController } = require('../controllers/searchController')

route.get('/', searchPostGetController)

module.exports = route