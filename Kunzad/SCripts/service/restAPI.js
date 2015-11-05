var restAPI = function ($http, $localForage, $q) {
    var service = this;
    var asyncCall = undefined;
    var objData = undefined;
    var deferred = $q.defer();

    if (window.XMLHttpRequest) {
        FactoryXMLHttpRequest = function () {
            return new XMLHttpRequest();
        }
    }
    else if (window.ActiveXObject) {
        FactoryXMLHttpRequest = function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }

    function Asynchronous(userSettings) {
        this.xmlhttp = new FactoryXMLHttpRequest();
        this.isBusy = false;
        this.userSettings = userSettings;
    }

    function Asynchronous_call(request) {
        var instance = this;
        var instRequest = request;
        //send request to server
        this.xmlhttp.open(request.action, request.url, true);
        try {

            var eTagId = null;
            var etagKey = null;

            this.xmlhttp.onreadystatechange = function () {
                if (instance.xmlhttp.readyState == 4) {
                    //if already completed
                    if (instance.xmlhttp.status == 200 && request.action == "GET") { //get fresh data
                        if (etagKey != null) {
                            //remove first existing just in case it is expire on server
                            $localForage.removeItem(etagKey);
                        }
                        var newETagId = instance.xmlhttp.getResponseHeader("ETag");
                        $localForage.setItem(request.url + "+" + newETagId, instance.xmlhttp.response);
                        var jsonObj = JSON.parse(instance.xmlhttp.response);
                        //save data in local storage here
                        objData = jsonObj;
                    } else if (instance.xmlhttp.status == 304 && request.action == "GET") { //retrive in cache
                        $localForage.getItem(etagKey).then(function (data) {
                            objData = JSON.parse(data);
                        });
                    }
                    //reset all keys
                    eTagId = null
                    etagKey = null
                }
            }

            $localForage.iterate(function (value, key) {
                if (key.indexOf(request.url) > -1) { //if request is already on localforeage get the etag
                    eTagId = key.substring(key.indexOf("+") + 1, key.length);
                    etagKey = key;
                }
            }).then(function (data) {
                if (eTagId == null) {
                    instance.xmlhttp.setRequestHeader("If-None-Match", '"dummy"');
                    instance.xmlhttp.send(request.data); //send w/o if-none-match
                } else {
                    instance.xmlhttp.setRequestHeader("If-None-Match", eTagId);
                    instance.xmlhttp.send(request.data);
                }
            });
        }
        catch (e) {
            //globals.errorHandler(e);
        }
    }

    function HttpRequest_get(strurl) {
        //invoke Asynchronous.prototype.call function
        this.call({ action: "GET", url: strurl });
    }

    //invoke HttpRequest_get function
    Asynchronous.prototype.get = HttpRequest_get;
    //invoke Asynchronous_call function
    Asynchronous.prototype.call = Asynchronous_call;

    var request = {
        validatingAsynchronous: function (type) {
            return new Asynchronous();
        },
    };

    service.retrieve = function (url) {
        asyncCall = request.validatingAsynchronous("GET");
        asyncCall.get(url);
    };

    service.edit = function (url) {
    };

    service.save = function (url) {

    };

    service.delete = function (url) {

    };

    function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = obj.constructor(); // give temp the original obj's constructor
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }
        return temp;
    }

    service.getObjData = function () {
        var objToCreate = (cloneObject(objData));

        objData = undefined;
        return objToCreate;
    }

    service.isValid = function () {
        return objData != null;
    }



    service.setObjData = function (val) {
        objData = val;
    }
};
kunzadApp.service('restAPI', restAPI);