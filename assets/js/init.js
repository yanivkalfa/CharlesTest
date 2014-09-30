
(function (undefined) {
    'use strict';


    function api() {
        var _data = {
            users: [
                {
                    id: 142,
                    name: 'Jack',
                    type: 'admin',
                    age: 32,
                    skills: ['unix', 'windows', 'http']
                },
                {
                    id: 523,
                    name: 'Bob',
                    type: 'customer',
                    age: 23,
                    likes: ['shoes', 't-shirts', '<b>Clubs</b>&nbsp;<br/><i>bars</i>']
                }
            ],

            responsibilities: {
                142: [
                    {
                        name: 'project 1'
                    },
                    {
                        name: 'project 2'
                    }
                ]
            },

            purchasedItems: {
                523: [
                    {
                        name: 'adidas sneakers #24124'
                    },
                    {
                        name: 'Jack Daniel\'s 18 years'
                    }
                ]
            }

        };

        this.getData = function (resourceName) { return _data[resourceName]; };
    }

    function charlesTestCtrl($scope, api) {}

    angular.module('CharlesTest', ['ng'])
        .service('api', [api])
        .controller('charlesTestCtrl', ["$scope","api", charlesTestCtrl]);



}).call(window && typeof window.document !== 'undefined' ? window : global);



