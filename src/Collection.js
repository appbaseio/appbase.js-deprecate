
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
        var entryPath = getPath(key);
        http.on(entryPath, callback);
    }
    
    this.off = function off(key, callback) {
        var entryPath = getPath(key);
        return http.off(entryPath, callback); // Listeners added to the promise returned by on wouldn't work
    }
    
    this.onDocuments = function onDocuments(key, callback) {
        var entryPath = getPath(URL.DOCUMENTS);
        return http.on(entryPath, callback);
    }
    
    this.onRef = function onRef(key, callback) {
        var entryPath = getPath(URL.REFERENCES);
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
        return http.get(getPath(key), { "all" : true });
    }

}

module.exports = Collection