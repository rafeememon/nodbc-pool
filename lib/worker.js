var nodbc = require('nodbc');
var Promise = require('bluebird');

var connection = null;

function getConnection(connectionString) {
  if (!connection) {
    connection = Promise.fromNode(function(cb) {
      nodbc.open(connectionString, cb);
    })
    .catch(function(err) {
      console.error(err.stack);
      process.exit(-1);
      throw err;
    });
  }
  return connection;
}

module.exports = function execute(connectionString, query, values, cb) {
  getConnection(connectionString)
  .then(function(cxn) {
    return Promise.fromNode(function(cb2) {
      cxn.execute(query, values, cb2);
    });
  })
  .nodeify(cb);
};
