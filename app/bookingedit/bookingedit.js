'use strict';

angular.module('myApp.bookingedit', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/bookingedit', {
            templateUrl: 'bookingedit/bookingedit.html',
            controller: 'BookingeditCtrl'
        });
    }])

    .controller('BookingeditCtrl', ['$scope', '$http', '$routeParams', '$timeout',
        function($scope, $httpClient, $routeParams, $timeout) {

            var actionUrl = $routeParams.action;
            var id = $routeParams.id;
            $scope.bookingArray = [];
            $scope.customerArray = [];
            $scope.carArray = [];
            $scope.availableCarArray = [];

            if (actionUrl === 'edit') {
                $scope.action = "Edit";

                $httpClient.get("http://127.0.0.1:8080/api/rest/booking.svc/bookings")
                    .then(function (response) {
                        if (response.data.result != null && response.data.result === "SUCCESS") {
                            $scope.bookingArray = response.data.holderList;
                        }

                        $httpClient.get("http://127.0.0.1:8080/api/rest/customer.svc/customers")
                            .then(function (response) {
                                if (response.data.result != null && response.data.result === "SUCCESS") {
                                    $scope.customerArray = response.data.holderList;
                                }
                                for (var i = 0; i < $scope.bookingArray.length; ++i) {
                                    if ($scope.bookingArray[i].booking_pk == id) {
                                        $scope.customer = $scope.customerArray[$scope.bookingArray[i].customer_pk - 1].first_name + " "
                                            + $scope.customerArray[$scope.bookingArray[i].customer_pk - 1].last_name;
                                    }
                                }
                            })

                        $httpClient.get("http://127.0.0.1:8080/api/rest/car.svc/cars")
                            .then(function (response) {
                                if (response.data.result != null && response.data.result === "SUCCESS") {
                                    $scope.carArray = response.data.holderList;
                                }
                                for (var i = 0; i < $scope.bookingArray.length; ++i) {
                                    if ($scope.bookingArray[i].booking_pk == id) {
                                        $scope.car = $scope.carArray[$scope.bookingArray[i].car_pk - 1].make + " "
                                            + $scope.carArray[$scope.bookingArray[i].car_pk - 1].model;
                                    }
                                }
                            })

                        for (var i = 0; i < $scope.bookingArray.length; ++i) {
                            if ($scope.bookingArray[i].booking_pk == id) {
                                $scope.date_from = $scope.bookingArray[i].date_from;
                                $scope.date_to = $scope.bookingArray[i].date_to;
                                console.log($scope.bookingArray[i].date_from);
                            }
                        }
                    })

            } else {
                $scope.action = "Create new booking";
            }


            $httpClient.get("http://127.0.0.1:8080/api/rest/customer.svc/customers")
                .then(function (response) {
                    if (response.data.result != null && response.data.result === "SUCCESS") {
                        $scope.customerArray = response.data.holderList;
                    }
                    console.log(response);
                })

            $scope.dateFrom = {
                value: new Date()
            }
            $scope.dateTo = {
                value: new Date()
            }


            $httpClient.get("http://127.0.0.1:8080/api/rest/customer.svc/customers")
                .then(function (response) {
                    if (response.data.result != null && response.data.result === "SUCCESS") {
                        $scope.customers = response.data.holderList;
                    }
                })

            $httpClient.get("http://127.0.0.1:8080/api/rest/car.svc/cars")
                .then(function (response) {
                    if (response.data.result != null && response.data.result === "SUCCESS") {
                        $scope.carArray = response.data.holderList;

                        for (var i = 0; i < $scope.carArray.length; ++i) {
                            if ($scope.carArray[i].status === "AVAILABLE") {
                                $scope.availableCarArray.push($scope.carArray[i]);
                            }
                        }
                    }
                })


            $scope.submitBooking = function () {
                console.log("Booking submit button clicked");


                var bookingDto = {
                    "date_of_booking": new Date(),
                    "customer_pk": $scope.selectedCustomer.customer_pk,
                    "car_pk": $scope.selectedCar.car_pk,
                    "date_from": $scope.dateFrom.value,
                    "date_to": $scope.dateTo.value,
                    "status_in_db": "ACTIVE"
                }
                if ($routeParams.action === 'edit') {
                    bookingDto.booking_pk = $routeParams.id;
                }

                var submitData = JSON.stringify(bookingDto);

                if ($routeParams.action === 'edit') {
                    $httpClient.put("http://127.0.0.1:8080/api/rest/booking.svc/booking", submitData)
                        .then(function (response) {
                            console.log(response);

                            if (response.data.result != null && response.data.result === "SUCCESS") {
                                window.location.href="#!/bookinglist";
                            } else {
                                if (response.data.errorType === "ERROR") {
                                    document.getElementById("bookingRegisterError").style.display = 'block';
                                    document.getElementById("bookingRegisterWarning").style.display = 'none';
                                    document.getElementById("registerErrorMessage").textContent = response.data.message;
                                    $timeout( function () {
                                        document.getElementById("bookingRegisterError").style.display = 'none';
                                    }, 3000);

                                } else if (response.data.errorType === "WARNING") {
                                    document.getElementById("bookingRegisterError").style.display = 'none';
                                    document.getElementById("bookingRegisterWarning").style.display = 'block';
                                    document.getElementById("registerWarningMessage").textContent = response.data.message;
                                    $timeout( function () {
                                        document.getElementById("bookingRegisterWarning").style.display = 'none';
                                    }, 3000);
                                }
                            }
                        })

                }
            }

            $scope.returnClick = function () {
                window.location.href="#!/bookinglist";
            }


        }]);
