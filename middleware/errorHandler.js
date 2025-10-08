
// detect whether an error is a known, custom-defined one
const { ApiError } = require('../utils/customErrors');


function errorHandler(err, req, res, next) {
  // Check if the error is an instance of ApiError (a known, custom error)
  const isKnown = err instanceof ApiError;
  // Use the error's own statusCode if it's a known error; otherwise default to 500 (Internal Server Error)
  const status = isKnown ? err.statusCode : 500;
  // Uses the error's own message if error is know else default to 500(Internal Server Error)
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


