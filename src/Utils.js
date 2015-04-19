
function Utils () {}

Utils.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
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