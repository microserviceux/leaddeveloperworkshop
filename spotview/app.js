
var muonCore  = require("muon-core");
var Logger    = require('./lib/logging/logger');

var debug     = require('debug')("SpotView");

var muon = new muonCore.generateMuon("spotview");

muon.onQuery("/spotdata", function(event, data, respond) {
    
    //call through to the projection .... 
    muon.query("muon://eventstore/projection?projection-name=count-products", function(event, data) {
        try {
            var productIdList = data["current-value"];
        
            respond({
                "message":"There are " + productIdList.length + " products",
                products: productIdList
            });
        } catch (error) {
            console.dir(error);
        }
    });
});
