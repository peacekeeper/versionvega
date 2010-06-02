const nsISupports           = Components.interfaces.nsISupports;
const nsICategoryManager    = Components.interfaces.nsICategoryManager;
const nsIComponentRegistrar = Components.interfaces.nsIComponentRegistrar;
const nsICommandLine        = Components.interfaces.nsICommandLine;
const nsICommandLineHandler = Components.interfaces.nsICommandLineHandler;
const nsIFactory            = Components.interfaces.nsIFactory;
const nsIModule             = Components.interfaces.nsIModule;
const nsIWindowWatcher      = Components.interfaces.nsIWindowWatcher;
const trayICommandLine      = Components.interfaces.trayICommandLine;

const clh_contractID = "@codefisher.org/minimizetotray/turbo-startup;1";
const clh_CID = Components.ID("{74178bba-c85d-11de-8989-00247e68d2ed}");
const clh_category = "m-minimizetotray";

const cc = Components.classes;
const ci = Components.interfaces;

const PromptService        = cc["@mozilla.org/embedcomp/prompt-service;1"]
                               .getService(ci.nsIPromptService);
const WindowMediator       = cc["@mozilla.org/appshell/window-mediator;1"]
                               .getService(ci.nsIWindowMediator);
const PrefBranch           = cc["@mozilla.org/preferences-service;1"]
                               .getService(ci.nsIPrefBranch);
const WindowWatcherService = cc["@mozilla.org/embedcomp/window-watcher;1"]
                               .getService(ci.nsIWindowWatcher);
const SupportsString       = cc["@mozilla.org/supports-string;1"]
                               .createInstance(ci.nsISupportsString);
const ExtensionManager     = cc['@mozilla.org/extensions/manager;1']
                               .getService(ci.nsIExtensionManager);
const RDFService           = cc["@mozilla.org/rdf/rdf-service;1"]
                 			   .getService(ci.nsIRDFService);
const AppStartup           = cc["@mozilla.org/toolkit/app-startup;1"]
             				   .getService(ci.nsIAppStartup);
const XULRuntime           = cc["@mozilla.org/xre/app-info;1"]
			                   .getService(ci.nsIXULRuntime);

const PREF_PREFIX     = 'extensions.minimizetotray.';

const FIREFOX_ID 	  = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}";
const THUNDERBIRD_ID  = "{3550f703-e582-4d05-9a08-453d09bdfdc6}";
const SUNBIRD_ID 	  = "{718e30fb-e89b-41dd-9da7-e25a45638b28}";
const SEAMONKEY_ID	  = "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}";

const INCOMPATIBLE    = ["{3502a070-ea2f-11dd-ba2f-0800200c9a66}",
                         "firetray@radicalsoft.com",
                         "{31513E58-F253-47ad-86DB-D5F21E905429}",
                         "mintrayr@tn123.ath.cx",
                         "{9533f794-00b4-4354-aa15-c2bbda6989f8}"];

const PREFIX_ITEM_URI = "urn:mozilla:item:";
const PREFIX_NS_EM    = "http://www.mozilla.org/2004/em-rdf#";

/**
 * Utility functions
 */

function getProductID() {
	try {
		// Works on Firefox 1.0+ and Future SeaMonkey's
		var appInfo = cc["@mozilla.org/xre/app-info;1"].getService(ci.nsIXULAppInfo);
		// Use App info if possible
		return appInfo.ID;
	}
	catch(ex) {}
	// only works on Gecko 1.8 and higher (if above doesn't return)
	if ('nsIChromeRegistrySea' in Components.interfaces) {
		return 'SeaMonkey';
	}  
}

function openTurboWindow(url) {
	WindowWatcherService.openWindow(
			null,	// parent
			url,	// url
			"cmdLineTurboWindow",	// target
			"chrome,dialog=no,all,width=0,height=0", // features
			SupportsString // args
	); 
}

function checkExtensionEnabled(id) {
	var enabled = false;
	var itemResource = RDFService.GetResource(PREFIX_ITEM_URI + id);
	if (itemResource) {
		var ds = ExtensionManager.datasource;
		var target = ds.GetTarget(itemResource, RDFService
				.GetResource(PREFIX_NS_EM + "isDisabled"), true);
		if (target && target instanceof Components.interfaces.nsIRDFLiteral) {
			enabled = (target.Value != "true");
		}
	}
	return enabled;
}
 
/**
 * The XPCOM component that implements nsICommandLineHandler. It also implements
 * nsIFactory to serve as its own singleton factory.
 */
