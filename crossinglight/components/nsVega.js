var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

const component = {

	classDescription : "@crossinglight/vega;1",
	classID : Components.ID("{fb063345-93ff-4388-a3cf-e3bf521d2601}"),
	contractID : "@crossinglight/vega;1",

	QueryInterface: XPCOMUtils.generateQI([Ci.nsIVega]),

	connect : 
	function(localPort, remoteHost, remotePort, parameters) {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "connect", 4, [localPort, remoteHost, remotePort, parameters], { });
	},

	disconnect : 
	function() {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "disconnect", 0, [], { });
	},

	connected : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "connected", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	nodeId : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "nodeId", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	localHost : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "localHost", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	localPort : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "localPort", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	publicHost : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "publicHost", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	publicPort : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "publicPort", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	remoteHost : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "remoteHost", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	remotePort : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "remotePort", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	parameters : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "parameters", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	lookupRandom : 
	function() {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "lookupRandom", 0, [], { });
		if ((! ret) || (! ret[0])) return null;

		return ret[0];
	},

	lookupNeighbors : 
	function(num, retCount) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "lookupNeighbors", 1, [num], { });
		if (! ret) return null;

		retCount.value = ret.length;
		return ret;
	},

	send : 
	function(nodeId, ray, content, flags, extension) {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "send", 5, [nodeId, ray, content, flags, extension], { });
	},

	subscribeTopic : 
	function(client, topic) {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "subscribeTopic", 2, [client, topic], { });
	},

	unsubscribeTopic : 
	function(client, topic) {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "unsubscribeTopic", 2, [client, topic], { });
	},

	topics : 
	function(client, retCount) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "topics", 1, [client,], { });
		if (! ret) return null;

		retCount.value = ret.length;
		return ret;
	},

	resetTopics :
	function(client) {
		
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "resetTopics", 1, [client], { });
	},

	multicast : 
	function(topic, ray, content, flags, extension) {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "multicast", 5, [topic, ray, content, flags, extension], { });
	},

	anycast : 
	function(topic, ray, content, flags, extension) {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "anycast", 5, [topic, ray, content, flags, extension], { });
	},

	get : 
	function(key) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "get", 1, [key], { });
		if ((! ret) || (! ret[0])) return null;
		
		return ret[0];
	},

	put : 
	function(key, value) {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "put", 2, [key, value], { });
	},

	multiPut : 
	function(key, value) {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "multiPut", 2, [key, value], { });
	},

	multiGet : 
	function(key, retCount) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "multiGet", 1, [key], retCount);
		if (! ret) return null;

		retCount.value = ret.length;
		return ret;
	},

	multiGetIndex : 
	function(key, index) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "multiGetIndex", 2, [key, index], { });
		if ((! ret) || (! ret[0])) return null;
		
		return ret[0];
	},

	multiGetCount : 
	function(key) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "multiGetCount", 1, [key], { });
		if ((! ret) || (! ret[0])) return null;
		
		return ret[0];
	},

	multiGetRandom : 
	function(key) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "multiGetRandom", 1, [key], { });
		if ((! ret) || (! ret[0])) return null;
		
		return ret[0];
	},

	multiDelete : 
	function(key, value) {
	
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "multiDelete", 2, [key, value], { });
	},

	subscribeRay :
	function(client, ray) {
		
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "subscribeRay", 2, [client, ray], { });
	},

	unsubscribeRay :
	function(client, ray) {
		
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "unsubscribeRay", 2, [client, ray], { });
	},

	rays : 
	function(client, retCount) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "rays", 1, [client], { });
		if (! ret) return null;

		retCount.value = ret.length;
		return ret;
	},

	resetRays :
	function(client) {
		
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "resetRays", 1, [client], { });
	},

	hasPackets : 
	function(client) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "hasPackets", 1, [client], { });
		if ((! ret) || (! ret[0])) return null;
		
		return ret[0];
	},

	fetchPacket : 
	function(client) {
	
		var ret =
		Cc["@crossinglight/versionvega;1"].getService(Ci.nsIVersionVega)
		.invoke("vega", "fetchPacket", 1, [client], { });
		if ((! ret) || (! ret[0])) return null;
		
		return ret[0];
	}
};
component.wrappedJSComponent = component;

function nsVega() { }
nsVega.prototype = component;
var NSGetModule = XPCOMUtils.generateNSGetModule([nsVega]);
