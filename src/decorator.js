
function Decorator(validators) {

    this.decorate = function decorate(funktion, thisArg, definitions){

        return function decorator() {
            var thisArguments = Array.prototype.slice.call(arguments);

            var messages = [];

            var newArguments = [];
            var size = definitions.length;
            var requiredCount = 0;

            for(var i = size - 1; i >= 0; i--) {
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

            arguments.length < requiredCount ? notEnough(definitions, arguments) : showMessages(messages, arguments);

            return funktion.apply(thisArg, thisArguments);
        };
    }

    this.addvalidator = function(validator) {
        validators.push(validator);
    };

    function getValidator(definition) {
        return definition.validator ? validators[definition.validator] : definition.custom;
    }

    function notEnough (definitions, args) {
        throw new Error("Not enough parameters. You should provide: " + definitions.map(function(definition) {
            return definition.name + (definition.optional ? '(optional)' : '(required)');
        }).join(', '));
    }

    function showMessages (messages, args) {
        if(messages.length){
            var argumentNames = args.length ? Array.prototype.slice.call(args).join(', ') : "None";
            var msg = "Invalid arguments provided: " + argumentNames + ". Valid Arguments are: ";
            throw new Error(msg + messages.join(", "));
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