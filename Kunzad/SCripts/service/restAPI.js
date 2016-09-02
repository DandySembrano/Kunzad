
var restAPI = function ($rootScope, $http, $localForage, $interval) {
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
            $localForage.getItem("Token").then(function (value) {
                $.ajax(url, {
                    type: "GET",
                    beforeSend: function (request) {
                        request.setRequestHeader("If-None-Match", eTagId);
                        request.setRequestHeader('Token', value.toString());
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

        });

    }

    service.retrieveWDToken = function (url) {
        $localForage.getItem("Token").then(function (value) {
            $http.defaults.headers.common['Token'] = value;
            $http.get(url)
            .success(function (data, status) {
                //$scope.serviceList = data;
                var promise = $interval(function () {
                    console.log("service");
                    console.log(data);
                    if (data != undefined) {
                        $interval.cancel(promise);
                        promise = undefined;
                        return { status: "SUCCESS", value: data };
                        //if (data.status == "FAILURE") {
                        //    if (data.value == 401)
                        //        $scope.sessionExpired = true;
                        //}
                        //else {
                        //    $scope.serviceList = data.value;
                        //}
                    }
                }, 500);
            })
            .error(function (response, status) {
                return { status: "FAILURE", value: status };
            })
            //return $http.get(url);
        });
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