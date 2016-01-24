define(function(require){
    var app = angular.module('tn.modules.user.service', [
            require('../cache/cache.module').name
        ]);
    // Window Factory
    window[ angular.namespace ].make( app );

    app.run(function($rootScope){
        $rootScope.message = app.name + " Successfully Loaded";
        // Key Listeners
        $rootScope.$on('persisted', function( event, saved ){
            // console.log("Persisted Short Response", saved );
            console.toast.messages.add( 'persistence', saved );
        });
        // Winodw Factory
        window[ angular.namespace ].modules[ app.name ].run = $rootScope;    
    })
    .service('User', ['$rootScope', 'DB', function($rootScope, DB){
        // Create Service Object
        var User = DB.getFromStorage('User') || {};
        // If Cache Has User, Save Ref
        if ( !User.hasOwnProperty('username') ) User = {
            id: "",
            data: {},
            username: "( Ben San )"
        }; 
        // First Run Save User To Cache
        User = DB.saveToStorage('User', User);
        // Key Listeners
        
        // Server Requesting Username
        $rootScope.$on('username', function(){
            // Broadcast the Users Current Data
            $rootScope.$broadcast('emit:user', User);
        });
        // Server Sent Update User Object
        $rootScope.$on('update:user', function( event, user ){
            // Update This User
            User = user;
            // Update RootScope
            $rootScope.$broadcast('persist', { data: user, Class: 'User' });
        });
        // Window Factory
        // Return User Object
        return window[ angular.namespace ].modules[ app.name ].services.User = User;
    }]);
    // Return This Module
    return app;
});