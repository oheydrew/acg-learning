'use strict';

const AWS = require('aws-sdk');

const TABLE_NAME = `${process.env.SLS_STAGE}-shortened-urls`;
const documentClient = new AWS.DynamoDB.DocumentClient();

const successMessage = item => ({
  statusCode: 302,
  body: item.long_url,
  headers: {
    Location: item.long_url,
    'Content-Type': 'text/plain'
  }
});

const failMessage = () => ({
  statusCode: 404,
  body: "This shortened link doesn't exist, check that you entered it right.",
  headers: {
    'Content-Type': 'text/plain'
  }
});

const handler = (event, _context, handlerCallback) => {
  console.log(JSON.stringify(event));

  const slug = event.pathParameters.slug;

  const getQuery = {
    TableName: TABLE_NAME,
    Key: {
      slug: slug
    }
  };

  documentClient
    .get(getQuery)
    .promise()
    .then(data => {
      console.log({ data });
      data.Item
        ? handlerCallback(null, successMessage(data.Item))
        : handlerCallback(null, failMessage());
    })
    .catch(err => {
      console.log(`ERROR: ${err}`);
      return handlerCallback(err);
    });
};

module.exports = { handler };
