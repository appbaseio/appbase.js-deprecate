
function HTTP (appname, secret, callbackToRequest, Promise, atomic, URL) {

    var appToken;

    function xhrBuilder(method) {
        return function(url, body) {
            var resolve, reject;
            var promise = new Promise(function(res, rej) {
                resolve = res;
                reject = rej;
            });

            url = URL.ROOT + '/' + appname + url;

            var request = {
                url : url,
                headers : getHeaders()
            };

            if(method === 'get'){
                request.url = typeof(body) === 'object' ? appendParams(url, body) : url;
            } else {
                request.data = body
            }

            atomic[method](request)
            .success(resolve).error(reject);

            return promise;
        }
    }

    function appendParams (url, body) {
        for(var i in body){
            if(body[i] !== undefined && body.hasOwnProperty(i)){
                url = url.indexOf('?') === -1 ? url + '?' : url;
                url = url + i + '=' + body[i];
            }
        }
        return url;
    }

    var methods = ['get', 'put', 'post', 'patch', 'delete'];

    for(var i = 0, length = methods.length; i < length; i++) {
        var method = methods[i];
        this[method] = xhrBuilder(method);
    }

    this.on = function(url, callback, errorCallback) {
        atomic.get({
            url : URL.ROOT + '/' + appname + url + '?streamonly=true',
            headers : getHeaders(),
            beforeSend : function(request){
                var requests = callbackToRequest.has(callback) ? callbackToRequest.get(callback) : [];
                requests.push(request);
                callbackToRequest.set(callback, requests);
            }
        })
        .notify(function on(objects) {
            var arrayInner = objects.substring(0, objects.length - 1);
            var array;

            try {
                array = JSON.parse('[' + arrayInner + ']');
            } catch(e) {
                if(errorCallback){
                    errorCallback('Invalid JSON object: ' + arrayInner);
                }
                return;
            }

            for(var i = 0, length = array.length; i < length; i++){
                callback(array[i]);
            }
        })
        .error(errorCallback);
    };

    this.off = function off (callback) {
        var requests = callbackToRequest.get(callback) || [];
        requests.forEach(function(request) {
            try {
                request.abort();
            } catch(e){
                console.log(e)
            }
        });

        callbackToRequest.remove(callback);
    }

    this.setToken = function setToken(token) {
        appToken = token;
    }

    this.getApp = function getApp() {
        return appname;
    }

    function getHeaders() { // Should send the token, if present
        return {
            'Appbase-Secret' : secret
        }
    }

}

module.exports = HTTP;