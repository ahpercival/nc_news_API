const connection = require('../db/connection')

const fetchAllArticles = () => {
    return connection
        .select('articles.author', 'title', 'articles.article_id', 'topic', 'articles.created_at', 'articles.votes')
        .from('articles')
        .count({ comment_count: 'comment_id' })
        .leftJoin('comments', 'articles.article_id', 'comments.comment_id')
        .groupBy('articles.article_id');
}

module.exports = fetchAllArticles