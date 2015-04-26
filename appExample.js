var HTTP = require("./src/HTTP");
var App = require("./src/App");
var Appbase = require("./src/Appbase");
var Collection = require("./src/Collection");
var URL = require("./src/URL");
var hashmap = require("hashmap");
var xhr = typeof window !== 'undefined' && window.XMLHttpRequest ? window : require('xhr2');

var atomic = require("atomic-http")(xhr);
var Promise = require("bluebird");

var log = console.log.bind(console);

var appbase = new Appbase(Collection, HTTP, App, URL, hashmap, Promise, atomic, URL);

var AppTest = appbase.app("rest_test", "193dc4d2440146082ea734f36f4f2638");

// AppTest.listCollections().then(log);

// AppTest.serverTime().then(log);

// AppTest.search({"query": { "match_all" : {}}}).then(log, log);

var userCollection = AppTest.collection('user');

// userCollection.get('sagar').then(log);

// userCollection.search({"query": { "match_all" : {}}}).then(log);
function test (argument) {
    log('set')
    userCollection.set('sagss', {
        name : '1123'
    });
    setTimeout(test, 1000);

}

test();

function cb(argument) {
    log("First Notify")
}

userCollection.onDocuments(cb);
userCollection.onDocuments(cb);
userCollection.onDocuments(cb);
userCollection.onDocuments(cb);
userCollection.onDocuments(function (argument) {
    log("Another Notify")
});

setTimeout(function() {
    log("Removing First Notify")
    userCollection.off(cb)
}, 5000);