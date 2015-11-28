var Promise = require('bluebird');
var workerFarm = require('worker-farm');
var extend = require('lodash/object/extend');

var WORKER_PATH = require.resolve('./worker');

var DEFAULT_OPTIONS = {
  maxCallsPerWorker: 10,
  maxConcurrentCallsPerWorker: 1,
  maxCallTime: 10000,
  maxRetries: 5,
  autoStart: false
};

function pool(connectionString, options) {

  var workers = workerFarm(extend({}, DEFAULT_OPTIONS, options), WORKER_PATH);

  function execute(query) {
    var values = Array.prototype.slice.call(arguments, 1);
    return Promise.fromNode(function(cb) {
      workers(connectionString, query, values, cb);
    });
  }

  function end() {
    return Promise.fromNode(function(cb) {
      workers.end(cb);
    });
  }

  return {
    execute: execute,
    end: end
  };

}

module.exports = pool;
