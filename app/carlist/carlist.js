'use strict';

angular.module('myApp.carlist', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/carlist', {
            templateUrl: 'carlist/carlist.html',
            controller: 'CarlistCtrl'
        });
    }])

    .controller('CarlistCtrl', ['$scope', '$http', '$timeout',
        function($scope, $httpClient, $timeout) {

        $scope.carArray = [];

        $scope.searchClick = function ($) {

            var carDto = {
                make: $scope.makeSearch,
                model: $scope.modelSearch,
                car_body_type: $scope.bodyTypeSearch,
                year_of_production: $scope.yearOfProcutionSearch,
                mileage: $scope.mileageSearch,
                status: $scope.statusSearch,
                amount: $scope.amountSearch,
            }

            var submitData = JSON.stringify(carDto, function (key, value) {
                if (value === "") {
                    return null;
                }
                return value;
            })

            $httpClient.post("http://127.0.0.1:8080/api/rest/car.svc/cars/search",submitData)
                .then(function (response) {
                    console.log(response);
                    if (response.data.result != null && response.data.result === "SUCCESS") {
                        $scope.carArray = response.data.holderList;
                    }
                })

        }


        $httpClient.get("http://127.0.0.1:8080/api/rest/car.svc/cars")
            .then(function (response) {
                if (response.data.result != null && response.data.result === "SUCCESS") {
                    $scope.carArray = response.data.holderList;
                }
                console.log(response);
            })


        $scope.deleteClick = function (carPk) {
            $httpClient.delete("http://127.0.0.1:8080/api/rest/car.svc/car("+carPk+")")
                .then(function (response) {
                    if (response.data != null && response.data.result === "SUCCESS") {
                        for (var i = 0; i < $scope.carArray.length; ++i) {
                            if ($scope.carArray[i].car_pk === carPk) {
                                $scope.carArray.splice(i, 1);
                                console.log("DELETED PK: " + carPk);
                            }
                        }
                        if (response.data.result === "SUCCESS") {
                            document.getElementById("carDeleteError").style.display = 'none';
                            document.getElementById("carDeleteWarning").style.display = 'none';
                            document.getElementById("carDeleteSuccess").style.display = 'block';
                            document.getElementById("deleteSuccessMessage").textContent = response.data.message;
                            $timeout( function () {
                                document.getElementById("carDeleteSuccess").style.display = 'none';
                            }, 3000);
                        }
                    } else {
                        if (response.data.errorType === "ERROR") {
                            document.getElementById("carDeleteError").style.display = 'block';
                            document.getElementById("carDeleteWarning").style.display = 'none';
                            document.getElementById("carDeleteSuccess").style.display = 'none';
                            document.getElementById("deleteErrorMessage").textContent = response.data.message;
                            $timeout( function () {
                                document.getElementById("carDeleteError").style.display = 'none';
                            }, 3000);

                        } else if (response.data.errorType === "WARNING") {
                            document.getElementById("carDeleteError").style.display = 'none';
                            document.getElementById("carDeleteWarning").style.display = 'block';
                            document.getElementById("carDeleteSuccess").style.display = 'none';
                            document.getElementById("deleteWarningMessage").textContent = response.data.message;
                            $timeout( function () {
                                document.getElementById("carDeleteWarning").style.display = 'none';
                            }, 3000);
                        }
                    }
                })
        }


        $scope.updateClick = function (carPk) {
            window.location.href="#!/car?action=edit&id=" + carPk;
        }

        $scope.addNewClick = function () {
            window.location.href="#!/car";
        }



    }]);
