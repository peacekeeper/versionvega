if (!('extensions' in window))
	window.extensions = new Array();

if (!('mook' in window.extensions))
	window.extensions.mook = new Array();

if (!('minimizetotray' in window.extensions.mook))
	window.extensions.mook.minimizetotray = function() {
		// this is a stub only
		throw Components.results.NS_ERROR_ABORT;
	};

window.extensions.mook.minimizetotray.trayClick = function(event) {
	if (event.button == 0) {
		var self = window.extensions.mook.minimizetotray;
		if (self.m_isHidden) {
			self.restore();
		} else if (!self.restoreWindow()) {
			self.openNewWindow();
		}
	}
}

window.extensions.mook.minimizetotray.openNewWindow = function() {
	var wwatch = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
			.getService(Components.interfaces.nsIWindowWatcher);
	return wwatch.openWindow(null, document.location.href, "_blank",
			"chrome,dialog=no,all", null);

};

window.extensions.mook.minimizetotray.displayIcon = function() {
	if (window.extensions.mook.minimizetotray.m_allwaysShow) {
		return false;
	}
	try {
		// a turbo window must be open, or there is no way of restoring
		if (this.m_prefs.getBoolPref(this.k_pref_prefix + 'only-one-icon')
				&& window.extensions.mook.minimizetotray.turboWindowExists()) {
			return false;
		}
	} catch (e) {
		// better just show it then
		return true;
	}
	return true;
};

window.extensions.mook.minimizetotray.alwaysShow = function() {
	var self = window.extensions.mook.minimizetotray;

	// look for existing -turbo mode windows
	if (self.turboWindowExists()) {
		return;
	}

	if (this.m_allwaysShow || this.m_prefs.getBoolPref(this.k_pref_prefix + 'tray-always-show') == false) {
		return;
	}
	this.m_allwaysShow = Components.classes[this.k_contractid_windowIcon]
			.createInstance(Components.interfaces.trayIWindowIcon);
	var baseWindows = [ window ];
	this.m_allwaysShow.setup(baseWindows[0], self.m_applicationName);
	this.m_allwaysShow.showIcon();
	self.m_isTurboMode = true;
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
				w.extensions.mook.minimizetotray.m_isTurboMode = false;
				if (w.extensions.mook.minimizetotray.m_allwaysShow) {
					w.extensions.mook.minimizetotray.m_allwaysShow.hideIcon();
					w.extensions.mook.minimizetotray.m_allwaysShow = null;
					if(w.extensions.mook.minimizetotray.m_windowIcon) {
						w.extensions.mook.minimizetotray.m_windowIcon.showIcon();
					}
				}
			} else if (w.extensions.mook.minimizetotray.m_windowIcon) {
				w.extensions.mook.minimizetotray.m_windowIcon.showIcon();
			}
		}
	}
};

window.extensions.mook.minimizetotray.turboMode = function() {
	var self = window.extensions.mook.minimizetotray;
	self.noBinaryComponentWarning();

	// look for existing -turbo mode windows
	if (self.turboWindowExists()) {
		return;
	}
	
	self.m_isTurboMode = true;
	self.m_windowHider.suppressed = true;
	// make the -turbo mode window
	self.m_allwaysShow = Components.classes[self.k_contractid_windowIcon]
			.createInstance(Components.interfaces.trayIWindowIcon);
	// need this too if the -turbo mode icon is closed
	self.m_windowIcon = Components.classes[self.k_contractid_windowIcon]
			.createInstance(Components.interfaces.trayIWindowIcon);
	self.m_isHidden = [ window ];

	self.m_windowHider.minimize(1, [window]);
	self.m_allwaysShow.setup(window, self.m_applicationName);
	self.m_windowIcon.setup(window, self.m_applicationName);
	self.m_allwaysShow.showIcon();
	
	self.m_turboLoaded = true;
	return true;
};

window.extensions.mook.minimizetotray.minimizableOnClose = function() {
	return true;
}

// signal that the app-specific parts have done loading
window.extensions.mook.minimizetotray.m_bLoadedApp = true;