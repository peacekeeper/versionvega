const FIREFOX_ID = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}";
const THUNDERBIRD_ID = "{3550f703-e582-4d05-9a08-453d09bdfdc6}";
const SUNBIRD_ID = "{718e30fb-e89b-41dd-9da7-e25a45638b28}";
const RUN_FOLDER = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run";

const cc = Components.classes;
const ci = Components.interfaces;

function WindowsStartup(startUp, currentUser) {
	if (!("@mozilla.org/windows-registry-key;1" in Components.classes)) {
		return;
	}
	this.startUp = startUp;
	this.currentUser = currentUser;
	this.WindowsRegKey = cc["@mozilla.org/windows-registry-key;1"]
	                       .createInstance(ci.nsIWindowsRegKey);
	this.XULAppInfo    = cc["@mozilla.org/xre/app-info;1"]
		                       .createInstance(ci.nsIXULAppInfo);
}
/* returns if this object can function */
WindowsStartup.prototype.functional = function() {
	return ("@mozilla.org/windows-registry-key;1" in Components.classes);
};
/* what to do when the window is accepted */
WindowsStartup.prototype.dialogAccept = function() {
	this.saveStartUp(this.startUp.checked, this.currentUser.checked);
};

WindowsStartup.prototype.init = function() {
	var settingLocation = this.locationOfSetting();
	if (settingLocation == this.WindowsRegKey.ROOT_KEY_LOCAL_MACHINE) {
		this.currentUser.checked = false;
		this.startUp.checked = true;
		if (!this.registryWriteable(this.WindowsRegKey.ROOT_KEY_LOCAL_MACHINE)) {
			this.startUp.disabled = true;
		}
	} else if (settingLocation == this.WindowsRegKey.ROOT_KEY_CURRENT_USER) {
		this.currentUser.checked = true;
		this.startUp.checked = true;
	} else {
		this.currentUser.checked = true;
		this.currentUser.disabled = true;
		this.startUp.checked = false;
	}
	if (!this.registryWriteable(this.WindowsRegKey.ROOT_KEY_LOCAL_MACHINE)) {
		this.currentUser.checked = true;
		this.currentUser.disabled = true;
		this.currentUser.hidden = true;
	}
	if (!this.registryWriteable(this.WindowsRegKey.ROOT_KEY_CURRENT_USER)) {
		this.startUp.disabled = true;
	}
	this.updateCurrentUser();
	this.startUp.addEventListener('CheckboxStateChange', function() { window.startupControler.updateCurrentUser(); }, true);
};

// save the registry setting
WindowsStartup.prototype.saveStartUp = function(enabled, current_user) {
	if (enabled == false) {
		try {
			this.removeRegistryKey(this.WindowsRegKey.ROOT_KEY_LOCAL_MACHINE, this.XULAppInfo.name);
		} catch (e) {
		}
		try {
			this.removeRegistryKey(this.WindowsRegKey.ROOT_KEY_CURRENT_USER, this.XULAppInfo.name);
		} catch (e) {
		}
	} else {
		var path = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties).get(
						"CurProcD", Components.interfaces.nsIFile);
		path.append(this.XULAppInfo.name.toLowerCase());
		if (current_user) {
			try {
				this.writeRegistryKey(this.WindowsRegKey.ROOT_KEY_CURRENT_USER, this.XULAppInfo.name,
						'"' + path.path + '" -turbo');
				// this may fail if the user has not access, in which case we could
				// end up with Firefox added twice, which is ugly.  But unavoidable.
				this.removeRegistryKey(this.WindowsRegKey.ROOT_KEY_LOCAL_MACHINE, this.XULAppInfo.name);
			} catch (e) {
			}
		} else {
			try {
				this.removeRegistryKey(this.WindowsRegKey.ROOT_KEY_CURRENT_USER, this.XULAppInfo.name);
				this.writeRegistryKey(this.WindowsRegKey.ROOT_KEY_LOCAL_MACHINE, this.XULAppInfo.name,
						'"' + path.path + '" -turbo');
			} catch (e) {
			}
		}
	}
};

WindowsStartup.prototype.writeRegistryKey = function(root_key, application, path) {
	this.WindowsRegKey.create(root_key, RUN_FOLDER, this.WindowsRegKey.ACCESS_WRITE);
	this.WindowsRegKey.writeStringValue(application, path);
	this.WindowsRegKey.close();
};

WindowsStartup.prototype.removeRegistryKey = function(root_key, application) {
	this.WindowsRegKey.create(root_key, RUN_FOLDER, this.WindowsRegKey.ACCESS_ALL);
	if (this.WindowsRegKey.hasValue(application)) {
		this.WindowsRegKey.removeValue(application);
	}
	this.WindowsRegKey.close();
};

