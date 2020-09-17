'use strict';

angular.module('myApp.booking', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/booking', {
            templateUrl: 'booking/booking.html',
            controller: 'BookingCtrl'
        });
    }])

    .controller('BookingCtrl', ['$scope', '$http', '$routeParams', '$timeout',
        function($scope, $httpClient, $routeParams, $timeout) {

            var actionUrl = $routeParams.action;
            var id = $routeParams.id;
            $scope.bookingArray = [];

            if (actionUrl === 'edit') {
                $scope.action = "Edit";

                $httpClient.get("http://127.0.0.1:8080/api/rest/booking.svc/bookings")
                    .then(function (response) {
                        if (response.data.result != null && response.data.result === "SUCCESS") {
                            $scope.bookingArray = response.data.holderList;
                        }
                        for (var i = 0; i < $scope.bookingArray.length; ++i) {
                            if ($scope.bookingArray[i].booking_pk == id) {
                                console.log("works");
                                $scope.selectedCustomer = $scope.bookingArray[i].customer;
                                $scope.car = $scope.bookingArray[i].car;
                                $scope.date_from = $scope.bookingArray[i].date_from;
                                $scope.date_to = $scope.bookingArray[i].date_to;
                            }
                        }
                    })

            } else {
                $scope.action = "Create new booking";
            }

            $scope.example = {
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
                        $scope.cars = response.data.holderList;
                    }
                })


            $scope.submitBooking = function () {
                console.log("Booking submit button clicked");

                var bookingDto = {
                    "date_of_booking": new Date(),
                    "customer": $scope.customer,
                    "car": $scope.car,
                    "date_from": $scope.date_from.value,
                    "date_to": $scope.date_to.value,
                    "amount": 1.0,
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
                                    }, 2000);

                                } else if (response.data.errorType === "WARNING") {
                                    document.getElementById("bookingRegisterError").style.display = 'none';
                                    document.getElementById("bookingRegisterWarning").style.display = 'block';
                                    document.getElementById("registerWarningMessage").textContent = response.data.message;
                                    $timeout( function () {
                                        document.getElementById("bookingRegisterWarning").style.display = 'none';
                                    }, 2000);
                                }
                            }
                        })

                } else {

                    $httpClient.post("http://127.0.0.1:8080/api/rest/booking.svc/booking", submitData)
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
                                    }, 2000);

                                } else if (response.data.errorType === "WARNING") {
                                    document.getElementById("bookingRegisterError").style.display = 'none';
                                    document.getElementById("bookingRegisterWarning").style.display = 'block';
                                    document.getElementById("registerWarningMessage").textContent = response.data.message;
                                    $timeout( function () {
                                        document.getElementById("bookingRegisterWarning").style.display = 'none';
                                    }, 2000);
                                }
                            }
                        })
                }
            }


        }]);
