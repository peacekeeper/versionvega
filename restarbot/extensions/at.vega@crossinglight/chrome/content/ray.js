var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);
var polaris = Components.classes["@crossinglight/polaris;1"].getService(Components.interfaces.nsIPolaris);

var main;
var content;

function println(line) {

	content.innerHTML += code.bbToHtml(line) + "<br>";
	main.contentWindow.scrollByPages(1);
}

function clear() {

	content.innerHTML = "";
}

function onLoad() {

	this.addEventListener("beforerun", onBeforeRun, false);
	this.addEventListener("run", onRun, false);
	this.addEventListener("afterrun", onAfterRun, false);
	this.addEventListener("packet", onPacket, false);

	main = this.document.getElementById("main");
	content = main.contentDocument.getElementById("content");
	sol.setStatus("Ready.", this.ray);
}

function onUnload() {

}

function onBeforeRun(event) {

	var data = JSON.parse(event.data);

	println(data.line);
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

	if (data.packet.flags & 256) {

		println(data.packet.iname + "> " + data.packet.content);
	}
}

// Runlevel

function onButton1() {

	sol.openRay("@vega*runlevel", true, true, null);
}

// Identity

function onButton2() {

	sol.openRay("@vega*identity", true, true, null);
}

// Friends

function onButton3() {

	sol.openRay("@vega*friends", true, true, null);
}

// Direct Chat

function onButton4() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}
	
	var out = debug.inputString("Who would you like to chat with? (e.g. =markus)");

	if (out.button == 0) {
		
		var inumber = orion.resolve(out.input);
		var nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		
		var query = "iname=" + encodeURIComponent(out.input) + "&nodeid=" + encodeURIComponent(nodeid);
		
		sol.openRay("@vega*chat", true, false, query);
	}
}

// Topic Chat

function onButton5() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}
	
	var out = debug.inputString("What topic would you like to chat about? (e.g. +help)", "+help");

	if (out.button == 0) {
		
		var query = "topic=" + encodeURIComponent(out.input + "@vega*chat");

		sol.openRay("@vega*chat", true, false, query);
	}
}

// Broadcast Chat

function onButton6() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}
	
	var query = "topic=" + encodeURIComponent(orion.iname() + "@vega*chat");

	sol.openRay("@vega*chat", true, false, query);
}

// Read Text

function onButton7() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}
	
	var out = debug.inputString("Address of text? (e.g. " + orion.iname() + "+mytext)", orion.iname() + "+mytext");

	if (out.button == 0) {
		
		var query = encodeURIComponent(out.input);

		sol.openRay("@vega*read", true, false, query);
	}
}

// Write Text

function onButton8() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}
	
	var out = debug.inputString("Address of text? (e.g. " + orion.iname() + "+mytext)", orion.iname() + "+mytext");

	if (out.button == 0) {
		
		var query = encodeURIComponent(out.input);

		sol.openRay("@vega*write", true, false, query);
	}
}

// ...

function onButton9() {

}

// Web Overlay

function onButton10() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}
	
	var out = debug.inputString("Web URL? (e.g. http://www.google.com/", "http://www.google.com/");

	if (out.button == 0) {
		
		var query = "topic=" + encodeURIComponent("+(" + out.input + ")@vega*chat") + "&uri=" + encodeURIComponent(out.input);

		sol.openRay("@vega*web", true, false, query);
	}
}

// Voting

function onButton11() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}

	sol.openRay("@vega*vote", true, false, null);
}

// Control Panel

function onButton12() {

	sol.openRay("@vega*control", true, false, null);
}
