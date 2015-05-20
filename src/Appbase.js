var DefinitionBuilder = require('./DefinitionBuilder');

function Appbase(Collection, http, App, URL, HashMap, Promise, atomic, AuthService, Auth, uuid) {
    
    this.app = function app(name, secret) {
        var appHttp =  new http(name, secret, new HashMap(), Promise, atomic, URL);
        var app = new App(Collection, appHttp, URL, new HashMap(), uuid);
        if(typeof window !== 'undefined'){
            app.oauth = new AuthService(new Auth(appHttp));
        }
        return app;
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