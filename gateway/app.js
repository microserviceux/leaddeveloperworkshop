//************ Setup ************
// call the packages we need
var restify   = require('restify');
var muonCore  = require("muon-core");
var uuid      = require("uuid");
var Logger    = require('./lib/logging/logger');

var debug     = require('debug')("MuonGateway");

//************ Define Gateway App ************
var server = restify.createServer();
var port      = 9001;
var myConfig  = {};

//Define name and url
server.name = "Tau";
server.url = "http://localhost";

//Load cURL handler
server.pre(restify.pre.userAgentConnection());
//Load the handlers
server.use(restify.queryParser());
server.use(restify.bodyParser(
  {mapParams: true}
));


//************ Muon Start ************

try {
  var muonSystem = new muonCore.generateMuon("mygateway");
}
catch(err){
  console.error('Could not create muonSystem');
  console.error(err);
}

//************ Start Routes ************
server.get('/', function(req, res) {
  muonSystem.query('muon://awsview/data', {}, function(event, payload) {
      debug("Query response ... ");
      debug(payload);
      debug('-------------------------');
      res.json(payload);
  });
});

server.listen(port, function() {
  debug('%s listening at %s', server.name, server.url);
});
