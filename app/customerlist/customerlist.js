'use strict';

angular.module('myApp.customerlist', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/customerlist', {
            templateUrl: 'customerlist/customerlist.html',
            controller: 'CustomerlistCtrl'
        });
    }])

    .controller('CustomerlistCtrl', ['$scope', '$http', '$timeout',
        function($scope, $httpClient, $timeout) {

            $scope.customerArray = [];

            $scope.searchClick = function ($) {

                var customerDto = {
                    first_name: $scope.firstNameSearch,
                    last_name: $scope.lastNameSearch,
                    email: $scope.emailSearch,
                    phone_number: $scope.phoneNumberSearch,
                    address: $scope.addressSearch,
                }

                var submitData = JSON.stringify(customerDto, function (key, value) {
                    if (value === "") {
                        return null;
                    }
                    return value;
                })

                $httpClient.post("http://127.0.0.1:8080/api/rest/customer.svc/customers/search",submitData)
                    .then(function (response) {
                        console.log(response);
                        if (response.data.result != null && response.data.result === "SUCCESS") {
                            $scope.customerArray = response.data.holderList;
                        }
                    })

            }


            $httpClient.get("http://127.0.0.1:8080/api/rest/customer.svc/customers")
                .then(function (response) {
                    if (response.data.result != null && response.data.result === "SUCCESS") {
                        $scope.customerArray = response.data.holderList;
                    }
                    console.log(response);
                })


            $scope.deleteClick = function (customerPk) {
                $httpClient.delete("http://127.0.0.1:8080/api/rest/customer.svc/customer("+customerPk+")")
                    .then(function (response) {
                        if (response.data != null && response.data.result === "SUCCESS") {
                            for (var i = 0; i < $scope.customerArray.length; ++i) {
                                if ($scope.customerArray[i].customer_pk === customerPk) {
                                    $scope.customerArray.splice(i, 1);
                                    console.log("DELETED PK: " + customerPk);
                                }
                            }
                            if (response.data.result === "SUCCESS") {
                                document.getElementById("customerDeleteError").style.display = 'none';
                                document.getElementById("customerDeleteWarning").style.display = 'none';
                                document.getElementById("customerDeleteSuccess").style.display = 'block';
                                document.getElementById("deleteSuccessMessage").textContent = response.data.message;
                                $timeout( function () {
                                    document.getElementById("customerDeleteSuccess").style.display = 'none';
                                }, 2000);
                            }
                        } else {
                            if (response.data.errorType === "ERROR") {
                                document.getElementById("customerDeleteError").style.display = 'block';
                                document.getElementById("customerDeleteWarning").style.display = 'none';
                                document.getElementById("customerDeleteSuccess").style.display = 'none';
                                document.getElementById("deleteErrorMessage").textContent = response.data.message;
                                $timeout( function () {
                                    document.getElementById("customerDeleteError").style.display = 'none';
                                }, 2000);

                            } else if (response.data.errorType === "WARNING") {
                                document.getElementById("customerDeleteError").style.display = 'none';
                                document.getElementById("customerDeleteWarning").style.display = 'block';
                                document.getElementById("customerDeleteSuccess").style.display = 'none';
                                document.getElementById("deleteWarningMessage").textContent = response.data.message;
                                $timeout( function () {
                                    document.getElementById("customerDeleteWarning").style.display = 'none';
                                }, 2000);
                            }
                        }
                    })
            }


            $scope.updateClick = function (customerPk) {
                window.location.href="#!/customer?action=edit&id=" + customerPk;
            }

            $scope.addNewClick = function () {
                window.location.href="#!/customer";
            }



        }]);
