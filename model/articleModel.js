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

const updateVoteByArticleID = (article_id, inc_votes = 0) => {
    return connection('articles')
        .where('articles.article_id', '=', article_id)
        .increment('votes', inc_votes)
        .returning('*')

}

const fetchArticleCommentsById = (article_id, sort_by, order) => {
    return connection
        .select('comments.comment_id', 'comments.votes', 'comments.created_at', 'comments.author', 'comments.body')
        .from('comments')
        .where('comments.article_id', '=', article_id)
        .orderBy(sort_by || 'comments.created_at', order || 'desc')
}

const addNewComment = (newComment) => {
    return connection('comments')
        .insert(newComment)
        .returning('*')
}

module.exports = {
    fetchAllArticles,
    fetchArticleById,
    updateVoteByArticleID,
    fetchArticleCommentsById,
    addNewComment
}