# nc_news_API

This repo is the backend API for a news app, that allows users to search, read and post articles, as well as leave votes and comments.

This backend has been built with Express, Knex and a PostgreSQL database. It is hosted on Heroko

## Installation

```bash
$ npm install knex, pg, express
```

Create a file in the root called knexfile.js and paste in the following code:

```js
const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfigs = {
  development: {
    connection: {
      database: 'nc_news',
      //username: '',
      //password: '',
    },
  },
  test: {
    connection: {
      database: 'nc_news_test',
      //username: '',
      //password: '',
    },
  },
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };

```

If you are using Linux you will need to un-comment and fill in your username and password in customConfigs.

Testing
```bash
$ npm install mocha, chai, supertest -D
$ npm t
```

Usage
```bash
$ npm run setup-dbs
$ npm run seed
```