const { fetchUserByUsername, fetchAllUsers, addNewUser } = require('../model/userModel')

const getAllUsers = (req, res, next) => {
    fetchAllUsers().then(users => {
        res.status(200).send({ users })
    })
        .catch(next)
}

const postNewUser = (req, res, next) => {
    const { username, avatar_url, name } = req.body
    const newUser = { username, avatar_url, name }
    addNewUser(newUser)
        .then(([user]) => {
            if (!user.username.length || !user.avatar_url.length || !user.name.length) { return next({ code: 4005 }) }
            res.status(201).send({ user })
        })
        .catch(next)
}

const getUserByUsername = (req, res, next) => {
    const { username } = req.params
    fetchUserByUsername(username)
        .then((user) => {
            if (!user) { return next({ code: 4043 }) }
            res.status(200).send({ user })
        })
        .catch(next)
}

module.exports = { getUserByUsername, getAllUsers, postNewUser }