var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);

var main;
var content;

var topic;
var iname;
var nodeid;

function println(line) {

	content.innerHTML += code.bbToHtml(line) + "<br>";
	main.contentWindow.scrollByPages(1);
}

function clear() {

	content.innerHTML = "";
}

function onLoad() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}

	this.addEventListener("beforerun", onBeforeRun, false);
	this.addEventListener("run", onRun, false);
	this.addEventListener("afterrun", onAfterRun, false);
	this.addEventListener("packet", onPacket, false);

	main = this.document.getElementById("main");
	content = main.contentDocument.getElementById("content");

	var params = net.queryParams(this.document.location.search.substring(1, this.document.location.search.length));
	topic = params.topic;
	iname = params.iname;
	nodeid = params.nodeid;

	if (topic) {

		vega.subscribeTopic(sol.client(), topic);
		
		if (topic.charAt(0) != "+") {

			sol.setStatus("Broadcast: " + topic.substring(0, topic.length - "@vega*chat".length));
		} else {

			sol.setStatus("Topic: " + topic.substring(0, topic.length - "@vega*chat".length));
		}
	} else if (iname && nodeid) {

		sol.setStatus("User: " + iname);
	} else {
		
	}
}

function onUnload() {

	if (topic) {

		vega.unsubscribeTopic(sol.client(), topic);
	} else if (iname && nodeid) {
	
	} else {
		
	}
}

function onBeforeRun(event) {

	var data = JSON.parse(event.data);
}

function onRun(event) {

	var data = JSON.parse(event.data);

	try {

		eval(data.script);
	} catch (ex) {

		Components.utils.reportError(ex);
	}
}

function onAfterRun(event) {

	var data = JSON.parse(event.data);
}

function onPacket(event) {

	var data = JSON.parse(event.data);

	if (topic) {
		
		if (topic == data.packet.topic) println(data.packet.iname + "> " + data.packet.content);
	} else if (iname && nodeid) {
		
		if (iname == data.packet.iname) println(data.packet.iname + "> " + data.packet.content);
	} else {
		
	}
}
