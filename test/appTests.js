
var App = require("../src/App");
var URL = require("../src/URL");
var request = require("request");
var sinon = require("sinon");
var Promise = require("bluebird");
var chai = require("chai");
var expect = chai.expect;

describe('App Behavior', function() {
    var app;

    afterEach(function() {
        ['get', 'post', 'del', 'patch', 'put', 'head'].forEach(function(item) {
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

            new App("someName", "someSecret", request, URL).serverTime().then(function(time) {
                expect(now).to.equal(time);
            })
            .then(done);
        });

        it("Should call the SERVER_TIME url", function() {

            sinon.stub(request, 'get');

            new App("someName", "someSecret", request, URL).serverTime();

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

            new App("someName", "someSecret", request, URL).listCollections().then(function(response) {
                expect(collections).to.equal(response);
            })
            .then(done);
        });

        it("Should call the COLLECTIONS url", function() {

            sinon.stub(request, 'get');

            new App("someName", "someSecret", request, URL).listCollections();

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

            new App("someName", "someSecret", request, URL).search().then(function(response) {
                expect(collections).to.equal(response);
            })
            .then(done);
        });

        it("Should query the app's collections", function() {

            var query = {
                some : "query"
            }

            sinon.stub(request, 'post');

            new App("someName", "someSecret", request, URL).search(query);

            expect(request.post.calledWith(URL.SEARCH, query))
            .to.ok;
        });
    });


});