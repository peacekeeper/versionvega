// based on code found in Gears 
// http://code.google.com/p/gears/source/browse/trunk/gears/base/firefox/static_files/components/stub.js

// We did this because we where freaking out over the fact the 64 bit
// Linux binary was crashing 32bit Thunderbird making it unstartable
// that is unless you know about safe mode

const Cc = Components.classes;
const Ci = Components.interfaces;

function getLibFileName() {
	var XULRuntime = Cc["@mozilla.org/xre/app-info;1"]
			.getService(Ci.nsIXULRuntime);
	return XULRuntime.OS + '-'
			+ ((XULRuntime.XPCOMABI.substring(0, 6) == 'x86_64') ? '64' : '32');
}

function NSGetModule() {
	return {
		registerSelf : function(compMgr, location, loaderStr, type) {
			var compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
			var libFolder = location.parent.parent;
			libFolder.append("library");
			try {
				libOSFolder = libFolder.clone()
				libOSFolder.append(getLibFileName());
				compMgr.autoRegister(libOSFolder);
			} catch(e) {
				// something went really bad, the extension will now break
			}
		}
	}
}
