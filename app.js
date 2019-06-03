const express = require('express');
const apiRouter = require('./routes/api');
const { routeNotFound, handlePsqlErrors, handle400Errors, handle404Errors, handle500 } = require('./errors');
const cors = require('cors')


const app = express();
app.use(cors())

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(handlePsqlErrors);

app.use(handle400Errors);

app.use(handle404Errors);

app.use(handle500);

module.exports = app;
