
(function (undefined) {
    'use strict';

    function charlesTestCtrl($scope, $http) {
        var method = 'POST';
        var url = '/search';

        var handleResults = function(results){
            console.log(results);
            var searchTerm = $scope.searchTerm.search;
            var searchTermToLower = $scope.searchTerm.search.toLowerCase();

            if(results.data.brand != ''){
                var startPosition = searchTermToLower.indexOf(results.data.brand),
                    endPosition = results.data.brand.length,
                    stringStart = '',
                    stringEnd = '',
                    foundBrand = '';

                if(startPosition > -1){
                    stringStart = searchTerm.slice(0,startPosition);
                    foundBrand = searchTerm.slice(startPosition,endPosition);
                    stringEnd = searchTerm.slice(endPosition,-1);
                    searchTerm = stringStart + '<strong>' + foundBrand + '</strong>' + stringEnd;
                }
            }

            if(results.data.clothingType != ''){
                var startPosition = searchTermToLower.indexOf(results.data.clothingType),
                    endPosition = results.data.clothingType.length,
                    stringStart = '',
                    stringEnd = '',
                    foundBrand = '';

                if(startPosition > -1){
                    stringStart = searchTerm.slice(0,startPosition);
                    foundBrand = searchTerm.slice(startPosition,endPosition);
                    stringEnd = searchTerm.slice(endPosition,-1);
                    searchTerm = stringStart + '<strong>' + foundBrand + '</strong>' + stringEnd;
                }
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



