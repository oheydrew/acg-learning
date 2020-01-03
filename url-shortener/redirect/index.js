'use strict';

const AWS = require('aws-sdk');

const TABLE_NAME = process.env.DDB_TABLE;
const documentClient = new AWS.DynamoDB.DocumentClient();

const addHttpIfRequired = url => {
  if (!url.includes('http://') || !url.includes('https://')) {
    console.log(`adding http:// - http://${url}`);
    return `http://${url}`;
  }

  return url;
};

const successMessage = item => {
  const longHttpUrl = addHttpIfRequired(item.long_url);

  return {
    statusCode: 302,
    body: longHttpUrl,
    headers: {
      Location: longHttpUrl,
      'Content-Type': 'text/plain'
    }
  };
};

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
