// routes/middleware.js
// Middleware to protect task routes

module.exports.ensureLogin = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};
