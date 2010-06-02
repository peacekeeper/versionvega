var versionVega = Components.classes["@crossinglight/versionvega;1"].getService(Components.interfaces.nsIVersionVega);
var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);
var polaris = Components.classes["@crossinglight/polaris;1"].getService(Components.interfaces.nsIPolaris);
var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var alertsService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);

var parent;

var topicslist;
var addtopictextbox;

function addRichlistitem(topic) {
	
	var richlistitem = this.document.createElement("richlistitem");
	richlistitem.topic = topic;
	var description = document.createElement("description");
	description.setAttribute("value", topic.substring(0, topic.length - "@vega*chat".length));
	var spacer = document.createElement("spacer");
	spacer.setAttribute("flex", "1");
	var removebutton = document.createElement("image");
	removebutton.setAttribute("class", "removebutton");
	removebutton.setAttribute("tooltiptext", "Unsubscribe");
	removebutton.onclick = function() { onUnsubscribe(this); };

	topicslist.appendChild(richlistitem);
	richlistitem.appendChild(description);
	richlistitem.appendChild(spacer);
	richlistitem.appendChild(removebutton);
}

function removeRichlistitem(topic) {
	
	for (i in topicslist.childNodes) {
		
		var richlistitem = topicslist.childNodes[i];
		if (richlistitem.topic == topic) {
			
			topicslist.removeChild(richlistitem);
			break;
		}
	}
}

function refresh() {

	try {

		var topics = polaris.getReferences(orion.inumber() + "/@vega*chat+topics", { });

		while (topicslist.hasChildNodes()) topicslist.removeChild(topicslist.firstChild);

		for (i in topics) {

			addRichlistitem(topics[i]);
		}

		setTimeout(checkPackets, 0);
	} catch (ex) {

		Components.utils.reportError(ex);
	}
}

function onWindowLoad() {

	parent = window.arguments[0];

	topicslist = this.document.getElementById("topicslist");
	addtopictextbox = this.document.getElementById("addtopictextbox");

	initDebug();
	initNet();
	initCode();

	refresh();
}

function onWindowUnload() {
}

function onOk() {
	
	window.close();
}

function onSubscribe() {
	
	var topic = addtopictextbox.value + "@vega*chat";

	polaris.add(orion.inumber() + "/@vega*chat+topics/" + topic, null);
	vega.subscribeTopic("restarbot", topic);
	addRichlistitem(topic);
	if (topic.charAt(0) == "+") parent.addMenuitem(topic);
}

function onUnsubscribe(removebutton) {

	var topic = removebutton.parentNode.topic;
	
	polaris.del(orion.inumber() + "/@vega*chat+topics/" + topic, null);
	vega.unsubscribeTopic("restarbot", topic);
	removeRichlistitem(topic);
	if (topic.charAt(0) == "+") parent.removeMenuitem(topic);
}

function checkPackets() {

	try {

		while (vega.hasPackets("restarbot")) {

			var packet = JSON.parse(vega.fetchPacket("restarbot"));

			var title;
			var text;
			
			title = packet.iname;
			if (packet.topic) title += " >> " + packet.topic;
			text = packet.content;
			
			alertsService.showAlertNotification(
					"chrome://branding/content/logo32.png", // imageUrl
					title, // title
					text, // text
					true, // textClickable
					null, // cookie
					null, // nsIObserver alertListener, 
					null); //name
		}

		setTimeout(checkPackets, prefs.getIntPref("timer.interval"));
	} catch (ex) {

		Components.utils.reportError(ex);
		return;
	}
}
