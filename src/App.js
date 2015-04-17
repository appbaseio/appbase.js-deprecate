
function App(http, URL) {

    this.search = function appSearch(query) {
        return http.post(URL.SEARCH, query);
    }

    this.listCollections = function listCollections() {
        return http.get(URL.COLLECTIONS);
    }

    this.serverTime = function serverTime() {
        return http.get(URL.SERVER_TIME);
    }
}

module.exports = App;