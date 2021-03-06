var DefinitionBuilder = require('./DefinitionBuilder');

function Collection(name, http, URL, uuid) {

    var path = "/" + name;

    function getPath(key) {
        return key.indexOf('/') !== -1 ? path + key : path + "/" + key;
    }

    this.name = name;
    
    this.search = function search(query) {
        return http.post(getPath(URL.SEARCH), query);
    }
    
    this.insert = function insert(entry) {
        return this.set(uuid.uuid4(), entry);
    }
    
    this.set = function set(key, entry) {
        var entryPath = getPath(key) + URL.PROPERTIES;
        return http.patch(entryPath, entry);
    }

    this.unset = function unset(key, property) {
        var entryPath = getPath(key) + URL.PROPERTIES;
        return http['delete'](entryPath, {
            properties : property
        });
    }
    
    this.get = function get(key) {
        var entryPath = getPath(key) + URL.PROPERTIES;
        return http.get(entryPath);
    }
    
    this.getAll = function getAll(filters) {
        var entryPath = getPath(URL.DOCUMENTS);
        filters = filters || {};
        return http.get(entryPath, {
            limit : filters.limit,
            skip  : filters.skip
        });
    }
    
    this.on = function on(key, callback, errorCallback) {
        var entryPath = getPath(key) + URL.PROPERTIES;
        http.on(entryPath, callback, errorCallback);
    }
    
    this.off = function off(callback) {
        return http.off(callback);
    }
    
    this.onDocuments = function onDocuments(callback, errorCallback) {
        var entryPath = getPath(URL.DOCUMENTS);
        return http.on(entryPath, callback, errorCallback);
    }
    
    this.onRef = function onRef(key, callback, errorCallback) {
        var entryPath = getPath(key) + URL.REFERENCES;
        return http.on(entryPath, callback, errorCallback);
    }
    
    this.setRef = function setRef(key, ref, path, priority) {
        var entryPath = getPath(key) + URL.REFERENCES;
        var reference = {};
        reference[ref] = { "path": path, "priority": priority };
        return http.patch(entryPath, reference);
    }
    
    this.getRefs = function getRefs(key, filters) {
        var entryPath = getPath(key) + URL.REFERENCES;
        filters = filters || {};
        return http.get(entryPath, {
            limit : filters.limit,
            skip  : filters.skip
        });
    }

    this.unsetRef = function unsetRef(key, references) {
        var entryPath = getPath(key) + URL.REFERENCES;
        return http['delete'](entryPath, {
            references : references
        });
    }
    
    this['delete'] = function deleteKey(key) {
        return http['delete'](getPath(key), { "all" : true });
    }
}

Collection.search = DefinitionBuilder.build().add()
    .name('query')
    .validator('typeOf')
    .type('object')
    .optional()
    .end();

Collection.insert = DefinitionBuilder.build().add()
    .name('entry')
    .validator('typeOf')
    .type('object')
    .end();

Collection.set = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('entry')
    .validator('typeOf')
    .type('object')
    .end();

Collection.unset = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('property')
    .validator('typeOf')
    .type('object')
    .end();

Collection.get = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .end();

Collection.getAll = DefinitionBuilder.build().add()
    .name('filters')
    .validator('typeOf')
    .type('object')
    .optional()
    .end();

Collection.on = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('callback')
    .validator('typeOf')
    .type('function')
    .end();

Collection.onDocuments = DefinitionBuilder.build().add()
    .name('callback')
    .validator('typeOf')
    .type('function')
    .end();

Collection.onRef = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('callback')
    .validator('typeOf')
    .type('function')
    .end();

Collection.off = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('callback')
    .validator('typeOf')
    .type('function')
    .optional()
    .end();

Collection.getRefs = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('filters')
    .validator('typeOf')
    .type('object')
    .optional()
    .end();

Collection.unsetRef = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('properties')
    .validator('typeOf')
    .type(['object', 'string'])
    .end();

Collection.setRef = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('ref')
    .validator('typeOf')
    .type('string')
    .add()
    .name('path')
    .validator('documentPath')
    .add()
    .name('priority')
    .validator('number')
    .optional()
    .end();

Collection['delete'] = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .end();

module.exports = Collection