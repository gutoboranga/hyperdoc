var express = require('express');
// var cors = require('cors')
// var shell = require('shelljs');
var fs = require('fs');
var path = require('path')
var bodyParser = require('body-parser');

var Parser = require('./parser').Parser
var Builder = require('./builder').Builder

var app = express();

let CONTENT_DIR = "../content/"
let TEMPLATES_DIR = "../templates/"

let BASE_URL = "https://localhost:5000/"

let parser = new Parser([],[],[]);
let builder = new Builder(parser.indexes, parser.titles, parser.filenames);

app.use(express.static(path.join(__dirname, "../style/")));

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  var port = app.get('port').toString();
  
  console.log("Running on port " + port);
});

// ========================================================================================
//    ROUTES
// ========================================================================================

app.get("/", function(req, res) {
  let p = path.join(__dirname, "../templates/index.html")
  
  res.sendFile(p)
});

app.get("/:mode", function(req, res) {
  var mode = req.params.mode;
  
  let newUrl = builder.buildPage(mode, undefined);
  
  res.redirect(newUrl);
});


app.get("/:mode/:file", function(req, res) {
  var mode = req.params.mode;
  var file = req.params.file;
  
  let result = builder.buildPage(mode, file);
  
  res.send(result);
});
