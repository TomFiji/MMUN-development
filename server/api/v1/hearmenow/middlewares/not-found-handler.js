const { ERROR_CODES } = require("../constants");

module.exports = ( req, res, next) => {
    const error = new Error("Page Not Found")
    error.status = 404;
    error.code = ERROR_CODES.NOT_FOUND
    throw error
  }