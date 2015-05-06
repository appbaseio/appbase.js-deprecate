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
 - query: String - The name of the collection, should already exists in your dashboard.  
 ```
 
```javascript
var userCollection = AppTest.collection('user');
```

3. Collection Class
-----------
Provides an interface to the Appbase's REST endpoints to manage your collections.
[View in the REST API Docs](http://docs.appbase.io/#/v3.0/rest/api-reference)

----------
## Methods



