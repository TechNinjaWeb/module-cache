define(function(require){
	return function( namespace ) {
		// Define Important Variables
		var self = window[ namespace ] = {};
			window[ namespace ].namespace = namespace; 
			window[ namespace ].modules = {};
			window[ namespace ].rootSet = false;

		// Return Factory Controls
		self.root = function( app ) {
			// Debugging
			// console.dir(self);
			// Die if already set
			if (self.rootSet) return self.modules.root;
			// Set Root True
			self.rootSet = true;
			// Define The Child Module Namespace
			self.modules[ app.name ] = {};
			self.modules[ app.name ].app = app;
			self.modules[ app.name ].controllers = {};
			self.modules[ app.name ].services = {};
			self.modules[ app.name ].run = {};
			// Save Ref To This As Root of Modules
			self.modules.root = self.modules[ app.name ];
			// Return The Child Module
			return window[ self.namespace ] = self;
		};
		self.make = function( app ) {
			// Define The Child Module Namespace
			window[ self.namespace ].modules[ app.name ] = {};
			window[ self.namespace ].modules[ app.name ].app = app;
			window[ self.namespace ].modules[ app.name ].controllers = {};
			window[ self.namespace ].modules[ app.name ].services = {};
			window[ self.namespace ].modules[ app.name ].run = {};
			// Return The Child Module
			return window[ self.namespace ];
		};
		self.$ = window[ namespace ];

		// Invoke Self On Winodw Now
		return (function(n){
			return window[ n ];
		}(namespace))
	}
})