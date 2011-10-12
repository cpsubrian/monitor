var cluster = require('cluster');
var conf = require('../conf');

var Server = module.exports = function() {
  this.app = cluster('../lib/app')
    .set('workers', 1)
    .use(cluster.logger('logs'))
    .use(cluster.stats())
    .use(cluster.pidfiles('pids'))
    .use(cluster.cli())
    .use(cluster.reload('../'));
}
Server.prototype.start = function() {
  this.app.listen(conf.port);
}

// Only listen on '$ node server.js'
if (!module.parent) {
  var server = new Server();
  console.log('Starting cluster server on port ' + conf.port);
  server.start();
}
