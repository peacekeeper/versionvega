var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

const component = {

	classDescription : "@crossinglight/polaris;1",
	classID : Components.ID("{4330bf3f-b35e-4ca0-9f68-fe521660d61e}"),
	contractID : "@crossinglight/polaris;1",

	QueryInterface: XPCOMUtils.generateQI([Ci.nsIPolaris]),

	add :
	function(xdi, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("polaris", "add", 2, [xdi, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	get :
	function(xdi, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("polaris", "get", 2, [xdi, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	mod :
	function(xdi, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("polaris", "mod", 2, [xdi, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	set :
	function(xdi, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("polaris", "set", 2, [xdi, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	del :
	function(xdi, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("polaris", "del", 2, [xdi, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	getLiterals :
	function(xdi, retCount) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("polaris", "getLiterals", 1, [xdi], { });
		if (! ret) return null;

		retCount.value = ret.length;
		return ret;
	},

	getLiteral :
	function(xdi) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("polaris", "getLiteral", 1, [xdi], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	getReferences :
	function(xdi, retCount) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("polaris", "getReferences", 1, [xdi], { });
		if (! ret) return null;

		retCount.value = ret.length;
		return ret;
	},

	getReference :
	function(xdi) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("polaris", "getReference", 1, [xdi], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	execute :
	function(message, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("polaris", "execute", 2, [message, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	}
};
component.wrappedJSComponent = component;

function nsPolaris() { }
nsPolaris.prototype = component;
var NSGetModule = XPCOMUtils.generateNSGetModule([nsPolaris]);
