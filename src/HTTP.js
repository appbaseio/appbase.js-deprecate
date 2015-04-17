var xhr = typeof window !== 'undefined' && window.XMLHttpRequest ? window : require('xhr2');

var atomic = require("atomic-http")(xhr);
var Promise = require("bluebird");
var URL = require("../src/URL");

function HTTP (appname, secret) {

    function xhrBuilder(method) {
        return function(url, body) {
            var resolve, reject;
            var promise = new Promise(function(res, rej) {
                resolve = res;
                reject = rej;
            });

            atomic[method]({
                url : URL.ROOT + '/' + appname + url,
                headers : {
                    'Appbase-Secret' : secret
                },
                data : body
            })
            .success(resolve).error(reject);

            return promise;
        }
    }

    var methods = ['get', 'put', 'post', 'patch', 'delete'];

    for(var i = 0, length = methods.length; i < length; i++) {
        var method = methods[i];
        this[method] = xhrBuilder(method);
    }

    this.on = function(url, callback) {
        atomic.get({
            url : URL.ROOT + '/' + appname + url + '?streamonly=true',
            headers : {
                'Appbase-Secret' : secret
            }
        })
        .notify(callback);
    };

}

module.exports = HTTP;