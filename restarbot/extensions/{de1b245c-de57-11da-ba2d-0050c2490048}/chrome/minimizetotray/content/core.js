// core functions for MinimizeToTray

if (!('extensions' in window))
	window.extensions = new Array();

if (!('mook' in window.extensions))
	window.extensions.mook = new Array();

if (!('minimizetotray' in window.extensions.mook)) {
	window.extensions.mook.minimizetotray = function() {
		// this is a stub only
		throw Components.results.NS_ERROR_ABORT;
	};
}

// /// constants
window.extensions.mook.minimizetotray.k_contractid_windowHider = '@codefisher.org/minimizetotray/window-hider;1';
window.extensions.mook.minimizetotray.k_contractid_windowIcon = '@codefisher.org/minimizetotray/window-icon;1';
window.extensions.mook.minimizetotray.k_pref_prefix = 'extensions.minimizetotray.';
window.extensions.mook.minimizetotray.k_xul_prefix = 'extensions.mook.minimizetotray.';

// /// component handles
window.extensions.mook.minimizetotray.m_windowWatcher = null;
window.extensions.mook.minimizetotray.m_windowHider = null;
window.extensions.mook.minimizetotray.m_prefs = null;

window.extensions.mook.minimizetotray.m_stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"]
		.getService(Components.interfaces['nsIStringBundleService']);
window.extensions.mook.minimizetotray.m_applicationName = Components.classes["@mozilla.org/xre/app-info;1"]
		.getService(Components.interfaces.nsIXULAppInfo).name;
window.extensions.mook.minimizetotray.m_stringsCommon = window.extensions.mook.minimizetotray.m_stringBundleService
		.createBundle("chrome://minimizetotray/locale/common.properties");
window.extensions.mook.minimizetotray.nsIExtensionManager = Components.classes['@mozilla.org/extensions/manager;1']
        .getService(Components.interfaces.nsIExtensionManager);

// /// global variables
window.extensions.mook.minimizetotray.m_isTurboMode = false;
window.extensions.mook.minimizetotray.m_isHidden = false;
window.extensions.mook.minimizetotray.m_isLocked = false;
window.extensions.mook.minimizetotray.m_isMinimizing = false;

// ///methods
window.extensions.mook.minimizetotray.init = function() {

	// because |this| is |window|, where the event fired,
	// not |window.extensions.mook.minimizetotray|
	var self = window.extensions.mook.minimizetotray;

	// check to be sure that both app-neutral and app-specific parts
	// of the script has been loaded
	if (!('m_bLoadedCore' in self) || (!self.m_bLoadedCore)
			|| !('m_bLoadedApp' in self) || (!self.m_bLoadedApp)) {
		window.setTimeout(self.init, 10);
		return;
	}

	// remove the event handler
	window.removeEventListener("load",
			window.extensions.mook.minimizetotray.init, true);

	// we get an extra fire because the remove listener hasn't fired
	// so we just ignore the inconsistency - pretend it never happened
	if (self.m_prefs) {
		return;
	}
	// throw Components.results.NS_ERROR_ALREADY_INITIALIZED;
	
	self.noBinaryComponentWarning();

	self.m_prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);
	self.m_windowHider = Components.classes[self.k_contractid_windowHider]
			.createInstance(Components.interfaces.trayIWindowHider);
	self.m_windowHider.watch(window);

	if (!self.initTurboMode()) { // turbo did not load
		if (self.alwaysShow) {
			self.alwaysShow();
		}
	}

	document.addEventListener("TrayMinimize", function(event) {
		self.minimizeWindow();
		event.preventDefault();
	}, true);
	document.addEventListener("TrayMinimizeAll", function(event) {
		self.minimizeAll();
		event.preventDefault();
	}, true);
	document.addEventListener("TrayRestore", function(event) {
		self.restore(); 
	}, true);
	document.addEventListener("MinimizeStoped", function(event) {
		alert('hit');
	}, true);
	document.addEventListener("TrayClose", function(event) {
		if (self.minimizableOnClose()) {
			self.minimizeWindow();
			event.preventDefault();
		}
	}, true);
	document.addEventListener("TrayTurboClose", function(event) {
		if (self.m_isTurboMode) {
			self.minimizeWindow();
			event.preventDefault();
		}
	}, true);


	window.addEventListener("TrayClick", function(event) {
		if (event.button == 0) {
			if (!self.m_prefs
					.getBoolPref(self.k_pref_prefix + 'two-click-restore')) {
				self.trayClick(event);
			}
		} else if(event.button == 2) {
			document.getElementById(self.k_xul_prefix + 'traypopup')
				.openPopupAtScreen(event.screenX, event.screenY, true);
		}
	}, true);

	window.addEventListener("TrayDblClick", self.trayClick, true);

	// this allows the window to paint, which will cause the window to activate.
	// And we need to suppress that to make the turbo mode work correctly
	// but once the window is loaded we must remove that otherwise the window
	// can't be restored at all
	setTimeout(function() {
		self.m_windowHider.suppressed = false;
		
		/* finally load our page if needed */
		self.load_update_page();
	}, 3000);
};

