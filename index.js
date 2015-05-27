
var validator = require("./src/validators");

var Decorator       = new (require("./src/Decorator"))(validator);
var HTTP            = require("./src/HTTP");
var App             = require("./src/App");
var Collection      = require("./src/Collection");
var AuthService     = Decorator.decorateAll(require("./src/OAuthService"));
var Auth            = require("./src/OAuth/auth");
var oauthio         = require("./src/OAuth/oauthio");
var uuid            = require("./src/uuid");
var URL             = require("./src/URL");
var hashmap         = require("hashmap");

var xhr = typeof window !== 'undefined' && window.XMLHttpRequest ? window : require('xhr2');

var atomic = require("atomic-http")(xhr);
var Promise = require("bluebird");

var AppbaseClass = Decorator.decorateAll(require('./src/Appbase'));

Appbase = new AppbaseClass(Decorator.decorateAll(Collection), HTTP, Decorator.decorateAll(App), URL, hashmap, Promise, atomic, AuthService.bind(null, oauthio), Auth.bind(null, oauthio, atomic), uuid);

module.exports = Appbase;