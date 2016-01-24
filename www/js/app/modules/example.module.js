/*
	Template of a core module
	!isRequired = anywhere
*/

define(function(require){
	var app = angular.module('tn.modules.APP_NAME', ['ui.router']);

	// Window Factory
	window[ angular.namespace ].make( app );

	app.run(function($rootScope, $state, $window){
		$rootScope.message = app.name + " Module Loaded Successfully";

		// Winodw Factory
		$$Ninja.modules[ app.name ].run = $rootScope;
	});

	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('stateName', {
				url: '',
				abstract: true,
				template: "<div ui-view='stateName'></div>"
			})
			.state('stateName.index', {
				url: '/user', 
				views: {
					'stateName@stateName': {
						template: "Working on Cache Module"
					}
				}
			});
	}]);

	return app;
});