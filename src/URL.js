
var URL = {};

URL.ROOT        = "https://v3.api.appbase.io";

URL.SEARCH      = "/~search";
URL.COLLECTIONS = "/~collections";
URL.SERVER_TIME = "/~timestamp";
URL.PROPERTIES  = "/~properties";
URL.DOCUMENTS   = "/~documents";

URL.get = function getURL(url) {
    return UR.ROOT + url;
}

module.exports = URL;