
var muonCore  = require("muon-core");
var Logger    = require('./lib/logging/logger');

var debug     = require('debug')("SpotView");

var muon = new muonCore.generateMuon("spotview");

muon.onQuery("/echo", function(event, data, respond) {
    
    //call through to the projection .... 
    
    respond({
        "something":"awesome",
        "method":"query"
    });
});
