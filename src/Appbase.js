
function Appbase(http, App, URL) {
    
    this.app = function app(name, secret) {
        return new App(new http(name, secret), URL);
    }
}

module.exports = Appbase;