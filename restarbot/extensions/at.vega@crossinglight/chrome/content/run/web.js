if (! args[0]) {

	println("Missing parameter (URI, e.g. www.google.com");
} else {

	query = "topic=" + encodeURIComponent("+(" + args[0] + ")@vega*chat") + "&uri=" + encodeURIComponent(args[0]);
	sol.openRay("@vega*web", true, false, query);
}
