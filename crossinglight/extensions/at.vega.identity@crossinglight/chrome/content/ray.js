var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);

var nameTextbox;
var organizationTextbox;
var streetTextbox;
var postalcodeTextbox;
var cityTextbox;
var stateTextbox;
var countryTextbox;
var genderTextbox;
var descriptionTextbox;

function refreshCoreIdentity() {
	
	this.document.getElementById("inameDescription").value = orion.iname();
	this.document.getElementById("inumberDescription").value = orion.inumber();
}

function refreshExtendedIdentity() {
	
	var message = "[$[$get[[" + orion.inumber() + "[+name][+organization][+street][+postalcode][+city][+state][+country][+gender][+description]]]]]";
	var data;
	
	var working = 
	function() {

		data = JSON.parse(sirius.execute(message, null));
	}
	
	var main =
	function() {

		try { nameTextbox.value = data[orion.inumber()]["+name"]; }
		catch (ex) { nameTextbox.value = ""; }
		try { organizationTextbox.value = data[orion.inumber()]["+organization"]; }
		catch (ex) { organizationTextbox.value = ""; }
		try { streetTextbox.value = data[orion.inumber()]["+street"]; }
		catch (ex) { streetTextbox.value = ""; }
		try { postalcodeTextbox.value = data[orion.inumber()]["+postalcode"]; }
		catch (ex) { postalcodeTextbox.value = ""; }
		try { cityTextbox.value = data[orion.inumber()]["+city"]; }
		catch (ex) { cityTextbox.value = ""; }
		try { stateTextbox.value = data[orion.inumber()]["+state"]; }
		catch (ex) { stateTextbox.value = ""; }
		try { countryTextbox.value = data[orion.inumber()]["+country"]; }
		catch (ex) { countryTextbox.value = ""; }
		try { genderTextbox.value = data[orion.inumber()]["+gender"]; }
		catch (ex) { genderTextbox.value = ""; }
		try { descriptionTextbox.value = data[orion.inumber()]["+description"]; }
		catch (ex) { descriptionTextbox.value = ""; }
	}

	sol.runThread(working, main);
}

function refreshTimeTokens() {
	
	var timeLeft1Str = "";
	var timeLeft24Str = "";
	var timeLeft30Str = "";
	var timeLeft1Pct;
	var timeLeft24Pct;
	var timeLeft30Pct;
	
	var working = 
	function() {

		var timeLeft1 = orion.timeLeft1();
		var timeLeft24 = orion.timeLeft24();
		var timeLeft30 = orion.timeLeft30();
		
		timeLeft1Pct = Math.max(0, (timeLeft1 / 3600000) * 10);
		timeLeft24Pct = Math.max(0, (timeLeft24 / 86400000) * 10);
		timeLeft30Pct = Math.max(0, (timeLeft30 / 2592000000) * 10);

		var i;
		for (i=0; i<timeLeft1Pct; i+=0.5) timeLeft1Str = "-" + timeLeft1Str;
		for (; i<10; i+=0.5) timeLeft1Str = ">" + timeLeft1Str;
		for (i=0; i<timeLeft24Pct; i+=0.5) timeLeft24Str = "-" + timeLeft24Str;
		for (; i<10; i+=0.5) timeLeft24Str = ">" + timeLeft24Str;
		for (i=0; i<timeLeft30Pct; i+=0.5) timeLeft30Str = "-" + timeLeft30Str;
		for (; i<10; i+=0.5) timeLeft30Str = ">" + timeLeft30Str;
		
//		timeLeft1Str = timeLeft1Pct;
//		timeLeft24Str = timeLeft24Pct;
//		timeLeft30Str = timeLeft30Pct;
	}
	
	var main =
	function() {
		
		this.document.getElementById("timeLeft1Description").value = "[ " + timeLeft1Str + " ] ";
		this.document.getElementById("timeLeft24Description").value = "[ " + timeLeft24Str + " ] " ;
		this.document.getElementById("timeLeft30Description").value = "[ " + timeLeft30Str + " ] ";
		this.document.getElementById("timeLeft1PctDescription").value = Math.floor(100-timeLeft1Pct*10) + " %";
		this.document.getElementById("timeLeft24PctDescription").value = Math.floor(100-timeLeft24Pct*10) + " %";
		this.document.getElementById("timeLeft30PctDescription").value = Math.floor(100-timeLeft30Pct*10) + " %";
	}

	sol.runThread(working, main);
}

function onLoad() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}

	nameTextbox = document.getElementById("nameTextbox");
	organizationTextbox = document.getElementById("organizationTextbox");
	streetTextbox = document.getElementById("streetTextbox");
	postalcodeTextbox = document.getElementById("postalcodeTextbox");
	cityTextbox = document.getElementById("cityTextbox");
	stateTextbox = document.getElementById("stateTextbox");
	countryTextbox = document.getElementById("countryTextbox");
	genderTextbox = document.getElementById("genderTextbox");
	descriptionTextbox = document.getElementById("descriptionTextbox");
	
	display("coreIdentity");

	refreshCoreIdentity();
	refreshExtendedIdentity();
	refreshTimeTokens();
	
	sol.setStatus("Your Identity.");
}

function onUnload() {

}

function display(tab) {

	this.document.getElementById("coreIdentity").hidden = (tab != "coreIdentity");
	this.document.getElementById("extendedIdentity").hidden = (tab != "extendedIdentity");
	this.document.getElementById("timeTokens").hidden = (tab != "timeTokens");
}

function onSaveExtendedIdentity() {
	
	var message = "[$[$set[[" + orion.inumber() + 
	"[+name[\"" + nameTextbox.value + "\"]]" +
	"[+organization[\"" + organizationTextbox.value + "\"]]" +
	"[+street[\"" + streetTextbox.value + "\"]]" +
	"[+postalcode[\"" + postalcodeTextbox.value + "\"]]" +
	"[+city[\"" + cityTextbox.value + "\"]]" +
	"[+state[\"" + stateTextbox.value + "\"]]" +
	"[+country[\"" + countryTextbox.value + "\"]]" +
	"[+gender[\"" + genderTextbox.value + "\"]]" +
	"[+description[\"" + descriptionTextbox.value + "\"]]" +
	"]]]]";
	var data;
	
	var working = 
	function() {

		data = sirius.execute(message, null);
	}
	
	sol.runThread(working);
}

function onRefreshCoreIdentity() {
	
	refreshCoreIdentity();
}

function onRefreshExtendedIdentity() {
	
	refreshExtendedIdentity();
}

function onRefreshTimeTokens() {
	
	refreshTimeTokens();
}
