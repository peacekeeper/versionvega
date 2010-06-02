/*var timetoken = orion.timeToken1(line);

var extension = { };
extension.timetoken = timetoken;*/

if (topic) {

	vega.multicast(topic, "@vega*chat", line, null, null);
} else if (iname && nodeid) {

	println(orion.iname() + "> " + line);
	vega.send(nodeid, "@vega*chat", line, null, null);
} else {

}
