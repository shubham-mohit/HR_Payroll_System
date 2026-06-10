export const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || err.statuscode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "INTERNAL_SERVER_ERROR",
  });
};
