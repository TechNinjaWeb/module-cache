define(function(require){
    var app = angular.module('tn.modules.parse.services', [
            require('../cache/cache.module').name
        ]);
        // Window Factory
        window[ angular.namespace ].make( app );
        // App Service
        app.service("ParseService", function(DB){
            var parse = {};

            parse.save = function( Class, data ) {
                var Table = Parse.Object.extend( Class ),
                    parseObject = new Table();
                // Save Each Property to parseObject
                for (var prop in data) {
                    parseObject.set( prop, data[ prop ]);
                }
                // Return Promise
                return parseObject.save(null, {
                    success: function(res) {
                        console.log(res);
                    },
                    error: function(res,err) {
                        console.warn(res,err);
                    }
                })
            };

            parse.findById = function( Class, id ) {
                var query = new Parse.Query( Class );
                // Return Promise
                return query.get( id, {
                    success: function(res) {
                        console.log(res);
                    },
                    error: function(res,err) {
                        console.warn(res,err);
                    }
                });
            };

            parse.find = function( Class, conditions ) {
                /*
                    // SAMPLE CONDITIONS OBJECT
                    [{ equalTo: 'username' },
                    { exists: 'column to check' }]
                */

                // Query Object
                var query = new Parse.Query( Class );
                // Set Conditions
                conditions.forEach(function( condition ){
                    // Iterate Over Conditions Property
                    for (var prop in condition) {
                        // Set Query Condition
                        if (condition[ prop ] !== null) 
                            query[ prop ]( condition[ prop ]);
                    }
                });
                // Return Promise
                return query.find({
                    success: function(res) {
                        console.log(res);
                    },
                    error: function(res,err) {
                        console.warn(res,err);
                    }
                });
            };

            parse.update = function( Class, id, data ) {
                var query = new Parse.Query( Class );
                // Return Promise
                return query.get( id, {
                    success: function(res) {
                        console.log(res);
                        // Save Each Property to parseObject
                        for (var prop in data) {
                            res.set( prop, data[ prop ]);
                        }
                        // Return Promise
                        return res.save({
                            success: function(res) {
                                console.info(res);
                            },
                            error: function(res,err) {
                                console.warn(res,err);
                            }
                        })

                    },
                    error: function(res,err) {
                        console.warn(res,err);
                    }
                });
            };
            // Window Factory
            // Return The Serice Object
            return window[ angular.namespace ].modules[ app.name ].services.ParseService  = parse;
    });
    // Return This App
    return app;
})