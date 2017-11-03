var authenticate = require('../../lib/common/authenticate');
var assert = require('assert');
var nockValidateKeyCall = require("../fixtures/validate_key_call");

module.exports = {
  "test service access using allowed project id and correct api key": function(finish){
    process.env.FH_SERVICE_APP = 'true';
    process.env.FH_SERVICE_AUTHORISED_PROJECTS = "projectguid1,projectguid2";
    process.env.FH_MILLICORE = "testing.feedhenry.me";
    process.env.FH_ENV = "dev";

    var req = {
      headers: {
        'x-request-with': "projectguid2",
        'x-fh-auth-app': "rightkey"
      }
    };

    authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){
      assert.ok(!err, "Expected No Error " + err);

      //Restore Env
      process.env.FH_SERVICE_APP = '';
      process.env.FH_SERVICE_AUTHORISED_PROJECTS = "";
      finish();
    });

  },
  "test service access using disallowed project id and correct api key": function(finish){
    process.env.FH_SERVICE_APP = 'true';
    process.env.FH_SERVICE_AUTHORISED_PROJECTS = "projectguid1,projectguid2";
    process.env.FH_MILLICORE = "testing.feedhenry.me";

    var req = {
      headers: {
        'x-request-with': "wrongprojectguid",
        'x-fh-auth-app': "rightkey"
      }
    };

    authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){
      assert.ok(err, "Expected An Error ");
      assert.equal(401, err.code);
      assert.ok(err.message, "Invalid API Key");

      //Restore Env
      process.env.FH_SERVICE_APP = '';
      process.env.FH_SERVICE_AUTHORISED_PROJECTS = "";
      finish();
    });
  },
  "test service access using allowed project id and incorrect api key": function(finish){
    process.env.FH_SERVICE_APP = 'true';
    process.env.FH_SERVICE_AUTHORISED_PROJECTS = "projectguid1,projectguid2";
    process.env.FH_MILLICORE = "testing.feedhenry.me";

    var req = {
      headers: {
        'x-request-with': "projectguid2",
        'x-fh-auth-app': "wrongkey"
      }
    };

    authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){
      assert.ok(err, "Expected An Error ");
      assert.equal(401, err.code);
      assert.ok(err.message, "Invalid API Key");

      //Restore Env
      process.env.FH_SERVICE_APP = '';
      process.env.FH_SERVICE_AUTHORISED_PROJECTS = "";
      finish();
    });
  },
  "test service access using correct service access key": function(finish){
    process.env.FH_SERVICE_APP = 'true';
    process.env.FH_SERVICE_ACCESS_KEY = "accesskey1234";

    var req = {
      headers: {
        'x-fh-service-access-key': "accesskey1234"
      }
    };

    authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){
      assert.ok(!err, "Expected No Error " + err);
      //Restore Env
      process.env.FH_SERVICE_APP = '';
      process.env.FH_SERVICE_ACCESS_KEY = "";
      finish();
    });
  },
  "test service access using incorrect service access key": function(finish){
    process.env.FH_SERVICE_APP = 'true';
    process.env.FH_SERVICE_ACCESS_KEY = "accesskey1234";

    var req = {
      headers: {
        'x-fh-service-access-key': "wrongaccesskey"
      }
    };

    authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){
      assert.ok(err, "Expected An Error ");
      assert.equal(401, err.code);
      assert.ok(err.message.indexOf('service') > -1, "Expected A Service Error Message");
      //Restore Env
      process.env.FH_SERVICE_APP = '';
      process.env.FH_SERVICE_ACCESS_KEY = "";
      finish();
    });
  },
  "test service access using '/hello' OVERRIDES_KEY, hello endpoint": function(finish){
    process.env.FH_SERVICE_APP = 'true';
    process.env.FH_SERVICE_ACCESS_KEY = "accesskey1234";

    var req = {
      headers: {
        'x-fh-service-access-key': "accesskey1234"
      }
    };

    var OVERRIDES_KEY = '/hello';

    var authConfig = {
      authConfig: "{\"appId\":\"itmi5e3ythuwuclhbg7bmdoi\",\"default\":\"appapikey\",\"environment\":\"dev\",\"overrides\":{\"" + OVERRIDES_KEY + "\":{\"security\":\"https\"}}}"
    };

    authenticate(req, {}, authConfig).authenticate("/hello", function(err){
      assert.ok(!err, "Expected No Error " + err);
      //Restore Env
      process.env.FH_SERVICE_APP = '';
      process.env.FH_SERVICE_ACCESS_KEY = "";
      finish();
    });
  },
  "test service access using '/hello' OVERRIDES_KEY, hello endpoint, and url with unparsed query parameter": function(finish){
    process.env.FH_SERVICE_APP = 'true';
    process.env.FH_SERVICE_ACCESS_KEY = "accesskey1234";

    var req = {
      headers: {
        'x-fh-service-access-key': "accesskey1234"
      }
    };

    var OVERRIDES_KEY = '/hello';

    var authConfig = {
      authConfig: "{\"appId\":\"itmi5e3ythuwuclhbg7bmdoi\",\"default\":\"appapikey\",\"environment\":\"dev\",\"overrides\":{\"" + OVERRIDES_KEY + "\":{\"security\":\"https\"}}}"
    };

    authenticate(req, {}, authConfig).authenticate("/hello?hello=world", function(err){
      assert.ok(!err, "Expected No Error " + err);
      //Restore Env
      process.env.FH_SERVICE_APP = '';
      process.env.FH_SERVICE_ACCESS_KEY = "";
      finish();
    });
  }
};
