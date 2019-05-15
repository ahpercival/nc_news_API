const fetchUserByUsername = require('../model/userModel')


const getUserByUsername = (req, res, next) => {
    const { username } = req.params
    fetchUserByUsername(username)
        .then(user => {
            res.status(200).send({ user })
        })
}

module.exports = getUserByUsername