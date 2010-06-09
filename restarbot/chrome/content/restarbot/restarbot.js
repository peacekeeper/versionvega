var versionVega = Components.classes["@crossinglight/versionvega;1"].getService(Components.interfaces.nsIVersionVega);
var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);
var polaris = Components.classes["@crossinglight/polaris;1"].getService(Components.interfaces.nsIPolaris);
var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var alertsService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);

var ui;
var splash;
var mode;
var broadcast;
var user;
var topicsmenulist;
var topicsmenupopup;
var edit;

var oldrunlevel;
var checkpacketstimer;

function addMenuitem(topic) {

	var menuitem = this.document.createElement("menuitem");
	menuitem.topic = topic;
	menuitem.setAttribute("label", topic.substring(0, topic.length - "@vega*chat".length));
	topicsmenupopup.appendChild(menuitem);
}

function removeMenuitem(topic) {
	
	for (var i=0; i<topicsmenupopup.childNodes.length; i++) {
		
		var menuitem = topicsmenupopup.childNodes[i];
		if (menuitem.topic == topic) {
			
			topicsmenupopup.removeChild(menuitem);
			break;
		}
	}
}

function removeAllMenuitems() {
	
	while (topicsmenupopup.childNodes.length > 0) {

		var menuitem = topicsmenupopup.childNodes[0];
		topicsmenupopup.removeChild(menuitem);
	}
}

function onWindowLoad() {

	versionVega.provisionThread(Components.classes["@mozilla.org/thread-manager;1"].getService().mainThread);
	
	sol = new sol(this, this.document);
	ui = this.document.getElementById("ui");
	splash = this.document.getElementById("splash");
	mode = this.document.getElementById("mode");
	broadcast = this.document.getElementById("broadcast");
	user = this.document.getElementById("user");
	topicsmenulist = this.document.getElementById("topicsmenulist");
	topicsmenupopup = this.document.getElementById("topicsmenupopup");
	edit = this.document.getElementById("edit");

	initDebug();
	initNet();
	initCode();

	display("random");
	setTimeout(function() { checkRunlevel(true); }, 0);
	setTimeout(function() { edit.focus(); }, 0);
}

function onWindowUnload() {

	sol.closeRays(true);

	try {

		vega.resetRays("restarbot");
		vega.resetTopics("restarbot");
	} catch (ex) { }
}

function display(newmode) {

	if (! newmode) {
		
		ui.hidden = true;
		splash.hidden = false;
		return;
	} else {
		
		ui.hidden = false;
		splash.hidden = true;
	}
	
	if (newmode == "broadcast") {

		mode.mode = "broadcast";
		
		mode.label = "Broadcast!";
		broadcast.hidden = false;
		user.hidden = true;
		topicsmenulist.hidden = true;
	} else if (newmode == "user") {
		
		mode.mode = "user";

		mode.label = "Send to user!";
		broadcast.hidden = true;
		user.hidden = false;
		topicsmenulist.hidden = true;
	} else if (newmode == "topic") {
		
		mode.mode = "topic";

		mode.label = "Send to topic!";
		broadcast.hidden = true;
		user.hidden = true;
		topicsmenulist.hidden = false;
	} else if (newmode == "random") {
		
		mode.mode = "random";

		mode.label = "Say something to the network!";
		broadcast.hidden = true;
		user.hidden = true;
		topicsmenulist.hidden = true;
	}

	edit.focus();
}

function onMode() {

	if (mode.mode == "broadcast") {

		display("user");
	} else if (mode.mode == "user") {
		
		display("topic");
	} else if (mode.mode == "topic") {
		
		display("random");
	} else if (mode.mode == "random") {
		
		display("broadcast");
	}
}

function onFollowing() {

	window.openDialog("chrome://restarbot/content/following.xul", "restarbot:following:window", "chrome,centerscreen,resizable=yes,scrollbars=no", this);
}

function onSend() {

	if (edit.value == "") return;
	
	var working = 
	function() {
	
		if (mode.mode == "broadcast") {
	
			vega.multicast(orion.iname() + "@vega*chat", "@vega*chat", edit.value, null, null);
		} else if (mode.mode == "user") {
			
			var inumber;
			var nodeid;

			if (user.value.indexOf("=!") == 0 || user.value.indexOf("@!") == 0) {
	
				inumber = user.value;
				nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
			} else if (user.value.indexOf("=") == 0 || user.value.indexOf("@") == 0) {
				
				inumber = orion.resolve(user.value);
				nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
			} else {
				
				nodeid = user.value;
			}

			if (! nodeid) throw "Unknown destination: " + user.value;
	
			vega.send(nodeid, "@vega*chat", edit.value, null, null);
		} else if (mode.mode == "topic") {
			
			vega.multicast(topicsmenulist.label + "@vega*chat", "@vega*chat", edit.value, null, null);
		} else if (mode.mode == "random") {

			var nodeid = vega.lookupRandom();
			
			vega.send(nodeid, "@vega*chat", edit.value, null, null);
		}
	};
	
	var main = 
	function() {
	
		edit.value = "";
	};
	
	sol.runThread(working, main);
}

function cmdDebugConsole() {

	var console = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow('global:console');

	if (console) {

		console.focus();
	} else {

		console = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
		console.openWindow(null, "chrome://global/content/console.xul","", "all,dialog=no,resizable", null);
	}
}

function cmdAbout() {

	window.openDialog("chrome://restarbot/content/aboutDialog.xul", "About", "chrome,centerscreen,resizable=no,scrollbars=no");
}

function cmdExtensions() {

	var console = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
	console.openWindow(null, "chrome://mozapps/content/extensions/extensions.xul?type=extensions","", "all,dialog=no,resizable", null);
}