const turboHandler = {

	turboMode: false,
 
	/* nsISupports */
	QueryInterface : function clh_QI(iid) {
		if (iid.equals(nsICommandLineHandler) ||
				iid.equals(trayICommandLine) ||
				iid.equals(nsIFactory) ||
				iid.equals(nsISupports)) {
			return this;
		}
		throw Components.results.NS_ERROR_NO_INTERFACE;
	},

	/* nsICommandLineHandler */

	handle : function clh_handle(aCommandLine) {
	    //PromptService.alert(null, '', XULRuntime.OS + '-'
		//	+ ((XULRuntime.XPCOMABI.substring(0, 6) == 'x86_64') ? '64' : '32'));

		/* if there are other extensions installed, disable them */
		if(nsICommandLine.STATE_INITIAL_LAUNCH == aCommandLine.state) {
			var changed = false;
			for( var i = 0; i < INCOMPATIBLE.length; i++) {
				var extensionId = INCOMPATIBLE[i];
				try {
					if (ExtensionManager.getItemForID(extensionId)
							&& checkExtensionEnabled(extensionId)) {
						ExtensionManager.disableItem(extensionId);
						changed = true;
					}
				} catch (e) {}
			}
			if(changed){
				AppStartup.quit(AppStartup.eRestart | AppStartup.eAttemptQuit);
			}
		}
		/* do the turbo processing */
		var productID = getProductID();
		if (nsICommandLine.STATE_INITIAL_LAUNCH != aCommandLine.state) {
			aCommandLine.handleFlag("turbo", false); // remove if there are
														// windows open
			/*
			 * if they set this, we look though all windows looking for one to
			 * restore
			 */
			if(PrefBranch.getBoolPref(PREF_PREFIX + 'restore-on-open')){
				var e = WindowMediator.getEnumerator(null);
				while (e.hasMoreElements()) {
					var w = e.getNext();
					/*
					 * nice if we could work out why the app is being opened,
					 * don't know if we really want to do this in all cases.
					 */
					if(('extensions' in w) && ('mook' in w.extensions) 
							&& ('minimizetotray' in w.extensions.mook)
							&& (w.extensions.mook.minimizetotray.m_windowHider
									&& w.extensions.mook.minimizetotray.m_isHidden
									&& !w.extensions.mook.minimizetotray.m_isTurboMode)) {
						// |w| is a hidden window, it is not a turbo,
						// and it is the main window if it was from a group
						w.extensions.mook.minimizetotray.restore();
						aCommandLine.preventDefault = true;
						break;
					}
				}
			}
		} else if (aCommandLine.handleFlag("turbo", false)) {
			if(productID == FIREFOX_ID) {
				// running under Firefox
				openTurboWindow("chrome://minimizetotray/content/turboBrowser.xul");
				aCommandLine.preventDefault = true;
			} else if(productID == SEAMONKEY_ID){
				// running under SeaMonkey
				openTurboWindow("chrome://minimizetotray/content/turboNavigator.xul");
				aCommandLine.preventDefault = true;
			} else {
				this.turboMode = true;	
			}
		} else if(PrefBranch.getBoolPref(PREF_PREFIX + 'tray-always-show')){
			/*
			 * we are trying to get the turbo window to always be open
			 */
			if(productID == FIREFOX_ID) {
				openTurboWindow("chrome://minimizetotray/content/turboBrowser.xul");
			} else if(productID == SEAMONKEY_ID) {
				openTurboWindow("chrome://minimizetotray/content/turboNavigator.xul");
			}
			// the other apps go here as needed
		}
	},

	helpInfo : "  -turbo		Open application in turbo (quick start mode)\n",

	/* nsIFactory */

	createInstance : function clh_CI(outer, iid) {
		if (outer != null) {
			throw Components.results.NS_ERROR_NO_AGGREGATION;
		}
		return this.QueryInterface(iid);
	},

	lockFactory : function clh_lock(lock) {
		/* no-op */
	},

	/* trayICommandLine */
	isTurboMode: function() {
		return this.turboMode;
	}
  
};

/**
 * The XPCOM glue that implements nsIModule
 */
const turboHandlerModule = {
	/* nsISupports */
	QueryInterface : function mod_QI(iid) {
		if (iid.equals(nsIModule) ||
				iid.equals(nsISupports) ||
				iid.equals(trayICommandLine)) {
			return this;
		}
		throw Components.results.NS_ERROR_NO_INTERFACE;
	},

	/* nsIModule */
	getClassObject : function mod_gch(compMgr, cid, iid) {
		if (cid.equals(clh_CID)) {
			return turboHandler.QueryInterface(iid);
		}
		throw Components.results.NS_ERROR_NOT_REGISTERED;
	},

	registerSelf : function mod_regself(compMgr, fileSpec, location, type) {
		compMgr.QueryInterface(nsIComponentRegistrar);

		compMgr.registerFactoryLocation(clh_CID,
				"turboHandler",
				clh_contractID,
				fileSpec,
				location,
				type);

		var catMan = Components.classes["@mozilla.org/categorymanager;1"].
		getService(nsICategoryManager);
		catMan.addCategoryEntry("command-line-handler",
				clh_category,
				clh_contractID, true, true);
	},

	unregisterSelf : function mod_unreg(compMgr, location, type) {
		compMgr.QueryInterface(nsIComponentRegistrar);
		compMgr.unregisterFactoryLocation(clh_CID, location);

		var catMan = Components.classes["@mozilla.org/categorymanager;1"]
		                                .getService(nsICategoryManager);
		catMan.deleteCategoryEntry("command-line-handler", clh_category);
	},

	canUnload : function (compMgr) {
		return true;
	}
};

/*
 * The NSGetModule function is the magic entry point that XPCOM uses to find
 * what XPCOM objects this component provides
 */
function NSGetModule(comMgr, fileSpec) {
	return turboHandlerModule;
}
