
function HTTP (appname, secret, callbackToRequest, Promise, atomic, URL) {

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
            },
            beforeSend : function(request){
                var requests = callbackToRequest.has(callback) ? callbackToRequest.has(callback) : [];
                requests.push(request);
                callbackToRequest.set(callback, requests);
            }
        })
        .notify(function on (response) {
            var arrayInner = objects.substring(0, objects.length - 1);
            var array;

            try {
                array = JSON.parse('[' + arrayInner + ']');
            } catch(e) {
                console.log('Invalid JSON object: ' + arrayInner);
                return;
            }

            for(var i = 0, length = array.length; i < length; i++){
                callback(array[i]);
            }
        });
    };

    this.off = function off (callback) {
        var requests = callbackToRequest.get(callback) || [];
        requests.forEach(function(request) {
            try {
                request.abort();
            } catch(e){}
        });

        callbackToRequest.remove(callback);
    }

}

module.exports = HTTP;