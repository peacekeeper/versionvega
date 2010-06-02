if (! args[0]) {

	println("Missing parameter (text address, e.g. =yourname*text");
} else {

	sol.openRay("@vega*read", true, false, encodeURIComponent(args[0]));
}
