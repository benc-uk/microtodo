//
// Main Express server for Microtodo app
//
console.log(`\n### MicroTodo Server\n### ================`);

// Load .env file if it exists
require('dotenv').config()

// Load in modules, and create Express app 
const express = require('express');
const app = express();

// Serve static content from working directory ('.') by default or provided as arg
var staticContentDir = process.argv[2] || __dirname;
staticContentDir = require('path').resolve(staticContentDir)
console.log(`### Static content: '${staticContentDir}'`);

// Serve all Angular app static content (index.html, js, css, assets, etc.)
app.use('/', express.static(staticContentDir));

// Redirect all other requests to Vue.js app - i.e. index.html
app.use('*', function(req, res) {
  res.sendFile(`${staticContentDir}/index.html`);
});

// Start the Express server
var port = process.env.PORT || 8000;
var server = app.listen(port, function () {
  console.log(`### Server listening on ${server.address().port}`);
});