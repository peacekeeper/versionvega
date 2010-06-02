// Download specific functions for MinimizeToTray

if (!('extensions' in window))
    window.extensions = new Array();

if (!('mook' in window.extensions))
    window.extensions.mook = new Array();

if (!('minimizetotray' in window.extensions.mook))
    window.extensions.mook.minimizetotray = 
    function(){
        // this is a stub only
        throw Components.results.NS_ERROR_ABORT;
    };

// this allows the window to restore when activated
window.extensions.mook.minimizetotray.m_allowActivete = true;


window.extensions.mook.minimizetotray.trayWindowClose = function() {
    window.extensions.mook.minimizetotray.restore();
    window.close();
}

window.extensions.mook.minimizetotray.displayIcon = function () {
    try {
        // a turbo window must be open, or there is no way of restoring
        if(this.m_prefs.getBoolPref(this.k_pref_prefix + 'only-one-icon')
            && window.extensions.mook.minimizetotray.turboLoaded()){
            return true;
        }
    } catch(e) {
        // better just show it then
        return true;
    }
    return false;
};

// if there are active downloads, minimize else close
window.extensions.mook.minimizetotray.minimizableOnClose = function () {
	var nsIDownloadManager = Components.interfaces.nsIDownloadManager
	var downloadManager = Components.classes["@mozilla.org/download-manager;1"]
	                            .getService(nsIDownloadManager);
	var downloads = downloadManager.activeDownloads;
	while(downloads.hasMoreElements()){
		var download = downloads.getNext();
		if(download.state == nsIDownloadManager.DOWNLOAD_DOWNLOADING 
				|| download.state == nsIDownloadManager.DOWNLOAD_NOTSTARTED
				|| download.state == nsIDownloadManager.DOWNLOAD_PAUSED
				|| download.state == nsIDownloadManager.DOWNLOAD_SCANNING) {
			return true;
		}
	}
	return false;
}


// signal that the app-specific parts have done loading
window.extensions.mook.minimizetotray.m_bLoadedApp = true;
