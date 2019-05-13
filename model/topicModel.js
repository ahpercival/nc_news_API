const connection = require('../db/connection')

const fetchTopicData = () => {
    return connection
        .select('*')
        .from('topics')
}


module.exports = fetchTopicData 