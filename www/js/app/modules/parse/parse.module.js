define(function( require ){
    
    var Parse = window.Parse = require('parse'),
        settings = require('settings');
        // Debugging
        // console.warn("Settings",settings);
        // Define Application ID's
        Parse.applicationId = settings.Parse.applicationId || "";
        Parse.javascriptKey = settings.Parse.javascriptKey || "";
        // Create Connection To Parse
        Parse.initialize( Parse.applicationId, Parse.javascriptKey );


    var app = angular.module('tn.modules.parse', [
        'ui.router', 
        require('./parse.services').name,
        require('./parse.services.login').name
    ]);

    // Window Factory
    window[ angular.namespace ].make( app );

    app.run(function($rootScope, $timeout, 
        $window, $state, ParseService, LoginService) {
    /*
        RootScope Functions
    */
        $rootScope.message = app.name + " Run Successfully Loaded";

        // RootScope Listeners
        $rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) {
            // console.log("Start:   " + message(to, toP, from, fromP));
        });
        $rootScope.$on("$stateChangeSuccess", function(evt, to, toP, from, fromP) {
            // console.log("Success: " + message(to, toP, from, fromP));
        });
        $rootScope.$on("$stateChangeError", function(evt, to, toP, from, fromP, err) {
            // console.log("Error:   " + message(to, toP, from, fromP), err);
        });
       
        // Window Factory
        window[ angular.namespace ].modules[ app.name ].run = $rootScope;
        window[ angular.namespace ].modules[ app.name ].services.ParseService = ParseService;
        window[ angular.namespace ].modules[ app.name ].services.LoginService = LoginService;
    })
    .controller('ParseModuleCtrl', ['$scope', function($scope){
        $scope.message = "Parse Module Controller"

        // Window Factory
        window[ angular.namespace ].modules[ app.name ].controllers.appCtrl = $scope;
    }])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('parse', {
                url: '',
                abstract: true,
                template: "<div ui-view='parse'></div>",
                controller: 'ParseModuleCtrl'
            })
            .state('parse.index', {
                url: '/parse', 
                views: {
                    'parse@parse': {
                        template: "Working on Parse Module"
                    }
                }
            });
    }]);
    // Return App Object
    return app;
})