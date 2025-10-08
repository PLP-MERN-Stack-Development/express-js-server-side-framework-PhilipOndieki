// Define a custom base error class that extends the built-in JavaScript Error class
class ApiError extends Error {
  // Constructor accepts statusCode, message, and optional details
  constructor(statusCode, message, details) {
    // Call the parent Error class constructor with the message
    super(message);

    // Assign the HTTP status code (default to 500 if not provided)
    this.statusCode = statusCode || 500;

    // Store any additional error details (optional)
    this.details = details;
  }
}

// Define a NotFoundError for handling 404 Not Found cases
class NotFoundError extends ApiError {
  // Provide a default message, but allow a custom one
  constructor(message = 'Resource not found', details) {
    // Call the base ApiError constructor with a 404 status code
    super(404, message, details);
  }
}

// Define a BadRequestError for invalid or malformed client requests (400)
class BadRequestError extends ApiError {
  constructor(message = 'Bad request', details) {
    // Pass a 400 status code to the base class
    super(400, message, details);
  }
}

// Define an UnauthorizedError for authentication failures (401)
class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', details) {
    // Pass a 401 status code to the base class
    super(401, message, details);
  }
}

// Define a ValidationError for input validation issues (422)
class ValidationError extends ApiError {
  constructor(message = 'Validation failed', details) {
    // Pass a 422 status code to the base class
    super(422, message, details);
  }
}

// Export all error classes so they can be imported and used elsewhere in the application
module.exports = {
  ApiError,          // Base error class
  NotFoundError,     // 404 errors
  BadRequestError,   // 400 errors
  UnauthorizedError, // 401 errors
  ValidationError,   // 422 errors
};
