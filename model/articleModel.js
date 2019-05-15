const connection = require('../db/connection')

const fetchAllArticles = (sort_by, order, author, topic) => {
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
}

const fetchArticleById = (article_id) => {

    return connection
        .select('articles.*')
        .from('articles')
        .count({ comment_count: 'comments.article_id' })
        .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', '=', article_id)

}

const updateVoteByArticleID = (article_id, inc_vote_by = 0) => {
    return connection('articles')
        .where('articles.article_id', '=', article_id)
        .increment('votes', inc_vote_by)
        .returning('*')

}

const fetchArticleCommentsById = (article_id, sort_by, order) => {
    return connection
        .select('*')
        .from('comments')
        .where('comments.article_id', '=', article_id)
        .orderBy(sort_by || 'comments.created_at', order || 'desc')
}

const addNewComment = (article_id, username, body) => {
    const newComment = {}
    newComment.author = username
    newComment.body = body
    newComment.article_id = article_id

    return connection('comments')
        .insert(newComment)
        .returning('*')
}

module.exports = { fetchAllArticles, fetchArticleById, updateVoteByArticleID, fetchArticleCommentsById, addNewComment }