// Where the setting is, current user or all users
WindowsStartup.prototype.locationOfSetting = function() {
	this.WindowsRegKey.create(this.WindowsRegKey.ROOT_KEY_LOCAL_MACHINE, RUN_FOLDER, this.WindowsRegKey.ACCESS_READ);
	if (this.WindowsRegKey.hasValue(this.XULAppInfo.name)) {
		this.WindowsRegKey.close();
		return this.WindowsRegKey.ROOT_KEY_LOCAL_MACHINE;
	} else {
		this.WindowsRegKey.create(this.WindowsRegKey.ROOT_KEY_CURRENT_USER, RUN_FOLDER, this.WindowsRegKey.ACCESS_READ);
		if (this.WindowsRegKey.hasValue(this.XULAppInfo.name)) {
			this.WindowsRegKey.close();
			return this.WindowsRegKey.ROOT_KEY_CURRENT_USER;
		} else {
			return -1;
		}
	}
	return -1;
};

WindowsStartup.prototype.updateCurrentUser = function() {
	this.currentUser.disabled = !this.startUp.checked;
}

// is it possible to write the setting?
WindowsStartup.prototype.registryWriteable = function(root_key) {
	try {
		this.WindowsRegKey.create(root_key, RUN_FOLDER, this.WindowsRegKey.ACCESS_ALL);
		this.WindowsRegKey.writeStringValue('TestWrite', 'None');
		if (this.WindowsRegKey.hasValue("TestWrite")) {
			this.WindowsRegKey.removeValue('TestWrite');
			this.WindowsRegKey.close();
			return true;
		} else {
			this.WindowsRegKey.close();
			return false;
		}
	} catch (e) {
		return false;
	}	
};

function LinuxStartup(startUp, currentUser) {
	this.configFolder = Components.classes["@mozilla.org/file/directory_service;1"]
               .getService(Components.interfaces.nsIProperties)
               .get("Home", Components.interfaces.nsIFile);
	this.configFolder.append(".config");
	this.configFolder.append("autostart");
	if(!this.configFolder.exists()){
		return;
	}
	this.startUp = startUp;
	this.currentUser = currentUser;
	this.XULAppInfo    = cc["@mozilla.org/xre/app-info;1"]
		                       .createInstance(ci.nsIXULAppInfo);
	this.startupFile = this.configFolder.clone();
	this.startupFile.append(this.XULAppInfo.name.toLowerCase() + ".desktop");
}

/* returns if this object can function */
LinuxStartup.prototype.functional = function() {
	return this.configFolder.exists();
};
/* what to do when the window is accepted */
LinuxStartup.prototype.dialogAccept = function() {}

LinuxStartup.prototype.init = function() {
	this.currentUser.hidden = true;
	this.startUp.checked = this.startupFile.exists();
	this.startUp.addEventListener('CheckboxStateChange', function() { window.startupControler.toggleCheckbox(); }, true);
};

LinuxStartup.prototype.toggleCheckbox = function() {
	if(this.startUp.checked){
		if(!this.startupFile.exists() && this.configFolder.isWritable()){
			var path = Components.classes["@mozilla.org/file/directory_service;1"]
      				.getService(Components.interfaces.nsIProperties).get(
      						"CurProcD", Components.interfaces.nsIFile);
      		path.append(this.XULAppInfo.name.toLowerCase());
			var value = "[Desktop Entry]\nType=Application\nExec=\"" 
					+ path.path
					+ " -turbo\"\nHidden=false\nX-GNOME-Autostart-enabled=true\nName="
					+ this.XULAppInfo.name
					+ "\nComment=";
			var foStream = Components.classes['@mozilla.org/network/file-output-stream;1']
          			.createInstance(Components.interfaces.nsIFileOutputStream);
          	foStream.init(this.startupFile, 0x02 | 0x08 | 0x20, 0664, 0);
          	foStream.write(value, value.length);
          	foStream.close();
		}
	} else {
		this.startupFile.remove(false);
	}
}

function DialogInit() {
	var startUp = document.getElementById('chkStartWithWindows');
	var currentUser = document.getElementById('chkCurrentUserOnly');
	
	window.startupControler = new WindowsStartup(startUp, currentUser);
	if(!window.startupControler.functional()){
		window.startupControler = new LinuxStartup(startUp, currentUser);		
	}	
	if(window.startupControler.functional()){
		window.startupControler.init();
	} else {
		startWithWindows.style.display = 'none';
		currentUser.style.display = 'none';
	}
}

function DialogAccept() {
	/*
	 * this function will never run on linux, because the pref window has no
	 * accept button.
	 */
	window.startupControler.dialogAccept();
}