define(function(require){
	var app = angular.module('tn.modules.cache', ['ui.router']);
	// Window Factory
	window[ angular.namespace ].make( app );

	app.run(function($rootScope, $state, $window, DB){
		$rootScope.message = "Cache Module Loaded Successfully";

		// Winodw Factory
		window[ angular.namespace ].modules[ app.name ].run = $rootScope;
	});

	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('cache', {
				url: '',
				abstract: true,
				template: "<div ui-view='cache'></div>"
			})
			.state('cache.index', {
				url: '/user', 
				views: {
					'cache@cache': {
						template: "Working on Cache Module"
					}
				}
			});
	}])
	.service("DB", function($rootScope) {
        return window[ angular.namespace ].modules[ app.name ].services.DB = {
            saveToStorage: function saveToStorage(property, value) {
                var data;
                try {
                    if (typeof value === 'object' && value.hasOwnProperty('$$hashKey')) delete value.$$hashKey;
                    data = JSON.stringify(value);
                } catch (e) {
                    data = value;
                } finally {
                    localStorage[property] = data;
                    return this.getFromStorage(property);
                }
            },
            getFromStorage: function getFromStorage(property) {
                var data;
                var store = localStorage[property];
                try {
                    data = JSON.parse(store);
                    if (typeof store === 'object' && store.hasOwnProperty('$$hashKey')) delete store.$$hashKey;
                } catch (e) {
                    data = localStorage[property];
                } finally {
                    return data
                }
            }
        }
    });

	return app;
});