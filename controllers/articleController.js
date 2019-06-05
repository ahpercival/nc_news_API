const {
    fetchAllArticles,
    fetchArticleById,
    updateVoteByArticleID,
    fetchArticleCommentsById,
    addNewComment,
    addNewArticle,
    removeArticleById,
    countTotalArticles
} = require('../model/articleModel')

const getAllArticles = (req, res, next) => {
    const orderBy = ['desc', 'asc']
    const { sort_by, order, author, topic, limit, p } = req.query

    if (order && !orderBy.includes(order)) { return next({ code: 4001 }) }
    Promise.all([countTotalArticles(), fetchAllArticles(sort_by, order, author, topic, limit, p)])
        .then(([total_count, articles]) => {
            if (!articles.length) { return next({ code: 4041 }) }
            res.status(200).send({ total_count, articles })
        })
        .catch(next)
}

const getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id)
        .then(article => {
            if (!article) { return next({ code: 4041 }) }
            res.status(200).send({ article })
        })
        .catch(next)
}

const patchVoteByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    updateVoteByArticleID(article_id, inc_votes)
        .then((article) => {
            if (!article.article) { return next({ code: 4002 }) }
            res.status(200).send(article)
        })
        .catch(next)
}

const getArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params
    const { sort_by, order, limit, p } = req.query
    fetchArticleCommentsById(article_id, sort_by, order, limit, p)
        .then(comments => {
            res.status(200).send({ comments })
        })
        .catch(next)
}

const postNewComment = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    const author = username
    const newComment = { author, body, article_id }

    addNewComment(newComment)
        .then(([comment]) => {
            if (!comment.body.length) { return Promise.reject({ code: 4003 }) }
            res.status(201).send({ comment })
        })
        .catch(next)
}

const postNewArticle = (req, res, next) => {
    const { author, title, body, topic } = req.body
    const newArticle = { author, title, body, topic }
    addNewArticle(newArticle)
        .then(([article]) => {
            res.status(201).send({ article })
        })
        .catch(next)
}

const deleteArticleById = (req, res, next) => {
    const { article_id } = req.params
    removeArticleById(article_id)
        .then((result) => {
            if (!result) { return next({ code: 4041 }) }
            res.status(204).send()
        })
        .catch(next)
}

module.exports = {
    getAllArticles,
    getArticleById,
    patchVoteByArticleId,
    getArticleCommentsById,
    postNewComment,
    postNewArticle,
    deleteArticleById
}