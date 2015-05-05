var OAuth;
var isOAuthLoaded = (window.OAuth !== undefined);
 
// as the oauth library we are using loads the OAuth object in the window, we need to check if there's already an OAuth object in the window
if(isOAuthLoaded) {
  var exposedOAuth = window.OAuth; // save exposed OAuth object
  delete window.OAuth; // delete original
  require("oauth-js"); // load new instance of OAuth, which is now window.OAuth
  OAuth = window.OAuth; // which we will use in Appbase
  window.OAuth = exposedOAuth; // now expose the original OAuth object
} else {
  require("oauth-js"); // load new instance of OAuth, which is now window.OAuth
  OAuth = window.OAuth; // which we will use in Appbase
  delete window.OAuth; // don't expose it
}

module.exports = OAuth;