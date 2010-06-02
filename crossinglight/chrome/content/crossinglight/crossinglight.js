var versionVega = Components.classes["@crossinglight/versionvega;1"].getService(Components.interfaces.nsIVersionVega);
var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);
var polaris = Components.classes["@crossinglight/polaris;1"].getService(Components.interfaces.nsIPolaris);
var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

var sol;
var luna;
var input;
var fountain;
var pulses;
var pulsepopup;

function run(line) {

	var ray = sol.currentRay();
	
	sol.dispatchBeforeRun(line, ray);

	// process the line

	var args;
	var xri;
	var rest;

	args = line.split(/\s+/g);

	if (net.isXri(args[0])) xri = args.shift(); else xri = "*default";
	if (net.isXriRelative(xri)) xri = ray.xri + xri;

	rest = function(index) {

		if (! index) index = 0;
		var rest = line;
		var prevrest = rest;
		for (var i=0; i<=index; i++) {
			rest = rest.replace(/^\s*\S+\s+/, "");
			if (rest == prevrest) return null;
			prevrest = rest;
		}
		rest = rest.replace(/^\s+/, "");
		return(rest);
	}

	// get the script

	if (xri.lastIndexOf("*") == -1) return;
	
	var src = 
		"chrome://" + 
		code.xriToChromeUri(xri.substring(0, xri.lastIndexOf("*"))) +
		"/content/run/" +
		code.xriToChromeUri(xri.substring(xri.lastIndexOf("*") + 1)) +
		".js";

	if (! net.exists(src)) return;
	var script = net.httpGet(src);

	script = 
		"var line = unescape(\"" + escape(line) + "\");" +
		"var xri = unescape(\"" + escape(xri) + "\");" +
		"var args = eval(" + args.toSource() + ");" +
		"var rest = eval(" + rest.toSource() + ");" +
		script;

	// dispatch the script

	sol.dispatchRun(script, ray);
	sol.dispatchAfterRun(line, ray);
}

function refresh() {

	try {

		vega.resetRays("crossinglight");
		if (vega.connected()) vega.resetTopics("crossinglight");

		for (i in sol.rays) vega.subscribeRay("crossinglight", sol.rays[i].xri);
	} catch (ex) {
		
		Components.utils.reportError(ex);
	}
	
	sol.setAutoFountainColor();
}

function onWindowLoad() {

	versionVega.provisionThread(Components.classes["@mozilla.org/thread-manager;1"].getService().mainThread);

	sol = new sol(this, this.document);
	luna = new luna(this, this.document);
	input = this.document.getElementById("input");
	fountain = this.document.getElementById("fountain");
	pulses = this.document.getElementById("pulses");
	pulsepopup = this.document.getElementById("pulsepopup")

	fountain.addEventListener("fountainclick", onFountainClick, false);
	pulses.addEventListener("pulseclick", onPulseClick, false);

	initDebug();
	initSound();
	initNet();
	initCode();

	document.getElementById("solsuccess").style.display = null;
	document.getElementById("solerror").style.display = "none";

	refresh();
	sol.openDefaultRay(true);
	sol.checkRunlevel();
	setTimeout(checkPackets, 0);
}

function onWindowUnload() {

	sol.closeRays(true);
	if (vega.connected()) vega.resetTopics("crossinglight");
	vega.resetRays("crossinglight");
}

function onWindowKeyPress(event) {

	if (event.ctrlKey && ! event.shiftKey && event.keyCode == 9) {

		sol.cycleRay();
		event.preventDefault();
		return;
	}

	if (event.ctrlKey && event.shiftKey && event.keyCode == 9) {

		sol.cycleRayBack();
		event.preventDefault();
		return;
	}

	if (event.keyCode == 9) {
	
		do
			document.commandDispatcher.advanceFocus();
		while
			(document.commandDispatcher.focusedElement == null);
		event.preventDefault();
		return;
	}

	if (event.charCode && event.keyCode != 13) {

		sound.key();
		return;
	}

	if (event.keyCode == 13) {

		sound.enter();
		return;
	}
}

function onInputKeyPress(event) {

	if (event.keyCode == 38) {

		sol.historyPrev();
		return;
	}

	if (event.keyCode == 40) {

		sol.historyNext();
		return;
	}

	if (event.keyCode == 13 && input.value.length > 0) {

		try {

			sol.historyAppend(input.value);
			run(input.value);
			input.value = "";
		} catch (ex) {

			debug.messageError(ex);
		}

		return;
	}
}

function onFountainClick(event) {

	sol.openRunlevelRay(true, true);
}

function onPulseClick(event) {

	var packet = JSON.parse(event.data);
	
	pulsepopup.packet = packet;
	pulsepopup.showPopup(pulses, -1, -1, "popup", "topleft", "topright");
}

function onPulsePopupShowing(pulsepopup) {

	this.document.getElementById("pulsepopupiname").value = "From: " + pulsepopup.packet.iname;
	this.document.getElementById("pulsepopupray").value = "Ray:  " + pulsepopup.packet.ray;
	this.document.getElementById("pulsepopupcontent").childNodes[0].nodeValue = pulsepopup.packet.content;
}

function onPulsePopupExecute() {

	if (pulsepopup.packet.flags & 1) {
		
		run(pulsepopup.packet.content);
	} else if (pulsepopup.packet.flags & 2) {

		var extension = null;
		if (pulsepopup.packet.extension) extension = JSON.parse(pulsepopup.packet.extension);
		
		var focus = extension && extension.focus ? extension.focus : true;
		var singleton = extension && extension.singleton ? extension.singleton : false;
		var query = extension && extension.query ? extension.query : null;
		
		sol.openRay(pulsepopup.packet.content, focus, singleton, query);
	}

	pulsepopup.hidePopup();
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

	window.openDialog("chrome://crossinglight/content/aboutDialog.xul", "About", "chrome,centerscreen,resizable=no,scrollbars=no");
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

function checkPackets() {

	try {

		while (vega.hasPackets("crossinglight")) {

			var packet = JSON.parse(vega.fetchPacket("crossinglight"));

			if (packet.flags & 1 || packet.flags & 2) {

				// display a pulse

				luna.newPulse(packet, 2);
			} else {

				// dispatch it to the rays

				sol.dispatchPacket(packet);
			}
		}

		setTimeout(checkPackets, prefs.getIntPref("timer.interval"));
	} catch (ex) {

		Components.utils.reportError(ex);
		return;
	}
}
