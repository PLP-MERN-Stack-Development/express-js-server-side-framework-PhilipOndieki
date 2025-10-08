
// The logger middleware function logs request details and how long they take to complete
function logger(req, res, next) {
  // Record the high-resolution start time (in nanoseconds)
  const start = process.hrtime.bigint();

  // When the response finishes sending to the client, execute this callback
  res.on('finish', () => {
    // Calculate duration: current time - start time, then convert from nanoseconds to milliseconds
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    // Log the request method (GET, POST, etc.), URL, status code, and duration
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs.toFixed(1)}ms`
    );
  });

  // Pass control to the next middleware or route handler
  next();
}

// Export the logger function so it can be used in other parts of the app (e.g., app.use(logger))
module.exports = logger;
