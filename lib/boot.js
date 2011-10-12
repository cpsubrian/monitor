/**
 * Application bootstrapping.
 */
var express = require('express'),
    fs = require('fs');

/**
 * Perform the bootstrap.
 */
module.exports = function(app) {
  bootFixLessCompiler(app);
  bootConfig(app);
  //bootErrors(app);
  bootHelpers(app);
  bootModels(app);
  bootControllers(app);
  
  // Catch-all 404 handler (Do not add any routes below this).
  //app.get('/*', function(req, res, next) {
  //  next(new ErrorNotFound('Page not found.'));
  //});
}

/**
 * Configuration.
 */
function bootConfig(app) {  
  // Defaults.
  app.configure(function(){
    // Load conf.
    app.conf = require('../conf.js');
    
    // Configure express server.
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'html');
    app.register(".html", require("jqtpl").express);
    app.use(express.compiler({ src: __dirname + '/../public', enable: ['less'] }));
    app.use(express.static(__dirname + '/../public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: app.conf.session.secret }));
    
    // Restrict access to only logged-in users.
    app.use(require('./auth').middleware());
  });

  // Developement.
  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });
  
  // Tests.
  app.configure('test', function(){
    app.use(express.errorHandler());
  });
  
  // Production.
  app.configure('production', function(){
    app.use(express.errorHandler()); 
  });
}

/**
 * Setup error handlers.
 */
function bootErrors(app) {
  require('./errors.js')(app);
}

/**
 * Setup static and dynamic helpers.
 */
function bootHelpers(app) {
  require('./helpers.js')(app);
}

/**
 * Load Models.
 */
function bootModels(app) {
  app.models = {};
  fs.readdir(__dirname + '/../models', function(err, files){
    if (err) throw err;
    files.forEach(function(file){
      if (file.indexOf('.js') > 0) {
        bootModel(app, file);
      }
    });
  });
}
function bootModel(app, file) {
  var name = file.replace('.js', ''),
      model = require(__dirname + '/../models/'+ name);
      
  // Store the model for reference throughout the app.
  app.models[name] = model;
}

/**
 * Load Controllers.
 */
function bootControllers(app) {
  app.controllers = {};
  fs.readdir(__dirname + '/../controllers', function(err, files){
    if (err) throw err;
    files.forEach(function(file){
      if (file.indexOf('.js') > 0) {
        bootController(app, file);
      }
    });
  });
}
function bootController(app, file) {
  var name = file.replace('.js', ''),
      Controller = require(__dirname + '/../controllers/'+ name);
  
  // Since we only one want instance of each contorller, we just create it here.
  app.controllers[name] = new Controller(app);
}

/**
 * Fix LESS compiler so it renders with the path relative to /public/css.
 */
function bootFixLessCompiler(app) {
   var cache = {};
   express.compiler.compilers.less.compile = function(str, fn) {
    if (!cache.less) {
      cache.less = require('less');
      var origRender = cache.less.render;
      cache.less.render = function(str, options, fn) {
        if (typeof(options) === 'function') {
          fn = options;
          options = { paths: [__dirname + '/../public/css'] };
        }
        return origRender.call(this, str, options, fn);
      };
    }
    var less = cache.less;
    try {
      less.render(str, fn);
    } catch (err) {
      fn(err);
    }
  }; 
}

