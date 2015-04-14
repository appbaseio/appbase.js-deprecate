
var App = require("../src/App");
var URL = require("../src/URL");
var request = require("request");
var sinon = require("sinon");
var Promise = require("bluebird");
var chai = require("chai");
var expect = chai.expect;

var Collection = require("../src/Collection");

describe('Collection Behavior', function() {
    var collection;

    afterEach(function() {
        ['get', 'post', 'del', 'patch', 'put', 'head'].forEach(function(item) {
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

            new Collection("someName", {}, request, URL).search({}).then(function(response) {
                expect(data).to.equal(response);
            })
            .then(done);
        });

        it("Should query the collection's data", function() {

            var query = {
                some : "query"
            };

            sinon.stub(request, 'post');

            new Collection("someName", {}, request, URL).search(query);

            expect(request.post.args[0][0].indexOf(URL.SEARCH) !== -1).to.be.ok;
            expect(request.post.args[0][1] === query).to.be.ok;
        });
    });
});