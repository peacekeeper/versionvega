if (! args[0]) {

	println("Missing parameter (XRI, e.g. =yourname/+friend)");
} else {

	var working =
	function() {
	
		sirius.mod(rest(0), null);
	}
	
	sol.runThread(working);
}
