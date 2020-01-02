'use strict';

const handler = (event, _context, callback) => {
  console.log(JSON.stringify(event));
  const slug = event.pathParameters.slug;
  const target =
    process.env[`URL_${slug.toUpperCase()}`] ||
    'http://serverless.com/framework/docs';

  callback(null, {
    statusCode: 302,
    body: target,
    headers: {
      Location: target,
      'Content-Type': 'text/plain'
    }
  });
};

module.exports = { handler };
