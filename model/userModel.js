const connection = require('../db/connection')

const fetchAllUsers = () => {
    return connection
        .select('*')
        .from('users')
}

const addNewUser = (newUser) => {
    return connection('users')
        .insert(newUser)
        .returning('*')
}

const fetchUserByUsername = (username) => {
    return connection
        .select('*')
        .from('users')
        .where('users.username', '=', username)
        .then(([user]) => { return user })
}

module.exports = { fetchUserByUsername, fetchAllUsers, addNewUser }