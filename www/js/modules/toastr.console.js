define(function(require){
/* 
	This file attaches Toastr to window object
	and defines a succes, err, and messages Array
	to store messages
*/
	(function(){
		// Define Toastr
		var toastr = require('toastr');
			toastr.messages = [];
			toastr.messages.clear = function(){ toastr.messages = []; };
			toastr.messages.remove = function ( index ) { return toastr.messages.splice( index, 1 ) };
		// Attach Alternate Toastr Methods
		window.console.success = function() {
			// Copy Arguments
			var args = Array.prototype.slice.call(arguments).join('');
			// Send Arguments To Message List
			toastr.messages.push( {arguments: args, time: new Date( Date() ).getTime(), type: 'success' } )
			toastr.success( args );
		}
		window.console.warning = function() {
			// Copy Arguments
			var args = Array.prototype.slice.call(arguments).join('');
			// Send Arguments To Message List
			toastr.messages.push( {arguments: args, time: new Date( Date() ).getTime(), type: 'warning' } )
			toastr.warning( args );
		}
		window.console.err = function() {
			// Copy Arguments
			var args = Array.prototype.slice.call(arguments).join('');
			// Send Arguments To Message List
			toastr.messages.push( {arguments: args, time: new Date( Date() ).getTime(), type: 'error' } )
			toastr.error( args );
		}
		window.console.alert = function() {
			// Copy Arguments
			var args = Array.prototype.slice.call(arguments).join('');
			// Send Arguments To Message List
			toastr.messages.push( {arguments: args, time: new Date( Date() ).getTime(), type: 'info' } )
			toastr.info( args );
		}
		// Window Factory
		window.console.toast = toastr;
		window.toastr = toastr;

	}())
});