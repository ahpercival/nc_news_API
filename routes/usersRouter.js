const usersRouter = require('express').Router();
const { methodNotAllowed } = require('../errors/index');
const getUserByUsername = require('../controllers/userController')

usersRouter
    .route('/:username')
    .get(getUserByUsername)
    .all(methodNotAllowed);


module.exports = usersRouter