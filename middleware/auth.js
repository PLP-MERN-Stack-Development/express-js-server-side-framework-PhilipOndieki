const { UnauthorizedError } = require('../utils/customErrors');

function auth(req, res, next) {
  const providedKey = req.header('x-api-key');
  const validKey = process.env.API_KEY;

  if (!validKey) {
    return next(new UnauthorizedError('API key is not configured'));
  }
  if (!providedKey || providedKey !== validKey) {
    return next(new UnauthorizedError('Invalid or missing API key'));
  }
  next();
}

module.exports = auth;


