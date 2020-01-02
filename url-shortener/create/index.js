'use strict';
const AWS = require('aws-sdk');
const Path = require('path');
const Crypto = require('crypto');
const QueryString = require('querystring');

AWS.config.setPromisesDependency(Promise);

const TABLE_NAME = `${process.env.SLS_STAGE}-shortened-urls`;
const documentClient = new AWS.DynamoDB.DocumentClient();

const htmlPage = (link, submittedUrl) => `
  <html>
    <head>
      <meta charset="UTF-8">
      <title>🎉 YOU'RE SNIPPED ✂️</title>
    </head>

    <body>
      <h1>✂️ 🎉 🎊 ✂️</h1>
      <h3>Original URL: ${submittedUrl}</h3>
      <h3>Your snipped URL: <a href="${link}">${link}</a></h3>
    </body>
  </html>
`;

const handler = (event, context, callback) => {
  const {
    headers: { Referer: referer },
    body
  } = event;

  const { link: submittedUrl } = QueryString.parse(body);

  console.log(JSON.stringify(event));
  console.log({ submittedUrl });

  return new Promise((resolve, reject) => {
    // grab some random bytes
    resolve(
      Crypto.randomBytes(8)
        .toString('base64')
        // take out chars that mean something in URLs
        .replace(/[=+/]/g, '')
        // 4 chars gives us 14776336 options
        .substring(0, 4)
    );
  })
    .then(slug => {
      console.log(`Trying to save URL ${submittedUrl} slug ${slug} now`);
      return documentClient
        .put({
          TableName: TABLE_NAME,
          Item: {
            slug: slug,
            long_url: submittedUrl
          },
          Expected: {
            long_url: { Exists: false }
          }
        })
        .promise()
        .then(() => {
          return slug;
        });
    })
    .then(slug => {
      console.log('woo, succeeded!');
      return callback(null, {
        statusCode: 200,
        body: htmlPage(Path.join(referer, slug).replace(':/', '://'), referer),
        headers: { 'Content-Type': 'text/html' }
      });
    })
    .catch(error => {
      console.log('Oh no, hit an error! ' + error);
      callback(null, {
        statusCode: 400,
        body: 'Something went wrong, please try again'
      });
    });
};

module.exports = { handler };
