requirejs.config({
    baseUrl: './js/lib',
    paths: {
    	'angular': 'angular',
    	'ui-router': 'angular-ui-router',
        'jquery': 'jquery',
        'toastr': 'toastr',
        'parse': 'parse.min',
        'toastr.console': '../modules/toastr.console',
        'app': '../app/app',
        'settings': '../app/app.settings',
        'index': '../index'
    }, 
    shim: {
    	app: {
    		deps: ['ui-router', 'settings']
    	},
    	angular: {
    		deps: ['toastr', 'toastr.console', 'parse']
    	},
    	'ui-router': {
    		deps: ['angular']
    	},
    	toastr:{
    		deps: ['jquery']
    	}
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
require(['../modules/window.factory/index', 'settings'], function(factory, settings){
    // Custom Window Namespacing
	var namespace = settings.namespace || '$$Ninja',
		Factory = factory( namespace );
        Factory.namespace = namespace;
        // Attach to Angular
        angular = window.angular || {};
        angular.Factory = Factory


	// Bootstrap Angular
    require(['app'], function (app) {
		// Debugging
		// console.warn(angular[ namespace ]);
    	
    	// Register Angular App To Dom
		angular.bootstrap(document, [app.name]);

    })
});