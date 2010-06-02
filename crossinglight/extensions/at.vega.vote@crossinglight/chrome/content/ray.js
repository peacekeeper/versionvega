var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);
var polaris = Components.classes["@crossinglight/polaris;1"].getService(Components.interfaces.nsIPolaris);

var listPollsList;
var createPollBox;
var titleTextBox;
var descriptionTextBox;
var pollDetailsBox;
var titleDescription;
var descriptionDescription;
var yesDescription;
var noDescription;
var commentTextBox;
var proposePollTextBox;

var address;

function addRichlistitem(address, description) {
	
	var title = address.substring(address.indexOf("@vega*vote") + 10);

	var richlistitem = document.createElement("richlistitem");
	var vbox = document.createElement("vbox");
	vbox.address = address;
	vbox.setAttribute("flex", "1");
	vbox.onclick = function() { onPollDetails(this.address); };
	var addressDescription = document.createElement("description");
	addressDescription.setAttribute("class", "addressdescription");
	addressDescription.setAttribute("value", address);
	var descriptionDescription = document.createElement("description");
	descriptionDescription.setAttribute("class", "descriptiondescription");
	descriptionDescription.setAttribute("value", description);
	var vbox2 = document.createElement("vbox");
	var deleteButton = document.createElement("image");
	deleteButton.address = address;
	deleteButton.setAttribute("class", "deletebutton");
	deleteButton.setAttribute("tooltiptext", "Remove");
	deleteButton.onclick = function() { onPollDelete(this.address); };

	listPollsList.appendChild(richlistitem);
	richlistitem.appendChild(vbox);
	vbox.appendChild(addressDescription);
	vbox.appendChild(descriptionDescription);
	richlistitem.appendChild(vbox2);
	vbox2.appendChild(deleteButton);
}

function refreshCreatePollBox() {

	titleTextBox.value = "+your.vote";
	descriptionTextBox.value = "Should we ...?";
}

function refreshListPollsList() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}

	var addresses;
	var descriptions = [ ];

	var working =
	function() {
		
		addresses = polaris.getReferences(orion.inumber() + "/@vega*vote+polls", { });
		for (i in addresses) {
			
			descriptions[i] = sirius.getLiteral(addresses[i] + "/+description");
			if (descriptions[i]) descriptions[i] = code.decode64(descriptions[i]);
		}
	}
	
	var main =
	function() {
		
		while (listPollsList.hasChildNodes()) listPollsList.removeChild(listPollsList.firstChild);

		for (i in addresses) {
			
			var address = addresses[i];
			var description = descriptions[i];
			
			addRichlistitem(address, description);
		}
	}

	sol.runThread(working, main);
}

function refreshPollDetailsBox() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}

	var title;
	var description;
	var yes = 0;
	var no = 0;

	var working =
	function() {
		
		title = address.substring(address.indexOf("@vega*vote")+10);
		description = sirius.getLiteral(address + "/+description", { });
		if (description) description = code.decode64(description);

		var votes = JSON.parse(sirius.get(address + "/$public@vega*vote+votes", "X3J"));
		votes = votes[address]["$public@vega*vote+votes"];
		
		for (i in votes) {

			if (! votes[i]) continue;
			if (votes[i]["+vote"] == "1") yes++;
			if (votes[i]["+vote"] == "0") no++;
		}
	}
	
	var main =
	function() {
	
		titleDescription.value = title;
		descriptionDescription.value = description;
		yesDescription.value = yes;
		noDescription.value = no;
		commentTextBox.value = "";
		proposePollTextBox.value = "";
	}

	sol.runThread(working, main);
}

function display(tab) {

	this.document.getElementById("listPollsList").hidden = (tab != "listPollsList");
	this.document.getElementById("createPollBox").hidden = (tab != "createPollBox");
	this.document.getElementById("pollDetailsBox").hidden = (tab != "pollDetailsBox");
}

