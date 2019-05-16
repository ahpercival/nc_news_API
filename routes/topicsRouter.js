const topicsRouter = require('express').Router();
const { methodNotAllowed } = require('../errors/index');
const getTopicData = require('../controllers/topicController')

topicsRouter
    .route('/')
    .get(getTopicData)
    .all(methodNotAllowed);

module.exports = topicsRouter