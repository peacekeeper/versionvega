var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

const component = {

	classDescription : "@crossinglight/orion;1",
	classID : Components.ID("{bf1f5c4e-5bf6-4a4b-a484-50c2192f7681}"),
	contractID : "@crossinglight/orion;1",

	QueryInterface: XPCOMUtils.generateQI([Ci.nsIOrion]),

	login : 
	function(iname, password) {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "login", 2, [iname, password], { });
	},

	logout : 
	function() {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "logout", 0, [], { });
	},

	loggedin : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "loggedin", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	iname : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "iname", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	inumber : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "inumber", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	xdiUri : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "xdiUri", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	resolve : 
	function(str) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "resolve", 1, [str], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	sign : 
	function(str) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "sign", 1, [str], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	verify : 
	function(str, signature, xri) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "verify", 3, [str, signature, xri], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	encrypt : 
	function(str, xri) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "encrypt", 2, [str, xri], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	decrypt : 
	function(str) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "decrypt", 1, [str], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	symGenerateKey : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "symGenerateKey", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	symEncrypt : 
	function(str, key) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "symEncrypt", 2, [str, key], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	symDecrypt : 
	function(str, key) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "symDecrypt", 2, [str, key], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	guid : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "guid", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	timeToken1 : 
	function(data) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "timeToken1", 1, [data], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	timeToken24 : 
	function(data) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "timeToken24", 1, [data], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	timeToken30 : 
	function(data) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "timeToken30", 1, [data], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	timeLeft1 : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "timeLeft1", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	timeLeft24 : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "timeLeft24", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	timeLeft30 : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "timeLeft30", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	verifyTimeToken : 
	function(data, timeToken, xri) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("orion", "verifyTimeToken", 3, [data, timeToken, xri], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	}
};
component.wrappedJSComponent = component;

function nsOrion() { }
nsOrion.prototype = component;
var NSGetModule = XPCOMUtils.generateNSGetModule([nsOrion]);
