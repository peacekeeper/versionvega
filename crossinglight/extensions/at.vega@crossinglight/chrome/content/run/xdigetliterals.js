if (! args[0]) {

	println("Missing parameter (XRI, e.g. =yourname/+friend)");
} else {

	var value;
	
	var working =
	function() {
	
		value = sirius.getLiterals(rest(0), { });
	}

	var main =
	function() {
		
		println(value);
	}
	
	sol.runThread(working, main);
}
