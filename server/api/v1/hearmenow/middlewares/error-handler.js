const { ERROR_CODES } = require("../constants");

module.exports = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      code: err.code || ERROR_CODES.UNEXPECTED_ERROR,
    },
  });
};
