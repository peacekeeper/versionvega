if (! args[0]) {

	println("Missing parameter (XRI, e.g. =yourname/+friend)");
} else {

	var value;
	
	var working =
	function() {
	
		value = sirius.get(rest(0), "X3 Standard");
	}

	var main =
	function() {
		
		println(value);
	}
	
	sol.runThread(working, main);
}
