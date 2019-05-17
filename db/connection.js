const dbConfig = process.env.PORT ? process.env.PORT : require('../knexfile');

module.exports = require('knex')(dbConfig);
