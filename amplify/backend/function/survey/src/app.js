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
const MAX_SURVEY_TIME = 1205000;

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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
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
  let scanParams = {
    TableName: "samples",
    ProjectionExpression: "#id, #status, #timestamp",
    FilterExpression: "#status = :pending OR #status = :in_progress",
    ExpressionAttributeNames: {
      "#id": "id",
      "#status": "status",
      "#timestamp": "timestamp",
    },
    ExpressionAttributeValues: {
      ":pending": PENDING,
      ":in_progress": IN_PROGRESS,
    },
  };

  dynamodb.scan(scanParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: "Could not retrieve samples: " + err });
      console.error("An error occured while scanning: ", err);
    } else {
      let filteredIds = [];
      for (let i = 0; i < data.Items.length; i++) {
        if (
          data.Items[i].status === IN_PROGRESS &&
          Date.now() - data.Items[i].timestamp <= MAX_SURVEY_TIME
        ) {
          continue;
        }
        filteredIds.push({ id: data.Items[i].id });
      }
      shuffleArray(filteredIds);
      const batchGetParams = {
        RequestItems: {
          samples: {
            Keys: filteredIds.slice(0, maxResLength),
            ProjectionExpression: "#id, #sample",
            ExpressionAttributeNames: { "#id": "id", "#sample": "sample" },
          },
        },
      };
      dynamodb.batchGet(batchGetParams, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.json({ error: "Could not retrieve samples: " + err });
          console.error(
            "An error occured while fetching random samples: ",
            err
          );
        } else {
          console.log(
            "Successfully retrieved samples with ids: ",
            data.Responses.samples.map((item) => item.id)
          );
          const transactParams = {
            TransactItems: data.Responses.samples.map((item) => ({
              Update: {
                TableName: "samples",
                Key: { id: item.id },
                UpdateExpression:
                  "SET #status = :in_progress, #timestamp = :time",
                ExpressionAttributeNames: {
                  "#status": "status",
                  "#timestamp": "timestamp",
                },
                ExpressionAttributeValues: {
                  ":in_progress": IN_PROGRESS,
                  ":time": Date.now(),
                },
              },
            })),
          };
          dynamodb.transactWrite(transactParams, (err) => {
            if (err) {
              res.statusCode = 500;
              res.json({ error: "Could not update sample status: " + err });
              console.error(
                "An error occured while updating sample status: ",
                err
              );
            } else {
              console.log(
                "Updated status to IN_PROGRESS for samples with ids: ",
                data.Responses.samples.map((item) => item.id)
              );
              res.statusCode = 200;
              res.json(data.Responses.samples);
              console.log(
                "Successfully sent samples with ids: ",
                data.Responses.samples.map((item) => item.id)
              );
            }
          });
        }
      });
    }
  });
});

/*************************************
 * HTTP post method for adding ratings
 *************************************/

app.post(path + "/ratings", function (req, res) {
  const transactParams = {
    TransactItems: req.body.map((sample) => ({
      Update: {
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
    })),
  };
  dynamodb.transactWrite(transactParams, (err) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: "Could not post ratings: " + err });
      console.error("An error occurred while posting ratings: ", err);
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
