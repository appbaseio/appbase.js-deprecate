
function Appbase(Collection, http, App, URL, HashMap) {
    
    this.app = function app(name, secret) {
        return new App(Collection, new http(name, secret), URL, new HashMap());
    }
}

module.exports = Appbase;