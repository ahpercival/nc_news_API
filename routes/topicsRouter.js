const topicsRouter = require('express').Router();
const { methodNotAllowed } = require('../errors/index');
const { getTopicData, postNewTopic } = require('../controllers/topicController')

topicsRouter
    .route('/')
    .get(getTopicData)
    .post(postNewTopic)
    .all(methodNotAllowed);

module.exports = topicsRouter