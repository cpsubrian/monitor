var util = require('util'),
    http = require('http'),
    EventEmitter = require('events').EventEmitter;

/**
 * Server model.
 */
var Server = module.exports = function(host) {
  EventEmitter.call(this);
  
  var server = this;
  var statusCode = 0;
  var timer = {
    start: 0,
    end: 0
  };
  
  /**
   * Start a timer for this host.
   */
  var startTimer = function() {
    timer.start = new Date().getTime();
  };
  
  /**
   * End the timer and calculate the elapsed time.
   */
  var endTimer = function() {
    timer.end = new Date().getTime();
  };
  
  /**
   * Return the elapsed time.
   */
  server.getElapsed = function() {
    return timer.end - timer.start;
  };
  
  /**
   * Return the status of the last ping.
   */
  server.getStatusCode = function(){
    return statusCode;
  };
  
  /**
   * 'Ping' a server by making an http request to the hostname.
   */
  server.ping = function() {
    startTimer();
    http.get({host: host, port: 80, path: '/'}, function(res) {
      endTimer();
      statusCode = res.statusCode;
      server.emit('ping');
    });
  };
  
  /**
   * Return information about the server and it's last ping response.
   */
  server.toString = function() {
    return host + ' - ' + server.getStatusCode() + ' - ' + server.getElapsed() + 'ms';
  };
  
};

// Server extends EventEmitter.
util.inherits(Server, EventEmitter);
