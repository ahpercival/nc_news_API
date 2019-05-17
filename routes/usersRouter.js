const usersRouter = require('express').Router();
const { methodNotAllowed } = require('../errors/index');
const { getUserByUsername, getAllUsers, postNewUser } = require('../controllers/userController')

usersRouter
    .route('/')
    .get(getAllUsers)
    .post(postNewUser)
    .all(methodNotAllowed);

usersRouter
    .route('/:username')
    .get(getUserByUsername)
    .all(methodNotAllowed);


module.exports = usersRouter