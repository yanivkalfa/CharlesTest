
(function (undefined) {
    'use strict';

    function charlesTestCtrl($scope, $http) {
        var method = 'POST';
        var url = '/search';

        var handleResults = function(results){
            var searchTerm = $scope.searchTerm.search,
                searchTermToLower = $scope.searchTerm.search.toLowerCase();

            if(angular.isArray(results.data)){
                results.data.forEach(function(found){
                    console.log(found, searchTermToLower);
                    var startPosition = searchTermToLower.indexOf(found.keyword),
                        endPosition = found.keyword.length,
                        stringStart = '',
                        stringEnd = '',
                        foundBrand = '';

                    if(startPosition > -1){
                        stringStart = searchTerm.slice(0,startPosition);
                        foundBrand = searchTerm.slice(startPosition,endPosition);
                        stringEnd = searchTerm.slice(endPosition,-1);

                        if(found.type == "brand")
                        {
                            searchTerm = stringStart + '<strong>' + foundBrand + '</strong>' + stringEnd;
                            searchTermToLower = searchTerm.toLowerCase();
                        }
                        else
                        {
                            console.log('elsing');
                            searchTerm = stringStart + '<i>' + foundBrand + '</i>' + stringEnd;
                            searchTermToLower = searchTerm.toLowerCase();
                        }
                    }

                });
            }

            console.log(searchTerm);

            return searchTerm;
        };

        $scope.fetch = function(search) {
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



