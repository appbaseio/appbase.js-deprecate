
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

        it("Should get newly added Documents on the collection", function() {

            var spy = sinon.spy();

            sinon.stub(request, 'on');

            collection.onDocuments(spy);

            expect(request.on.calledWith("/someName" + URL.DOCUMENTS, spy)).to.be.ok;
        });

        it("Should get newly added References on the Document", function() {
            var spy = sinon.spy();

            sinon.stub(request, 'on');

            collection.onRef('key', spy);

            expect(request.on.calledWith("/someName/key" + URL.REFERENCES, spy)).to.be.ok;
        });

        it("Should set a new References on the Document", function() {

            sinon.stub(request, 'patch');

            collection.setRef('key', 'friend', 'user/someUser', 1);

            expect(request.patch.calledWithMatch("/someName/key" + URL.REFERENCES, {
                friend : { "path": 'user/someUser', "priority": 1 }
            })).to.be.ok;
        });

        it("Should set a new Document on the Collection", function() {

            var entry = {
                test : 'dsfgh'
            };

            sinon.stub(request, 'patch');

            collection.set('key', entry);

            expect(request.patch.calledWithMatch("/someName/key" + URL.PROPERTIES, entry)).to.be.ok;
        });

        it("Should delete References from the Document", function() {

            var references = {
                references : ['friend', 'someOtherRef']
            };

            sinon.stub(request, 'delete');

            collection.unsetRef('key', references.references);

            expect(request.delete.calledWithMatch("/someName/key" + URL.REFERENCES, references)).to.be.ok;
        });

        it("Should get refs from a Document on the collection with the provided key", function() {

            sinon.stub(request, 'get');

            collection.getRefs('key');

            expect(request.get.calledWithMatch("/someName/key" + URL.REFERENCES, {})).to.be.ok;
        });

        it("Should get newly added Documents on the collection with the provided key", function() {
            var spy = sinon.spy();

            sinon.stub(request, 'on');

            collection.on('key', spy);

            expect(request.on.calledWith("/someName/key" + URL.PROPERTIES, spy)).to.be.ok;
        });

        it("Should remove the callback on newly added Documents on the collection", function() {

            var spy = sinon.spy();

            sinon.stub(request, 'on');

            collection.off('key', spy);

            expect(request.off.calledWith("/someName/key" + URL.PROPERTIES, spy)).to.be.ok;
        });

        it("Should delete the Documents from the collection", function() {

            var spy = sinon.spy();

            sinon.stub(request, 'delete');

            collection.delete('key', spy);

            expect(request.delete.calledWithMatch("/someName/key", { "all" : true })).to.be.ok;
        });
    });
});