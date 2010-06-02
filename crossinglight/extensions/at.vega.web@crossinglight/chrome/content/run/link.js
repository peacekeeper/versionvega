if (! args[0]) {
	
	println("Usage: *link [link-xri] target-uri");
} else {

	var linkxri = null;
	var targeturi = null;

	if (args.length >= 2) {
	
		linkxri = args[0];
		targeturi = args[1];
	} else if (args.length >= 1) {
		
		linkxri = "+link";
		targeturi = args[0];
	}

	var working =
	function() {

		sirius.add("+(" + encodeURIComponent(uri) + ")/$public+links//" + orion.inumber() + "/" + linkxri + "/+(" + encodeURIComponent(targeturi) + ")", null);
	}

	sol.runThread(working);
}
