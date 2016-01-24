/*
	Define A Namespace to declare as a window object
*/
define(function(require){
	return function ( namespace ) {
		// Define Namespace
		this.namespace = namespace,
		// Create Factory On Namespace
		factory = require('./factory')( namespace );
		// Return Factory Function
		return factory;
	};
})