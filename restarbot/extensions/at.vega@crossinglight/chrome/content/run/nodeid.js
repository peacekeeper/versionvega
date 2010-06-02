if (! args[0]) {

	if (vega.connected()) {

		println(vega.nodeId());
	} else {
		
		println("Not connected.");
	}
} else {

	var inumber;
	var nodeid;

	var working =
	function() {

		if (args[0].indexOf("=!") == 0 || args[0].indexOf("@!") == 0) {

			inumber = args[0];
			nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		} else if (args[0].indexOf("=") == 0 || args[0].indexOf("@") == 0) {
			
			inumber = orion.resolve(args[0]);
			nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		}
	};

	var main =
	function() {

		println(inumber + " is at " + nodeid);
	};

	sol.runThread(working, main);
}
