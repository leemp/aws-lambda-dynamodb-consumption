'use strict';
var ApiBuilder = require('claudia-api-builder'),
  api = new ApiBuilder(),
  AWS = require('aws-sdk');

module.exports = api;

api.get('/{table}/{read}', function (request) {
  AWS.config.update({region: 'eu-west-1'});
  var dynamoDb = new AWS.DynamoDB();

  var dt = dynamoDb.describeTable({TableName: request.pathParams.table}).promise();

  return dt.then(function (data) {
    var main = {
      read: data.Table.ProvisionedThroughput.ReadCapacityUnits,
      write: data.Table.ProvisionedThroughput.WriteCapacityUnits,
      size: data.Table.TableSizeBytes
    };

    var params = {
      TableName: request.pathParams.table,
      ProvisionedThroughput: {
        ReadCapacityUnits: request.pathParams.read,
        WriteCapacityUnits: main.write
      }
    };

    if (request.queryString.index) {

      var update = dynamoDb.updateTable(params).promise();
      return update.then(function (result) {
        params = {
          TableName: request.pathParams.table,
          GlobalSecondaryIndexUpdates: [
            {
              Update: {
                IndexName: request.queryString.index,
                ProvisionedThroughput: {
                  ReadCapacityUnits: request.pathParams.read,
                  WriteCapacityUnits: main.write
                }
              }
            }
          ]
        };

        update = dynamoDb.updateTable(params).promise();
        return update.then(function (result) {
          return result;
        })

      });
    }

    return dynamoDb.updateTable(params).promise(); // returns dynamo result
  });

});
