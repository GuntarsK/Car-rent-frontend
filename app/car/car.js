'use strict';

angular.module('myApp.car', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/car', {
            templateUrl: 'car/car.html',
            controller: 'CarCtrl'
        });
    }])

    .controller('CarCtrl', ['$scope', '$http', '$routeParams', '$timeout',
        function($scope, $httpClient, $routeParams, $timeout) {

        var actionUrl = $routeParams.action;
        var id = $routeParams.id;
        $scope.bodyTypeArray = ["SEDAN", "SUV", "STATION_WAGON", "VAN"];
        $scope.statusArray = ["RENTED", "AVAILABLE", "UNAVAILABLE"];

        if (actionUrl === 'edit') {
            // GET CAR BY ID

            // $scope.carArray = response.data.holderList;
            // for (var i = 0; i < $scope.carArray.length; ++i) {
            //     if ($scope.carArray[i].status_in_db === "ACTIVE") {
            //         $scope.activeCarArray.push($scope.carArray[i]);
            //     }
            // }

            $scope.action = "Edit";
        } else {
            $scope.action = "Add new car";
        }



        $scope.submitCar = function () {
            console.log("Car submit button clicked");

            var carDto = {
                "make": $scope.make,
                "model": $scope.model,
                "car_body_type": $scope.car_body_type,
                "year_of_production": $scope.year_of_production,
                "mileage": $scope.mileage,
                "status": $scope.status,
                "amount": $scope.amount,
                "status_in_db": "ACTIVE"
            }
            if ($routeParams.action === 'edit') {
                carDto.car_pk = $routeParams.id;
            }

            var submitData = JSON.stringify(carDto);

            if ($routeParams.action === 'edit') {
                $httpClient.put("http://127.0.0.1:8080/api/rest/car.svc/car", submitData)
                    .then(function (response) {
                        console.log(response);

                        if (response.data.result != null && response.data.result === "SUCCESS") {
                            window.location.href="#!/carlist";
                        } else {
                            if (response.data.errorType === "ERROR") {
                                document.getElementById("carRegisterError").style.display = 'block';
                                document.getElementById("carRegisterWarning").style.display = 'none';
                                document.getElementById("registerErrorMessage").textContent = response.data.message;
                                $timeout( function () {
                                    document.getElementById("carRegisterError").style.display = 'none';
                                }, 2000);

                            } else if (response.data.errorType === "WARNING") {
                                document.getElementById("carRegisterError").style.display = 'none';
                                document.getElementById("carRegisterWarning").style.display = 'block';
                                document.getElementById("registerWarningMessage").textContent = response.data.message;
                                $timeout( function () {
                                    document.getElementById("carRegisterWarning").style.display = 'none';
                                }, 2000);
                            }
                        }
                    })

            } else {

                $httpClient.post("http://127.0.0.1:8080/api/rest/car.svc/car", submitData)
                    .then(function (response) {
                        console.log(response);

                        if (response.data.result != null && response.data.result === "SUCCESS") {
                            window.location.href="#!/carlist";
                        } else {
                            if (response.data.errorType === "ERROR") {
                                document.getElementById("carRegisterError").style.display = 'block';
                                document.getElementById("carRegisterWarning").style.display = 'none';
                                document.getElementById("registerErrorMessage").textContent = response.data.message;
                                $timeout( function () {
                                    document.getElementById("carRegisterError").style.display = 'none';
                                }, 2000);

                            } else if (response.data.errorType === "WARNING") {
                                document.getElementById("carRegisterError").style.display = 'none';
                                document.getElementById("carRegisterWarning").style.display = 'block';
                                document.getElementById("registerWarningMessage").textContent = response.data.message;
                                $timeout( function () {
                                    document.getElementById("carRegisterWarning").style.display = 'none';
                                }, 2000);
                            }
                        }
                    })
            }
        }


    }]);
