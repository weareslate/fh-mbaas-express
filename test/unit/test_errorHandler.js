var util = require('util');
var assert = require('assert');
var proxyquire = require('proxyquire');

function MockMbaasClient(env, obj) {
  this.app = {
    events: {
      create: function(obj, cb) {
        return cb();
      }
    }
  }
}

var eh = proxyquire('errorHandler.js', { 'fh-mbaas-client': MockMbaasClient});

exports.it_should_not_attempt_process_exit = function(finish) {
  var originalExit = process.exit;
  var exitCalled = false;

  var res = {
    end: function(){
      setTimeout(function(){
        process.exit = originalExit;
        assert.equal(exitCalled, false);
        finish();
      }, 1000);
    }
  };

  process.exit = function() {
    exitCalled = true;
  };

  // Mimic this being called by express core itself
  eh.errorHandler()({msg: 'test error(pe)'}, {}, res);
};

exports.it_should_attempt_process_exit = function (finish) {

  var originalExit = process.exit;
  var exitCalled = false;

  // If this is called test is a success
  process.exit = function() {
    exitCalled = true;
  };

  // Mimic call by the uncaughtException handler
  eh.handleUncaughtException({msg: 'test error(ex)'});
  setTimeout(function(){
    assert.equal(exitCalled, true);
    process.exit = originalExit;
    finish();
  }, 1000);
};