window.extensions.mook.minimizetotray.shutdown = function() {
	var self = window.extensions.mook.minimizetotray;
	if (self.m_windowIcon) {
		self.m_windowIcon.hideIcon();
	}
	if (self.m_allwaysShow) {
		self.m_allwaysShow.hideIcon();
	}
};

window.extensions.mook.minimizetotray.trayWindows = function() {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
	var e = wm.getEnumerator(null);
	var windows = [];
	while (e.hasMoreElements()) {
		var w = e.getNext();
		if ('extensions' in w && 'mook' in w.extensions
				&& 'minimizetotray' in w.extensions.mook) {
			windows[windows.length] = w;
		}
	}
	return windows;
}

window.extensions.mook.minimizetotray.trayClick = function(event) {
	if (event.button == 0) {
		window.extensions.mook.minimizetotray.restore();
	}
};

window.extensions.mook.minimizetotray.turboLoaded = function() {
	// try and find a turbo window
	var windows = window.extensions.mook.minimizetotray.trayWindows();
	for ( var i in windows) {
		var w = windows[i];
		if (w.extensions.mook.minimizetotray.m_isTurboMode) {
			return true; // found one !
		}
	}
	return false;
};

window.extensions.mook.minimizetotray.minimizeWindow = function() {
	this.noBinaryComponentWarning();
	this.restore();
	this.m_isMinimizing = true;
	this.m_windowIcon = Components.classes[this.k_contractid_windowIcon]
			.createInstance(Components.interfaces.trayIWindowIcon);
	this.m_isHidden = [ window ];
	this.m_windowHider.minimize(this.m_isHidden.length, this.m_isHidden);	
	this.m_windowIcon.setup(window, this.tooltip(null));
	if (this.displayIcon()) {
		this.m_windowIcon.showIcon();
	}
	this.m_isMinimizing = false;
};

window.extensions.mook.minimizetotray.minimizeAll = function() {
	this.noBinaryComponentWarning();
	this.restore();
	this.m_isMinimizing = true;
	this.m_windowIcon = Components.classes[this.k_contractid_windowIcon]
			.createInstance(Components.interfaces.trayIWindowIcon);
	var baseWindows = new Array();
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
	var e = wm.getEnumerator(null);
	while (e.hasMoreElements()) {
		var w = e.getNext();
		if (!('extensions' in w))
			w.extensions = new Array();
		if (!('mook' in w.extensions))
			w.extensions.mook = new Array();
		if (!('minimizetotray' in w.extensions.mook)) {
			w.extensions.mook.minimizetotray = new Object();
			w.extensions.mook.minimizetotray.m_isHidden = false;
		}
		// don't hide turbo mode hidden windows... :p
		if (!w.extensions.mook.minimizetotray.m_isHidden
				&& !w.extensions.mook.minimizetotray.m_isTurboMode) {
			baseWindows[baseWindows.length] = w;
			w.extensions.mook.minimizetotray.m_isHidden = true;
		}
	}
	this.m_isHidden = baseWindows;
	var title = null;
	if (baseWindows.length > 1) {
		title = this.m_stringsCommon.formatStringFromName(
				"trayTooltipMultiple", [ baseWindows.length ], 1);
	}
	this.m_windowHider.minimize(baseWindows.length, baseWindows);
	this.m_windowIcon.setup(window, this.tooltip(title));
	if (this.displayIcon()) {
		this.m_windowIcon.showIcon();
	}
	this.m_isMinimizing = false;
};

window.extensions.mook.minimizetotray.tooltip = function(title) {
	// pick the tooltip, the user may want just the application name,
	// because Windows uses it to decide of the icon should
	// allways show or not. But that is not our default
	if (title) {
		return title;
	}
	try {
		if (this.m_prefs
				.getBoolPref(this.k_pref_prefix + 'use-application-name')) {
			return this.m_applicationName;
		}
	} catch (e) {
	}
	return null;
};

