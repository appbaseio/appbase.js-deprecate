
function AuthService (OAuth, auth) {
    
    this.getAuth = function() {
        var authObj = auth.restoreCreds();
        if(authObj) {
            ab.server.setAppbaseToken(authObj.credentials.appbase.access_token)
            return {authObj: authObj, requestObj: auth.credsToRequetObj(authObj)}; 
        }
        return null;                 
    };

    this.callback = function(provider, callback) {
        OAuth.callback(provider, auth.completeAuth(provider, callback));
    };
    
    this.auth = function(provider, options, callback) {
        options.cache = true
        if(!options.authorize) {
            options.authorize = {}
        }
        options.authorize.response_type = "code"
        var tB;
        if((tB = typeof callback) === 'function') {
            OAuth.popup(provider, options, auth.completeAuth(provider, callback))
        } else if (tB === 'string') {
            OAuth.redirect(provider, options, callback)
        } else {
            throw ("Invalid argument:" + callback.toString())
        }
    };
    
    this.authPopup = function(provider, options, callback) {
        this.auth(provider, options, callback);
    };
    
    this.authRedirect = function(provider, options, redirectURL) {
        this.auth(provider, options, redirectURL);
    };
    
    this.unauth = function() {
        auth.unauth();
    };
}

var DefinitionBuilder = require('./DefinitionBuilder');

var providers = [ "google", "linkedin", "facebook", "dropbox", "github" ];

AuthService.callback = DefinitionBuilder.build()
    .check('provider')
    .validator('inArray')
    .prop('array', providers)

    .check('callback')
    .validator('instanceOf')
    .type(Function)
    .end();

AuthService.auth = DefinitionBuilder.build()
    .check('provider')
    .validator('inArray')
    .prop('array', providers)

    .check('options')
    .validator('typeOf')
    .type('object')

    .check('callback')
    .validator('typeOf')
    .type(['function', 'string'])
    .end();

AuthService.authPopup = DefinitionBuilder.build()
    .check('provider')
    .validator('inArray')
    .prop('array', providers)

    .check('options')
    .validator('typeOf')
    .type('object')

    .check('callback')
    .validator('typeOf')
    .type(['function', 'string'])
    .end();

AuthService.authRedirect = DefinitionBuilder.build()
    .check('provider')
    .validator('inArray')
    .prop('array', providers)

    .check('options')
    .validator('typeOf')
    .type('object')

    .check('redirectURL')
    .validator('typeOf')
    .type('string')
    .end();


module.exports = AuthService;
