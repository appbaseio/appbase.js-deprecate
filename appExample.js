var HTTP = require("./src/HTTP");
var App = require("./src/App");
var Appbase = require("./src/Appbase");
var Collection = require("./src/Collection");
var URL = require("./src/URL");
var hashmap = require("hashmap");

var log = console.log.bind(console);

var appbase = new Appbase(Collection, HTTP, App, URL, hashmap);

var AppTest = appbase.app("rest_test", "193dc4d2440146082ea734f36f4f2638");

// AppTest.listCollections().then(log);

// AppTest.serverTime().then(log);

// AppTest.search({"query": { "match_all" : {}}}).then(log, log);

var userCollection = AppTest.collection('user');

// userCollection.get('1429295999328').then(log);

// userCollection.search({"query": { "match_all" : {}}}).then(log);
function test (argument) {
    // body...
setTimeout(function() {


    userCollection.set('sagss', {
        name : '1123'
    });

    test()
}, 5000);

}

test();

userCollection.onDocuments(function(argument) {
    log("arguments")
});