window.extensions.mook.minimizetotray.restore = function() {	
	if (this.m_isHidden && !this.m_isMinimizing) {
		var windows = this.m_isHidden;
		for ( var i = 0; i < windows.length; ++i) {
			var w = windows[i];
			// w is a window to be restored
			if (w) {
				w.extensions.mook.minimizetotray.m_isHidden = false;
			}
		}
		this.m_windowHider.restore();

		if (this.m_windowIcon) {
			this.m_windowIcon.hideIcon();
		}
		return true;
	}
	return false;
	// our popup is not closing when doing a restore on linux
	//setTimeout(function() {
	//	document.getElementById(this.k_xul_prefix + 'traypopup').hidePopup();
	//  window.extensions.mook.minimizetotray.k_xul_prefix
	//	//window.focus();
	//}, 100);
};

window.extensions.mook.minimizetotray.trayWindowClose = function() {
	window.close();
	// this.restore();
	// if we restore, we get the window flash,
	// so just cleanly removing the icon will do
	this.m_windowIcon.hideIcon();
};

window.extensions.mook.minimizetotray.noBinaryComponentWarning = function() {
	if (!(this.k_contractid_windowIcon in Components.classes && this.k_contractid_windowHider in Components.classes)) {
		// can't find binary component
		var promptService = Components.classes['@mozilla.org/embedcomp/prompt-service;1']
				.getService(Components.interfaces.nsIPromptService);
		promptService.alert(window, "Minimize To Tray - Component Load Error",
				'Cannot find binary component');
		// prevent popping up two warnings
		this.m_windowWatcher = true;
		throw Components.results.NS_ERROR_NOT_AVAILABLE;
	}
};

window.extensions.mook.minimizetotray.initTurboMode = function() {
	var commandLine = Components.classes['@codefisher.org/minimizetotray/turbo-startup;1']
			.getService(Components.interfaces.trayICommandLine);
	// see if not yet running in turbo mode, and if this is the case, launch a
	// turbo window
	if (commandLine.isTurboMode()) {
		return this.turboMode();
	}
	return false;
};

window.extensions.mook.minimizetotray.restoreOtherWindow = function(target) {
	var windows = window.extensions.mook.minimizetotray.trayWindows();
	for ( var i in windows) {
		var w = windows[i];
		if (w == target.targetWindow) {
			w.extensions.mook.minimizetotray.restore();
		}
	}
};

window.extensions.mook.minimizetotray.restoreAllWindows = function() {
	var windows = window.extensions.mook.minimizetotray.trayWindows();
	for ( var i in windows) {
		var w = windows[i];
		if (w.extensions.mook.minimizetotray.m_isHidden) {
			// |w| is a hidden window, it is not a turbo window,
			// and it is the main window if it was from a group
			// so we can restore it
			w.extensions.mook.minimizetotray.restore();
		}
	}
};

window.extensions.mook.minimizetotray.restoreWindow = function() {
	var windows = window.extensions.mook.minimizetotray.trayWindows();
	for (var i in windows) {
		var w = windows[i];
		if (w.extensions.mook.minimizetotray.m_isHidden) {
			// |w| is a hidden window and not a turbo window
			w.extensions.mook.minimizetotray.restore();
			return true;
		}
	}
	return false;
};

window.extensions.mook.minimizetotray.turboWindowExists = function() {
	var windows = window.extensions.mook.minimizetotray.trayWindows();
	for (var i in windows) {
		var w = windows[i];
		if (w.extensions.mook.minimizetotray.m_isTurboMode)
			// a turbo mode window already exists
			return w;
	}
	return false;
}

window.extensions.mook.minimizetotray.loadPopupMenu = function() {
	var allwaysShow = document
			.getElementById('extensions.mook.minimizetotray.turbo.quit');
	var restore = document
			.getElementById('extensions.mook.minimizetotray.traypopup.restore');
	var closeWindow = document
			.getElementById('extensions.mook.minimizetotray.window.close');
	var restoreSeparator = document
			.getElementById('extensions.mook.minimizetotray.traypopup.restore.separator');
	if (this.m_allwaysShow) {
		allwaysShow.style.display = "-moz-box";
		if (this.m_isHidden) {
			restore.style.display = "-moz-box";
			if (restoreSeparator) {
				restoreSeparator.style.display = "-moz-box";
			}
			closeWindow.style.display = "-moz-box"
		} else {
			restore.style.display = "none";
			if (restoreSeparator) {
				restoreSeparator.style.display = "none";
			}
			closeWindow.style.display = "none"
		}
	} else {
		allwaysShow.style.display = "none";
		restore.style.display = "-moz-box";
		if (restoreSeparator) {
			restoreSeparator.style.display = "-moz-box";
		}
		closeWindow.style.display = "-moz-box"
	}
};

