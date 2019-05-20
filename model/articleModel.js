const connection = require('../db/connection')

const fetchAllArticles = (sort_by, order, author, topic, limit = 10, p = 1) => {
    return connection
        .select('articles.author', 'title', 'articles.article_id', 'topic', 'articles.created_at', 'articles.votes')
        .from('articles')
        .count({ comment_count: 'comments.article_id' })
        .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
        .groupBy('articles.article_id')
        .orderBy(sort_by || 'articles.created_at', order || 'desc')
        .modify(query => {
            if (author) { query.where('articles.author', author) }
            if (topic) { query.where('articles.topic', topic) }
        })
        .limit(limit).offset((p - 1) * limit)
}

const fetchArticleById = (article_id) => {

    return connection
        .select('articles.*')
        .from('articles')
        .count({ comment_count: 'comments.article_id' })
        .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', '=', article_id)
        .then(([article]) => { return article })

}

const updateVoteByArticleID = (article_id, inc_votes = 0) => {
    return connection('articles')
        .where('articles.article_id', '=', article_id)
        .increment('votes', inc_votes)
        .returning('*')
        .then(([value]) => {
            const article = { article: value }
            return article
        })

}

const fetchArticleCommentsById = (article_id, sort_by, order, limit = 10, p = 1) => {
    return connection
        .select('comments.comment_id', 'comments.votes', 'comments.created_at', 'comments.author', 'comments.body')
        .from('comments')
        .where('comments.article_id', '=', article_id)
        .orderBy(sort_by || 'comments.created_at', order || 'desc')
        .limit(limit).offset((p - 1) * limit)
}

const addNewComment = (newComment) => {
    return connection('comments')
        .insert(newComment)
        .returning('*')
}

const addNewArticle = (newArticle) => {
    return connection('articles')
        .insert(newArticle)
        .returning('*')
}

const removeArticleById = (article_id) => {
    return connection('articles')
        .where('articles.article_id', '=', article_id)
        .del()
}

module.exports = {
    fetchAllArticles,
    fetchArticleById,
    updateVoteByArticleID,
    fetchArticleCommentsById,
    addNewComment,
    addNewArticle,
    removeArticleById
}