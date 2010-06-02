var query;

if (args[0] && args[0].charAt(0) == "+") {
	
	query = "topic=" + encodeURIComponent(args[0] + "@vega*chat");
} else if (args[0]) {
	
	var inumber = orion.resolve(args[0]);
	var nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
	
	query = "iname=" + encodeURIComponent(args[0]) + "&nodeid=" + encodeURIComponent(nodeid);
} else {
	
	query = "topic=" + encodeURIComponent(orion.iname() + "@vega*chat");
}

sol.openRay("@vega*chat", true, false, query);
