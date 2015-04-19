var validator = {};

var Utils = require('./Utils')

function getName (definition) {
    return definition.name + (definition.optional ? " (optional) " : " (required) ")
}

validator.alphaNumUnder = {
    validate : function(argument, definition) {
        var pattern = new RegExp("^[a-zA-Z0-9_]*$");
        if(!(typeof argument === "string" && argument !== "" && pattern.test(argument))) {
            return getName(definition) + " should be an alphanumeric string with underscores";
        }
    }
};

validator.asciiExcept3 = {
    validate : function(input, definition) {// all ascii, including extended, except '/', '~' and ':'
        var pattern = new RegExp("^([\x00-\x2E]|[\x30-\x39]|[\x3B-\x7D]|[\x7F-\xFF])*$");
        if(!(typeof input === "string" && input !== "" && pattern.test(input))) {
            return getName(definition) + " should be an ascii string except '/', '~' and ':' characters";
        }
    }
};

validator.appName = {
    validate : function(input, definition) {
        var pattern = new RegExp("^[a-z0-9_]*$");
        if(!(typeof input === "string" && input !== "" && pattern.test(input))) {
            return getName(definition) + " application name should be a lower case alphanumeric string with underscores";
        }
    }
};

validator.secret = {
    validate : function(input, definition) {
        var pattern = new RegExp("^[a-zA-Z0-9]*$");
        if(!(typeof input === "string" && input !== "" && pattern.test(input))) {
            return getName(definition) + " application secret should be an alphanumeric string";
        }
    }
};

validator.instanceOf = {
    validate : function(input, definition) {
        if(!(input instanceof definition.type)){
            return getName(definition) + " should be a instance of " + definition.type;
        }
    }
};

validator.typeOf = {
    validate : function(input, definition) {
        var types = typeof(types) === 'string' ? [definition.type] : definition.type; 
        for (var i = types.length - 1; i >= 0; i--) {
            if(typeof(input) !== types[i]){
                return getName(definition) + " should have the types " + types.join(' or ');
            }
        };
    }
};

validator.documentPath = {
    validate : function(input, definition) {
        input = Utils.cutLeadingTrailingSlashes(input);
        var pattern = new RegExp("^([\x00-\x39]|[\x3B-\x7D]|[\x7F-\xFF])*$"); // all ascii, including extended, except '~' and ':'
        if(!(typeof input === "string" && input !== "" && pattern.test(input))) {
            return " a vertex path - an ascii string except '~' and ':' characters";
        }
    }
};

validator.documentKey = {
    validate : function(input, definition) {
        input = Utils.cutLeadingTrailingSlashes(input);
        var e = validator.asciiExcept3(input, definition);
        if(e) return e;
    }
};

validator.number = {
    validate : function(input, definition) {
        if(isNaN(input)){
            return getName(definition) + " should be a number";
        }
    }
};


module.exports = validator;
