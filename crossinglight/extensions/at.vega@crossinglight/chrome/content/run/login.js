if (! args[0]) {

	println("Missing parameter (i-name, e.g. =yourname)");
} else if (! args[1]) {

	println("Missing parameter (password, e.g. secret)");
} else {

	var iname;
	var inumber;

	var working =
	function() {

		orion.login(args[0], args[1]);
		iname = orion.iname();
		inumber = orion.inumber();
		sirius.set(inumber + "/$nodeid/'" + vega.nodeId() + "'", null);
	};

	var main = 
	function() {

		println(iname + " is " + inumber);
		sol.setAutoFountainColor();
	};

	var error =
	function(ex) {
		
		println(ex);
	};
	
	sol.runThread(working, main, error);
}
