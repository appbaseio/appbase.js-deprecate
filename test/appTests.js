
var App = require("../src/App");
var Collection = require("../src/Collection");
var URL = require("../src/URL");
var HTTP = new require("../src/HTTP");
var sinon = require("sinon");
var Promise = require("bluebird");
var hashmap = require("hashmap");
var chai = require("chai");
var expect = chai.expect;
var request = new HTTP();

describe('App Behavior', function() {
    var app;

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

            new App(Collection, request, URL, new hashmap()).serverTime().then(function(time) {
                expect(now).to.equal(time);
            })
            .then(done);
        });

        it("Should call the SERVER_TIME url", function() {

            sinon.stub(request, 'get');

            new App(Collection, request, URL, new hashmap()).serverTime();

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

            new App(Collection, request, URL, new hashmap()).listCollections().then(function(response) {
                expect(collections).to.equal(response);
            })
            .then(done);
        });

        it("Should call the COLLECTIONS url", function() {

            sinon.stub(request, 'get');

            new App(Collection, request, URL, new hashmap()).listCollections();

            expect(request.get.calledWith(URL.COLLECTIONS))
            .to.ok;
        });
    });

    describe("App collection search", function() {
        it("Should search the app's collections", function(done) {

            var collections = [1, 2, 3, 4];

            var deferred = new Promise(function(resolver) {
                resolver(collections);
            });

            sinon.stub(request, 'post').returns(deferred);

            new App(Collection, request, URL, new hashmap()).search().then(function(response) {
                expect(collections).to.equal(response);
            })
            .then(done);
        });

        it("Should query the app's collections", function() {

            var query = {
                some : "query"
            }

            sinon.stub(request, 'post');

            new App(Collection, request, URL, new hashmap()).search(query);

            expect(request.post.calledWith(URL.SEARCH, query))
            .to.ok;
        });
    });


});