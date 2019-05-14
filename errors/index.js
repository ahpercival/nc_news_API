const errMsg = require('./err-msg')

exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (errMsg.PSQL[err.code]) {
    res.status(400).send({ msg: errMsg.PSQL[err.code] })
  } else next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
  if (errMsg[400][err.code]) {
    res.status(400).send({ msg: errMsg[400][err.code] })
  } else next(err)

}

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
