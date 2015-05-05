
function Auth(OAuth, atomic, appCredentials) {

    this.config = {
        oauthdURL: 'https://auth.appbase.io/',
        oauthMiddleSever: 'https://auth.appbase.io:3000',
        oauthTokenURL: '/oauth/signin',
        oauthRefreshURL: '/oauth/refresh'
    };

    var cookies = ["oauthio_provider_google",
        "oauthio_provider_linkedin",
        "oauthio_provider_facebook",
        "oauthio_provider_dropbox",
        "oauthio_provider_github"];

    OAuth.initialize(appCredentials.getApp());
    OAuth.setOAuthdURL(this.config.oauthdURL);

    this.completeAuth = function(provider, cb) {
        return (function(error, providerResponse) {
            if(error) {
                this.unauth();
                cb(error)
                return
            }
            var savedCreds = this.restoreCreds()
            //TODO: check for code, provider
            if(savedCreds && (Date.now()/1000 < ((savedCreds.credentials.appbase.expires_in) + savedCreds.credentials.appbase.generated_at))) {
                appCredentials.setToken(savedCreds.credentials.appbase.access_token)
                cb(null, savedCreds, this.credsToRequetObj(savedCreds))
            } else {
                this.saveCreds(null)
                this.codeToCreds(provider, providerResponse.code, function(error, creds) {
                    creds.credentials.appbase.generated_at = (Date.now()/1000) - 2 //assuming network latency 2 secs
                    creds.credentials.provider.generated_at = creds.credentials.appbase.generated_at
                    this.saveCreds(creds)
                    appCredentials.setToken(creds.credentials.appbase.access_token)
                    cb(null, creds, this.credsToRequetObj(creds))
                })
            }
        }).bind(this)
    };

    this.codeToCreds = function(provider, code, cb) {
        var data = {
            app: appCredentials.getApp(),
            code: code,
            provider: provider
        };
        atomic.post(this.config.oauthMiddleSever + this.config.oauthTokenURL, data)
            .success(cb.bind(null, null))
            .error(errorHandler.bind(this));

        function errorHandler(error) {
            this.unauth();
            cb(error);
        }
    };

    this.credsToRequetObj = function(creds) {
        return OAuth.create(creds.credentials.provider.provider, creds.credentials.provider);
    };

    this.saveCreds = function(creds) {
        localStorage.setItem('appbase_credentials', JSON.stringify(creds));
    };

    this.restoreCreds = function(){
        try {
            return JSON.parse(localStorage.getItem('appbase_credentials'));
        } catch(e) {
            return null;
        }
    };
    
    this.unauth = function() {
        this.saveCreds(null);
        appCredentials.setToken(null);
        var delete_cookie = function( name ) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
        }
        cookies.forEach(delete_cookie);
    }
}

module.exports = Auth;