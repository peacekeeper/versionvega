var debug;

/*
 * API of "debug" object:
 *
 * alertString()
 * dumpString()
 * messageString()
 * inputString()
 * alertObject()
 * dumpObject()
 * messageObject()
 * alertError()
 * dumpError()
 * messageError()
 */

function initDebug() {
	
	debug = { };

	var recObject = function(obj, name, indent, depth) {

		if (depth > 1) return("");

		if (typeof obj == "object") {
	
			var child = null;
			var output = indent + name + "\n";
	
			indent += "  ";
	
			for (var item in obj) {
	
				try {
	
					child = obj[item];
				} catch (ex) {
	
					child = "<" + ex +">";
				}
	
				if (typeof child == "object") {
	
					output += recObject(child, item, indent, depth + 1);
				} else {
	
					output += indent + item + ": " + child + "\n";
				}
			}
	
			return(output);
		} else {
	
			return(obj);
		}
	}

	debug.alertString = function(string) {
	
		alert(string);
	}

	debug.dumpString = function(string) {
	
		dump(string + "\n");
	}

	debug.messageString = function(string, title, buttons) {

		if (! title) title = "Message";
		if (! buttons) buttons = [ "Close." ];
		
		var params = { "message" : string, "title" : title, "buttons" : buttons };
		window.openDialog("chrome://app/content/message.xul", null, "modal", params);

		return params.out;
	}
	
	debug.inputString = function(string, def, title, buttons) {
		
		if (! title) title = "Input";
		if (! buttons) buttons = [ "Ok.", "Cancel." ];
		
		var params = { "message" : string, "def" : def, "title" : title, "buttons" : buttons };
		window.openDialog("chrome://app/content/input.xul", null, "modal", params);

		return params.out;
	}

	debug.alertObject = function(obj) {

		debug.alertString(recObject(obj, "", "", 1));
	}

	debug.dumpObject = function(obj) {

		debug.dumpString(recObject(obj, "", "", 1));
	}

	debug.messageObject = function(obj) {

		debug.messageString(recObject(obj, "", "", 1));
	}

	debug.alertError = function(ex)  {

		try {

			var msg;
	
			msg = "";
			if (ex.name) msg += "NAME: " + ex.name;
			if (ex.message) msg += "\nMESSAGE: " + ex.message;
			if (ex.filename) msg += "\n\nFILE: " + ex.filename;
			if (ex.lineNumber) msg += "\nLINE: " + ex.lineNumber;	    
		
			debug.alertString(msg ? msg : ex);
		} catch (ex2) {

			debug.alertString("ERROR: " + ex);
		}
	} 	    	

	debug.dumpError = function(ex) {

		try {

			var msg;
		
			msg = "";
			if (ex.name) msg += "NAME: " + ex.name;
			if (ex.message) msg += "\nMESSAGE: " + ex.message;
			if (ex.filename) msg += "\n\nFILE: " + ex.filename;
			if (ex.lineNumber) msg += "\nLINE: " + ex.lineNumber;	    
		
			debug.dumpString((msg ? msg : ex) + "\n");
		} catch (ex2) {

			debug.dumpString("ERROR: " + ex + "\n");
		}
	}

	debug.messageError = function(ex) {

		try {

			var msg;
		
			msg = "";
			if (ex.name) msg += "NAME: " + ex.name;
			if (ex.message) msg += "\nMESSAGE: " + ex.message;
			if (ex.filename) msg += "\n\nFILE: " + ex.filename;
			if (ex.lineNumber) msg += "\nLINE: " + ex.lineNumber;	    
		
			debug.messageString((msg ? msg : ex) + "\n");
		} catch (ex2) {

			debug.messageString("ERROR: " + ex + "\n");
		}
	}
}
