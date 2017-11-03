var nock = require('nock');

module.exports.wrong_key = nock('https://testing.feedhenry.me')
  .persist()
  .post('/box/api/projects/undefined/apps/undefined/validate_key', {
    "environment": "dev",
    "appApiKey": "testkey",
    "clientApiKey": "wrongkey"
  })
  .times(2)
  .reply(401, {})

module.exports.good_key = nock('https://testing.feedhenry.me')
  .persist()
  .filteringRequestBody(function(body) {
    console.log('body', body);
    return '*';
  })
  .post('/box/api/projects/undefined/apps/undefined/validate_key', '*')
  .times(2)
  .reply(200, {});

  module.exports.good_key_auth_proj = nock('https://testing.feedhenry.me')
  .persist()
  .post('/box/api/projects/undefined/apps/undefined/validate_key_against_authorised_projects', {
    "environment": "dev",
    "clientApiKey": "rightkey"
  })
  .times(1)
  .reply(200, {})

  module.exports.wrong_key_auth_proj = nock('https://testing.feedhenry.me')
  .persist()
  .post('/box/api/projects/undefined/apps/undefined/validate_key_against_authorised_projects', {
    "environment": "dev",
    "clientApiKey": "wrongkey"
  })
  .times(1)
  .reply(400, {})
  