const { articleData, commentData, topicData, userData } = require('../data');
const { convertTimeStamp, createRef, renameKeys, formatPairs } = require('../../utils/seeding-functions')

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topicData)
        .returning('*')
    })
    .then(() => {
      return knex('users')
        .insert(userData)
        .returning('*')
    })
    .then(() => {
      return knex('articles')
        .insert(convertTimeStamp(articleData))
        .returning('*')
    })
    .then((articleRows) => {
      const articleLookUp = createRef(articleRows, 'title', 'article_id')
      const commentTimeStampAmended = convertTimeStamp(commentData)
      const updateArticleKey = renameKeys(commentTimeStampAmended, 'belongs_to', 'article_id')
      const updateArticleValue = formatPairs(updateArticleKey, articleLookUp)
      const updatedAuthorKey = renameKeys(updateArticleValue, 'created_by', 'author')
      return knex('comments')
        .insert(updatedAuthorKey)
        .returning('*')
    })

};
