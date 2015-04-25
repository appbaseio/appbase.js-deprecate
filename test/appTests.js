
var App = require("../src/App");
var Collection = require("../src/Collection");
var URL = require("../src/URL");
var HTTP = new require("../src/HTTP");
var sinon = require("sinon");
var Promise = require("bluebird");
var hashmap = require("hashmap");
var chai = require("chai");
var expect = chai.expect;


var xhr = typeof window !== 'undefined' && window.XMLHttpRequest ? window : require('xhr2');
var atomic = require("atomic-http")(xhr);

var request = new HTTP('appname', 'secret', hashmap, Promise, atomic, URL);

describe('App Behavior', function() {
    var app;

    beforeEach(function() {
        app = new App(Collection, request, URL, new hashmap());
    });

    afterEach(function() {
        Object.keys(request).forEach(function(item) {
            request[item].restore ? request[item].restore() : null;
        });
    });

    describe("App timestamp getter", function() {
        it("Should fetch the server's timestamp", function(done) {

            var now = new Date().getTime();

            var deferred = new Promise(function(resolver) {
                resolver(now);
            });

            sinon.stub(request, 'get').returns(deferred);

            app.serverTime().then(function(time) {
                expect(now).to.equal(time);
            })
            .then(done);
        });

        it("Should call the SERVER_TIME url", function() {

            sinon.stub(request, 'get');

            app.serverTime();

            expect(request.get.calledWith(URL.SERVER_TIME))
            .to.ok;
        });
    });

    describe("App collections getter", function() {
        it("Should fetch the app's collections", function(done) {

            var collections = [1, 2, 3, 4];

            var deferred = new Promise(function(resolver) {
                resolver(collections);
            });

            sinon.stub(request, 'get').returns(deferred);

            app.listCollections().then(function(response) {
                expect(collections).to.equal(response);
            })
            .then(done);
        });

        it("Should call the COLLECTIONS url", function() {

            sinon.stub(request, 'get');

            app.listCollections();

            expect(request.get.calledWith(URL.COLLECTIONS))
            .to.ok;
        });

        it("Should call the get a new collection and cache it", function() {

            sinon.stub(request, 'get');

            var collection = app.collection('user');

            var collection2 = app.collection('user');

            expect(collection).to.an.instanceOf(Collection);
            expect(collection).to.equal(collection2);
        });
    });

    describe("App collection search", function() {
        it("Should search the app's collections", function(done) {

            var collections = [1, 2, 3, 4];

            var deferred = new Promise(function(resolver) {
                resolver(collections);
            });

            sinon.stub(request, 'post').returns(deferred);

            app.search().then(function(response) {
                expect(collections).to.equal(response);
            })
            .then(done);
        });

        it("Should query the app's collections", function() {

            var query = {
                some : "query"
            }

            sinon.stub(request, 'post');

            app.search(query);

            expect(request.post.calledWith(URL.SEARCH, query))
            .to.ok;
        });
    });


});