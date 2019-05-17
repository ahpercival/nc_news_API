const connection = require('../db/connection')

const fetchTopicData = () => {
    return connection
        .select('*')
        .from('topics')
}

const addNewTopic = (newTopic) => {
    return connection('topics')
        .insert(newTopic)
        .returning('*')
}


module.exports = { fetchTopicData, addNewTopic } 