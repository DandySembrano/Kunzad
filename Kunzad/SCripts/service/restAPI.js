
var restAPI = function ($http, $localForage) {
    var service = this;
    var objData = undefined;

    service.retrieve = function (url) {
        var eTagId = null;
        var etagKey = null;

        $localForage.iterate(function (value, key) {
            if (key.indexOf(url) > -1) { //if request is already on localforeage get the etag
                eTagId = key.substring(key.indexOf("+") + 1, key.length);
                etagKey = key;
            }
        }).then(function (data) {
            if (eTagId == null) {
                eTagId = "dummy"
            }

            $.ajax(url, {
                type: "GET",
                beforeSend: function (request) {
                    request.setRequestHeader("If-None-Match", eTagId);
                },
                success: function (result, status, xhr) {
                    if (xhr.readyState == 4) {
                        if (status == 'success') { //200
                            if (etagKey != null) {
                                //remove first existing just in case it is expire on server
                                $localForage.removeItem(etagKey);
                            }
                            var newETagId = xhr.getResponseHeader("ETag");
                            $localForage.setItem(url + "+" + newETagId, xhr.responseText);
                            objData = angular.copy(xhr.responseJSON)

                        } else if (status == 'notmodified') { //304
                            $localForage.getItem(etagKey).then(function (data) {

                                objData = JSON.parse(data);
                                console.log(objData);
                                objData = angular.copy(objData);

                            });
                        }
                        eTagId = null
                        etagKey = null
                    }
                },
                error: function (xhr) {

                }
            });
        });

    }
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