const { ApiError } = require('../utils/customErrors');

function errorHandler(err, req, res, next) {
  const isKnown = err instanceof ApiError;
  const status = isKnown ? err.statusCode : 500;
  const message = isKnown ? err.message : 'Internal Server Error';
  const response = {
    success: false,
    message,
  };
  if (isKnown && err.details) {
    response.details = err.details;
  }
  if (!isKnown) {
    console.error('Unhandled error:', err);
  }
  res.status(status).json(response);
}

module.exports = errorHandler;


