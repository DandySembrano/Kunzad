var restAPI = function ($http, $localForage) {
    var service = this;
    var asyncCall = undefined;
    var objData = undefined;

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
            this.xmlhttp.onreadystatechange = function () {
                if (instance.xmlhttp.readyState == 4) {
                    //if already completed
                    if (instance.xmlhttp.status == 200 && request.action == "GET") {
                        //persist in local foreage
                        $localForage.setItem("EtagID", instance.xmlhttp.getResponseHeader("ETag"));
                        var jsonObj = JSON.parse(instance.xmlhttp.response);
                        //save data in local storage here
                        objData = jsonObj;
                    }
                }
            }

            $localForage.getItem("EtagID").then(function (data) {
                if (data === undefined) {
                    instance.xmlhttp.setRequestHeader("If-None-Match", '"xxx"');
                    instance.xmlhttp.send(request.data); //send w/o if-none-match
                } else { //retrieve in the cache
                    alert('Dili pa ka retrieve kay wla paman na save sa local storage, temporary.');
                    EtagID = data;
                    var jsonObj = [{ForTesting: null}];
                    objData = jsonObj;
                    instance.xmlhttp.setRequestHeader("If-None-Match", EtagID);
                    instance.xmlhttp.send(request.data);
                }
            })
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
        //invoke Asynchronous.prototype.get function
        asyncCall.get(url);
    };

    service.edit = function (url) {
    };

    service.save = function (url) {

    };

    service.delete = function (url) {

    };

    service.getObjData = function () {
        return objData;
    }
};
kunzadApp.service('restAPI', restAPI);
