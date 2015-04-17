
var atomic = require("atomic")(require('xhr2'));
var Promise = require("bluebird");
var URL = require("../src/URL");


function HTTP (appname, secret) {

    this.post = function post(url, body) {
        var resolve, reject;
        var promise = new Promise(function(res, rej) {
            resolve = res;
            reject = rej;
        });

        atomic.post({
            url : URL.ROOT + '/' + appname + url,
            headers : {
                'Appbase-Secret' : secret
            },
            data : JSON.stringify(body)
        })
        .success(resolve).error(reject);

        return promise;
    }

    this.put = function put(url, body) {
        var resolve, reject;
        var promise = new Promise(function(res, rej) {
            resolve = res;
            reject = rej;
        });

        atomic.put({
            url : URL.ROOT + '/' + appname + url,
            headers : {
                'Appbase-Secret' : secret
            },
            data : JSON.stringify(body)
        })
        .success(resolve).error(reject);

        return promise;
    }

    this.get = function get(url) {
        var resolve, reject;
        var promise = new Promise(function(res, rej) {
            resolve = res;
            reject = rej;
        });

        atomic.get(URL.ROOT + '/' + appname + url, {
            headers : {
                'Appbase-Secret' : secret
            }
        })
        .success(resolve).error(reject);

        return promise;
    }

}

module.exports = HTTP;