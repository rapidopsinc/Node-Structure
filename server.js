var app = require('./app');
var server = require('http').Server(app);
var lodash = require('lodash');

var server=app.listen(config.server.port,()=>{
  console.log(`Server listening on ${server.address().address} @ ${server.address().port}`);
});

