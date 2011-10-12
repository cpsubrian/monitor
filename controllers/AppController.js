var app;

/**
 * Application Controller.
 */
var AppController = module.exports = function(_app) {
  app = _app;
  
  // Routes.
  app.get('/', this.index);
  app.get('/login', this.loginForm);
  app.post('/login', this.login);
  app.get('/logout', this.logout);
}

/**
 * Methods and properties.
 */
AppController.prototype = {
  
  /**
   * Index. 
   */
  index: function(req, res) {
    res.render('index');
  },
  
  /**
   * Login page.
   */
  loginForm: function(req, res) {
    if (req.session && req.session.user) {
      res.redirect('/'); 
    }
    else {
      res.render('login', {
        bodyClass: 'narrow'  
      }); 
    }
  },
   
  /**
   * Login POST handler.
   */
  login: function(req, res) {
    if (req.session && req.session.user) {
      res.redirect('/'); 
    }
    else {
      if (req.body.username == app.conf.auth.username) {
        if (req.body.password == app.conf.auth.password) {
          req.session.regenerate(function() {
            req.session.user = true;
            res.redirect('/');
          });
          return;
        }
      }
      
      // There was an error with the login.
      res.render('login', {
        error: 'Bad Username or Password',
        bodyClass: 'narrow'
      });
    }
  },
    
  /**
   * Log the user out.
   */
  logout: function(req, res) {
    if (req.session) {
      req.session.destroy(function() {
        res.redirect('/');
      });
    }
    else {
      res.redirect('/'); 
    }
  }
    
  
};

