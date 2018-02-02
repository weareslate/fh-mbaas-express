var assert = require('assert');
var requestValidator = require('../../lib/common/requestValidator.js');
var util = require('util');

module.exports = {
  "setUp" : function(finish){
    finish();
  },
  "tearDown" : function(finish){
    finish();
  },
  "test getForms validation": function(finish){
    var testRequest = {
      "params": {
        "appId": "clientApp12345"
      }
    };

    requestValidator(testRequest).forms.getForms(function(err, result){
      assert.ok(!err, "Error was not expected: " + util.inspect(err));
      assert.ok(result, "Expected a result ");

      assert.ok(result.appClientId === "clientApp12345", "Expected result to have appClientId parameter with value: clientApp12345 but got: ", result.appClientId);
      finish();
    });
  },
  "test getForm validation": function(finish){
    var testRequest = {
      "params": {
        "appId": "clientApp13245",
        "formId": "formId123456"
      }
    };

    requestValidator(testRequest).forms.getForm(function(err, result){
      assert.ok(!err, "Error was not expected: " + util.inspect(err));
      assert.ok(result, "Expected a result ");

      assert.ok(result.appClientId === "clientApp13245", "Expected result to have appClientId parameter with value: clientApp13245 but got: ", result.appClientId);
      assert.ok(result._id === "formId123456", "Expected _id to be formId123456 but got: ", result._id);
      finish();
    });
  },
  "test getTheme validation": function(finish){
    var testRequest = {
      "params": {
        "appId": "clientApp13245"
      }
    };

    requestValidator(testRequest).forms.getTheme(function(err, result){
      assert.ok(!err, "Error was not expected: " + util.inspect(err));
      assert.ok(result, "Expected a result ");

      assert.ok(result.appClientId === "clientApp13245", "Expected result to have appClientId parameter with value: clientApp13245 but got: ", result.appClientId);
      finish();
    });
  },
  "test getConfig validation": function(finish){
    var testRequest = {
      "params": {
        "appId": "clientApp13245",
        "deviceId": "device123456"
      }
    };

    requestValidator(testRequest).forms.getConfig(function(err, result){
      assert.ok(!err, "Error was not expected: " + util.inspect(err));
      assert.ok(result, "Expected a result ");

      assert.ok(result.appClientId === "clientApp13245", "Expected result to have appClientId parameter with value: clientApp13245 but got: ", result.appClientId);
      assert.ok(result.deviceId === "device123456", "Expected result to have deviceId parameter with value: device123456 but got: ", result.deviceId);
      finish();
    });
  },
  "test submitFormData validation": function(finish){
    var testRequest = {
      "params": {
        "appId": "clientApp13245",
        "formId": "formId12345"
      },
      "connection": {
        "remoteAddress": "192.168.1.1"
      },
      "body": {
        "formFields": []
      }
    };

    requestValidator(testRequest).forms.submitFormData(function(err, result){
      assert.ok(!err, "Error was not expected: " + util.inspect(err));
      assert.ok(result, "Expected a result ");

      assert.ok(result.appClientId === "clientApp13245", "Expected result to have appClientId parameter with value: clientApp13245 but got: ", result.appClientId);
      assert.ok(result.submission, "Expected a submission object");
      assert.ok(result.submission.deviceIPAddress === "192.168.1.1", "Expected ip address to be 192.168.1.1 but got:", result.submission.deviceIPAddress);
      finish();
    });
  },
  "test submitFormFile validation": function(finish){
    var testRequest = {
      "params": {
        "appId": "clientApp13245",
        "fileId": "file12345",
        "fieldId": "field12345",
        "submitId": "submission12345"
      },
      "files": [
        {
          "path": "/some/file/path",
          "filename": "somefileName"
        }
      ]
    };

    requestValidator(testRequest).forms.submitFormFile(function(err, result){
      assert.ok(!err, "Error was not expected: " + util.inspect(err));
      assert.ok(result, "Expected a result ");

      assert.ok(result.appClientId === "clientApp13245", "Expected result to have appClientId parameter with value: clientApp13245 but got: ", result.appClientId);
      assert.ok(result.submission, "Expected a submission object");
      assert.ok(result.submission.submissionId === "submission12345", "Expected result to have submissionId parameter with value: submission12345 but got: ", result.submission.submissionId);
      assert.ok(result.submission.fieldId === "field12345", "Expected result to have fieldId parameter with value: field12345 but got: ", result.submission.fieldId);
      assert.ok(result.submission.fileId === "file12345", "Expected result to have fileId parameter with value: file12345 but got: ", result.submission.fileId);
      assert.ok(result.submission.fileStream === "/some/file/path", "Expected result to have fileStream parameter with value: /some/file/path but got: ", result.submission.fileStream);
      assert.ok(result.submission.fileName === "somefileName", "Expected result to have fileName parameter with value: somefileName but got: ", result.submission.fileName);

      finish();
    });
  },
  "test getSubmissionStatus validation": function(finish){
    var testRequest = {
      "params": {
        "submitId": "submission3322",
        "appId": "appId1234"
      }
    };

    requestValidator(testRequest).forms.getSubmissionStatus(function(err, result){
      assert.ok(!err, "Error was not expected: " + util.inspect(err));
      assert.ok(result, "Expected a result ");

      assert.ok(result.appClientId === "appId1234", "Expected result to have appClientId parameter with value: appId1234 but got: ", result.appClientId);
      assert.ok(result.submission, "Expected a submission object");
      assert.ok(result.submission.submissionId === "submission3322", "Expected submissionId in result to be submission3322 but got " + result.submission.submissionId);
      finish();
    });
  },
  "test completeSubmission validation": function(finish){
    var testRequest = {
      "params": {
        "submitId": "submission5411",
        "appId": "appId1234"
      }
    };

    requestValidator(testRequest).forms.completeSubmission(function(err, result){
      assert.ok(!err, "Error was not expected: " + util.inspect(err));
      assert.ok(result, "Expected a result ");

      assert.ok(result.appClientId === "appId1234", "Expected result to have appClientId parameter with value: appId1234 but got: ", result.appClientId);
      assert.ok(result.submission, "Expected a submission object");
      assert.ok(result.submission.submissionId === "submission5411", "Expected submissionId in result to be submission5411 but got " + result.submission.submissionId);
      finish();
    });
  }
}
