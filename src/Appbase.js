
function Appbase(http, App, URL) {
    
    this.app = function app(name, secret) {
        return new App(name, secret, http, URL);
    }
}

module.exports = Appbase;