
function Utils () {
    
    this.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

module.exports = Utils;