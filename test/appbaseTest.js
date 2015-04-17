
var Appbase = require("../src/Appbase");
var Collection = require("../src/Collection");
var App = require("../src/App");
var URL = require("../src/URL");
var HTTP = new require("../src/HTTP");
var sinon = require("sinon");
var Promise = require("bluebird");
var HashMap = require("hashmap");
var chai = require("chai");
var expect = chai.expect;

describe('Appbase global object Behavior', function() {

    var appbase;

    beforeEach(function() {
        appbase = new Appbase(Collection, HTTP, App, URL, HashMap);
    });

    it("Should return a App instance", function() {
        var app = appbase.app("someAppName", "someSecret");

        expect(app instanceof App).to.be.ok;
    });

});