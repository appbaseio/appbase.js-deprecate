var DefinitionBuilder = require('./DefinitionBuilder');

function Collection(name, http, URL, uuid) {

    var path = "/" + name;

    function getPath(key) {
        return key.indexOf('/') !== -1 ? path + key : path + "/" + key;
    }
    
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
        return http.get(entryPath, (filters || {}));
    }
    
    this.on = function on(key, callback) {
        var entryPath = getPath(key) + URL.PROPERTIES;
        http.on(entryPath, callback);
    }
    
    this.off = function off(key, callback) {
        var entryPath = getPath(key) + URL.PROPERTIES;
        return http.off(entryPath, callback);
    }
    
    this.onDocuments = function onDocuments(callback) {
        var entryPath = getPath(URL.DOCUMENTS);
        return http.on(entryPath, callback);
    }
    
    this.onRef = function onRef(key, callback) {
        var entryPath = getPath(key) + URL.REFERENCES;
        return http.on(entryPath, callback);
    }
    
    this.setRef = function setRef(key, ref, path, priority) {
        var entryPath = getPath(key) + URL.REFERENCES;
        var reference = {};
        reference[ref] = { "path": path, "priority": priority };
        return http.patch(entryPath, reference);
    }
    
    this.getRefs = function getRefs(key, filters) {
        var entryPath = getPath(key) + URL.REFERENCES;
        return http.get(entryPath, (filters || {}));
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
    .validator('instanceOf')
    .type(Object)
    .optional()
    .end();

Collection.insert = DefinitionBuilder.build().add()
    .name('entry')
    .validator('instanceOf')
    .type(Object)
    .end();

Collection.set = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('entry')
    .validator('instanceOf')
    .type(Object)
    .end();

Collection.unset = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('property')
    .validator('instanceOf')
    .type(Object)
    .end();

Collection.get = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .end();

Collection.getAll = DefinitionBuilder.build().add()
    .name('filters')
    .validator('instanceOf')
    .type(Object)
    .optional()
    .end();

Collection.on = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('callback')
    .validator('instanceOf')
    .type(Function)
    .end();

Collection.onDocuments = DefinitionBuilder.build().add()
    .name('callback')
    .validator('instanceOf')
    .type(Function)
    .end();

Collection.onRef = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('callback')
    .validator('instanceOf')
    .type(Function)
    .end();

Collection.off = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('callback')
    .validator('instanceOf')
    .type(Function)
    .optional()
    .end();

Collection.getRefs = DefinitionBuilder.build().add()
    .name('key')
    .validator('documentKey')
    .add()
    .name('filters')
    .validator('instanceOf')
    .type(Object)
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
    .validator('instanceOf')
    .type(Object)
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