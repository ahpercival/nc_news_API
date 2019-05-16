const fetchUserByUsername = require('../model/userModel')


const getUserByUsername = (req, res, next) => {
    const { username } = req.params
    fetchUserByUsername(username)
        .then(([user]) => {
            if (!user) { return next({ code: 4043 }) }
            res.status(200).send({ user })
        })
        .catch(next)
}

module.exports = getUserByUsername