var validator = {};

function getName (definition) {
    return definition.name + (definition.optional ? " (required) " : " (optional) ")
}

validator.alphaNumUnder = {
    validate : function(argument, definition) {
        var pattern = new RegExp("^[a-zA-Z0-9_]*$");
        if(!(typeof argument === "string" && argument !== "" && pattern.test(argument))) {
            return getName(definition) + "should be an alphanumeric string with underscores";
        }
    }
};

validator.asciiExcept3 = {
    validate : function(input, definition) {// all ascii, including extended, except '/', '~' and ':'
        var pattern = new RegExp("^([\x00-\x2E]|[\x30-\x39]|[\x3B-\x7D]|[\x7F-\xFF])*$");
        if(!(typeof input === "string" && input !== "" && pattern.test(input))) {
            return getName(definition) + "should be an ascii string except '/', '~' and ':' characters";
        }
    }
};

validator.app = {
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

module.exports = validator;
