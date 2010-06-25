var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);
var polaris = Components.classes["@crossinglight/polaris;1"].getService(Components.interfaces.nsIPolaris);

function onLoad() {

	sol.setStatus("@versionvega Control Panel.");

	this.display("vega");
}

function onUnload() {

}

function display(tab) {

	this.document.getElementById("vega").hidden = (tab != "vega");
	this.document.getElementById("orion").hidden = (tab != "orion");
	this.document.getElementById("sirius").hidden = (tab != "sirius");
	this.document.getElementById("polaris").hidden = (tab != "polaris");
}

/*
 * Vega API
 */

function onVegaConnect() {
	
	var vegaConnectParam1 = this.document.getElementById("vegaConnectParam1").value == "" ? null : this.document.getElementById("vegaConnectParam1").value; 
	var vegaConnectParam2 = this.document.getElementById("vegaConnectParam2").value == "" ? null : this.document.getElementById("vegaConnectParam2").value; 
	var vegaConnectParam3 = this.document.getElementById("vegaConnectParam3").value == "" ? null : this.document.getElementById("vegaConnectParam3").value; 
	var vegaConnectParam4 = this.document.getElementById("vegaConnectParam4").value == "" ? null : this.document.getElementById("vegaConnectParam4").value; 

	var working =
	function() {

		vega.connect(vegaConnectParam1, vegaConnectParam2, vegaConnectParam3, vegaConnectParam4);
	};
	
	var main =
	function() {

		sol.setAutoFountainColor();
	};

	sol.runThread(working, main);
}

function onVegaDisconnect() {
	
	var working =
	function() {

		vega.disconnect();
	};
	
	var main =
	function() {

		sol.setAutoFountainColor();
	};

	sol.runThread(working, main);
}

function onVegaConnected() {

	debug.messageString(vega.connected());
}

function onVegaNodeId() {
	
	debug.messageString(vega.nodeId());
}

function onVegaLocalHost() {
	
	debug.messageString(vega.localHost());
}

function onVegaLocalPort() {
	
	debug.messageString(vega.localPort());
}

function onVegaPublicHost() {
	
	debug.messageString(vega.publicHost());
}

function onVegaPublicPort() {
	
	debug.messageString(vega.publicPort());
}

function onVegaRemoteHost() {
	
	debug.messageString(vega.remoteHost());
}

function onVegaRemotePort() {
	
	debug.messageString(vega.remotePort());
}

function onVegaParameters() {
	
	debug.messageString(vega.parameters());
}

function onVegaLookupRandom() {
	
	var result;
	
	var working =
	function() {

		result = vega.lookupRandom();
	};

	var main =
	function() {
		
		debug.messageString(result);
	};
	
	sol.runThread(working, main);
}

