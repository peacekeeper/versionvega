var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);

var page;
var main;
var content;

var topic;
var uri;

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

	page = this.document.getElementById("page");
	main = this.document.getElementById("main");
	content = main.contentDocument.getElementById("content");

	var params = net.queryParams(this.document.location.search.substring(1, this.document.location.search.length));
	topic = params.topic;
	uri = params.uri;

	var frame = document.createElement("iframe");
	frame.setAttribute("src", uri);
	frame.setAttribute("flex", "1");
	frame.setAttribute("onload", "top = null;");
	page.appendChild(frame);

	vega.subscribeTopic(sol.client(), topic);

	sol.setStatus("Web: " + uri);
}

function onUnload() {

	vega.unsubscribeTopic(sol.client(), topic);
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

	if (data.packet.topic == topic) println(data.packet.iname + "> " + data.packet.content);
}
