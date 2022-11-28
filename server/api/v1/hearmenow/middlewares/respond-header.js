module.exports = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin",  req.headers.origin || '*'); // to be updated
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
next();
};
