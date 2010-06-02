if (!('extensions' in window))
	window.extensions = new Array();

if (!('mook' in window.extensions))
	window.extensions.mook = new Array();

if (!('minimizetotray' in window.extensions.mook))
	window.extensions.mook.minimizetotray = function() {
		// this is a stub only
		throw Components.results.NS_ERROR_ABORT;
	};

function openWindow(parent, url, target, features, args) {
	var wwatch = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
			.getService(Components.interfaces.nsIWindowWatcher);

	var argstring;
	if (args) {
		argstring = Components.classes["@mozilla.org/supports-string;1"]
				.createInstance(Components.interfaces.nsISupportsString);
		argstring.data = args;
	}
	return wwatch.openWindow(parent, url, target, features, argstring);
};

//these next few functions were copied from Mozilla code, 
//and it allows us to figure out the home page to send the browser.xul window
function chromeURL() {
	if (this.mChromeURL) {
		return this.mChromeURL;
	}
	var prefb = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);
	this.mChromeURL = prefb.getCharPref("browser.chromeURL");
	return this.mChromeURL;
};

window.extensions.mook.minimizetotray.openNewWindow = function() {
	openWindow(null, chromeURL(), "_blank", "chrome,dialog=no,all", null);
};

// signal that the app-specific parts have done loading
window.extensions.mook.minimizetotray.m_bLoadedApp = true;
