const usersRouter = require('express').Router();
const getUserByUsername = require('../controllers/userController')

usersRouter
    .route('/:username')
    .get(getUserByUsername)


module.exports = usersRouter