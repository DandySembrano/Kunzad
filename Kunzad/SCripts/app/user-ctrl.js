kunzadApp.controller("UsersController", UsersController);
function UsersController($scope, $localForage, $http, $compile, $rootScope, $interval) {
    $localForage.getItem("Token").then(function (value) {
        $http.defaults.headers.common['Token'] = value;
    });
    $scope.modelName = "Booking";
    $scope.modelhref = "#/users";

    var watchChanges = $interval(function () {
        $scope.clientWidth = document.getElementsByClassName("navbar-branding dark")[0].clientWidth;
        if(document.getElementById("dragarea").offsetHeight < document.getElementById("droppable").offsetHeight){
            document.getElementById("droppable").className = "user-menus1";
            document.getElementById("dragarea").className = "my-menus1";
        }
        else
        {
            document.getElementById("droppable").className = "user-menus";
            document.getElementById("dragarea").className = "my-menus";
        }
    }, 100);

    $scope.setUser = function () {
        $scope.menuId = null;
        $scope.userIsError = false;
        $scope.userErrorMessage = "";
        $scope.viewOnly = false;
        $scope.dragging = false;
        $scope.dragForRemove = false;
        $scope.thisUserMenuList = [];
        $scope.thisUserMenuAccessList = [];
        $scope.openParents = [];
        $scope.openParents1 = [];
        $scope.openParentsAccess = [];
        $scope.submitType = "Create";
        $scope.url = document.URL.split("#")[0] + "api/Users";
        $scope.saveImage = false;
        
        $scope.userStatus = [{ Id: 1, Name: "Active" }, { Id: 0, Name: "Inactive" }];

        $scope.user = {
            Id: null,
            UserTypeId: null,
            LoginName: null,
            Password: null,
            FirstName: null,
            MiddleName: null,
            LastName: null,
            Email: null,
            BusinessUnitId: null,
            BusinessUnitName: null,
            CreatedByUserId: $scope.myInformation.Id,
            ImageName: null,
            Status: 1
        };

    };

    //Initialize User Type List for DropDown
    $scope.initUserTypeList = function () {
        $http.get("/api/UserTypes")
        .success(function (data, status) {
            $scope.userTypeList = data;
        })
    };

    //Send http post request
    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $scope.user.LoginName = $scope.user.LoginName.toUpperCase();
        $scope.user.FirstName = $scope.user.FirstName.toUpperCase();
        $scope.user.MiddleName = $scope.user.MiddleName.toUpperCase();
        $scope.user.LastName = $scope.user.LastName.toUpperCase();
        $scope.submitdefinition = $scope.user;
        $scope.submitdefinition.Id = 1;
        $scope.submitdefinition.UserMenus = [];
        for (var i = 0; i < $scope.thisUserMenuAccessList.length; i++)
        {
            $scope.UserMenu = {
                Id: -1,
                UserId: null,
                MenuId: null,
                MenuAccessId: null
            }

            if($scope.thisUserMenuAccessList[i].HasAccess == "Y"){
                $scope.UserMenu.MenuId = $scope.thisUserMenuAccessList[i].MenuId;
                $scope.UserMenu.MenuAccessId = $scope.thisUserMenuAccessList[i].MenuAccessId;
                $scope.submitdefinition.UserMenus.push($scope.UserMenu);
            }
        }
        
        $http.post($scope.url, $scope.submitdefinition)
            .success(function (response, status) {
                if (response.status == "SUCCESS") {
                    //Initialize Ids
                    $scope.viewOnly = true;
                    $scope.saveImage = true;
                    $scope.user.Id = response.objParam1.Id;
                    spinner.stop();
                    alert("Successfully Saved.");
                }
                else {
                    $scope.userIsError = true;
                    $scope.userErrorMessage = response.message;
                    window.scrollTo(0, 0);
                    spinner.stop();
                }
            })
            .error(function (response, status) {
                $scope.userIsError = true;
                $scope.userErrorMessage = response.message;
                window.scrollTo(0, 0);
                spinner.stop();
            })
    };

    //Send http put request
    $scope.apiUpdate = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.put($scope.submitdefinition.APIUrl + "/" + id, $scope.submitdefinition.DataItem)
            .success(function (response, status) {
                if (response.status == "SUCCESS") {
                    $scope.submitdefinition.DataItem = angular.copy(response.objParam1);
                    $scope.submitdefinition.Index = $scope.selectedIndex;
                    spinner.stop();
                    $scope.otheractions({ action: 'PostUpdate' });
                    return true;
                }
                else {
                    $scope.userIsError = true;
                    $scope.userErrorMessage = response.message;
                    spinner.stop();
                }
            })
            .error(function (response, status) {
                $scope.userIsError = true;
                $scope.userErrorMessage = response.message;
                spinner.stop();
            })
        return false;
    };

    //Send http delete request
    $scope.apiDelete = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.delete($scope.submitdefinition.APIUrl + "/" + id, $scope.submitdefinition.DataItem)
            .success(function (response, status) {
                if (response.status == "SUCCESS") {
                    $scope.submitdefinition.Index = $scope.selectedIndex;
                    $scope.submitdefinition.DataItem = angular.copy(response.objParam1);
                    spinner.stop();
                    $scope.otheractions({ action: 'PostDelete' });
                    return true;
                }
                else {
                    $scope.userIsError = true;
                    $scope.userErrorMessage = response.message;
                    spinner.stop();
                }
            })
            .error(function (response, status) {
                $scope.userIsError = true;
                $scope.userErrorMessage = response.message;
                spinner.stop();
            })
        return false;
    };

    //Function that check required fields
    $scope.checkRequiredFields = function () {
        if (user.LoginName == null || user.LoginName.trim() == '') {
            $scope.userIsError = true;
            $scope.userErrorMessage = "Login Name is required.";
            return false;
        }
        else if (user.FirstName == null || user.FirstName.trim() == '') {
            $scope.userIsError = true;
            $scope.userErrorMessage = "Login Name is required.";
            return false;
        }
        else if (user.MiddleName == null || user.MiddleName.trim() == '') {
            $scope.userIsError = true;
            $scope.userErrorMessage = "Login Name is required.";
            return false;
        }
        else if (user.LastName == null || user.LastName.trim() == '') {
            $scope.userIsError = true;
            $scope.userErrorMessage = "Login Name is required.";
            return false;
        }
        else if (user.Email == null || user.Email.trim() == '') {
            $scope.userIsError = true;
            $scope.userErrorMessage = "Login Name is required.";
            return false;
        }
        else if (user.BusinessUnitId == null || user.BusinessUnitId.trim() == '') {
            $scope.userIsError = true;
            $scope.userErrorMessage = "Login Name is required.";
            return false;
        }
        return true;
    };

    $scope.userOtheractions = function (action) {
        switch (action) {
            case 'Find':
                $scope.showUser();
                break;
            case 'Create':
                $scope.setUser();
                break;
            case 'Save':
                $scope.submit();
                break;
            case 'Edit':
                $scope.viewOnly = false;
                $scope.submitType = "Update";
                break;
            case 'Delete':
                $scope.submitType = "Delete";
                break;
            case 'Upload':
                var id = $scope.user.Id;
                var imageHolder;
                var flag = false;
                var files = $("#employeeImage").get(0).files;
                if (files.length > 0) {
                    var data = new FormData();
                    for (i = 0; i < files.length; i++) {
                        if (files[i].type == "image/jpeg") {
                            data.append("file" + i, files[i]);
                            imageHolder = files[i].name;
                        }
                        else
                        {
                            alert("Please choose image file.");
                            i = files.length;
                            flag = true;
                        }
                    }
                    $http.post("/api/fileupload?userId=" + id, data, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                    .success(function () {
                        alert("Successfully Uploaded.");
                        $scope.user.ImageName = imageHolder;
                    })
                    .error(function () {
                        alert("Error while invoking the Web API");
                    })
                }
                break;
        }
    }

    $scope.submit = function () {
        if ($scope.user.Status == null || $scope.user.Status == false)
            $scope.user.Status = 0;
        else
            $scope.user.Status = 1
        switch ($scope.submitType) {
            case 'Create':
                $scope.apiCreate();
                break;
            case 'Update':
                $scope.apiUpdate();
                break;
            case 'Delete':
                $scope.apiDelete();
                break;
        }
    };

    //Disable typing
    $('#BusinessUnit').keypress(function (key) {
        return false;
    });
    //Evaluate if child menus will be shown for logged user
    $scope.showMe = function (id) {
        if ($scope.openParents.indexOf(id) != -1) {
            return true;
        }
        else
            return false;
    };
    //Evaluate if child menus will be shown for this user
    $scope.showMe1 = function (id) {
        if ($scope.openParents1.indexOf(id) != -1) {
            return true;
        }
        else
            return false;
    };
    //Evaluate if menu access per menu will be shown for this user
    $scope.showMe3 = function (id) {
        if ($scope.openParentsAccess.indexOf(id) != -1) {
            return true;
        }
        else
            return false;
    };
    //Set the position of dragged menu
    $scope.setPosition = function (label, position, left, top) {
        document.getElementById("draggable").innerHTML = label;
        document.getElementById("draggable").style.position = position;
        document.getElementById("draggable").style.left = left - $scope.clientWidth + "px";
        document.getElementById("draggable").style.top = top + "px";
        if ($scope.dragging) {
            document.getElementById("droparea").className = "droparea noselect";
            document.getElementById("droparea").style.top = event.pageY - 100 + "px";
        }
        else {
            document.getElementById("droparea").className = "noselect";
            document.getElementById("droparea").style.top = 0 + "px";
        }
    };
    //Modify caret class in each parent menu for logged
    $scope.caretClicked = function (elementId, menuId) {
        $scope.dragging = false;
        //If dropped is true then add menu to user, $scope.menuId
        $scope.setPosition("", "absolute", 0, 0);
        $scope.index = $scope.openParents.indexOf(menuId);
        $scope.element = document.getElementById('"' + elementId + '"');

        if ($scope.index == -1) {
            $scope.element.className = "parent-menu-caret-open";
            $scope.openParents.push(menuId);
        }
        else {
            $scope.element.className = "parent-menu-caret-close";
            $scope.openParents.splice($scope.index, 1);
        }
    };
    //Modify caret class in each parent menu for this user
    $scope.caretClicked1 = function (elementId, menuId) {
        $scope.dragging = false;
        //If dropped is true then add menu to user, $scope.menuId
        $scope.setPosition("", "absolute", 0, 0);
        $scope.index = $scope.openParents1.indexOf(menuId);
        $scope.element = document.getElementById('"' + elementId + '"');

        if ($scope.index == -1) {
            $scope.element.className = "parent-menu-caret-open";
            $scope.openParents1.push(menuId);
        }
        else {
            $scope.element.className = "parent-menu-caret-close";
            $scope.openParents1.splice($scope.index, 1);
        }
    };
    //Modify caret class in each menu for this user
    $scope.caretClicked2 = function (elementId, menuId) {
        $scope.dragging = false;
        //If dropped is true then add menu to user, $scope.menuId
        $scope.setPosition("", "absolute", 0, 0);
        $scope.index = $scope.openParentsAccess.indexOf(menuId);
        $scope.element = document.getElementById('"' + elementId + '"');

        if ($scope.index == -1) {
            $scope.element.className = "menu-access-caret-open";
            $scope.openParentsAccess.push(menuId);
        }
        else {
            $scope.element.className = "menu-access-caret-close";
            $scope.openParentsAccess.splice($scope.index, 1);
        }
    };
    $scope.onMouseOver = function (elementId) {
        if (document.getElementById(elementId) != null) {
            document.getElementById(elementId).style.fontStyle = "italic";
            document.getElementById(elementId).style.color = "black";
        }
    };
    $scope.onMouseLeave = function (elementId) {
        if (document.getElementById(elementId) != null) {
            document.getElementById(elementId).style.fontStyle = "normal";
            document.getElementById(elementId).style.color = "#666666";
        }
    };
    //Invokes during clicked on menus
    $scope.onMouseDown = function (id, label, dragForRemove) {
        if (event.which == 1 && !$scope.viewOnly) {
            if (id != "draggable") {
                $scope.dragging = true;
                $scope.dragForRemove = dragForRemove;
                $scope.menuId = id;
                $scope.setPosition(label, "absolute", event.pageX, event.pageY);
            }
        }
    };
    //Invokes during mouse move in menu div
    $scope.onMouseMove = function () {
        if ($scope.dragging)
            $scope.setPosition(document.getElementById("draggable").innerHTML, "absolute", event.pageX, event.pageY);
        
    };
    //Invokes during mouse release
    $scope.onMouseUp = function (dropped) {
        $scope.dragging = false;
        //If dropped is true then add menu to user, $scope.menuId
        $scope.setPosition("", "absolute", 0, 0);
        if (dropped) {
            $scope.addUserMenu($scope.menuId);
        }
        else {
            if ($scope.dragForRemove)
                $scope.removeUserMenu($scope.menuId);
        }
    };
    //Close open modal
    $scope.closeModal = function () {
        jQuery.magnificPopup.close();
        if (angular.isDefined($scope.businessUnitDataDefinition)) {
            $scope.businessUnitDataDefinition.DataList = [];
            $scope.businessUnitFilteringDefinition.DataList = [];
            $rootScope.removeElement("businessUnitGrid");
            $rootScope.removeElement("businessUnitFilter");
        }

        if (angular.isDefined($scope.userDataDefinition)) {
            $scope.userDataDefinition.DataList = [];
            $scope.userFilteringDefinition.DataList = [];
            $rootScope.removeElement("userUnitGrid");
            $rootScope.removeElement("userFilter");
        }
    };

    //=====================================USER MENU MANIPULATION==================================
    $scope.menuExist = function (menuId) {
        for (var i = 0; i < $scope.thisUserMenuList.length; i++) {
            if ($scope.thisUserMenuList[i].Id == menuId)
                return true;
        }
        return false;
    };

    $scope.addThisUserMenuAccess = function (menuId) {
        var index = 0;
        for (var j = 0; j < $scope.menuAccess.length; j++) {
            if ($scope.menuAccess[j].MenuId == menuId) {
                $scope.holderMenuAccess = {
                    Id: null,
                    UserId: null,
                    MenuId: menuId,
                    MenuAccessId: $scope.menuAccess[j].Id,
                    Access: $scope.menuAccess[j].Access,
                    HasAccess: "N",
                    Sort: 0
                };

                $scope.thisUserMenuAccessList.push($scope.holderMenuAccess);
                index = $scope.thisUserMenuAccessList.length - 1;
                switch ($scope.thisUserMenuAccessList[index].Access) {
                    case "VIEW":
                        $scope.thisUserMenuAccessList[index].HasAccess = "Y";
                        $scope.thisUserMenuAccessList[index].Sort = 1;
                        break;
                    case "CREATE":
                        $scope.thisUserMenuAccessList[index].HasAccess = "N";
                        $scope.thisUserMenuAccessList[index].Sort = 2;
                        break;
                    case "EDIT":
                        $scope.thisUserMenuAccessList[index].HasAccess = "N";
                        $scope.thisUserMenuAccessList[index].Sort = 3;
                        break;
                    case "DELETE":
                        $scope.thisUserMenuAccessList[index].HasAccess = "N";
                        $scope.thisUserMenuAccessList[index].Sort = 4;
                        break;
                    default:
                        $scope.thisUserMenuAccessList[index].HasAccess = "N";
                        $scope.thisUserMenuAccessList[index].Sort = 5;
                }
            }
        }
    };

    $scope.addThisUserMenuAccess1 = function (menuId, UserMenuAccessId, UserId, MenuAccessId) {
        var index = 0;
        for (var j = 0; j < $scope.menuAccess.length; j++) {
            if ($scope.menuAccess[j].MenuId == menuId && $scope.menuAccess[j].Id == MenuAccessId) {
                $scope.holderMenuAccess = {
                    Id: UserMenuAccessId,
                    UserId: UserId,
                    MenuId: menuId,
                    MenuAccessId: $scope.menuAccess[j].Id,
                    Access: $scope.menuAccess[j].Access,
                    HasAccess: "Y",
                    Sort: 0
                };

                $scope.thisUserMenuAccessList.push($scope.holderMenuAccess);
                index = $scope.thisUserMenuAccessList.length - 1;
                switch ($scope.thisUserMenuAccessList[index].Access) {
                    case "VIEW":
                        $scope.thisUserMenuAccessList[index].Sort = 1;
                        break;
                    case "CREATE":
                        $scope.thisUserMenuAccessList[index].Sort = 2;
                        break;
                    case "EDIT":
                        $scope.thisUserMenuAccessList[index].Sort = 3;
                        break;
                    case "DELETE":
                        $scope.thisUserMenuAccessList[index].Sort = 4;
                        break;
                    default:
                        $scope.thisUserMenuAccessList[index].Sort = 5;
                }
                break;
            }
        }
    };

    $scope.addUserMenu = function (menuId) {
        //Add menu to this user
        for (var i = 0; i < $scope.menu.length; i++) {
            if ($scope.menu[i].Id == menuId) {
                if (!$scope.menuExist(menuId) && $scope.menu[i].IsParent == "N") {
                    $scope.thisUserMenuList.push($scope.menu[i]);
                    $scope.addThisUserMenuAccess(menuId);
                    break;
                }
            }
        }

        //Get Child/Children
        for (var i = 0; i < $scope.menu.length; i++) {
            if ($scope.menu[i].Id == menuId) {
                //If Group Menu Item
                if ($scope.menu[i].ParentId != null && $scope.menu[i].IsParent == "Y") {
                    //Get Menu Item
                    for (var j = 0; j < $scope.menu.length; j++) {
                        if($scope.menu[j].ParentId == $scope.menu[i].Id)
                        {
                            if (!$scope.menuExist($scope.menu[j].Id)) {
                                $scope.thisUserMenuList.push($scope.menu[j]);
                                $scope.addThisUserMenuAccess($scope.menu[j].Id);
                            }
                        }
                    }
                }
                else {
                    for (var j = 0; j < $scope.menu.length; j++) {
                        //Get Group Menu Item
                        if ($scope.menu[j].ParentId == $scope.menu[i].Id) {
                            if (!$scope.menuExist($scope.menu[j].Id)) {
                                //Get Menu Item
                                for (var k = 0; k < $scope.menu.length; k++) {
                                     if ($scope.menu[k].ParentId == $scope.menu[j].Id) {
                                         if (!$scope.menuExist($scope.menu[k].Id)) {
                                             $scope.thisUserMenuList.push($scope.menu[k]);
                                             $scope.addThisUserMenuAccess($scope.menu[k].Id);
                                         }
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
    };
    
    $scope.removeMenuAccess = function (menuId) {
        for (var menuIndex = 0; menuIndex < $scope.thisUserMenuAccessList.length; menuIndex++) {
            if ($scope.thisUserMenuAccessList[menuIndex].MenuId == menuId) {
                $scope.thisUserMenuAccessList.splice(menuIndex, 1);
                menuIndex = menuIndex - 1;
            }
        }
    };

    $scope.removeUserMenu = function (menuId) {
        var index = 0;
        for (var i = 0; i < $scope.thisUserMenuList.length; i++) {
            //Remove Child Menu
            if ($scope.thisUserMenuList[i].IsParent == "N") {
                if ($scope.thisUserMenuList[i].Id == menuId) {
                    //Remove MenuAccess
                    $scope.removeMenuAccess($scope.thisUserMenuList[i].Id);
                    $scope.thisUserMenuList.splice(i, 1);
                    break;
                }

            }
        }

        for (var i = 0; i < $scope.menu.length; i++) {
            if ($scope.menu[i].Id == menuId) {
                //Remove child of Group Menu Item
                if ($scope.menu[i].ParentId != null && $scope.menu[i].IsParent == "Y") {
                    //Remove child of Group Menu Item
                    for (var j = 0; j < $scope.thisUserMenuList.length; j++) {
                        if ($scope.thisUserMenuList[j].ParentId == menuId) {
                            //Remove MenuAccess
                            $scope.removeMenuAccess($scope.thisUserMenuList[j].Id);
                            $scope.thisUserMenuList.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
                //Remove child of group menu
                else {
                    for (var j = 0; j < $scope.menu.length; j++) {
                        //Get Item of Group Menu
                        if ($scope.menu[j].ParentId == menuId) {
                            //Get child of Group Menu  Item
                            for (var k = 0; k < $scope.thisUserMenuList.length; k++) {
                                if ($scope.thisUserMenuList[k].ParentId == $scope.menu[j].Id) {
                                    //Remove MenuAccess
                                    $scope.removeMenuAccess($scope.thisUserMenuList[k].Id);
                                    $scope.thisUserMenuList.splice(k, 1);
                                    k = k - 1;
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
    };

    $scope.thisGetAccess = function (menuId) {
        var menuAccess = [];
        for (var i = 0; i < $scope.thisUserMenuAccessList.length; i++) {
            if ($scope.thisUserMenuAccessList[i].MenuId == menuId)
                menuAccess.push($scope.thisUserMenuAccessList[i]);
        }
        return menuAccess;
    };

    $scope.hasChild1 = function (menuId) {
        for (var i = 0; i < $scope.thisUserMenuList.length; i++) {
            if ($scope.thisUserMenuList[i].ParentId == menuId) {
                return true;
            }
        }
        return false;
    };

    $scope.showGroupMenu1 = function (menuId) {
        //Show Group Menu if at least one of it's item(Group Menu Item) has child
        for (var i = 0; i < $scope.groupMenuItem.length; i++) {
            if ($scope.groupMenuItem[i].ParentId == menuId) {
                if ($scope.hasChild1($scope.groupMenuItem[i].Id)) {
                    return true;
                }
            }
        }
        return false;
    };

    $scope.hasMenu1 = function (menuId) {
        for (var i = 0; i < $scope.thisUserMenuList.length; i++) {
            if ($scope.thisUserMenuList[i].Id == menuId) {
                return true;
            }
        }
        return false;
    };
    //==================================END OF USER MENU MANIPULATION===============================

    //=====================================BUSINESS UNIT MODAL======================================
    $scope.showBusinessUnit = function () {
        openModalPanel2("#business-unit-list-modal");
        $scope.loadBusinessUnitDataGrid();
        $scope.loadBusinessUnitFiltering();

        $scope.businessUnitFilteringDefinition.SetSourceToNull = true;
        $scope.businessUnitDataDefinition.Retrieve = true;

    };
    //Load businessUnit filtering for compiling
    $scope.loadBusinessUnitFiltering = function () {
        $scope.initBusinessUnitFilteringParameters();
        $scope.initBusinessUnitFilteringContainter();
    };
    //initialize businessUnit filtering parameters
    $scope.initBusinessUnitFilteringContainter = function () {
        html = '<dir-filtering  id = "businessUnitFilter" filterdefinition="businessUnitFilteringDefinition"' +
                                'filterlistener="businessUnitDataDefinition.Retrieve"' +
                                'otheractions="businessUnitOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#businessUnitFilterContainter')).html(html);
        $compile($content)($scope);
    };
    //function that will be called during compiling of business unit filtering to DOM
    $scope.initBusinessUnitFilteringParameters = function () {
        $scope.initBusinessUnitFilteringDefinition = function () {
            $scope.businessUnitFilteringDefinition = {
                "Url": ($scope.businessUnitDataDefinition.EnablePagination == true ? 'api/BusinessUnits?type=paginate&param1=' + $scope.businessUnitDataDefinition.CurrentPage : 'api/BusinessUnits?type=scroll&param1=' + $scope.businessUnitDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "Code", "Column": "Code", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Name", "Column": "Name", "Values": [], "From": null, "To": null, "Type": "Default" },
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.businessUnitOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.businessUnitSource = $scope.businessUnitFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.businessUnitSource.length; i++) {
                        if ($scope.businessUnitSource[i].Type == "Date") {
                            $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0][$scope.businessUnitSource[i].Column] = $scope.businessUnitSource[i].From;
                            $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[1][$scope.businessUnitSource[i].Column] = $scope.businessUnitSource[i].To;
                        }
                        else
                            $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0][$scope.businessUnitSource[i].Column] = $scope.businessUnitSource[i].From;
                    }

                    if ($scope.businessUnitDataDefinition.EnablePagination == true && $scope.businessUnitFilteringDefinition.ClearData) {
                        $scope.businessUnitDataDefinition.CurrentPage = 1;
                        $scope.businessUnitFilteringDefinition.Url = 'api/BusinessUnits?type=paginate&param1=' + $scope.businessUnitDataDefinition.CurrentPage;
                    }
                    else if ($scope.businessUnitDataDefinition.EnablePagination == true) {
                        $scope.businessUnitDataDefinition.DataList = [];
                        $scope.businessUnitFilteringDefinition.Url = 'api/BusinessUnits?type=paginate&param1=' + $scope.businessUnitDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.businessUnitFilteringDefinition.ClearData)
                            $scope.businessUnitDataDefinition.DataList = [];
                        $scope.businessUnitFilteringDefinition.Url = 'api/BusinessUnits?type=scroll&param1=' + $scope.businessUnitDataDefinition.DataList.length;
                    }
                    //$scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0].ParentBusinessUnitId = $scope.shipmentItem.BusinessUnit.Id;
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize businessUnitDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize businessUnitDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.businessUnitFilteringDefinition.DataList = $rootScope.formatBusinessUnit($scope.businessUnitFilteringDefinition.DataList);
                    if ($scope.businessUnitDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.businessUnitFilteringDefinition.DataList.length; j++)
                            $scope.businessUnitDataDefinition.DataList.push($scope.businessUnitFilteringDefinition.DataList[j]);
                    }

                    if ($scope.businessUnitDataDefinition.EnablePagination == true) {
                        $scope.businessUnitDataDefinition.DataList = [];
                        $scope.businessUnitDataDefinition.DataList = $scope.businessUnitFilteringDefinition.DataList;
                        $scope.businessUnitDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initBusinessUnitDataItems = function () {
            $scope.businessUnitFilteringDefinition.DataItem1 = angular.copy($rootScope.businessUnitObj());
        };

        $scope.initBusinessUnitFilteringDefinition();
        $scope.initBusinessUnitDataItems();
    };
    //Load business datagrid for compiling
    $scope.loadBusinessUnitDataGrid = function () {
        $scope.initBusinessUnitDataGrid();
        $scope.compileBusinessUnitDataGrid();
    };
    //initialize businessUnit datagrid parameters
    $scope.initBusinessUnitDataGrid = function () {
        $scope.businessUnitSubmitDefinition = undefined;
        $scope.initializeBusinessUnitDataDefinition = function () {
            $scope.businessUnitDataDefinition = {
                "Header": ['Code', 'Name', 'Main Business Unit', 'Business Unit Type', 'Is Operating Site?', 'Has Airport?', 'Has Seaport?', 'No.'],
                "Keys": ['Code', 'Name', 'ParentBusinessUnit[0].Name', 'BusinessUnitType[0].Name', 'isOperatingSite', 'hasAirPort', 'hasSeaPort'],
                "Type": ['Default', 'ProperCase', 'ProperCase', 'ProperCase', 'Bit', 'Bit', 'Bit'],
                "ColWidth": [150, 200, 200, 200, 150, 150, 150],
                "DataList": [],
                "RequiredFields": [],
                "CellTemplate": ["None"],
                "RowTemplate": "Default",
                "EnableScroll": true,
                "EnablePagination": false,
                "CurrentPage": 1, //By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "Retrieve": false, //By default
                "DataItem": {},
                "DataTarget": "BusinessUnitMenu",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""],
                "IsDetail": false
            }
            $scope.businessUnitDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                              '</div>';
        };
        $scope.businessUnitOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    $scope.user.BusinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                    $scope.user.BusinessUnitName = $scope.businessUnitDataDefinition.DataItem.Name;
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeBusinessUnitDataDefinition();
    };
    //function that will be invoked during compiling of businessUnit datagrid to DOM
    $scope.compileBusinessUnitDataGrid = function () {
        var html = '<dir-data-grid2 id = "businessUnitGrid" datadefinition      = "businessUnitDataDefinition"' +
                                    'submitdefinition   = "businessUnitSubmitDefinition"' +
                                    'otheractions       = "businessUnitOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#businessUnitContainer')).html(html);
        $compile($content)($scope);
    };
    //=======================================END OF BUSINESS UNIT MODAL==============================

    //=====================================USER MODAL======================================
    $scope.showUser = function () {
        openModalPanel2("#user-list-modal");
        $scope.loadUserDataGrid();
        $scope.loadUserFiltering();

        $scope.userFilteringDefinition.SetSourceToNull = true;
        $scope.userDataDefinition.Retrieve = true;

    };
    //Load user filtering for compiling
    $scope.loadUserFiltering = function () {
        $scope.initUserFilteringParameters();
        $scope.initUserFilteringContainter();
    };
    //initialize user filtering parameters
    $scope.initUserFilteringContainter = function () {
        html = '<dir-filtering  id = "userFilter" filterdefinition="userFilteringDefinition"' +
                                'filterlistener="userDataDefinition.Retrieve"' +
                                'otheractions="userOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#userFilterContainter')).html(html);
        $compile($content)($scope);
    };
    //function that will be called during compiling of business unit filtering to DOM
    $scope.initUserFilteringParameters = function () {
        $scope.initUserFilteringDefinition = function () {
            $scope.userFilteringDefinition = {
                "Url": ($scope.userDataDefinition.EnablePagination == true ? 'api/Users?type=paginate&param1=' + $scope.userDataDefinition.CurrentPage : 'api/Users?type=scroll&param1=' + $scope.userDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "Login Name", "Column": "LoginName", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "First Name", "Column": "FirstName", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 2, "Label": "Middle Name", "Column": "MiddleName", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 3, "Label": "Last Name", "Column": "LastName", "Values": [], "From": null, "To": null, "Type": "Default" },
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.userOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.userSource = $scope.userFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.userSource.length; i++) {
                        if ($scope.userSource[i].Type == "Date") {
                            $scope.userFilteringDefinition.DataItem1.User[0][$scope.userSource[i].Column] = $scope.userSource[i].From;
                            $scope.userFilteringDefinition.DataItem1.User[1][$scope.userSource[i].Column] = $scope.userSource[i].To;
                        }
                        else
                            $scope.userFilteringDefinition.DataItem1.User[0][$scope.userSource[i].Column] = $scope.userSource[i].From;
                    }

                    if ($scope.userDataDefinition.EnablePagination == true && $scope.userFilteringDefinition.ClearData) {
                        $scope.userDataDefinition.CurrentPage = 1;
                        $scope.userFilteringDefinition.Url = 'api/Users?type=paginate&param1=' + $scope.userDataDefinition.CurrentPage;
                    }
                    else if ($scope.userDataDefinition.EnablePagination == true) {
                        $scope.userDataDefinition.DataList = [];
                        $scope.userFilteringDefinition.Url = 'api/Users?type=paginate&param1=' + $scope.userDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.userFilteringDefinition.ClearData)
                            $scope.userDataDefinition.DataList = [];
                        $scope.userFilteringDefinition.Url = 'api/Users?type=scroll&param1=' + $scope.userDataDefinition.DataList.length;
                    }
                    //$scope.userFilteringDefinition.DataItem1.User[0].ParentUserId = $scope.shipmentItem.User.Id;
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize userDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize userDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.userFilteringDefinition.DataList = $rootScope.formatUser($scope.userFilteringDefinition.DataList);
                    if ($scope.userDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.userFilteringDefinition.DataList.length; j++)
                            $scope.userDataDefinition.DataList.push($scope.userFilteringDefinition.DataList[j]);
                    }

                    if ($scope.userDataDefinition.EnablePagination == true) {
                        $scope.userDataDefinition.DataList = [];
                        $scope.userDataDefinition.DataList = $scope.userFilteringDefinition.DataList;
                        $scope.userDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initUserDataItems = function () {
            $scope.userFilteringDefinition.DataItem1 = angular.copy($rootScope.userObj());
        };

        $scope.initUserFilteringDefinition();
        $scope.initUserDataItems();
    };
    //Load business datagrid for compiling
    $scope.loadUserDataGrid = function () {
        $scope.initUserDataGrid();
        $scope.compileUserDataGrid();
    };
    //initialize user datagrid parameters
    $scope.initUserDataGrid = function () {
        $scope.userSubmitDefinition = undefined;
        $scope.initializeUserDataDefinition = function () {
            $scope.userDataDefinition = {
                "Header": ['Login Name', 'First Name', 'Middle Name', 'Last Name', 'User Type', 'Business Unit', 'No.'],
                "Keys": ['LoginName', 'FirstName', 'MiddleName', 'LastName', 'UserType[0].Name', 'BusinessUnit[0].Name'],
                "Type": ['Default', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase'],
                "ColWidth": [150, 200, 200, 200, 200, 200],
                "DataList": [],
                "RequiredFields": [],
                "CellTemplate": ["None"],
                "RowTemplate": "Default",
                "EnableScroll": true,
                "EnablePagination": false,
                "CurrentPage": 1, //By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "Retrieve": false, //By default
                "DataItem": {},
                "DataTarget": "UserMenu",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""],
                "IsDetail": false
            }
            $scope.userDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                              '</div>';
        };
        $scope.userOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    $scope.user.Id = $scope.userDataDefinition.DataItem.Id;
                    $scope.user.LoginName = $scope.userDataDefinition.DataItem.LoginName;
                    $scope.user.FirstName = $scope.userDataDefinition.DataItem.FirstName;
                    $scope.user.MiddleName = $scope.userDataDefinition.DataItem.MiddleName;
                    $scope.user.LastName = $scope.userDataDefinition.DataItem.LastName;
                    $scope.user.Email = $scope.userDataDefinition.DataItem.Email;
                    $scope.user.UserTypeId = $scope.userDataDefinition.DataItem.UserTypeId;
                    $scope.user.BusinessUnitId = $scope.userDataDefinition.DataItem.BusinessUnitId;
                    $scope.user.BusinessUnitName = $scope.userDataDefinition.DataItem.BusinessUnit[0].Name;
                    $scope.user.ImageName = $scope.userDataDefinition.DataItem.ImageName;
                    $scope.user.Status = $scope.userDataDefinition.DataItem.Status;
                    $scope.closeModal();
                    $scope.thisUserMenuList = [];
                    $scope.thisUserMenuAccessList = [];
                   
                    for (var i = 0; i < $scope.userDataDefinition.DataItem.UserMenus.length; i++) {
                        for (var j = 0; j < $scope.menu.length; j++) {
                            if ($scope.userDataDefinition.DataItem.UserMenus[i].MenuId == $scope.menu[j].Id) {
                                if (!$scope.menuExist($scope.menu[j].Id)) {
                                    //Add user menu
                                    $scope.thisUserMenuList.push($scope.menu[j]);
                                    break;
                                }
                            }
                        }
                    }

                    for (var i = 0; i < $scope.userDataDefinition.DataItem.UserMenus.length; i++) {
                        for (var j = 0; j < $scope.menu.length; j++) {
                            if ($scope.userDataDefinition.DataItem.UserMenus[i].MenuId == $scope.menu[j].Id) {
                                //Add Menu Access
                                $scope.addThisUserMenuAccess1($scope.menu[j].Id, $scope.userDataDefinition.DataItem.UserMenus[i].Id, $scope.userDataDefinition.DataItem.UserMenus[i].UserId, $scope.userDataDefinition.DataItem.UserMenus[i].MenuAccessId);
                            }
                        }
                    }

                    $scope.viewOnly = true;
                    $scope.saveImage = true;
                    return true;
                default: return true;
            }
        };
        $scope.initializeUserDataDefinition();
    };
    //function that will be invoked during compiling of user datagrid to DOM
    $scope.compileUserDataGrid = function () {
        var html = '<dir-data-grid2 id = "userGrid" datadefinition      = "userDataDefinition"' +
                                    'submitdefinition   = "userSubmitDefinition"' +
                                    'otheractions       = "userOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#userContainer')).html(html);
        $compile($content)($scope);
    };
    //=======================================END OF USER MODAL==============================

    $scope.init = function() {
        $localForage.getItem("Token").then(function (value) {
            $http.defaults.headers.common['Token'] = value;
            $scope.initUserTypeList();
        });
        $scope.setUser();
    };
    $scope.init();

    $scope.$on('$destroy', function () {
        $interval.cancel(watchChanges);
        watchChanges = undefined;
    });
}