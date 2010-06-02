if (! args[0]) {

	println("Missing parameter (key)");
} else {

	var value;
	
	var working =
	function() {
	
		value = vega.get(args[0]);
	}

	var main =
	function() {
		
		println(value);
	}

	sol.runThread(working, main);
}
