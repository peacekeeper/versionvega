if (! args[0]) {

	debug.messageString("Missing parameter (text address, e.g. =yourname*myreply)");
} else {

	var xdi;
	
	if (args[1])
			xdi = address + "/$public+reply//" + orion.inumber() + "/" + args[1] + "/" + args[0];
		else
			xdi = address + "/$public+reply//" + orion.inumber() + "/" + "+reply" + "/" + args[0];
	
	var working =
	function() {
	
		sirius.add(xdi, null);
	}
	
	var main =
	function() {
			
		sol.openRay("@vega*write", true, false, encodeURIComponent(args[0]));
	}
	
	sol.runThread(working, main);
}