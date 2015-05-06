# appbase.js
JavaScript Wrapper for Appbase Rest API


1. Appbase Global Object
-----------

The Appbase object is responsible for instantiating Apps.


----------
### Methods  
**Appbase.app(appname, secret)**  
Used to create a new instance of a App  
Parameters:
 ```
 - appname: String - The name of the app on your appbase dashboard
 - secret: String - The secret of the app
 ```
#### Example
```javascript
    var restTestApp = Appbase.app("rest_test", "193dc4d2440146082ea734f36f4f2638");
```
 
----------

2. App Class
-----------
The App class has utility methods to manage the App's collections.

----------
###Methods  
 **App.search(query)**  
This method searches the App's collections with the given query.  
[View in the REST API Docs](http://docs.appbase.io/#/v3.0/rest/api-reference#api-reference-global-search-collections)    
Parameters:  
 ```
 - query: Object - A JS Object to query the collections.
 ```
 Example
 ```javascript
    AppTest.search({
        match_all : {}
    })
    .then(function(response){
       response.hits.hits.forEach(console.log.bind(console)); // hits.hits - Contains all matched objects, limited by the query or by default 10
       console.log(response.hits.total); // hits.total - Total number of objects matched
    });
 ```
 
  **AppTest.listCollections()**  
This method retrieves all the collections of the app.  
[View in the REST API Docs](http://docs.appbase.io/#/v3.0/rest/api-reference#api-reference-global-list-collections)  

```javascript
    AppTest.listCollections()
    .then(function(collections) {
        collections.forEach(function(collection) { // The collections variable is a array of Collection
            console.log(collection.name);
        });
    });
 ```

**AppTest.serverTime()**  
Returns the server timestamp in milliseconds.  
[View in the REST API Docs](http://docs.appbase.io/#/v3.0/rest/api-reference#api-reference-global-server-time)  

```javascript
    AppTest.serverTime()
    .then(function(time) {
        console.log(time); // 1430941365939
    });
```

**AppTest.collection(name)**  
Returns a Collection object for the provided name  

Parameters:  
 ```
 - name: String - The name of the collection, should already exists in your dashboard.  
 ```
 
```javascript
var userCollection = AppTest.collection('user');
```

3. Collection Class
-----------
Provides an interface to the Appbase's REST endpoints to manage your collections.
[View in the REST API Docs](http://docs.appbase.io/#/v3.0/rest/api-reference)

----------
## Properties
```
**name** String - The name of the collection
```

## Methods

**collection.search(query)**
Searches the collection's documents with the provided query.
[View in the REST API Docs](http://docs.appbase.io/#/v3.0/rest/api-reference#api-reference-collection-search-documents-by-propertyies)    
Parameters:  
 ```
 - query: Object - A JS Object to query the collection.
 ```

```javascript
    userCollection.search({
        filter : {
            term : {
                foo : 'bar'
            }
        }
    }).then(function(response) {
        console.log(response.hits.hits)
    });
```

**collection.insert(entry)**
Create a new document in the collection
[View in the REST API Docs](http://docs.appbase.io/#/v3.0/rest/api-reference#api-reference-document-properties-create-update-document-properties)

Parameters:  
 ```
 - entry: Object - A JS Object to be added to the collection.
 ```

```javascript
    userCollection.insert({
        foo : 'bar',
        name : 'aName'
    }).then(function(response) {
        console.log(response)
        /*
            {
                "foo": "bar",
                "name": "aName",
                "_id": "c12c7649-53e3-44bf-bbe8-f23769885eb0",
                "_collection": "calls",
                "_timestamp": 1430943009686
            }
        */
    });
```

**collection.set(key, entry)**
Create a new document in the collection, with the provided key as the id of that object.
[View in the REST API Docs](http://docs.appbase.io/#/v3.0/rest/api-reference#api-reference-document-properties-create-update-document-properties)

Parameters:  
 ```
 - key: String - A unique key.
 - entry: Object - A JS Object to be added to the collection.
 ```

```javascript
    userCollection.set('12345', {
        foo : 'bar',
        name : 'aName'
    }).then(function(response) {
        console.log(response)
        /*
            {
                "foo": "bar",
                "name": "aName",
                "_id": "12345",
                "_collection": "calls",
                "_timestamp": 1430943009686
            }
        */
    });
```







