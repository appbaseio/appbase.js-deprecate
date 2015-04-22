
function DefinitionBuilder () {

    var definitions = [];
    
    this.add = function() {
        definitions.push({});
        return this;
    };
    
    this.name = function (name) {
        last().name = name;
        return this;
    }
    
    this.check = function (name) {
        this.add();
        last().name = name;
        return this;
    }
    
    this.optional = function () {
        last().optional = true;
        return this;
    }
    
    this.defaultValue = function (value) {
        last().defaultVal = value;
        return this;
    }
    
    this.end = function () {
        return {
            definitions : definitions
        };
    }

    this.validator = function(validator) {
        if(typeof(validator) === 'function'){
            last().custom = validator;
        } else {
            last().validator = validator;
        }
        return this;
    };

    this.type = function(type) {
        last().type = type;
        return this;
    };

    this.prop = function(key, value) {
        last()[key] = value;
        return this;
    };

    function last() {
        return definitions[definitions.length-1];
    }

}

DefinitionBuilder.build = function() {
    return new DefinitionBuilder();
};

module.exports = DefinitionBuilder;