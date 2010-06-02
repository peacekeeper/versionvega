// Firefox specific functions for MinimizeToTray

if (!('extensions' in window))
	window.extensions = new Array();

if (!('mook' in window.extensions))
	window.extensions.mook = new Array();

if (!('minimizetotray' in window.extensions.mook))
	window.extensions.mook.minimizetotray = function() {
		// this is a stub only
		throw Components.results.NS_ERROR_ABORT;
	};
	
window.extensions.mook.minimizetotray.m_isLocked = true;

window.extensions.mook.minimizetotray.trayClick = function(event) {
	if (event.button == 0) {
		var self = window.extensions.mook.minimizetotray;
		if (!self.restoreWindow()) {
			self.openNewWindow();
		}
	}
};

window.extensions.mook.minimizetotray.trayTurboClose = function() {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
	var e = wm.getEnumerator(null);
	while (e.hasMoreElements()) {
		var w = e.getNext();
		if ('extensions' in w && 'mook' in w.extensions
				&& 'minimizetotray' in w.extensions.mook) {
			if (w.extensions.mook.minimizetotray.m_isTurboMode) {
				// |w| is a turbo-mode window
				w.close();
				w.extensions.mook.minimizetotray.m_windowIcon.hideIcon();
			} else if (w.extensions.mook.minimizetotray.m_isHidden) {
				w.extensions.mook.minimizetotray.m_windowIcon.showIcon();
			}
		}
	}
};

window.extensions.mook.minimizetotray.initTurboMode = function() {
	var self = window.extensions.mook.minimizetotray;
	var commandLine = Components.classes['@codefisher.org/minimizetotray/turbo-startup;1']
			.getService(Components.interfaces.trayICommandLine);
	if (self.m_isTurboMode) {
		return true;
	}
	window.focus(); window.restore();
	self.m_isTurboMode = true;
	self.m_windowHider.suppressed = true;
	
	self.m_windowIcon = Components.classes[self.k_contractid_windowIcon]
			.createInstance(Components.interfaces.trayIWindowIcon);
	var baseWindows = [ window ];
	self.m_windowHider.minimize(baseWindows.length, baseWindows);
	
	self.m_windowIcon.setup(window, self.m_applicationName);
	self.m_windowIcon.showIcon();
	return true;
};

//signal that the app-specific parts have done loading
window.extensions.mook.minimizetotray.m_bLoadedApp = true;