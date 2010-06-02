if ((! args[0]) || (! args[1])) {

	println("Missing parameter (key, value)");
} else {

	var working =
	function() {
	
		vega.put(args[0], args[1]);
	}

	sol.runThread(working);
}
