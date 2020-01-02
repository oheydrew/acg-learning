'use strict';
const URL_PREFIX = 'mysite.com';

const htmlPage = prefix => `
  <html>
    <head>
      <meta charset="UTF-8">
      <title>🎉 YOU'RE SNIPPED ✂️</title>
    </head>

    <body>
      <h1>✂️ 🎉 🎊 ✂️</h1>
      <h3>Your snipped URL: <a href="https://${prefix}/fake">${prefix}/fake</a></h3>
    </body>
  </html>
`;

const handler = (event, context, callback) => {
  console.log(JSON.stringify(event));

  callback(null, {
    statusCode: 200,
    body: htmlPage(URL_PREFIX),
    headers: { 'Content-Type': 'text/html' }
  });
};

module.exports = { handler };
