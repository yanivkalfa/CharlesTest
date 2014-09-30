
(function (undefined) {
    'use strict';

    function charlesTestCtrl($scope, $http) {
        var method = 'POST';
        var url = '/search';

        var handleResults = function(results){
            console.log(results);
            var searchTerm = $scope.searchTerm.search;
            var searchTermToLower = $scope.searchTerm.search.toLowerCase();

            if(angular.isArray(results.data.brands)){
                results.data.brands.forEach(function(brand){
                    var startPosition = searchTermToLower.indexOf(brand),
                        endPosition = brand.length,
                        stringStart = '',
                        stringEnd = '',
                        foundBrand = '';

                    if(startPosition > -1){
                        stringStart = searchTerm.slice(0,startPosition);
                        foundBrand = searchTerm.slice(startPosition,endPosition);
                        stringEnd = searchTerm.slice(endPosition,-1);
                        searchTerm = stringStart + '<strong>' + foundBrand + '</strong>' + stringEnd;
                    }
                });
            }

            if(angular.isArray(results.data.clothingTypes)){
                results.data.clothingTypes.forEach(function(clothingType){
                    var startPosition = searchTermToLower.indexOf(clothingType),
                        endPosition = clothingType.length,
                        stringStart = '',
                        stringEnd = '',
                        foundBrand = '';

                    if(startPosition > -1){
                        stringStart = searchTerm.slice(0,startPosition);
                        foundBrand = searchTerm.slice(startPosition,endPosition);
                        stringEnd = searchTerm.slice(endPosition,-1);
                        searchTerm = stringStart + '<strong>' + foundBrand + '</strong>' + stringEnd;
                    }
                })
            }

            return searchTerm;
        };

        $scope.fetch = function(search) {
            console.log(search);
            if(!search) return;

            $scope.code = null;
            $scope.searchTerm = {"search" : search};
            $scope.response = null;

            $http({
                method: method,
                url: url,
                data : $scope.searchTerm
            }).success(function(data, status) {
                $scope.searchResults = false;
                if(data.status){
                    $scope.searchResults = handleResults(data);
                }
            }).error(function(data, status) {
                $scope.searchResults = false;
            });
        };


    }

    angular.module('CharlesTest', ['ng' , 'ngSanitize'])
        .controller('charlesTestCtrl', ["$scope", "$http", charlesTestCtrl]);



}).call(window && typeof window.document !== 'undefined' ? window : global);



