/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require("aws-sdk");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const bodyParser = require("body-parser");
const express = require("express");

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const path = "/surveydata";

// Define status codes for survey samples
const PENDING = 0;
const IN_PROGRESS = 1;
const COMPLETE = 2;

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/****************************************
 * HTTP Get method for retrieving samples
 ****************************************/

app.get(path + "/samples", function (req, res) {
  let queryParams = {
    tableName: sampleTableName,
    ProjectionExpression: "sample",
    FilterExpression: `status === ${PENDING}`,
  };

  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: "Could not load items: " + err });
    } else {
      data.Items.forEach((item) => {
        dynamodb.get(
          { tableName: "contexts", Key: item.id },
          (err, context) => {
            if (err) {
              res.statusCode = 500;
              res.json({ error: "Could not load items: " + err });
            } else {
              item.sample.context = context.data;
            }
          }
        );
        dynamodb.update(
          {
            tableName: "samples",
            Key: item.id,
            UpdateExpression: `set status = ${IN_PROGRESS}`,
          },
          (err) => {
            if (err) {
              res.statusCode = 500;
              res.json({ error: err, url: req.url, body: req.body });
            }
          }
        );
      });
      res.json(data.Items);
    }
  });
});

/*************************************
 * HTTP post method for adding ratings
 *************************************/

app.post(path + "/surveyratings", function (req, res) {
  for (let i = 0; i < req.body.length; i++) {
    const updateItemParams = {
      tableName: sampleTableName,
      Key: req.body[i].id,
      UpdateExpression: `ADD ratings = ${req.body[i].ratings} set status = ${COMPLETE}`,
    };
    dynamodb.update(updateItemParams, (err) => {
      if (err) {
        res.statusCode = 500;
        res.json({ error: err, url: req.url, body: req.body });
      }
    });
  }
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
