var appcontent;
var statusbardisplay;
var input;

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

function onWindowLoad() {

	appcontent = this.document.getElementById("appcontent");
	statusbardisplay = this.document.getElementById("statusbar-display");
	input = this.document.getElementById("input");
}

function onWindowUnload() {

	sol.closeRay(true);
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
}

function onWindowFocus() {
	
	sol.appcontent = appcontent;
	sol.statusbardisplay = statusbardisplay;
	sol.input = input;
	
	for (rayindex in sol.rays) {
	
		if (sol.rays[rayindex] == this) {
			
			sol.rayindex = rayindex;
			return;
		}
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

function cmdToggleFullScreen() {
	
	this.fullScreen = ! this.fullScreen;
}
