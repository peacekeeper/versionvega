if (! args[0]) {

	println("Missing parameter (text address, e.g. =yourname*text)");
} else {
	
	sol.openRay("@vega*write", true, false, encodeURIComponent(args[0]));
}