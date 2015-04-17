var HTTP = require("./src/HTTP");
var App = require("./src/App");
var Appbase = require("./src/Appbase");
var URL = require("./src/URL");

var appbase = new Appbase(HTTP, App, URL);

var AppTest = appbase.app("rest_test", "193dc4d2440146082ea734f36f4f2638");
// var AppTest = new App(new HTTP("watchlist", "85bf32de5f631d0f6115cf391b87f8d5"), URL);

AppTest.listCollections().then(function() {
    console.log(JSON.stringify(arguments))
});

AppTest.serverTime().then(function() {
    console.log(JSON.stringify(arguments))
});

AppTest.search({"query": { "match_all" : {}}}).then(function() {
    console.log(JSON.stringify(arguments))
}, function() {
    console.log(JSON.stringify(arguments))
});