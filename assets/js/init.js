
(function (undefined) {
    'use strict';

    function charlesTestCtrl($scope, $http) {
        var method = 'POST';
        var url = '/search';

        var handleResults = function(results){
            var searchTerm = $scope.searchTerm.search.match(/\S+/g);
            var searchTermToLower = $scope.searchTerm.search.toLowerCase().match(/\S+/g);

            if(angular.isArray(results.brands)){
                results.brands.forEach(function(brand){
                    var i = searchTermToLower.indexOf(brand);
                    if(i > -1){
                        searchTerm[i] = '<strong>' + searchTerm[i] + '</strong>';
                    }
                });
            }

            if(angular.isArray(results.clothingTypes)){
                results.clothingTypes.forEach(function(clothingType){
                    var i = searchTermToLower.indexOf(clothingType);
                    if(i > -1){
                        searchTerm[i] = '<i>' + searchTerm[i] + '</i>';
                    }
                })
            }


            var toreturn = searchTerm.join(" ");
            console.log(searchTerm, toreturn);
            return searchTerm.join(" ");
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

    angular.module('CharlesTest', ['ng'])
        .controller('charlesTestCtrl', ["$scope", "$http", charlesTestCtrl]);



    /*angular.module('CharlesTest', ['ng'])
        .service('api', [api])
        .controller('charlesTestCtrl', ["$scope", "$http", "api", charlesTestCtrl]);
        */



}).call(window && typeof window.document !== 'undefined' ? window : global);



