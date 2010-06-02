var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);
var polaris = Components.classes["@crossinglight/polaris;1"].getService(Components.interfaces.nsIPolaris);

var chats;
var initpacket;

var title;
var main;
var content;
var input;

function println(line) {

	content.innerHTML += code.bbToHtml(line) + "<br>";
	main.contentWindow.scrollByPages(1);
}

function clear() {

	content.innerHTML = "";
}

function onWindowLoad() {

	this.addEventListener("packet", onPacket, false);

	chats = window.arguments[0];
	initpacket = window.arguments[1];

	title = this.document.getElementById("title");
	main = this.document.getElementById("main");
	content = main.contentDocument.getElementById("content");
	input = this.document.getElementById("input");

	if (initpacket.ray == "@vega*chat") {

		chats[initpacket.topic] = window;
		vega.subscribeTopic("restarbot", initpacket.topic);
		
		if (initpacket.topic.charAt(0) != "+") {

			title.value = "Broadcast: " + initpacket.topic.substring(0, initpacket.topic.length - "@vega*chat".length);
			input.hidden = true;
		} else {

			title.value = "Topic: " + initpacket.topic.substring(0, initpacket.topic.length - "@vega*chat".length);
			input.hidden = false;
		}
	} else if (initpacket.ray == "@vega" && initpacket.flags == 256) {
	
		chats[initpacket.iname] = window;
		title.value = "User: " + initpacket.iname;
	} else {
		
	}

	initDebug();
	initNet();
	initCode();

	input.focus();
}

function onWindowUnload() {

	if (initpacket.ray == "@vega*chat") {

		chats[initpacket.topic] = null;
		vega.unsubscribeTopic("restarbot", initpacket.topic);
	} else if (initpacket.ray == "@vega" && initpacket.flags == 256) {
	
		chats[initpacket.iname] = null;
	} else {
		
	}
}

function onPacket(event) {

	var data = JSON.parse(event.data);

	println(data.packet.iname + "> " + data.packet.content);
}

function onInputKeyPress(event) {

	if (event.keyCode == 13 && input.value.length > 0) {

		try {

			if (initpacket.ray == "@vega*chat") {

				vega.multicast(initpacket.topic, "@vega*chat", input.value, null, null);
			} else if (initpacket.ray == "@vega" && initpacket.flags == 256) {
			
				var nodeid = sirius.getLiteral(initpacket.inumber + "/$nodeid", null);
				vega.send(nodeid, "@vega", input.value, "256", null);
			} else {
				
			}

			input.value = "";
		} catch (ex) {

			debug.messageError(ex);
		}

		return;
	}
}
