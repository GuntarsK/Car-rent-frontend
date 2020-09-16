'use strict';

angular.module('myApp.bookinglist', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/bookinglist', {
            templateUrl: 'bookinglist/bookinglist.html',
            controller: 'BookinglistCtrl'
        });
    }])

    .controller('BookinglistCtrl', ['$scope', '$http', '$timeout',
        function($scope, $httpClient, $timeout) {

            $scope.customerArray = [];
            $scope.carArray = [];
            $scope.bookingArray = [];

            $scope.searchClick = function ($) {

                var bookingDto = {
                    date_of_booking: $scope.dateOfBookingSearch,
                    customer: $scope.customerSearch,
                    car: $scope.carSearch,
                    date_from: $scope.dateFromSearch,
                    date_to: $scope.dateToSearch,
                    amount: $scope.amountSearch
                }

                var submitData = JSON.stringify(bookingDto, function (key, value) {
                    if (value === "") {
                        return null;
                    }
                    return value;
                })

                $httpClient.post("http://127.0.0.1:8080/api/rest/booking.svc/bookings/search",submitData)
                    .then(function (response) {
                        console.log(response);
                        if (response.data.result != null && response.data.result === "SUCCESS") {
                            $scope.bookingArray = response.data.holderList;
                        }
                    })

            }


            $scope.getItemInfoById = function(array, idToFind) {
                if (array != null) {
                    for (var i = 0; i < array.lenght; ++i) {
                        if (array[i].id === idToFind) {
                            return array[i].name;
                        }
                    }
                }
            }


            $httpClient.get("http://127.0.0.1:8080/api/rest/customer.svc/customers")
                .then(function (response) {
                    if (response.data.result != null && response.data.result === "SUCCESS") {
                        $scope.customerArray = response.data.holderList;
                    }
                    console.log(response);
                })


            $httpClient.get("http://127.0.0.1:8080/api/rest/car.svc/cars")
                .then(function (response) {
                    if (response.data.result != null && response.data.result === "SUCCESS") {
                        $scope.carArray = response.data.holderList;
                    }
                    console.log(response);
                })


            $httpClient.get("http://127.0.0.1:8080/api/rest/booking.svc/bookings")
                .then(function (response) {
                    if (response.data.result != null && response.data.result === "SUCCESS") {
                        $scope.bookingArray = response.data.holderList;
                    }
                    console.log(response);
                })




            $scope.deleteClick = function (bookingPk) {
                $httpClient.delete("http://127.0.0.1:8080/api/rest/booking.svc/booking("+bookingPk+")")
                    .then(function (response) {
                        if (response.data != null && response.data.result === "SUCCESS") {
                            for (var i = 0; i < $scope.bookingArray.length; ++i) {
                                if ($scope.bookingArray[i].booking_pk === bookingPk) {
                                    $scope.bookingArray.splice(i, 1);
                                    console.log("DELETED PK: " + bookingPk);
                                }
                            }
                            if (response.data.result === "SUCCESS") {
                                document.getElementById("bookingDeleteError").style.display = 'none';
                                document.getElementById("bookingDeleteWarning").style.display = 'none';
                                document.getElementById("bookingDeleteSuccess").style.display = 'block';
                                document.getElementById("deleteSuccessMessage").textContent = response.data.message;
                                $timeout( function () {
                                    document.getElementById("bookingDeleteSuccess").style.display = 'none';
                                }, 2000);
                            }
                        } else {
                            if (response.data.errorType === "ERROR") {
                                document.getElementById("bookingDeleteError").style.display = 'block';
                                document.getElementById("bookingDeleteWarning").style.display = 'none';
                                document.getElementById("bookingDeleteSuccess").style.display = 'none';
                                document.getElementById("deleteErrorMessage").textContent = response.data.message;
                                $timeout( function () {
                                    document.getElementById("bookingDeleteError").style.display = 'none';
                                }, 2000);

                            } else if (response.data.errorType === "WARNING") {
                                document.getElementById("bookingDeleteError").style.display = 'none';
                                document.getElementById("bookingDeleteWarning").style.display = 'block';
                                document.getElementById("bookingDeleteSuccess").style.display = 'none';
                                document.getElementById("deleteWarningMessage").textContent = response.data.message;
                                $timeout( function () {
                                    document.getElementById("bookingDeleteWarning").style.display = 'none';
                                }, 2000);
                            }
                        }
                    })
            }


            $scope.updateClick = function (bookingPk) {
                window.location.href="#!/booking?action=edit&id=" + bookingPk;
            }

            $scope.addNewClick = function () {
                window.location.href="#!/booking";
            }



        }]);
