var AppbaseClass = require('./src/Appbase');

var HTTP = require("./src/HTTP");
var App = require("./src/App");
var Collection = require("./src/Collection");
var URL = require("./src/URL");
var hashmap = require("hashmap");

Appbase = new AppbaseClass(Collection, HTTP, App, URL, hashmap);

module.exports = Appbase;