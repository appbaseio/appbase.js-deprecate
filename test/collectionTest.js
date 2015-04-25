
var App = require("../src/App");
var URL = require("../src/URL");
var HTTP = require("../src/HTTP");
var sinon = require("sinon");
var Promise = require("bluebird");
var chai = require("chai");
var expect = chai.expect;
var request = new HTTP();

var Collection = require("../src/Collection");

describe('Collection Behavior', function() {
    var collection;

    beforeEach(function() {
        collection = new Collection("someName", request, URL);
    });

    afterEach(function() {
        Object.keys(request).forEach(function(item) {
            request[item].restore ? request[item].restore() : null;
        });
    });

    describe("Collection's data search", function() {
        it("Should search the collection", function(done) {

            var data = [1, 2, 3, 4];

            var deferred = new Promise(function(resolver) {
                resolver(data);
            });

            sinon.stub(request, 'post').returns(deferred);

            collection.search({}).then(function(response) {
                expect(data).to.equal(response);
            })
            .then(done);
        });

        it("Should query the collection's data", function() {

            var query = {
                some : "query"
            };

            sinon.stub(request, 'post');

            collection.search(query);

            expect(request.post.args[0][0].indexOf(URL.SEARCH) !== -1).to.be.ok;
            expect(request.post.args[0][1] === query).to.be.ok;
        });

        it("Should get a Document from the collection", function() {

            var data = {
                _id : "name"
            };

            var deferred = new Promise(function(resolver) {
                resolver(data);
            });

            sinon.stub(request, 'get').returns(deferred);

            collection.get(data._id).then(function(response) {
                expect(data._id).to.equal(response._id);
            });

            expect(request.get.calledWith("/someName/" + data._id + URL.PROPERTIES)).to.be.ok;

        });

        it("Should get all Documents from the collection", function() {

            var data = [{
                _id : "name"
            }];

            var filter = {
                test : 'dsfgh'
            };

            var deferred = new Promise(function(resolver) {
                resolver(data);
            });

            sinon.stub(request, 'get').returns(deferred);

            collection.getAll(filter).then(function(response) {
                expect(data).to.equal(response);
            });

            expect(request.get.calledWith("/someName" + URL.DOCUMENTS, filter)).to.be.ok;

        });

        it("Should get all Documents from the collection with a empty filter", function() {

            var data = [{
                _id : "name"
            }];

            var deferred = new Promise(function(resolver) {
                resolver(data);
            });

            sinon.stub(request, 'get').returns(deferred);

            collection.getAll().then(function(response) {
                expect(data).to.equal(response);
            });

            expect(request.get.calledWithMatch("/someName" + URL.DOCUMENTS, {})).to.be.ok;

        });
    });
});