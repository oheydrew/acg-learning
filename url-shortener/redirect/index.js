'use strict';

const AWS = require('aws-sdk');

const TABLE_NAME = `${process.env.SLS_STAGE}-shortened-urls`;
const documentClient = new AWS.DynamoDB.DocumentClient();

const handler = (event, _context, handlerCallback) => {
  console.log(JSON.stringify(event));

  const slug = event.pathParameters.slug;

  const getQuery = {
    TableName: TABLE_NAME,
    Key: {
      slug: slug
    }
  };

  const getCallback = handlerCallback => (err, data) => {
    if (err) {
      console.log(`ERROR: ${err}`);
      return handlerCallback(err);
    }

    if (data.Item) {
      handlerCallback(null, {
        statusCode: 302,
        body: data.Item.long_url,
        headers: {
          Location: data.Item.long_url,
          'Content-Type': 'text/plain'
        }
      });
    } else {
      handlerCallback(null, {
        statusCode: 404,
        body:
          "This shortened link doesn't exist, check that you entered it right.",
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  };

  documentClient.get(getQuery, getCallback(handlerCallback));
};

module.exports = { handler };
