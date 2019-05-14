const fetchAllArticles = require('../model/articleModel')

const getAllArticles = (req, res, next) => {
    const { sort_by, order } = req.query
    // const orderBy = ['desc', 'asc']

    // if (!orderBy.includes(order)) { return next({ code: 4001 }) }

    fetchAllArticles(sort_by, order)
        .then(articles => {
            res.status(200).send({ articles })
        })
        .catch(next)
}

module.exports = getAllArticles