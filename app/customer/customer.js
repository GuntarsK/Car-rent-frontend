'use strict';

angular.module('myApp.customer', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/customer', {
            templateUrl: 'customer/customer.html',
            controller: 'CustomerCtrl',
        });
    }])

    .controller('CustomerCtrl', ['$scope', '$http', '$routeParams', '$timeout',
        function($scope, $httpClient, $routeParams, $timeout) {

            var actionUrl = $routeParams.action;
            var id = $routeParams.id;
            $scope.customerArray = [];


            if (actionUrl === 'edit') {
                $scope.action = "Edit";
                $httpClient.get("http://127.0.0.1:8080/api/rest/customer.svc/customers")
                    .then(function (response) {
                        if (response.data.result != null && response.data.result === "SUCCESS") {
                            $scope.customerArray = response.data.holderList;
                        }
                        for (var i = 0; i < $scope.customerArray.length; ++i) {
                            if ($scope.customerArray[i].customer_pk == id) {
                                $scope.first_name = $scope.customerArray[i].first_name;
                                $scope.last_name = $scope.customerArray[i].last_name;
                                $scope.email = $scope.customerArray[i].email;
                                $scope.phone_number = $scope.customerArray[i].phone_number;
                                $scope.address = $scope.customerArray[i].address;
                            }
                        }
                    })

            } else {
                $scope.action = "Register new user";
            }


            $scope.submitCustomer = function () {
                console.log("Customer submit button clicked");

                var customerDto = {
                    "first_name": $scope.first_name,
                    "last_name": $scope.last_name,
                    "email": $scope.email,
                    "phone_number": $scope.phone_number,
                    "address": $scope.address,
                    "password_hash": "9999999",
                    "status_in_db": "ACTIVE"
                }
                if ($routeParams.action === 'edit') {
                    customerDto.customer_pk = $routeParams.id;
                }

                var submitData = JSON.stringify(customerDto);

                if ($routeParams.action === 'edit') {
                    $httpClient.put("http://127.0.0.1:8080/api/rest/customer.svc/customer", submitData)
                        .then(function (response) {
                            console.log(response);

                            if (response.data.result != null && response.data.result === "SUCCESS") {
                                window.location.href="#!/customerlist";

                            } else {
                                if (response.data.errorType === "ERROR") {
                                    document.getElementById("customerRegisterError").style.display = 'block';
                                    document.getElementById("customerRegisterWarning").style.display = 'none';
                                    document.getElementById("registerErrorMessage").textContent = response.data.message;
                                    $timeout( function () {
                                        document.getElementById("customerRegisterError").style.display = 'none';
                                    }, 2000);

                                } else if (response.data.errorType === "WARNING") {
                                    document.getElementById("customerRegisterError").style.display = 'none';
                                    document.getElementById("customerRegisterWarning").style.display = 'block';
                                    document.getElementById("registerWarningMessage").textContent = response.data.message;
                                    $timeout( function () {
                                        document.getElementById("customerRegisterWarning").style.display = 'none';
                                    }, 2000);
                                }
                            }
                        })

                } else {

                    $httpClient.post("http://127.0.0.1:8080/api/rest/customer.svc/customer", submitData)
                        .then(function (response) {
                            console.log(response);

                            if (response.data.result != null && response.data.result === "SUCCESS") {
                                window.location.href="#!/customerlist";

                               } else {
                                if (response.data.errorType === "ERROR") {
                                    document.getElementById("customerRegisterError").style.display = 'block';
                                    document.getElementById("customerRegisterWarning").style.display = 'none';
                                    document.getElementById("registerErrorMessage").textContent = response.data.message;
                                    $timeout( function () {
                                        document.getElementById("customerRegisterError").style.display = 'none';
                                    }, 2000);

                                } else if (response.data.errorType === "WARNING") {
                                    document.getElementById("customerRegisterError").style.display = 'none';
                                    document.getElementById("customerRegisterWarning").style.display = 'block';
                                    document.getElementById("registerWarningMessage").textContent = response.data.message;
                                    $timeout( function () {
                                        document.getElementById("customerRegisterWarning").style.display = 'none';
                                    }, 2000);
                                }
                            }
                        })
                }
            }

            $scope.returnClick = function () {
                window.location.href="#!/customerlist";
            }


        }]);
