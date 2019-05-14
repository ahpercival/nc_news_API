const fetchAllArticles = require('../model/articleModel')

const getAllArticles = (req, res, next) => {
    const orderBy = ['desc', 'asc']
    const { sort_by, order, author } = req.query

    if (order && !orderBy.includes(order)) { return next({ code: 4001 }) }

    fetchAllArticles(sort_by, order, author)
        .then(articles => {
            if (!articles.length) { return next({ code: 4041 }) }
            res.status(200).send({ articles })
        })
        .catch(next)
}

module.exports = getAllArticles