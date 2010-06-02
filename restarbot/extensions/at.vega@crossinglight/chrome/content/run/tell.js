if (! args[0]) {

	println("Missing parameter (nodeid)");
} else if (! rest(1)) {

	println("Missing parameter (message, e.g. how are you)");
} else {

	var working =
	function() {

		if (args[0].indexOf("=!") == 0 || args[0].indexOf("@!") == 0) {

			inumber = args[0];
			nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		} else if (args[0].indexOf("=") == 0 || args[0].indexOf("@") == 0) {
			
			inumber = orion.resolve(args[0]);
			nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		} else {
			
			nodeid = args[0];
		}

		if (! nodeid) throw "Unknown destination: " + args[0];
		
		vega.send(nodeid, "@vega", rest(1), "256", null);
	}

	sol.runThread(working);
}
