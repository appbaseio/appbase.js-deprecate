
var URL = require("../src/URL");
var HTTP = new require("../src/HTTP");
var sinon = require("sinon");
var Promise = require("bluebird");
var Hashmap = require("hashmap");
var chai = require("chai");
var expect = chai.expect;

var xhr = typeof window !== 'undefined' && window.XMLHttpRequest ? window : require('xhr2');
var request = require("atomic-http")(xhr);

describe('HTTP Wrapper Behavior', function() {
    var http;
    var methods = ['get', 'put', 'post', 'patch', 'delete'];
    var realtime = ['on', 'off'];
    var hashmap = new Hashmap();

    beforeEach(function() {
        http = new HTTP('appname', 'secret', hashmap, Promise, request, URL);
    });

    afterEach(function() {
        Object.keys(request).forEach(function(item) {
            request[item].restore ? request[item].restore() : null;
        });
    });

    describe("HTTP Methods", function() {
        methods.concat(realtime).forEach(function(method) {
            it("Should implement the method " + method, function() {
                expect(http[method]).to.be.an.instanceOf(Function);
            });
        });
        methods.forEach(function(method) {
            it("The implementation of " + method + " must return a thenable ", function() {

                var requestReturn = {};
                requestReturn.error = sinon.stub().returns(requestReturn);
                requestReturn.success = sinon.stub().returns(requestReturn);

                sinon.stub(request, method).returns(requestReturn);

                expect(http[method]().then).to.be.an.instanceOf(Function);

                expect(requestReturn.error.calledOnce).to.be.ok;
                expect(requestReturn.success.calledOnce).to.be.ok;
            });
        });
    });

    describe("Realtime Methods", function() {

        it("The implementation of 'on' must return undefined and call notify", function() {
            var requestReturn = {};
            requestReturn.notify = sinon.stub().returns(requestReturn);
            sinon.stub(request, 'get').returns(requestReturn);

            expect(http.on()).to.be.undefined;

            expect(requestReturn.notify.calledOnce).to.be.ok;
        });

        it("The implementation of 'off' must return undefined", function() {
            expect(http.off()).to.be.undefined;
        });

        it("Should add the callback to the map and then remove it", function() {            
            var requestReturn = {};
            var spy = sinon.spy();
            requestReturn.notify = sinon.stub().returns(requestReturn);
            sinon.stub(request, 'get').returns(requestReturn);

            http.on(URL.ROOT, spy);

            request.get.args[0][0].beforeSend({
                abort : spy
            });

            expect(hashmap.has(spy)).to.be.ok;

            http.off(spy);

            expect(hashmap.has(spy)).to.be.not.ok;
        });


    });

});