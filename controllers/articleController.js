const fetchAllArticles = require('../model/articleModel')

const getAllArticles = (req, res, next) => {
    fetchAllArticles()
        .then(articles => {
            res.status(200).send({ articles })
        })
        .catch(next)
}

module.exports = getAllArticles