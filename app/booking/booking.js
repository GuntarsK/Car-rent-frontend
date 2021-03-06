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

            $scope.bookingArray = [];
            $scope.customerArray = [];
            $scope.carArray = [];
            $scope.availableCarArray = [];

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

            $scope.returnClick = function () {
                window.location.href="#!/bookinglist";
            }


        }]);
