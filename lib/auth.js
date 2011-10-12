/**
 * Express middleware to check authentication.
 */
module.exports = {
  middleware: function() {
    return function(req, res, next) {
      if ((req.url == '/login') || (req.session && req.session.user)) {
        next(); 
      }
      else {
        res.redirect('/login');
      }
    }
  }
};