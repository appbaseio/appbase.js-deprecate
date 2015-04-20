
function Decorator(validators) {

    this.decorate = function decorate(funktion, thisArg, definitions){

        return function decorator() {
            var thisArguments = new Array(arguments.length);
            for (var i = 0, l = arguments.length; i < l; i++) {
                thisArguments[i] = arguments[i];
            }

            var messages = [];

            var newArguments = [];
            var size = definitions.length;
            var requiredCount = 0;

            for(var i = 0; i < size; i++) {
                if(size !== thisArguments.length && definitions[i].optional){
                    thisArguments.splice(i, 0, clone(definitions[i].defaultVal));
                }
                requiredCount = definitions[i].optional ? requiredCount : requiredCount + 1;
            }

            for (var i = 0; i < size; i++) {
                var definition = definitions[i];
                var message = getValidator(definition).validate(thisArguments[i], definition);
                !definition.optional && message ? messages.push(message) : null;
            };

            arguments.length < requiredCount ? notEnough(definitions, arguments) : showMessages(messages, arguments, definitions);

            return funktion.apply(thisArg, thisArguments);
        };
    }

    this.decorateAll = function(Class) {
        var decorator = this;
        return function ClassDecorator() {
            Class.apply(this, arguments);
            for(var i in Class){
                var definition = Class[i];
                if(Object.hasOwnProperty.call(this, i) && typeof(this[i]) === 'function' && definition.definitions){
                    this[i] = decorator.decorate(this[i], this, definition.definitions);
                }
            }
        }
    };

    this.addvalidator = function(name, validator) {
        validators[name] = validator;
    };

    function getValidator(definition) {
        return definition.validator ? validators[definition.validator] : definition.custom;
    }

    function notEnough (definitions, args) {
        throw new Error("Not enough parameters. You should provide: " + getNames(definitions));
    }

    function getNames (definitions) {
        return definitions.map(function(definition) {
            return definition.name + (definition.optional ? '(optional)' : '(required)');
        }).join(', ')
    }

    function showMessages (messages, args, definitions) {
        if(messages.length){
            var argumentNames = args.length ? Array.prototype.slice.call(args).join('", "') : "None";
            var msg = "Invalid arguments provided: \"" + argumentNames + "\". Valid Arguments are: " + getNames(definitions);
            throw new Error(msg + ". Errors: " + messages.join(", "));
        }
    }

}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

module.exports = Decorator;