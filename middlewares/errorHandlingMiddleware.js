const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
  
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.BUILD_MODE === "dev" ? err.stack : null
    })
  
    next()
  }
  
  module.exports = errorHandler