
function Utils () {}

Utils.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

Utils.getIndexesOf = function(array, item) {
    var indexes = [];
    for (var i = array.length - 1; i >= 0; i--) {
        if(array[i] === item){
            indexes.push(i);
        }
    }
    return indexes;
};

Utils.cutLeadingTrailingSlashes = function(input) {
    while(input.charAt(input.length - 1) === '/') {
        input = input.slice(0,-1);
    }
    while(input.charAt(0) === '/') {
        input = input.slice(1);
    }
    return input;
}

module.exports = Utils;