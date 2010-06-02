if (!('extensions' in window))
	window.extensions = new Array();

if (!('mook' in window.extensions))
	window.extensions.mook = new Array();

if (!('minimizetotray' in window.extensions.mook))
	window.extensions.mook.minimizetotray = function() {
		// this is a stub only
		throw Components.results.NS_ERROR_ABORT;
	};

window.extensions.mook.minimizetotray.displayIcon = function() {
	try {
		// a turbo window must be open, or there is no way of restoring
		if (this.m_prefs.getBoolPref(this.k_pref_prefix + 'only-one-icon') == false
				|| window.extensions.mook.minimizetotray.turboLoaded() == false) {
			return true;
		}
	} catch (e) {
		// better just show it then
		return true;
	}
	return false;
};

window.extensions.mook.minimizetotray.trayTurboClose = function() {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
	var e = wm.getEnumerator(null);
	while (e.hasMoreElements()) {
		var w = e.getNext();
		if ('extensions' in w && 'mook' in w.extensions
				&& 'minimizetotray' in w.extensions.mook
				&& w.extensions.mook.minimizetotray.m_isTurboMode) {
			// |w| is a turbo-mode window
			w.extensions.mook.minimizetotray.restore();
			w.close();
		}
	}
};

window.extensions.mook.minimizetotray.turboMode = function() {
	var self = window.extensions.mook.minimizetotray;
	self.noBinaryComponentWarning();
	// look for existing -turbo mode windows
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
	var e = wm.getEnumerator(null);
	while (e.hasMoreElements()) {
		var w = e.getNext();
		if ('extensions' in w && 'mook' in w.extensions
				&& 'minimizetotray' in w.extensions.mook
				&& w.extensions.mook.minimizetotray.m_isTurboMode)
			// a turbo mode window already exists
			return;
	}

	// make the -turbo mode window
	self.m_windowHider.suppressed = true;
	self.m_isHidden  = [ window ];
	self.m_windowHider.minimize(self.m_isHidden.length, self.m_isHidden);
	
	self.m_windowIcon = Components.classes[self.k_contractid_windowIcon]
	                           			.createInstance(Components.interfaces.trayIWindowIcon);
	self.m_windowIcon.setup(window, self.m_applicationName);
	self.m_windowIcon.showIcon();
	
	self.m_isTurboMode = true;
};

// WA: Fullscreen minimize-button Overlay
function mtt_minimizebuttonOnClick(event) {
	if (event.button == 2) {
		if (event.ctrlKey) {
			window.extensions.mook.minimizetotray.minimizeAll();
		} else {
			window.extensions.mook.minimizetotray.minimizeWindow();
		}
	} else if (event.button == 1) {
		window.extensions.mook.minimizetotray.minimizeAll();
	}
};

function mtt_minimizebuttonOnCommand() {
	if (window.extensions.mook.minimizetotray.m_prefs
			.getBoolPref(window.extensions.mook.minimizetotray.k_pref_prefix + 'always')) {
		window.extensions.mook.minimizetotray.minimizeWindow();
	} else {
		window.minimize();
	}
};

window.extensions.mook.minimizetotray.minimizableOnClose = function() {
	// See if the window has a menubar. This is important because
	// if the window does not have a way to select File-Exit because the
	// menu
	// bar is missing, then there isn't an easy way to close that window
	// So, the workaround is to normally close windows that whose
	// menubars are hidden.
	return document.documentElement.getAttribute("chromehidden").indexOf(
			"menubar") == -1;
};

if ('BrowserTryToCloseWindow' in this) {
	BrowserTryToCloseWindow = (function() {
		let _p = BrowserTryToCloseWindow;
		return function() {
			try {
				// if one tab is left, this could close the window, so stop it
				var minimizetotray = window.extensions.mook.minimizetotray;
				if (minimizetotray.m_prefs.getBoolPref(minimizetotray.k_pref_prefix + 'minimize-on-close')) {
					minimizetotray.minimizeWindow();
					return null;
				}
			} catch (ex) {
			}
			return _p.apply(this, arguments);
		}
	})();
}

// signal that the app-specific parts have done loading
window.extensions.mook.minimizetotray.m_bLoadedApp = true;