function onVegaLookupNeighbors() {
	
	var vegaLookupNeighborsParam1 = this.document.getElementById("vegaLookupNeighborsParam1").value == "" ? null : this.document.getElementById("vegaLookupNeighborsParam1").value; 

	var result;
	
	var working =
	function() {

		result = vega.lookupNeighbors(vegaLookupNeighborsParam1, { });
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onVegaSend() {
	
	var vegaSendParam1 = this.document.getElementById("vegaSendParam1").value == "" ? null : this.document.getElementById("vegaSendParam1").value; 
	var vegaSendParam2 = this.document.getElementById("vegaSendParam2").value == "" ? null : this.document.getElementById("vegaSendParam2").value; 
	var vegaSendParam3 = this.document.getElementById("vegaSendParam3").value == "" ? null : this.document.getElementById("vegaSendParam3").value; 
	var vegaSendParam4 = this.document.getElementById("vegaSendParam4").value == "" ? null : this.document.getElementById("vegaSendParam4").value; 
	var vegaSendParam5 = this.document.getElementById("vegaSendParam5").value == "" ? null : this.document.getElementById("vegaSendParam5").value; 

	var working =
	function() {

		vega.send(vegaSendParam1, vegaSendParam2, vegaSendParam3, vegaSendParam4, vegaSendParam5);
	};

	sol.runThread(working);
}

function onVegaSubscribe() {
	
	var vegaSubscribeTopicParam1 = this.document.getElementById("vegaSubscribeTopicParam1").value == "" ? null : this.document.getElementById("vegaSubscribeTopicParam1").value; 
	var vegaSubscribeTopicParam2 = this.document.getElementById("vegaSubscribeTopicParam2").value == "" ? null : this.document.getElementById("vegaSubscribeTopicParam2").value; 
	
	var working =
	function() {

		vega.subscribeTopic(vegaSubscribeTopicParam1, vegaSubscribeTopicParam2);
	};
	
	sol.runThread(working);
}

function onVegaUnsubscribeTopic() {
	
	var vegaUnsubscribeTopicParam1 = this.document.getElementById("vegaUnsubscribeTopicParam1").value == "" ? null : this.document.getElementById("vegaUnsubscribeTopicParam1").value; 
	var vegaUnsubscribeTopicParam2 = this.document.getElementById("vegaUnsubscribeTopicParam2").value == "" ? null : this.document.getElementById("vegaUnsubscribeTopicParam2").value; 
	
	var working =
	function() {

		vega.unsubscribeTopic(vegaUnsubscribeTopicParam1, vegaUnsubscribeTopicParam2);
	};
	
	sol.runThread(working);
}

function onVegaTopics() {
	
	var vegaTopicsParam1 = this.document.getElementById("vegaTopicsParam1").value == "" ? null : this.document.getElementById("vegaTopicsParam1").value; 

	var result = vega.topics(vegaTopicsParam1, { });

	debug.messageString(result);
}

function onVegaResetTopics() {
	
	var vegaResetTopicsParam1 = this.document.getElementById("vegaResetTopicsParam1").value == "" ? null : this.document.getElementById("vegaResetTopicsParam1").value; 

	vega.resetTopics(vegaResetTopicsParam1, { });
}

function onVegaMulticast() {
	
	var vegaMulticastParam1 = this.document.getElementById("vegaMulticastParam1").value == "" ? null : this.document.getElementById("vegaMulticastParam1").value; 
	var vegaMulticastParam2 = this.document.getElementById("vegaMulticastParam2").value == "" ? null : this.document.getElementById("vegaMulticastParam2").value; 
	var vegaMulticastParam3 = this.document.getElementById("vegaMulticastParam3").value == "" ? null : this.document.getElementById("vegaMulticastParam3").value; 
	var vegaMulticastParam4 = this.document.getElementById("vegaMulticastParam4").value == "" ? null : this.document.getElementById("vegaMulticastParam4").value; 
	var vegaMulticastParam5 = this.document.getElementById("vegaMulticastParam5").value == "" ? null : this.document.getElementById("vegaMulticastParam5").value; 

	var working =
	function() {

		vega.multicast(vegaMulticastParam1, vegaMulticastParam2, vegaMulticastParam3, vegaMulticastParam4, vegaMulticastParam5);
	};

	sol.runThread(working);
}

function onVegaAnycast() {
	
	var vegaAnycastParam1 = this.document.getElementById("vegaAnycastParam1").value == "" ? null : this.document.getElementById("vegaAnycastParam1").value; 
	var vegaAnycastParam2 = this.document.getElementById("vegaAnycastParam2").value == "" ? null : this.document.getElementById("vegaAnycastParam2").value; 
	var vegaAnycastParam3 = this.document.getElementById("vegaAnycastParam3").value == "" ? null : this.document.getElementById("vegaAnycastParam3").value; 
	var vegaAnycastParam4 = this.document.getElementById("vegaAnycastParam4").value == "" ? null : this.document.getElementById("vegaAnycastParam4").value; 
	var vegaAnycastParam5 = this.document.getElementById("vegaAnycastParam5").value == "" ? null : this.document.getElementById("vegaAnycastParam5").value; 

	var working =
	function() {

		vega.anycast(vegaAnycastParam1, vegaAnycastParam2, vegaAnycastParam3, vegaAnycastParam4, vegaAnycastParam5);
	};

	sol.runThread(working);
}

function onVegaGet() {
	
	var vegaGetParam1 = this.document.getElementById("vegaGetParam1").value == "" ? null : this.document.getElementById("vegaGetParam1").value; 

	var result;
	
	var working =
	function() {

		result = vega.get(vegaGetParam1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onVegaPut() {
	
	var vegaPutParam1 = this.document.getElementById("vegaPutParam1").value == "" ? null : this.document.getElementById("vegaPutParam1").value; 
	var vegaPutParam2 = this.document.getElementById("vegaPutParam2").value == "" ? null : this.document.getElementById("vegaPutParam2").value; 

	var working =
	function() {

		vega.put(vegaPutParam1, vegaPutParam2);
	};

	sol.runThread(working);
}

function onVegaMultiPut() {
	
	var vegaMultiPutParam1 = this.document.getElementById("vegaMultiPutParam1").value == "" ? null : this.document.getElementById("vegaMultiPutParam1").value; 
	var vegaMultiPutParam2 = this.document.getElementById("vegaMultiPutParam2").value == "" ? null : this.document.getElementById("vegaMultiPutParam2").value; 

	var working =
	function() {

		vega.multiPut(vegaMultiPutParam1, vegaMultiPutParam2);
	};

	sol.runThread(working);
}

function onVegaMultiGet() {
	
	var vegaMultiGetParam1 = this.document.getElementById("vegaMultiGetParam1").value == "" ? null : this.document.getElementById("vegaMultiGetParam1").value; 

	var result;
	
	var working =
	function() {

		result = vega.multiGet(vegaMultiGetParam1, { });
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onVegaMultiGetIndex() {
	
	var vegaMultiGetIndexParam1 = this.document.getElementById("vegaMultiGetIndexParam1").value == "" ? null : this.document.getElementById("vegaMultiGetIndexParam1").value; 
	var vegaMultiGetIndexParam2 = this.document.getElementById("vegaMultiGetIndexParam2").value == "" ? null : this.document.getElementById("vegaMultiGetIndexParam2").value; 

	var result;
	
	var working =
	function() {

		result = vega.multiGetIndex(vegaMultiGetIndexParam1, vegaMultiGetIndexParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onVegaMultiGetCount() {
	
	var vegaMultiGetCountParam1 = this.document.getElementById("vegaMultiGetCountParam1").value == "" ? null : this.document.getElementById("vegaMultiGetCountParam1").value; 

	var result;
	
	var working =
	function() {

		result = vega.multiGetCount(vegaMultiGetCountParam1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onVegaMultiGetRandom() {
	
	var vegaMultiGetRandomParam1 = this.document.getElementById("vegaMultiGetRandomParam1").value == "" ? null : this.document.getElementById("vegaMultiGetRandomParam1").value; 

	var result;
	
	var working =
	function() {

		result = vega.multiGetRandom(vegaMultiGetRandomParam1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onVegaMultiDelete() {
	
	var vegaMultiDeleteParam1 = this.document.getElementById("vegaMultiDeleteParam1").value == "" ? null : this.document.getElementById("vegaMultiDeleteParam1").value;
	var vegaMultiDeleteParam2 = this.document.getElementById("vegaMultiDeleteParam2").value == "" ? null : this.document.getElementById("vegaMultiDeleteParam2").value;

	var working =
	function() {

		vega.multiDelete(vegaMultiDeleteParam1, vegaMultiDeleteParam2);
	};

	sol.runThread(working);
}

function onVegaSubscribeRay() {
	
	var vegaSubscribeRayParam1 = this.document.getElementById("vegaSubscribeRayParam1").value == "" ? null : this.document.getElementById("vegaSubscribeRayParam1").value;
	var vegaSubscribeRayParam2 = this.document.getElementById("vegaSubscribeRayParam2").value == "" ? null : this.document.getElementById("vegaSubscribeRayParam2").value;

	vega.subscribeRay(vegaSubscribeRayParam1, vegaSubscribeRayParam2);
}

function onVegaUnsubscribeRay() {
	
	var vegaUnsubscribeRayParam1 = this.document.getElementById("vegaUnsubscribeRayParam1").value == "" ? null : this.document.getElementById("vegaUnsubscribeRayParam1").value;
	var vegaUnsubscribeRayParam2 = this.document.getElementById("vegaUnsubscribeRayParam2").value == "" ? null : this.document.getElementById("vegaUnsubscribeRayParam2").value;

	vega.unsubscribeRay(vegaUnsubscribeRayParam1, vegaUnsubscribeRayParam2);
}

function onVegaRays() {
	
	var vegaRaysParam1 = this.document.getElementById("vegaRaysParam1").value == "" ? null : this.document.getElementById("vegaRaysParam1").value; 

	var result = vega.rays(vegaRaysParam1, { });

	debug.messageString(result);
}

function onVegaResetRays() {
	
	var vegaResetRaysParam1 = this.document.getElementById("vegaResetRaysParam1").value == "" ? null : this.document.getElementById("vegaResetRaysParam1").value; 

	vega.resetRays(vegaResetRaysParam1, { });
}

/*
 * Orion API
 */

function onOrionLogin() {
	
	var orionLoginParam1 = this.document.getElementById("orionLoginParam1").value == "" ? null : this.document.getElementById("orionLoginParam1").value; 
	var orionLoginParam2 = this.document.getElementById("orionLoginParam2").value == "" ? null : this.document.getElementById("orionLoginParam2").value; 

	var working =
	function() {

		orion.login(orionLoginParam1, orionLoginParam2);
	};

	sol.runThread(working);
}

function onOrionLogout() {
	
	var working =
	function() {

		orion.logout();
	};

	sol.runThread(working);
}

function onOrionLoggedin() {

	debug.messageString(orion.loggedin());
}

function onOrionIname() {
	
	debug.messageString(orion.iname());
}

function onOrionInumber() {
	
	debug.messageString(orion.inumber());
}

function onOrionXdiUri() {
	
	debug.messageString(orion.xdiUri());
}

function onOrionResolve() {
	
	var orionResolveParam1 = this.document.getElementById("orionResolveParam1").value == "" ? null : this.document.getElementById("orionResolveParam1").value; 

	var result;
	
	var working =
	function() {

		result = orion.resolve(orionResolveParam1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionSign() {
	
	var orionSignParam1 = this.document.getElementById("orionSignParam1").value == "" ? null : this.document.getElementById("orionSignParam1").value; 

	var result;
	
	var working =
	function() {

		result = orion.sign(orionSignParam1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionVerify() {
	
	var orionVerifyParam1 = this.document.getElementById("orionVerifyParam1").value == "" ? null : this.document.getElementById("orionVerifyParam1").value; 
	var orionVerifyParam2 = this.document.getElementById("orionVerifyParam2").value == "" ? null : this.document.getElementById("orionVerifyParam2").value; 
	var orionVerifyParam3 = this.document.getElementById("orionVerifyParam3").value == "" ? null : this.document.getElementById("orionVerifyParam3").value; 

	var result;
	
	var working =
	function() {

		result = orion.verify(orionVerifyParam1, orionVerifyParam2, orionVerifyParam3);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionEncrypt() {
	
	var orionEncryptParam1 = this.document.getElementById("orionEncryptParam1").value == "" ? null : this.document.getElementById("orionEncryptParam1").value; 
	var orionEncryptParam2 = this.document.getElementById("orionEncryptParam2").value == "" ? null : this.document.getElementById("orionEncryptParam2").value; 

	var result;
	
	var working =
	function() {

		result = orion.encrypt(orionEncryptParam1, orionEncryptParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionDecrypt() {
	
	var orionDecryptParam1 = this.document.getElementById("orionDecryptParam1").value == "" ? null : this.document.getElementById("orionDecryptParam1").value; 

	var result;
	
	var working =
	function() {

		result = orion.decrypt(orionDecryptParam1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionSymGenerateKey() {
	
	var result;
	
	var working =
	function() {

		result = orion.symGenerateKey();
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionSymEncrypt() {
	
	var orionSymEncryptParam1 = this.document.getElementById("orionSymEncryptParam1").value == "" ? null : this.document.getElementById("orionSymEncryptParam1").value; 
	var orionSymEncryptParam2 = this.document.getElementById("orionSymEncryptParam2").value == "" ? null : this.document.getElementById("orionSymEncryptParam2").value; 

	var result;
	
	var working =
	function() {

		result = orion.symEncrypt(orionSymEncryptParam1, orionSymEncryptParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionSymDecrypt() {
	
	var orionSymDecryptParam1 = this.document.getElementById("orionSymDecryptParam1").value == "" ? null : this.document.getElementById("orionSymDecryptParam1").value; 
	var orionSymDecryptParam2 = this.document.getElementById("orionSymDecryptParam2").value == "" ? null : this.document.getElementById("orionSymDecryptParam2").value; 

	var result;
	
	var working =
	function() {

		result = orion.symDecrypt(orionSymDecryptParam1, orionSymDecryptParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionGuid() {
	
	debug.messageString(orion.guid());
}

function onOrionTimeToken1() {
	
	var orionTimeToken1Param1 = this.document.getElementById("orionTimeToken1Param1").value == "" ? null : this.document.getElementById("orionTimeToken1Param1").value; 

	var result;
	
	var working =
	function() {

		result = orion.timeToken1(orionTimeToken1Param1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionTimeToken24() {
	
	var orionTimeToken24Param1 = this.document.getElementById("orionTimeToken24Param1").value == "" ? null : this.document.getElementById("orionTimeToken24Param1").value; 

	var result;
	
	var working =
	function() {

		result = orion.timeToken24(orionTimeToken24Param1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionTimeToken30() {
	
	var orionTimeToken30Param1 = this.document.getElementById("orionTimeToken30Param1").value == "" ? null : this.document.getElementById("orionTimeToken30Param1").value; 

	var result;
	
	var working =
	function() {

		result = orion.timeToken30(orionTimeToken30Param1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionTimeLeft1() {
	
	var result;
	
	var working =
	function() {

		result = orion.timeLeft1();
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionTimeLeft24() {
	
	var result;
	
	var working =
	function() {

		result = orion.timeLeft24();
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionTimeLeft30() {
	
	var result;
	
	var working =
	function() {

		result = orion.timeLeft30();
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onOrionVerifyTimeToken() {
	
	var orionVerifyTimeTokenParam1 = this.document.getElementById("orionVerifyTimeTokenParam1").value == "" ? null : this.document.getElementById("orionVerifyTimeTokenParam1").value; 
	var orionVerifyTimeTokenParam2 = this.document.getElementById("orionVerifyTimeTokenParam2").value == "" ? null : this.document.getElementById("orionVerifyTimeTokenParam2").value; 
	var orionVerifyTimeTokenParam3 = this.document.getElementById("orionVerifyTimeTokenParam3").value == "" ? null : this.document.getElementById("orionVerifyTimeTokenParam3").value; 

	var result;
	
	var working =
	function() {

		result = orion.verifyTimeToken(orionVerifyTimeTokenParam1, orionVerifyTimeTokenParam2, orionVerifyTimeTokenParam3);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

/*
 * Sirius API
 */

function onSiriusGet() {
	
	var siriusGetParam1 = this.document.getElementById("siriusGetParam1").value == "" ? null : this.document.getElementById("siriusGetParam1").value; 
	var siriusGetParam2 = this.document.getElementById("siriusGetParam2").value == "" ? null : this.document.getElementById("siriusGetParam2").value; 

	var result;
	
	var working =
	function() {

		result = sirius.get(siriusGetParam1, siriusGetParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onSiriusAdd() {
	
	var siriusAddParam1 = this.document.getElementById("siriusAddParam1").value == "" ? null : this.document.getElementById("siriusAddParam1").value; 
	var siriusAddParam2 = this.document.getElementById("siriusAddParam2").value == "" ? null : this.document.getElementById("siriusAddParam2").value; 

	var result;
	
	var working =
	function() {

		result = sirius.add(siriusAddParam1, siriusAddParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onSiriusSet() {
	
	var siriusSetParam1 = this.document.getElementById("siriusSetParam1").value == "" ? null : this.document.getElementById("siriusSetParam1").value; 
	var siriusSetParam2 = this.document.getElementById("siriusSetParam2").value == "" ? null : this.document.getElementById("siriusSetParam2").value; 

	var result;
	
	var working =
	function() {

		result = sirius.set(siriusSetParam1, siriusSetParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onSiriusMod() {
	
	var siriusModParam1 = this.document.getElementById("siriusModParam1").value == "" ? null : this.document.getElementById("siriusModParam1").value; 
	var siriusModParam2 = this.document.getElementById("siriusModParam2").value == "" ? null : this.document.getElementById("siriusModParam2").value; 

	var result;
	
	var working =
	function() {

		result = sirius.mod(siriusModParam1, siriusModParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onSiriusDel() {
	
	var siriusDelParam1 = this.document.getElementById("siriusDelParam1").value == "" ? null : this.document.getElementById("siriusDelParam1").value; 
	var siriusDelParam2 = this.document.getElementById("siriusDelParam2").value == "" ? null : this.document.getElementById("siriusDelParam2").value; 

	var result;
	
	var working =
	function() {

		result = sirius.del(siriusDelParam1, siriusDelParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onSiriusGetLiterals() {
	
	var siriusGetLiteralsParam1 = this.document.getElementById("siriusGetLiteralsParam1").value == "" ? null : this.document.getElementById("siriusGetLiteralsParam1").value; 

	var result;
	
	var working =
	function() {

		result = sirius.getLiterals(siriusGetLiteralsParam1, { });
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onSiriusGetLiteral() {
	
	var siriusGetLiteralParam1 = this.document.getElementById("siriusGetLiteralParam1").value == "" ? null : this.document.getElementById("siriusGetLiteralParam1").value; 

	var result;
	
	var working =
	function() {

		result = sirius.getLiteral(siriusGetLiteralParam1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onSiriusGetReferences() {
	
	var siriusGetReferencesParam1 = this.document.getElementById("siriusGetReferencesParam1").value == "" ? null : this.document.getElementById("siriusGetReferencesParam1").value; 

	var result;
	
	var working =
	function() {

		result = sirius.getReferences(siriusGetReferencesParam1, { });
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onSiriusGetReference() {
	
	var siriusGetReferenceParam1 = this.document.getElementById("siriusGetReferenceParam1").value == "" ? null : this.document.getElementById("siriusGetReferenceParam1").value; 

	var result;
	
	var working =
	function() {

		result = sirius.getReference(siriusGetReferenceParam1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onSiriusExecute() {
	
	var siriusExecuteParam1 = this.document.getElementById("siriusExecuteParam1").value == "" ? null : this.document.getElementById("siriusExecuteParam1").value; 
	var siriusExecuteParam2 = this.document.getElementById("siriusExecuteParam2").value == "" ? null : this.document.getElementById("siriusExecuteParam2").value; 

	var result;
	
	var working =
	function() {

		result = sirius.execute(siriusExecuteParam1, siriusExecuteParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

/*
 * Polaris API
 */

function onPolarisGet() {
	
	var polarisGetParam1 = this.document.getElementById("polarisGetParam1").value == "" ? null : this.document.getElementById("polarisGetParam1").value; 
	var polarisGetParam2 = this.document.getElementById("polarisGetParam2").value == "" ? null : this.document.getElementById("polarisGetParam2").value; 

	var result;
	
	var working =
	function() {

		result = polaris.get(polarisGetParam1, polarisGetParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onPolarisAdd() {
	
	var polarisAddParam1 = this.document.getElementById("polarisAddParam1").value == "" ? null : this.document.getElementById("polarisAddParam1").value; 
	var polarisAddParam2 = this.document.getElementById("polarisAddParam2").value == "" ? null : this.document.getElementById("polarisAddParam2").value; 

	var result;
	
	var working =
	function() {

		result = polaris.add(polarisAddParam1, polarisAddParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onPolarisSet() {
	
	var polarisSetParam1 = this.document.getElementById("polarisSetParam1").value == "" ? null : this.document.getElementById("polarisSetParam1").value; 
	var polarisSetParam2 = this.document.getElementById("polarisSetParam2").value == "" ? null : this.document.getElementById("polarisSetParam2").value; 

	var result;
	
	var working =
	function() {

		result = polaris.set(polarisSetParam1, polarisSetParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onPolarisMod() {
	
	var polarisModParam1 = this.document.getElementById("polarisModParam1").value == "" ? null : this.document.getElementById("polarisModParam1").value; 
	var polarisModParam2 = this.document.getElementById("polarisModParam2").value == "" ? null : this.document.getElementById("polarisModParam2").value; 

	var result;
	
	var working =
	function() {

		result = polaris.mod(polarisModParam1, polarisModParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onPolarisDel() {
	
	var polarisDelParam1 = this.document.getElementById("polarisDelParam1").value == "" ? null : this.document.getElementById("polarisDelParam1").value; 
	var polarisDelParam2 = this.document.getElementById("polarisDelParam2").value == "" ? null : this.document.getElementById("polarisDelParam2").value; 

	var result;
	
	var working =
	function() {

		result = polaris.del(polarisDelParam1, polarisDelParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onPolarisGetLiterals() {
	
	var polarisGetLiteralsParam1 = this.document.getElementById("polarisGetLiteralsParam1").value == "" ? null : this.document.getElementById("polarisGetLiteralsParam1").value; 

	var result;
	
	var working =
	function() {

		result = polaris.getLiterals(polarisGetLiteralsParam1, { });
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onPolarisGetLiteral() {
	
	var polarisGetLiteralParam1 = this.document.getElementById("polarisGetLiteralParam1").value == "" ? null : this.document.getElementById("polarisGetLiteralParam1").value; 

	var result;
	
	var working =
	function() {

		result = polaris.getLiteral(polarisGetLiteralParam1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onPolarisGetReferences() {
	
	var polarisGetReferencesParam1 = this.document.getElementById("polarisGetReferencesParam1").value == "" ? null : this.document.getElementById("polarisGetReferencesParam1").value; 

	var result;
	
	var working =
	function() {

		result = polaris.getReferences(polarisGetReferencesParam1, { });
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onPolarisGetReference() {
	
	var polarisGetReferenceParam1 = this.document.getElementById("polarisGetReferenceParam1").value == "" ? null : this.document.getElementById("polarisGetReferenceParam1").value; 

	var result;
	
	var working =
	function() {

		result = polaris.getReference(polarisGetReferenceParam1);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}

function onPolarisExecute() {
	
	var polarisExecuteParam1 = this.document.getElementById("polarisExecuteParam1").value == "" ? null : this.document.getElementById("polarisExecuteParam1").value; 
	var polarisExecuteParam2 = this.document.getElementById("polarisExecuteParam2").value == "" ? null : this.document.getElementById("polarisExecuteParam2").value; 

	var result;
	
	var working =
	function() {

		result = polaris.execute(polarisExecuteParam1, polarisExecuteParam2);
	};
	
	var main =
	function() {

		debug.messageString(result);
	};

	sol.runThread(working, main);
}
