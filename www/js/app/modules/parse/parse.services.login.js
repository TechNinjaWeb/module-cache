define(function(require){
    var app = angular.module('tn.modules.parse.services.login', [
            require('./parse.services.login.facebook').name
        ]);
    // Window Factory
    window[ angular.namespace ].make( app );

    app.run(['$rootScope', function( $rootScope ) {

    }])
    .service("LoginService", ['$state', '$rootScope', 'FBLogin', function($state, $rootScope, FBLogin) {
        var Login = {};

        Login.createUser = function(data) {
            // Create New User
            var user = new Parse.User();
            // Set User Details
            for (var prop in data) {
                user.set(prop, data[ prop ]);
            }
            // Send New User To Parse
            user.signUp(null, {
                success: function(user) {
                    // Update Parse Current User
                    Parse.User.current().fetch();
                    // Update User Service
                    var USER = { 
                        id: Parse.User.current().id,
                        data: Parse.User.current().attributes,
                        username: Parse.User.current().get('username'),
                        password: data.password
                    };
                    // Broadcast Change
                    $rootScope.$broadcast('user:created', USER);
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });

        };

        Login.login = function(user) {
            console.log("Logging In User "+user.username, [ user.username, user.password ]);
            // Login User
            Parse.User.logIn(user.username || $rootScope.user.username || "Ray", user.password || "password", {
                success: function(user) {
                    // Send User To Server
                    var USER = { 
                        id: Parse.User.current().id,
                        data: Parse.User.current().attributes,
                        username: Parse.User.current().get('username')
                    };
                    // Persist User To Cache
                    $rootScope.$broadcast('persist', { Class: 'User', data: USER});
                    // Emit Login Event
                    $rootScope.$broadcast('user:loggedIn', USER);
                    console.success(USER.username + " Logged In");
                },
                error: function(user, error) {
                    // The login failed. Check error to see why.
                    console.log("User Login Failed", error, user);
                }
            });
        };

        Login.logout = function(sessionUser) {
            if (!sessionUser && !!Parse.User.current()) sessionUser = Parse.User.current();
            console.log(["I heard your request to logout", { 
                username: sessionUser.get('username'), 
                data: sessionUser.attributes, 
                id: sessionUser.id 
            }])

            if (sessionUser) {
                // Run Parse User Logout
                Parse.User.logOut();
                // Send User To Server
                var USER = { 
                    id: "",
                    data: {},
                    username: ""
                };
                // Emit Logout Event
                $rootScope.$broadcast('user:loggedOut', sessionUser);
                // Clear Localstorage
                $rootScope.$broadcast('persist', { Class: 'User', data: {} });
                console.alert(sessionUser.get('username') + " Logged Out");
            }
            else {
                console.log("Please Login");
                $state.go('home.index');
            }
        };

        Login.facebookLogin = function() {
            Parse.FacebookUtils.logIn("public_profile,user_likes,email,read_friendlists,user_location", {
                success: function(user) {
                    if (!user.existed()) {
                        console.log("User signed up and logged in through Facebook!");
                        $rootScope.collectFacebookData(user);
                        console.log(user, "also running FB User Details Save");

                        console.log($rootScope.sessionUser); // Parse User Current Object

                        console.log("User Details Saved");

                        $rootScope.reloadWindow();
                    }
                    else {
                        console.log("User logged in through Facebook!");
                        // Recapture User Data If User Is Already in Parse DB
                        $rootScope.collectFacebookData(user);

                        console.log("THIS IS USER OBJECT", user);

                        $rootScope.reloadWindow();
                    }
                },
                error: function(user, error) {
                    alert("User cancelled the Facebook login or did not fully authorize.");
                }
            });
        };

        Login.makeAdmin = function() {
            if ($rootScope.sessionUser && $rootScope.techNinjaAdmin) {
                console.log("Making: " + $rootScope.techNinjaAdminName + " admin");
                console.log("Tech Ninja Admin variable is: ", $rootScope.techNinjaAdmin);
            }
            else {
                console.log("User: " + $rootScope.techNinjaAdminName + " is not an admin");
                console.log("Tech Ninja Admin variable is: ", $rootScope.techNinjaAdmin);
            }
        };

        // Window Factory
        window[ angular.namespace ].modules[ app.name ].services.LoginService = Login;
        window[ angular.namespace ].modules[ app.name ].services.FBLogin = FBLogin;

        // Return This Service
        return Login;

    }])
    .controller('LoginCtrl', ['$scope', '$state', '$window', '$rootScope', 'LoginService', function($scope, $state, $window, $rootScope, Login) {
        // User Object
        $scope.user = {};

        $scope.alias = 'Login Controller';
        if ($rootScope.sessionUser) $scope.sessionUser = true; //console.log(["Session User", "Changing State To Lobby"]);

        // Login Function Using /login Screen Data
        $scope.login = window.login = function(username, password) {
            
            return Login.login(username, password);
        };

        $scope.logout = function() {
            return Login.logout(Parse.User.current());
        };

        $scope.createUser = function( user ) {
            console.log("Running Create With Data", user);
            return Login.createUser(user);
        };

        $scope.save = function( user ) {
            // Debug
            console.info(["Saving User", user ]);
            return LoginService.createUser( user ), $scope.user = {};
        };

        $scope.facebookLogin = function() {
            return Login.facebookLogin();
        };

        // Test Alert button
        $scope.alert = function() {
            console.log("You've hit the Parse Current User alert button");
            console.log(Parse.User.current());
        };

        // Window Factory
        window[ angular.namespace ].modules[ app.name ].controllers.LoginCtrl = $scope;

    }]);

    // Return Service Object
    return app;
});