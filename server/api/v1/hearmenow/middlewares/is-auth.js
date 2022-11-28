const jwt = require("jsonwebtoken");
const { ERROR_CODES, COOKIES, STATUS } = require("../constants");
const User = require("../user/user.model");

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  const token = req.cookies[COOKIES.AUTH];
  if (!token) {
    const error = new Error("Not Authenticated");
    error.status = 401;
    error.code = ERROR_CODES.NOT_AUTHENTICATED;
    return next(error);
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  } catch (error) {
    error.status = 401;
    error.code = ERROR_CODES.NOT_AUTHENTICATED;
    return next(error);
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.status = 401;
    error.code = ERROR_CODES.NOT_AUTHENTICATED;
    return next(error);
  }
  req.userId = decodedToken.userId;
  req.authType = decodedToken.authorType;

  try{
    const user = await User.findById(req.userId).exec()
    if (user.status === STATUS.BANNED) {
      const err = new Error("User account is banned");
      err.status = 403;
      err.code = ERROR_CODES.NOT_AUTHENTICATED;
      return next(err);
    }
    req.user = user;
  }
  catch(error){
    error.status = 401;
    error.code = ERROR_CODES.NOT_AUTHENTICATED;
    return next(error);
  }

  next();
};
