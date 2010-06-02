if (! args[0]) {

	println("Missing parameter (media address)");
} else {
	
	sol.openRay("@vega*listen", true, false, encodeURIComponent(args[0]));
}