window.extensions.mook.minimizetotray.populateTurboMenu = function(showTurbo) {
	var seperator = document
			.getElementById("extensions.mook.minimizetotray.traypopup.restore.separator");
	// remove everything before the seperator
	while (seperator.previousSibling) {
		seperator.parentNode.removeChild(seperator.previousSibling);
	}
	var count = 0;
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
	var e = wm.getEnumerator(null);
	var xe = wm.getXULWindowEnumerator(null);
	while (e.hasMoreElements() && xe.hasMoreElements()) {
		var w = e.getNext();
		var xw = xe.getNext();
		if ('extensions' in w && 'mook' in w.extensions
				&& 'minimizetotray' in w.extensions.mook
				&& w.extensions.mook.minimizetotray.m_isHidden) {
			// |w| is a hidden window, it is not a turbo,
			// and it is the main window if it was from a group
			var menuitem = document.createElement('menuitem');
			var docShell = xw
					.QueryInterface(Components.interfaces.nsIXULWindow).docShell;
			menuitem.setAttribute('label',
					docShell.contentViewer.DOMDocument.title);
			menuitem.targetWindow = w;
			menuitem
					.setAttribute('oncommand',
							"window.extensions.mook.minimizetotray.restoreOtherWindow(this);");
			seperator.parentNode.insertBefore(menuitem, seperator);
			count++;
		}
	}
	if (count == 0) { // no windows to restore, so don't show it
		document
				.getElementById("extensions.mook.minimizetotray.traypopup.restore.menu").style.display = "none";
	} else {
		document
				.getElementById("extensions.mook.minimizetotray.traypopup.restore.menu").style.display = "-moz-box";
	}
	return true;
};

/* functions used for displaying the page about the extension being updated */
window.extensions.mook.minimizetotray.file_put_contents = function(file, data) {
	var foStream = Components.classes['@mozilla.org/network/file-output-stream;1']
			.createInstance(Components.interfaces.nsIFileOutputStream);
	foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);
	foStream.write(data, data.length);
	foStream.close();
}

window.extensions.mook.minimizetotray.load_url = function(url) {
	try {
		var newPage = getBrowser().addTab(url);
		getBrowser().selectedTab = newPage;
	} catch (e) {
		var uri = Components.classes['@mozilla.org/network/io-service;1']
				.getService(Components.interfaces.nsIIOService).newURI(url,
						null, null);
		var protocolSvc = Components.classes['@mozilla.org/uriloader/external-protocol-service;1']
				.getService(Components.interfaces.nsIExternalProtocolService);
		protocolSvc.loadUrl(uri);
	}
}

window.extensions.mook.minimizetotray.load_update_page = function() {
	var ext_id = "{de1b245c-de57-11da-ba2d-0050c2490048}";
	var version = this.nsIExtensionManager.getItemForID(ext_id).version;
	var url = "http://codefisher.org/minimizetotray/version/" + version;

	var extensionFlagFile = Components.classes["@mozilla.org/file/directory_service;1"]
			.getService(Components.interfaces.nsIProperties)
			.get("ProfD", Components.interfaces.nsIFile);
	extensionFlagFile.append("extensions");
	extensionFlagFile.append(ext_id);
	extensionFlagFile.append("installed");

	if (this.m_prefs.getCharPref(this.k_pref_prefix + "current-version") != version
			&& !extensionFlagFile.exists()) {
		this.m_prefs.setCharPref(this.k_pref_prefix + "current-version", version);
		this.file_put_contents(extensionFlagFile, version);
		this.load_url(url);
	}
}

window.addEventListener("load", function() {
	window.extensions.mook.minimizetotray.init();
}, true);

window.addEventListener("close", function() {
	window.extensions.mook.minimizetotray.shutdown();
}, true);

// override this function so it does not close the window if
// we are supposed to minimize it
if ('closeWindow' in this) {
	closeWindow = (function() {
		let _p = closeWindow;
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

// signal that the core has loaded
window.extensions.mook.minimizetotray.m_bLoadedCore = true;