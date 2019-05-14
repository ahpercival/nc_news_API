const connection = require('../db/connection')

const fetchAllArticles = (sort_by, order, author) => {
    return connection
        .select('articles.author', 'title', 'articles.article_id', 'topic', 'articles.created_at', 'articles.votes')
        .from('articles')
        .count({ comment_count: 'comments.article_id' })
        .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
        .groupBy('articles.article_id')
        .orderBy(sort_by || 'articles.created_at', order || 'desc')
        .modify(query => { if (author) { query.where('articles.author', author) } })
}

module.exports = fetchAllArticles
