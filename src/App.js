var DefinitionBuilder = require('./DefinitionBuilder');

function App(Collection, http, URL, map, uuid) {

    this.search = function appSearch(query) {
        return http.post(URL.SEARCH, {
            // body : {
                query : query
            // }
        });
    }

    this.listCollections = function listCollections() {
        return http.get(URL.COLLECTIONS).then(function(collections) {
            return collections.map(toCollection);
        });
    }

    this.serverTime = function serverTime() {
        return http.get(URL.SERVER_TIME);
    }

    this.collection = function collection(name) {
        return map.has(name) ? map.get(name) : map.set(name, new Collection(name, http, URL, uuid)).get(name);
    }

    var toCollection = (function(collection) {
        return this.collection(collection);
    }).bind(this);

}

App.search = DefinitionBuilder.build().add()
    .name('query')
    .validator('typeOf')
    .type('object')
    .end();

App.collection = DefinitionBuilder.build().add()
    .name('name')
    .validator('asciiExcept3')
    .end();


module.exports = App;