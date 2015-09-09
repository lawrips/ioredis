'use strict';

var _ = require('lodash');
var net = require('net');
var tls = require ('tls');

function Connector(options) {
  this.options = options;
}

Connector.prototype.check = function () {
  return true;
};

Connector.prototype.disconnect = function () {
  this.connecting = false;
  if (this.stream) {
    this.stream.end();
  }
};

Connector.prototype.connect = function (callback) {
  this.connecting = true;
  var connectionOptions;
  if (this.options.path) {
    connectionOptions = _.pick(this.options, ['path']);
  } else {
    connectionOptions = _.pick(this.options, ['port', 'host', 'family']);
  }

  var _this = this;
  process.nextTick(function () {
    if (!_this.connecting) {
      callback(new Error('Connection is closed.'));
      return;
    }
    var stream = {};
    
    if (_this.options.tls) {
       stream = tls.connect(_this.options.port, _this.options.host, _this.options.tls);
    }
    else {
        stream = _this.stream = net.createConnection(connectionOptions);
    }
    callback(null, stream);
  });
};

module.exports = Connector;
