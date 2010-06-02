if (! args[0]) {

	if (orion.loggedin()) {

		println(orion.inumber());
	} else {
		
		println("Not logged in.");
	}
} else {

	var inumber;

	var working =
	function() {

		inumber = orion.resolve(args[0]);
	};

	var main =
	function() {

		println(args[0] + " is " + inumber);
	};

	sol.runThread(working, main);
}