function onLoad() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}

	this.addEventListener("run", onRun, false);

	listPollsList = this.document.getElementById("listPollsList");
	createPollBox = this.document.getElementById("createPollBox");
	titleTextBox = this.document.getElementById("titleTextBox");
	descriptionTextBox = this.document.getElementById("descriptionTextBox");
	pollDetailsBox = this.document.getElementById("pollDetailsBox");
	titleDescription = this.document.getElementById("titleDescription");
	descriptionDescription = this.document.getElementById("descriptionDescription");
	yesDescription = this.document.getElementById("yesDescription");
	noDescription = this.document.getElementById("noDescription");
	commentTextBox = this.document.getElementById("commentTextBox");
	proposePollTextBox = this.document.getElementById("proposePollTextBox");

	if (this.document.documentURI.indexOf('?') > 0) {
		
		address = decodeURIComponent(this.document.documentURI.substring(this.document.documentURI.indexOf('?') + 1));

		var working =
		function() {
			
			polaris.set(orion.inumber() + "/@vega*vote+polls/" + address, null);
		}

		sol.runThread(working);
		
		display("pollDetailsBox");
		refreshPollDetailsBox();
	} else {

		display("listPollsList");
		refreshListPollsList();
	}
}

function onUnload() {

}

function onRun(event) {

	var data = JSON.parse(event.data);

	try {

		eval(data.script);
	} catch (ex) {

		Components.utils.reportError(ex);
	}
}

function onDisplayCreatePollBox() {
	
	display("createPollBox");
	refreshCreatePollBox();
}

function onDisplayListPollsList() {
	
	display("listPollsList");
	refreshListPollsList();
}

function onPollCreate() {
	
	var title = titleTextBox.value;
	var description = descriptionTextBox.value;
	
	var working = 
	function() {
	
		address = orion.inumber() + "@vega*vote" + title;
		
		sirius.set("[" + address + "[+description[\"" + code.encode64(description) + "\"]]]", null); 
		sirius.set("[" + address + "[$public@vega*vote+votes[]]]", null); 
		polaris.set(orion.inumber() + "/@vega*vote+polls/" + address, null);
	}

	var main =
	function() {
		
		display("pollDetailsBox");
		refreshPollDetailsBox();
	}
	
	sol.runThread(working, main);
}

function onPollDetails(selectedAddress) {
	
	address = selectedAddress;
	display("pollDetailsBox");
	refreshPollDetailsBox();
}

function onPollDelete(selectedAddress) {
	
	var working =
	function() {
	
		polaris.del(orion.inumber() + "/@vega*vote+polls/" + selectedAddress, null);
	}

	var main =
	function() {
	
		refreshListPollsList();
	}

	sol.runThread(working, main);
}

function onYes() {
	
	var working =
	function() {
	
		sirius.set(address + "/$public@vega*vote+votes//" + orion.inumber() + "/+vote/'1'", null);
	}

	var main =
	function() {
	
		sol.setStatus("Voted YES on " + address);
		refreshPollDetailsBox();
	}

	sol.runThread(working, main);
}

function onNo() {
	
	var working =
	function() {
	
		sirius.set(address + "/$public@vega*vote+votes//" + orion.inumber() + "/+vote/'0'", null);
	}

	var main =
	function() {
	
		sol.setStatus("Voted NO on " + address);
		refreshPollDetailsBox();
	}

	sol.runThread(working, main);
}

function onComment() {
	
	var comment = commentTextBox.value;

	var working =
	function() {
	
		sirius.set(address + "/$public@vega*vote+votes//" + orion.inumber() + "/+comment/'" + code.encode64(comment) + "'", null);
	}

	var main =
	function() {
	
		sol.setStatus("Added comment to " + address);
		commentTextBox.text = "";
	}

	sol.runThread(working, main);
}

function onProposePoll() {

	var to = proposePollTextBox.value;
	
	var inumber;
	var nodeid;

	var working =
	function() {

		if (to.indexOf("=!") == 0 || to.indexOf("@!") == 0) {

			inumber = to;
			nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		} else if (to.indexOf("=") == 0 || to.indexOf("@") == 0) {
			
			inumber = orion.resolve(to);
			nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		} else {
			
			nodeid = to;
		}
		
		if (! nodeid) throw "Unknown destination: " + to;

		var extension = { };
		extension.query = encodeURIComponent(address);
		
		vega.send(nodeid, "@vega", "@vega*vote", "2", JSON.stringify(extension));
	}

	sol.runThread(working);
}
