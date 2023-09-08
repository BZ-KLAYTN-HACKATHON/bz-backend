/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
ABOUT THIS NODE.JS EXAMPLE: This example works with AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-examples.html.

Purpose:
ddbClient.js is a helper function that creates an Amazon DynamoDB service client.

INPUTS:
- REGION

*/
// snippet-start:[dynamodb.JavaScript.tables.createclientv3]
// Create service client module using ES6 syntax.
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
// Set the AWS Region.
const config = require('../config')
const REGION = config.DYNAMO_DB.REGION; //e.g. "us-east-1"
const ACCESS_KEY_ID = config.DYNAMO_DB.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = config.DYNAMO_DB.SECRET_ACCESS_KEY;
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  }
});

module.exports = { ddbClient };

