var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

function Initializer() { }
Initializer.prototype = {

	classDescription : "@crossinglight/versionvega/startup;1",
	classID : Components.ID("{77ed4c10-116a-11df-8a39-0800200c9a66}"),
	contractID : "@crossinglight/versionvega/startup;1",
	_xpcom_categories : [{ category: "app-startup", service: true }],

	QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver, Ci.nsISupportsWeakReference]),

	observe:
	function(subject, topic, data) {

		switch (topic) {

			case "app-startup":
				var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
				observerService.addObserver(this, "quit-application", true);
				break;
			case "quit-application":
				component.shutdownAll();
				break;
		}
	}
};

const component = {

	classDescription : "@crossinglight/versionvega;",
	classID : Components.ID("{e01492f2-faa6-43e2-9aca-2cd7f7e74776}"),
	contractID : "@crossinglight/versionvega;1",

	threads : [ ],
	transportByThread : [ ],
	inputstreamByThread : [ ],
	textinputstreamByThread : [ ],
	outputstreamByThread : [ ],

	QueryInterface: XPCOMUtils.generateQI([Ci.nsIVersionVega]),

	
	init :
	function(i) {

		dump("" + i + " | init\n");

		var transportService = Cc["@mozilla.org/network/socket-transport-service;1"].getService(Ci.nsISocketTransportService);
		this.transportByThread[i] = transportService.createTransport(null, 0, prefs.getCharPref("versionvega.host"), prefs.getIntPref("versionvega.port"), null);

		this.inputstreamByThread[i] = this.transportByThread[i].openInputStream(Ci.nsITransport.OPEN_BLOCKING, 0, 0);
		this.textinputstreamByThread[i] = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream);
		this.textinputstreamByThread[i].init(this.inputstreamByThread[i], null, 1, 0xFFFD); 
		this.textinputstreamByThread[i].QueryInterface(Components.interfaces.nsIUnicharInputStream);

		this.outputstreamByThread[i] = this.transportByThread[i].openOutputStream(Ci.nsITransport.OPEN_BLOCKING, 0, 0);

		var line = "GO\n";
		dump("" + i + " > " + line);
		this.outputstreamByThread[i].write(line, line.length);
		this.outputstreamByThread[i].flush();

		line = this.readline(i);
		dump("" + i + " < " + line + "\n");
		if (line != "OK") throw "@versionvega access initialization error.";
	},

	shutdown :
	function(i) {

		dump("" + i + " | shutdown\n");

		try {

			if (this.inputstreamByThread[i]) this.inputstreamByThread[i].close();
			if (this.outputstreamByThread[i]) this.outputstreamByThread[i].close();
			if (this.transportByThread[i]) this.transportByThread[i].close(0);
		} catch (ex) {
	
			Components.utils.reportError(ex);
		}

		this.inputstreamByThread[i] = null;
		this.outputstreamByThread[i] = null;
		this.transportByThread[i] = null;
	},

	shutdownAll :
	function() {

		dump("shutdownall\r\n");

		for (i in this.threads) {

			this.shutdown(i);
		}
	},

	provisionThread :
	function(thread) {

		this.threads.push(thread);
		
		dump("" + (this.threads.length - 1) + " | provision\n");

		this.transportByThread[this.threads.length - 1] = null;
		this.inputstreamByThread[this.threads.length - 1] = null;
		this.outputstreamByThread[this.threads.length - 1] = null;
	},
	
	indexForThread :
	function() {

		var thread = Components.classes["@mozilla.org/thread-manager;1"].getService().currentThread;

		for (i in this.threads) {

			if (thread == this.threads[i]) return i;
		}

		throw "Invalid thread: " + thread;
	},

	invoke :
	function(object, method, argsCount, args, retCount) {

		return this.invokeRecursive(object, method, argsCount, args, 1, retCount);
	},

	invokeRecursive : 
	function(object, method, argsCount, args, retry, retCount) {

		var i = this.indexForThread();

		dump("" + i + " | invoke: " + object + " " + method + " " + args.length + "\n");

		try {

			if (this.transportByThread[i] == null) this.init(i);
			
			var line = object + " " + method + " " + args.length + "\n";
			dump("" + i + " > " + line);
			this.outputstreamByThread[i].write(line, line.length);
			this.outputstreamByThread[i].flush();

			for (ii in args) {

				var arg = args[ii];
				var buffer = "";

				if (typeof arg == 'string' || typeof arg == 'number' || typeof arg == 'boolean') {

					buffer += "string" + " ";
					buffer += this.encode64("" + arg);
					buffer += "\n";
				} else if (typeof arg == 'array') {
				
					var buffer = "";
					buffer += "string[]" + " ";
					var first = true;
					for (item in arg) {
					
						if (! first) buffer += ","; else first = false;
						buffer += this.encode64(item);
					}
					buffer += "\n";
				} else if (arg == null) {
				
					buffer += "NULL NULL";
					buffer += "\n";
				} else {
					
					throw "Invalid argument: " + typeof(arg);
				}
		
				dump("" + i + " > " + buffer);
				this.outputstreamByThread[i].write(buffer, buffer.length);
				this.outputstreamByThread[i].flush();
			}

			var line = this.readline(i);
			dump("" + i + " < " + line + "\n");
		
			var retParts = line.split(" ");
			
			var retClass = retParts[0] ? retParts[0] : undefined;
			var retValue = retParts[1] ? retParts[1] : undefined;
	
			if (retClass == "string") {
			
				if (retValue) {

					var ret = this.decode64(retValue)
					retCount.value = 1;
					return([ret]);
				} else {
					
					var ret = "";
					return(ret);
				}
			} else if (retClass == "string[]") {
			
				if (retValue) {
					
					var ret = retValue.split(",");
					for (ii in ret) ret[ii] = this.decode64(ret[ii]);
					retCount.value = ret.length;
					return(ret);
				} else {
					
					var ret = [];
					return(ret);
				}
			} else if (retClass == "exception") {
			
				retry = 0;
				throw this.decode64(retValue);
			} else if (retClass == "NULL" && retValue == "NULL") {
				
				retCount.value = null;
				return(null);
			} else {

				throw "Invalid return value: " + line;
			}
		} catch (ex) {

			Components.utils.reportError(ex);

			if (retry > 0) {

				this.shutdown(i);
				this.init(i);
				return this.invokeRecursive(object, method, argsCount, args, retry - 1, retCount);
			} else {

				throw ex;
			}
		}
	},

	readline :
	function(i) {

		try {

			var buffer = "";

			while (true) {

				var count;
				var c = { };

				count = this.textinputstreamByThread[i].readString(1, c);
				if (count == 0) throw "EOF";
				
				if (c.value == "\r") continue;
				if (c.value == "\n") break;
				buffer += c.value;
			}

			return(buffer);
		} catch (ex) {

			throw "@versionvega access not available: " + ex;
		}
	},

	encode64 :
	function(input) {

		if (input == "") return "";
		
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		do {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {

				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {

				enc4 = 64;
			}

			output = output +
			keyStr.charAt(enc1) +
			keyStr.charAt(enc2) +
			keyStr.charAt(enc3) +
			keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
	
		return output;
	},

	decode64 :
	function(input) {

		if (input == "") return "";

		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
	
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
	
		if (base64test.exec(input)) return(null);
	
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	
		do {
	
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			output = output + String.fromCharCode(chr1);
	
			if (enc3 != 64) output = output + String.fromCharCode(chr2);
			if (enc4 != 64) output = output + String.fromCharCode(chr3);
	
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
	
		return(output);
	}
};
component.wrappedJSComponent = component;

function nsVersionVega() { }
nsVersionVega.prototype = component;
var NSGetModule = XPCOMUtils.generateNSGetModule([Initializer, nsVersionVega]);
