
var validator = require("./src/validators");

var Decorator = new (require("./src/decorator"))(validator);
var HTTP = require("./src/HTTP");
var App = require("./src/App");
var Collection = require("./src/Collection");
var URL = require("./src/URL");
var hashmap = require("hashmap");

var AppbaseClass = Decorator.decorateAll(require('./src/Appbase'));

Appbase = new AppbaseClass(Decorator.decorateAll(Collection), HTTP, Decorator.decorateAll(App), URL, hashmap);

module.exports = Appbase;