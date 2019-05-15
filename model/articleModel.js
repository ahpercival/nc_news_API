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

module.exports = { fetchAllArticles, fetchArticleById, updateVoteByArticleID, fetchArticleCommentsById }