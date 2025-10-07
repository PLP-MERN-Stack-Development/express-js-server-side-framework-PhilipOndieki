class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode || 500;
    this.details = details;
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', details) {
    super(404, message, details);
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad request', details) {
    super(400, message, details);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', details) {
    super(401, message, details);
  }
}

class ValidationError extends ApiError {
  constructor(message = 'Validation failed', details) {
    super(422, message, details);
  }
}

module.exports = {
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ValidationError,
};


