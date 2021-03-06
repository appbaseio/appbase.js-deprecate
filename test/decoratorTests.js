
var validator = require("../src/validators");
var Decorator = require("../src/decorator");
var App = require("../src/App");
var chai = require("chai");
var sinon = require("sinon");
var expect = chai.expect;

describe('Decorator Behavior', function() {
    function EMPTY() {};
    function oneParam() {
        return arguments;
    };

    var decorator;

    beforeEach(function() {
        decorator = new Decorator(validator);
    });

    it("Should decorate a function", function() {
        var decorated = decorator.decorate(EMPTY, null, []);
        expect(decorated).not.to.equals(EMPTY);
        expect(decorated.name).to.equals('decorator');
    });

    it("Should decorate a class", function() {
        var decoratedClass = decorator.decorateAll(App);
        var instance = new decoratedClass();
        expect(decoratedClass).not.to.equals(App);
        expect(instance.serverTime.name).to.be.equals('serverTime');
        expect(instance.collection.name).to.be.equals('decorator');

        expect(instance.collection).to.throw('Not enough parameters. You should provide: name(required)');
    });

    it("Should bind the this to the function", function() {
        var thisArg = {};
        var spy = sinon.spy();
        var decorated = decorator.decorate(spy, thisArg, []);
        decorated();
        expect(spy.calledOn(thisArg)).to.be.ok;
    });

    it("Should throw a error if the required argument is not provided", function() {
        var decorated = decorator.decorate(oneParam, null, [{ name : 'param', validator : 'alphaNumUnder'}]);
        expect(decorated).to.throw();
    });

    it("Shouldn't throw a error if the optional argument is not provided", function() {
        var decorated = decorator.decorate(oneParam, null, [{ name : 'param', validator : 'alphaNumUnder', optional : true}]);
        expect(decorated).to.not.throw();
    });

    it("Should provide the default value if the optional argument is not provided", function() {
        var spy = sinon.spy();
        var decorated = decorator.decorate(spy, null, [{ name : 'param1', validator : 'alphaNumUnder'}, { name : 'param2', validator : 'alphaNumUnder', optional : true, defaultVal : {test:"test"}}, { name : 'param3', validator : 'alphaNumUnder', optional : true, defaultVal : '150'}, { name : 'param4', validator : 'alphaNumUnder'}]);
        decorated('5', '5');

        expect(spy.calledWithMatch('5', {test : 'test'}, '150', '5')).to.be.ok;
    });

});