const { fetchAllArticles, fetchArticleById } = require('../model/articleModel')

const getAllArticles = (req, res, next) => {
    const orderBy = ['desc', 'asc']
    const { sort_by, order, author, topic } = req.query

    if (order && !orderBy.includes(order)) { return next({ code: 4001 }) }

    fetchAllArticles(sort_by, order, author, topic)
        .then(articles => {
            if (!articles.length) { return next({ code: 4041 }) }
            res.status(200).send({ articles })
        })
        .catch(next)
}

const getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id)
        .then(article => {
            if (!article.length) { return next({ code: 4041 }) }
            res.status(200).send({ article })
        })
        .catch(next)
}

module.exports = { getAllArticles, getArticleById }