// Thunderbird specific functions for MinimizeToTray

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
	return !this.m_allwaysShow;
};

window.extensions.mook.minimizetotray.trayClick = function(event) {
	if (event.button == 0) {
		var self = window.extensions.mook.minimizetotray;
		if (!self.restore()) {
            if(window.windowState == window.STATE_MINIMIZED) {
			    window.restore();
            } else {
                window.focus();
            }
		}
	}
};

window.extensions.mook.minimizetotray.alwaysShow = function() {
	if (this.m_allwaysShow
			|| this.m_prefs
					.getBoolPref(this.k_pref_prefix + 'tray-always-show') == false)
		return;
	this.m_allwaysShow = Components.classes[this.k_contractid_windowIcon]
			.createInstance(Components.interfaces.trayIWindowIcon);

	this.m_allwaysShow.setup(window, self.m_applicationName);
	this.m_allwaysShow.showIcon();
	self.m_isTurboMode = true;
};

window.extensions.mook.minimizetotray.trayTurboClose = function() {
	this.m_allwaysShow.hideIcon();
	this.m_allwaysShow = null;
	this.m_isTurboMode = false;
	if (this.m_windowIcon) {
		this.m_windowIcon.showIcon();
	}
};

window.extensions.mook.minimizetotray.turboMode = function() {
	var self = window.extensions.mook.minimizetotray;
	self.noBinaryComponentWarning();

	// look for existing -turbo mode windows
	if(self.turboWindowExists()) {
		return;
	}
	
	self.m_isTurboMode = true;
	
	// make the -turbo mode window
	self.m_allwaysShow = Components.classes[self.k_contractid_windowIcon]
			.createInstance(Components.interfaces.trayIWindowIcon);
	// need this too if the -turbo mode icon is closed
	self.m_windowIcon = Components.classes[self.k_contractid_windowIcon]
			.createInstance(Components.interfaces.trayIWindowIcon);
	self.m_isHidden = [ window ];

	// for Tbird, there is no turbo mode, since there can only
	// ever be one window open
	self.m_windowHider.suppressed = true;
	self.m_windowHider.minimize(1, [window]);

	self.m_windowIcon.setup(window, self.m_applicationName);
	self.m_allwaysShow.setup(window, self.m_applicationName);
	self.m_allwaysShow.showIcon();	

	self.m_turboLoaded = true;
	return true;
};

window.extensions.mook.minimizetotray.minimizableOnClose = function() {
	return true;
};

// signal that the app-specific parts have done loading
window.extensions.mook.minimizetotray.m_bLoadedApp = true;
