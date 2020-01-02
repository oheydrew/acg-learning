'use strict';

const htmlPage = `
  <html>
    <head>
      <meta charset="UTF-8">
      <title>GET SNIPPY ✂️</title>
    </head>

    <body>
      <h1>✂️ ✂️ 🎉</h1>
      <form method="POST" action="">
        <label for="uri">Link:</label>
        <input type="text" id="link" name="link" size="40" autofocus />
        <br/>
        <br/>
        <input type="submit" value="✂️ SNIP ✨" />
      </form>
    </body>
  </html>`;

const handler = (event, _context, callback) => {
  console.log(JSON.stringify(event));

  callback(null, {
    statusCode: 200,
    body: htmlPage,
    headers: { 'Content-Type': 'text/html' }
  });
};

module.exports = { handler };
