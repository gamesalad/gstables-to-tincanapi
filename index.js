var express = require('express'),
    bodyParser = require('body-parser'),
    GSTable = require('gstable'),
    crypto = require('crypto'),
    uuid = require('node-uuid');

var app = express();

var lastPostedStatement = null;

// parse application/json
app.use(bodyParser());
app.post('/', function (req, res) {
  res.setHeader('Content-type', 'text-plain');

  // Debug to see raw request data
  console.log("RAW POST: ")
  console.log(req.body)
  console.log("\n\n");

  var checksum = crypto.createHash('sha1');
  checksum.update(req.body.params);

  // Verify Request Checksum
  if (checksum.digest('hex') != req.body.sig) {
    res.end(JSON.stringify({"Status":"Fail"}));
    return;
  }

  // Parse the GS Table Data.
  var table = GSTable.create();
  table.parseJSON(req.body.params);

  // Parse the table headers so we can use them as json paths.
  var propPaths = [];
  table.columnNames.forEach(function(propName, idx) {
    propPaths[idx] = propName.split("_");
  })

  // Process table rows. Each row is a statement
  table.rows.forEach(function(statmentData, rowIdx) {
    var statement = {};
    // Process each column
    propPaths.forEach(function(propPath, columnIdx) {
      var statementRef = statement;
      // Form the object based on the column path definition
      propPath.forEach(function(propName, proPathIdx) {
        if ((proPathIdx + 1) < propPath.length) {
          // We still have column path parts coming, so make a child object.
          statementRef[propName] = statementRef[propName] || {}
          statementRef = statementRef[propName]
        } else {
          // We're at the end, so let's set the column data at this point.
          statementRef[propName] = statmentData[columnIdx]
        }
      })
    })

    // Since we can't set this type of stuff on client, do it here
    statement["id"] = uuid.v1();
    statement["timestamp"] = new Date();

    lastPostedStatement = statement;

    // Debug to see the resulting statement object.
    console.log(statement);
  })

  // Send a successful response back to the client, so it can get on with things.
  res.write(JSON.stringify({"Status":"Success"}));
  res.end();
});

app.get('/', function(req, res) {
    var table = GSTable.create();
    
    res.end();
})

app.listen(3000);
console.log("GameSalad Network to Tin Can API Converter App Started");