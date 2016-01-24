define(function() {
	// Define App Module
	var app = angular.module('tn.modules.parse.services.login.facebook', []);
	// Window Factory
	window[ angular.namespace ].make ( app );

	app.run(['$rootScope', function($rootScope) {
		$rootScope.message = app.name + " Module Loaded Successfully";
		// Window Factory
		window[ angular.namespace ].modules[ app.name ].run = $rootScope;
	}])
	// This is test code to integrate Parse into Angular.
	// Elements will be reusable in this mannor by allowing us
	// to pass ParseServices as a dependency in any of our controllers
    .service("FBLogin", ['$rootScope', function($rootScope) {
        
        var FBLogin = {};
        FBLogin.login = function() {
        	Parse.FacebookUtils.logIn("user_likes,email,read_friendlists", {
				success: function(User) {
					if (!User.existed()) {
						// Store User in Parse
						console.warn(["User signed up and logged in through Facebook!", { 
							fbData: {data: User, username: User.get('username')}, 
							currentUser: { username: Parse.User.current().get('username'), data: Parse.User.current().attributes }
						}]);
						var getEmail = FBLogin.getEmail().then(function( FacebookData ) {
							// Save Ref to User Object
							var pUser = Parse.User.current();
								pUser.set('fb_objectId', Parse.User.current().get('username'));
							// Debugging
							// console.warn(["User Before Set", {id: pUser.id, data: pUser.attributes, username: pUser.get('username')}, "FbData", FacebookData]);

							// Set Username, Email & AuthData
							pUser.set( 'username', FacebookData.name );
							pUser.set( 'email', FacebookData.email );
							// Debugging
							// console.log(["Data Going Into Save", FacebookData, {data: pUser.attributes, username: pUser.get('username') }])
							// Save Parse User
							pUser.save({
								success: function(res) {
									// Try And Link FB Data
									FBLogin.linkFacebook( res );
									// Update Parse.User.current() object
									res.fetch({
										success: function(res) {
											// Broadcast Persist
											$rootScope.$broadcast('persist', { Class: 'User', data: res });
											// console.info("Persisted To Cache", res);
											console.alert( res.get('username') + " Logged In" );
										},
										error: function(res,err) {
											console.warn(res,err);
										}
									});
									
								},
								error: function(res,err) {
									console.warn(res,err);
								}
							});
						});
					} else {
						// Debugging
						// console.warn("User Already Exists", { username: User.get('username'), data: User.attributes });
						var getEmail = FBLogin.getEmail().then(function( FacebookData ) {
							// Save Ref to User Object
							var pUser = Parse.User.current();
								// Set Username & email
								pUser.set( 'username', FacebookData.name );
								pUser.set( 'email', FacebookData.email );
								// Save Data
								pUser.save({
									success: function(res) {
										// If No User data Then Alert Client
										// Otherwise, link Facebook and User
										// console.warn("Response from Save", res);
										!!res ? FBLogin.linkFacebook( res ) : console.log("Could Not Link You're Profile", { response: res } );
										// Update Parse.User.current()
										res.fetch();
										// Broadcast Persist
										$rootScope.$broadcast('persist', { Class: 'User', data: res });
										// console.info("Persisted To Cache", res);
										console.alert( res.get('username') + " Logged In" );
									},
									error: function(res,err) {
										console.warn(res,err);
									}
								});
						});
					}
				},
				error: function(user, error) {
					console.log("User cancelled the Facebook login or did not fully authorize.");
				}
			});
        };
        // Check For Existing Email
        FBLogin.checkExistingEmail = function(email) {
            var myEmail = email;
            var query = new Parse.Query(Parse.User);
            query.exists("email");
            query.find({
                success: function(response) {
                    for (i = 0; i < response.length; i++) {
                        var object = response[i];
                        if (object.get("email") == myEmail) {
                            console.log("Email Already Exists - Linking Accounts");
                            return true;
                        }
                        else {
                            console.log("Email DOES NOT Exist");
                            return false;
                        }
                    }
                },
                error: function(response, error) {
                    console.log("Error");
                }
            });
        };
        
        // Link Email to Facebook Account
        FBLogin.linkFacebook = function(user) {
            if (!Parse.FacebookUtils.isLinked(user)) {
                Parse.FacebookUtils.link(user, null, {
                    success: function(user) {
                        console.log("Woohoo, user logged in with Facebook!");
                    },
                    error: function(user, error) {
                        console.log("User cancelled the Facebook login or did not fully authorize.");
                    }
                });
            } else {
            	return [ "User Already Linked", user ];
            	// console.warn("User Already Linked", user);
            }
        };
        
        // Unlink Email from Facebook 
        FBLogin.unlinkFacebook = function(user) {
            Parse.FacebookUtils.unlink(user, {
                success: function(user) {
                    alert("The user is no longer associated with their Facebook account.");
                }
            });
        };
        // Get Facebook Email
        FBLogin.getEmail = function () {
        	return new Promise(function(resolve, reject) {
        		FB.api('/me', { locale: 'en_US', fields: 'name, email' },
					function(response) {
						// Debugging
						// console.log("Finished Getting User Data From Facebook Profile", response);
						return response.length <= 0 ? reject( response ) : resolve( response );
					}
				);
        	})
        }
        
        return window[ angular.namespace ].modules[ app.name ].services.FBLogin = FBLogin;
    }]);
	// Return This Module
	return app;
})