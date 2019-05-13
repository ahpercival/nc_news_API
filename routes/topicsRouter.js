const topicsRouter = require('express').Router();
const getTopicData = require('../controllers/topicController')

topicsRouter
    .route('/')
    .get(getTopicData)

module.exports = topicsRouter