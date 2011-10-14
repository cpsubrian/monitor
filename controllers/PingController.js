var _ = require('underscore');

/**
 * Monitors server uptime by making periodic http requests.
 */
var PingController = module.exports = function(app) {
  this.app = app;
  this.servers = [];
  
  // Bind method scope.
  _.bindAll(this);
  
  this.addServer('www.google.com');
  this.addServer('www.apple.com');
  this.addServer('www.freedomworks.com');
  
  // Set the interval to re-ping the hosts.
  this.pingInterval = setInterval(this.pingAll, 1000 * 10);
  
  // Do a ping right away.
  this.pingAll();
};

/**
 * Methods and properties.
 */
PingController.prototype = {
  
  /**
   * Add a server to be pinged.
   */
  addServer: function(host) {
    var server = new this.app.models.Server(host);
    
    server.on('ping', function() {
      console.log('Pinged: ' + server);
    });
    
    this.servers.push(server);
  },
  
  /**
   * Ping all registered servers.
   */
  pingAll: function() {
    for (var i in this.servers) {
      this.servers[i].ping();
    }
  }
  
};
