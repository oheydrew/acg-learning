'use strict';
const QueryString = require('querystring');

const htmlPage = (prefix, submittedUrl) => `
  <html>
    <head>
      <meta charset="UTF-8">
      <title>🎉 YOU'RE SNIPPED ✂️</title>
    </head>

    <body>
      <h1>✂️ 🎉 🎊 ✂️</h1>
      <h3>Original URL: ${submittedUrl}</h3>
      <h3>Your snipped URL: <a href="https://${prefix}/fake">${prefix}/fake</a></h3>
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

  callback(null, {
    statusCode: 200,
    body: htmlPage(referer || 'https://www.mysite.com', submittedUrl),
    headers: { 'Content-Type': 'text/html' }
  });
};

module.exports = { handler };
