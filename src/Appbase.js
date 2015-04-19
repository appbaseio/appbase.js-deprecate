var DefinitionBuilder = require('./DefinitionBuilder');

function Appbase(Collection, http, App, URL, HashMap) {
    
    this.app = function app(name, secret) {
        return new App(Collection, new http(name, secret), URL, new HashMap());
    }
}

Appbase.app = DefinitionBuilder.build().add()
    .name('name')
    .validator('appName')
    .add()
    .name('secret')
    .validator('secret')
    .end();

module.exports = Appbase;