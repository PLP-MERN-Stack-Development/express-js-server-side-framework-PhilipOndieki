const { ValidationError, BadRequestError } = require('../utils/customErrors');

function validateCreate(req, res, next) {
  const { name, price, category, description, inStock } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(new ValidationError('Field "name" must be a string with length >= 2'));
  }
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return next(new ValidationError('Field "price" must be a non-negative number'));
  }
  if (!category || typeof category !== 'string') {
    return next(new ValidationError('Field "category" is required'));
  }
  if (description !== undefined && typeof description !== 'string') {
    return next(new ValidationError('Field "description" must be a string'));
  }
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    return next(new ValidationError('Field "inStock" must be a boolean'));
  }
  next();
}

function validateUpdate(req, res, next) {
  const allowed = ['name', 'description', 'price', 'category', 'inStock'];
  const keys = Object.keys(req.body || {});
  if (keys.length === 0) {
    return next(new BadRequestError('Request body is empty'));
  }
  for (const key of keys) {
    if (!allowed.includes(key)) {
      return next(new BadRequestError(`Unknown field: ${key}`));
    }
  }
  if (req.body.name && (typeof req.body.name !== 'string' || req.body.name.trim().length < 2)) {
    return next(new ValidationError('Field "name" must be a string with length >= 2'));
  }
  if (req.body.price !== undefined && (typeof req.body.price !== 'number' || req.body.price < 0)) {
    return next(new ValidationError('Field "price" must be a non-negative number'));
  }
  if (req.body.category && typeof req.body.category !== 'string') {
    return next(new ValidationError('Field "category" must be a string'));
  }
  if (req.body.description !== undefined && typeof req.body.description !== 'string') {
    return next(new ValidationError('Field "description" must be a string'));
  }
  if (req.body.inStock !== undefined && typeof req.body.inStock !== 'boolean') {
    return next(new ValidationError('Field "inStock" must be a boolean'));
  }
  next();
}

module.exports = {
  validateCreate,
  validateUpdate,
};