function cmdConfig() {

	var console = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
	console.openWindow(null, "about:config","", "all,dialog=no,resizable", null);
}

function cmdXPCOMViewer() {

	var console = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
	console.openWindow(null, "chrome://xpcomviewer/content/xv.xul","", "all,dialog=no,resizable", null);
}

function cmdDOMInspector() {

	var windowDS = Components.classes["@mozilla.org/rdf/datasource;1?name=window-mediator"].getService(Components.interfaces.nsIWindowDataSource);
	var tmpNameSpace = {};                         
	var sl = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].createInstance(Components.interfaces.mozIJSSubScriptLoader);
	sl.loadSubScript("chrome://inspector/content/hooks.js", tmpNameSpace);
	tmpNameSpace.inspectDOMDocument(document);
}

function cmdOpenDefaultRay() {
	
	sol.openDefaultRay(true, false);
}

function cmdOpenRunlevelRay() {
	
	sol.openRunlevelRay(true, true);
}

function cmdCloseRay() {
	
	sol.closeRay();
}

function cmdToggleFullScreen() {
	
	this.fullScreen = ! this.fullScreen;
}

function cmdModeBroadcast() {
	
	display("broadcast");
	window.extensions.mook.minimizetotray.restore();
}

function cmdModeUser() {

	display("user");
	window.extensions.mook.minimizetotray.restore();
}

function cmdModeTopic() {
	
	display("topic");
	window.extensions.mook.minimizetotray.restore();
}

function cmdModeRandom() {
	
	display("random");
	window.extensions.mook.minimizetotray.restore();
}

function checkRunlevel(init) {
	
	dump("checkRunlevel(" + init + ")\n");
	
	var currentrunlevel = sol.runlevel();
	
	// runlevel changed?
	
	if (currentrunlevel != oldrunlevel) {

		// not in runlevel 3?
	
		if (init && (currentrunlevel != 3)) {
			
			// init dialog
			
			var message = "Your node runlevel is currently " + currentrunlevel + ". This means that you are not yet fully connected and identified. Click OK to fix this.";
			var title = "Node Runlevel";
			var buttons = ["OK.", "Cancel."];
	
			if (debug.messageString(message, title, buttons) == 0) {
				
				sol.openRunlevelRay(true, true);
			}
		}
		
		// left runlevel 3?
		
		if (currentrunlevel != 3) {
			
			// reset rays and topics, and cancel polling packets

			try {

				vega.resetRays("restarbot");
				vega.resetTopics("restarbot");
			} catch (ex) { }

			removeAllMenuitems();
			
			if (checkpacketstimer) clearTimeout(checkpacketstimer);
		}
		
		// entered runlevel 3?
		
		if (currentrunlevel == 3) {
		
			// set up rays and topics, and start polling packets
			
			try {
		
				vega.subscribeRay("restarbot", "@vega");
				vega.subscribeRay("restarbot", "@vega*chat");
		
				var topics = polaris.getReferences(orion.inumber() + "/@vega*chat+topics", { });
		
				for (i in topics) {
		
					if (topics[i].charAt(0) == "+") addMenuitem(topics[i]);
		
					vega.subscribeTopic("restarbot", topics[i]);
				}
			} catch (ex) {
		
				Components.utils.reportError(ex);
			}
		
			checkpacketstimer = setTimeout(function() { checkPackets(); }, 0);
		}

		// dispatch event with changed runlevel
		
		sol.dispatchRunlevelChanged(oldrunlevel, currentrunlevel);
		oldrunlevel = currentrunlevel;
	}
	
	// keep checking
	
	setTimeout(function() { checkRunlevel(false); }, 2000);
}

function checkPackets() {
	
	dump("checkPackets()\n");
	
	// listen to user clicks on notification
	
	var listener = {

		observe: function(subject, topic, data) {

			if (topic == "alertclickcallback") {

				var packet = JSON.parse(data);
				var query;

				if (packet.ray == "@vega*chat" && packet.topic) {

					query = "topic=" + encodeURIComponent(packet.topic);
				} else if (packet.ray == "@vega*chat") {

					var nodeid = sirius.getLiteral(packet.inumber + "/$nodeid", null);

					query = "iname=" + encodeURIComponent(packet.iname) + "&nodeid=" + encodeURIComponent(nodeid);
				} else {

					return;
				}

				sol.openRay("@vega*chat", true, false, query);
			}
		}
	}

	// fetch packets
	
	try {

		while (vega.hasPackets("restarbot")) {

			var packet = JSON.parse(vega.fetchPacket("restarbot"));

			// dispatch it to the rays

			sol.dispatchPacket(packet);

			// display notification

			var title;
			var text;

			if (packet.ray == "@vega*chat" && packet.topic) {

				title = packet.iname + " >> " + packet.topic;
				if (title.lastIndexOf("@vega*chat") == (title.length - "@vega*chat".length)) title = title.substring(0, title.lastIndexOf("@vega*chat"));
				text = packet.content;
			} else if (packet.ray == "@vega*chat") {
				
				title = packet.iname;
				text = packet.content;
			} else {
				
				continue;
			}

			alertsService.showAlertNotification(
					"chrome://branding/content/logo32.png", // imageUrl
					title, // title
					text, // text
					true, // textClickable
					JSON.stringify(packet), // cookie
					listener, // nsIObserver alertListener, 
					null); //name
		}
	} catch (ex) {

		Components.utils.reportError(ex);
	}

	// keep checking
	
	checkpacketstimer = setTimeout(function() { checkPackets(); }, prefs.getIntPref("timer.interval"));
}
