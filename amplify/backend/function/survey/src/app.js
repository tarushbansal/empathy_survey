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

// Define status codes for survey samples
const PENDING = 0;
const IN_PROGRESS = 1;
const COMPLETE = 2;

// Set maximum time allowed for survey
// (beyond which expire sample in progress status)
const MAX_SURVEY_TIME = 900000; // (15 min)

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

const path = "/samples";

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  next();
});

function updateStatus(sampleId, statusCode) {
  dynamodb.update(
    {
      TableName: "samples",
      Key: { id: sampleId },
      UpdateExpression: "SET #status = :in_progress, #timestamp = :time",
      ExpressionAttributeNames: {
        "#status": "status",
        "#timestamp": "timestamp",
      },
      ExpressionAttributeValues: {
        ":in_progress": statusCode,
        ":time": Date.now(),
      },
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

/****************************************
 * HTTP Get method for retrieving samples
 ****************************************/

app.get(path + "/:num", function (req, res) {
  const maxResLength = parseInt(req.params.num);
  if (maxResLength > 25) {
    res.statusCode = 500;
    res.json({ error: "Only allowed a maximum of 25 samples per request" });
    return;
  }
  let resData = [];
  let scanParams = {
    TableName: "samples",
    ProjectionExpression: "#id, #sample, #status, #timestamp",
    FilterExpression: "#status = :pending OR #status = :in_progress",
    ExpressionAttributeNames: {
      "#id": "id",
      "#status": "status",
      "#sample": "sample",
      "#timestamp": "timestamp",
    },
    ExpressionAttributeValues: {
      ":pending": PENDING,
      ":in_progress": IN_PROGRESS,
    },
    Limit: maxResLength,
  };

  function onScan(err, data) {
    if (err) {
      res.statusCode = 500;
      res.json({ error: "Could not load items: " + err });
    } else {
      for (let i = 0; i < data.Items.length; i++) {
        if (resData.length == maxResLength) break;
        if (
          data.Items[i].status === IN_PROGRESS &&
          Date.now() - data.Items[i].timestamp <= MAX_SURVEY_TIME
        ) {
          continue;
        }
        updateStatus(data.Items[i].id, IN_PROGRESS);
        resData.push(data.Items[i]);
      }

      if (data.LastEvaluatedKey && resData.length < maxResLength) {
        scanParams.ExclusiveStartKey = LastEvaluatedKey;
        dynamodb.scan(scanParams, onScan);
      } else {
        res.statusCode = 200;
        res.json(resData);
        console.log("Sucessfully scanned and sent samples: ", resData);
      }
    }
  }

  dynamodb.scan(queryParams, onScan);
});

/*************************************
 * HTTP post method for adding ratings
 *************************************/

app.post(path + "/ratings", function (req, res) {
  const transactParams = Object.fromEntries(
    req.body.map((sample) => [
      "Update",
      {
        TableName: "samples",
        Key: { id: sample.id },
        UpdateExpression:
          "SET #ratings = :ratings, #status = :complete REMOVE #timestamp",
        ExpressionAttributeNames: {
          "#ratings": "ratings",
          "#status": "status",
          "#timestamp": "timestamp",
        },
        ExpressionAttributeValues: {
          ":ratings": sample.ratings,
          ":complete": COMPLETE,
        },
      },
    ])
  );
  dynamodb.transactWrite(transactParams, (err) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: "Could not post ratings: " + err });
    } else {
      res.statusCode = 200;
      res.json("Successfully posted ratings!");
      console.log(
        "Ratings recieved for sample ids: ",
        req.body.map((sample) => sample.id)
      );
    }
  });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
