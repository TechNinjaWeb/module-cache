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
    app.run(['$rootScope', '$timeout',
        '$window', '$state', 'ParseService', 'LoginService', function(
        $rootScope, $timeout, $window, $state, ParseService, LoginService) {
        // console.log('Initializing FBLogin ...');
        window.fbAsyncInit = function() {
            // Debugging
            // console.log('FB Init has been called');
            Parse.FacebookUtils.init({ // this line replaces FB.init({
                appId: '796575453734742',
                xfbml: true,
                version: 'v2.2'
            });
            // Run code after the Facebook SDK is loaded.
        };
        // Initialize Script Immediately
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // Save Data From Facebook Auth
        $rootScope.collectFacebookData = function(user) {
            console.log("Capturing User Data from Facebook", user);

            // Set Facebook User Data and Save It To Parse
            FB.api('/me', function(response) {
                var object = response;
                console.log('Your name is ' + object.name);
                user.set("username", object.name);
                user.set("firstName", object.first_name);
                user.set("lastName", object.last_name);
                user.set("email", object.email);
                user.save();
            });

            FB.api('/me/picture', {
                "type": "normal"
            }, function(response) {
                var object = response;
                console.log("profile Pic Located at: " + object.data.url);
                user.set("profilePic", object.data.url);
                user.save();
            });
        };
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
    }])
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