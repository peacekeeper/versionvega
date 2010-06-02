var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);

var edit;

var address;

function refresh() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}

	var xdi = address + "/$text$value";
	var data;

	var working =
	function() {

		data = sirius.getLiteral(xdi);
	}
	
	var main =
	function() {
	
		if (data == null) {

			edit.value = "";
			sol.setStatus("Started " + address + ".");
		} else {

			edit.value = code.decode64(data);
			sol.setStatus("Loaded " + address + ".");
		}

		edit.focus();
		edit.setSelectionRange(0, 0);
	}

	sol.runThread(working, main);
}

function onLoad() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}

	this.addEventListener("run", onRun, false);

	edit = this.document.getElementById("edit");

	address = decodeURIComponent(this.document.documentURI.substring(this.document.documentURI.indexOf('?') + 1));

	refresh();
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
