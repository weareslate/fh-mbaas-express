var authenticate = require('../../lib/common/authenticate');
var assert = require('assert');
var nock = require('nock');
require("../fixtures/validate_key_call");

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
  },
  "test service access uses cached reponse for subsequent authorised requests": function(finish) {
    process.env.FH_SERVICE_APP = 'true';
    process.env.FH_SERVICE_AUTHORISED_PROJECTS = "projectguid1,projectguid2";
    process.env.FH_MILLICORE = "testing.feedhenry.me";
    process.env.FH_ENV = "dev";
    
    var req = {
      headers: {
        'x-request-with': "projectguid1",
        'x-fh-auth-app': "rightkey"
      }
    };

    // mock millicore call to return 200 for request with correct project and correct key
    var authorisedInterceptor = nock('https://testing.feedhenry.me')
      .persist()
      .post('/box/api/projects/undefined/apps/undefined/validate_key_against_authorised_projects', {
        "environment": "dev",
        "clientApiKey": "rightkey"
      })
      .times(1)
      .reply(200, {});

    // Make service request with allowed & valid credentials project. Authorised response expected
    authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){
      assert.ok(!err, "Expected valid call to be authorised " + err); //expect to be authorised

      // mock millicore call to return unauthorised for request with correct project and correct key    
      nock.removeInterceptor(authorisedInterceptor)
      var unauthorisedInterceptor = nock('https://testing.feedhenry.me')
        .persist()
        .post('/box/api/projects/undefined/apps/undefined/validate_key_against_authorised_projects', {
          "environment": "dev",
          "clientApiKey": "rightkey"
        })
        .times(1)
        .reply(401, {});

      // Make same service call again - Authorised reponse expected due to caching
      authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){
        //check that this call is served from the cache
        assert.ok(!err, "Expected invalid call to still be authorised due to caching" + JSON.stringify(err, null, 2));

        //Restore Env
        nock.removeInterceptor(unauthorisedInterceptor);
        process.env.FH_SERVICE_APP = '';
        process.env.FH_SERVICE_AUTHORISED_PROJECTS = "";
        finish();

      });            
    });    
    
  }, 
  "test service access uses cached reponse for subsequent unauthorised requests": function(finish) {
    process.env.FH_SERVICE_APP = 'true';
    process.env.FH_SERVICE_AUTHORISED_PROJECTS = "projectguid1,projectguid2";
    process.env.FH_MILLICORE = "testing.feedhenry.me";
    process.env.FH_ENV = "dev";
    
    const req = {
      headers: {
        'x-request-with': "projectguid1",
        'x-fh-auth-app': "otherkey"
      }
    };

    // mock millicore call to return 401 for request
    const unauthorisedInterceptor = nock('https://testing.feedhenry.me')
      .persist()
      .post('/box/api/projects/undefined/apps/undefined/validate_key_against_authorised_projects', {
        "environment": "dev",
        "clientApiKey": "otherkey"
      })
      .times(1)
      .reply(401, {});

    // Make service request. Expect 401 unauthorised response
    authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){
      assert.ok(err, "Expected An Error ");
      assert.equal(401, err.code);
      assert.ok(err.message, "Invalid API Key");

      // mock millicore call to return authorised for request with correct project and correct key    
      nock.removeInterceptor(unauthorisedInterceptor)
      const authorisedInterceptor = nock('https://testing.feedhenry.me')
        .persist()
        .post('/box/api/projects/undefined/apps/undefined/validate_key_against_authorised_projects', {
          "environment": "dev",
          "clientApiKey": "otherkey"
        })
        .times(1)
        .reply(200, {});

      // Make same service call again - Unauthorised reponse still expected due to caching
      authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){
        //check that this call is served from the cache
        assert.ok(err, "Expected An Error ");
        assert.equal(401, err.code);
        assert.ok(err.message, "Invalid API Key");

        //Restore Env
        nock.removeInterceptor(authorisedInterceptor);
        process.env.FH_SERVICE_APP = '';
        process.env.FH_SERVICE_AUTHORISED_PROJECTS = "";
        finish();

      });            
    });        
  }, 
  "test stale service cache entries are not served": function(finish) {
    //set env
    process.env.FH_SERVICE_APP = 'true';
    process.env.FH_SERVICE_AUTHORISED_PROJECTS = "projectguid1,projectguid2";
    process.env.FH_MILLICORE = "testing.feedhenry.me";
    process.env.FH_ENV = "dev";
    process.env.API_KEY_AUTH_PROJ_VALIDATION_TIMEOUT = 1000; //reduce cache time
    
    const req = {
      headers: {
        'x-request-with': "projectguid1",
        'x-fh-auth-app': "cacheTestKey"
      }
    };

    // authorise service request
    const authorisedInterceptor = nock('https://testing.feedhenry.me')
      .persist()
      .post('/box/api/projects/undefined/apps/undefined/validate_key_against_authorised_projects', {
        "environment": "dev",
        "clientApiKey": "cacheTestKey"
      })
      .times(1)
      .reply(200, {});

    authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){
      assert.ok(!err, "Expected valid call to be authorised " + err); //expect to be authorised  

      // Make call again & expect unauthorised reponse as cache has expired
      var expiration = parseInt(process.env.API_KEY_AUTH_PROJ_VALIDATION_TIMEOUT, 10) || 300000; // 5 minutes

      setTimeout(function() {

        // unauthorise request
        nock.cleanAll(); 
        const unauthorisedInterceptor = nock('https://testing.feedhenry.me')
          .persist()
          .post('/box/api/projects/undefined/apps/undefined/validate_key_against_authorised_projects', {
            "environment": "dev",
            "clientApiKey": "cacheTestKey"
          })
          .times(1)
          .reply(401, {});
         
        // check request is now unauthorised & that expired authorised cache request is not returned  
        authenticate(req, {}, {}).authenticate("some/path/to/something", function(err){

          //check that this call is served from the cache
          assert.ok(err, "Expected An Error ");
          assert.equal(401, err.code);
          assert.ok(err.message, "Invalid API Key");

          //Restore Env
          nock.cleanAll();      
          process.env.FH_SERVICE_APP = '';
          process.env.FH_SERVICE_AUTHORISED_PROJECTS = "";
          finish();

        })
      }, (expiration + 1000));      
      
    })
  }
};
