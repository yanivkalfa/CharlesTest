
(function (undefined) {
    'use strict';
    var handleResults = function(results){



        return results;
    };

    function charlesTestCtrl($scope, $http) {
        var method = 'GET';
        var url = '/search';

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
                console.log(data, status);
                if(status){
                    $scope.searchResults = handleResults(data, status);
                }
            }).error(function(data, status) {
                console.log(data, status);
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



