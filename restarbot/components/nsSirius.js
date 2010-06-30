var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

const component = {

	classDescription : "@crossinglight/sirius;1",
	classID : Components.ID("{f1351a47-a609-49ab-831c-e507858225a1}"),
	contractID : "@crossinglight/sirius;1",

	QueryInterface: XPCOMUtils.generateQI([Ci.nsISirius]),

	add :
	function(xdi, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("sirius", "add", 2, [xdi, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	get :
	function(xdi, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("sirius", "get", 2, [xdi, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	mod :
	function(xdi, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("sirius", "mod", 2, [xdi, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	set :
	function(xdi, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("sirius", "set", 2, [xdi, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	del :
	function(xdi, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("sirius", "del", 2, [xdi, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	getLiterals :
	function(xdi, retCount) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("sirius", "getLiterals", 1, [xdi], { });
		if (! ret) return null;

		retCount.value = ret.length;
		return ret;
	},

	getLiteral :
	function(xdi) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("sirius", "getLiteral", 1, [xdi], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	getReferences :
	function(xdi, retCount) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("sirius", "getReferences", 1, [xdi], { });
		if (! ret) return null;

		retCount.value = ret.length;
		return ret;
	},

	getReference :
	function(xdi) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("sirius", "getReference", 1, [xdi], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	execute :
	function(message, format) {

		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("sirius", "execute", 2, [message, format], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	}
};
component.wrappedJSComponent = component;

function nsSirius() { }
nsSirius.prototype = component;
var NSGetModule = XPCOMUtils.generateNSGetModule([nsSirius]);
