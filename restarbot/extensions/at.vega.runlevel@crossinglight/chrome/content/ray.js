var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);

var runlevelDescription;
var runlevelBox0;
var runlevelBox1;
var runlevelBox2;
var runlevelBox3;
var nothingPanel;
var onlinePanel;
var offlinePanel;
var loggedinPanel;
var loggedoutPanel;

function refresh() {

	try {

		nothingPanel.hidden = true;

		if (vega.connected()) {

			onlinePanel.hidden = false;
			offlinePanel.hidden = true;
	
			var neighborNodes = vega.lookupNeighbors(99, { }).length;
			var networkNodes = (neighborNodes < 8) ? neighborNodes : Math.pow(2, neighborNodes) + " (estimated)";
	
			this.document.getElementById("onlineLocalPort").value = vega.localPort();
			this.document.getElementById("onlineNodeId").value = vega.nodeId();
			this.document.getElementById("onlineNeighborNodes").value = neighborNodes;
			this.document.getElementById("onlineNetworkNodes").value = networkNodes + " (estimated)";
		} else {
	
			onlinePanel.hidden = true;
			offlinePanel.hidden = false;
			
			this.document.getElementById("offlineConnectTo").value = prefs.getCharPref("vega.remotehost");
		}
	
		if (orion.loggedin()) {
	
			loggedinPanel.hidden = false;
			loggedoutPanel.hidden = true;
	
			this.document.getElementById("loggedinIname").value = orion.iname();
			this.document.getElementById("loggedinInumber").value = orion.inumber();
		} else {
			
			loggedinPanel.hidden = true;
			loggedoutPanel.hidden = false;
		}
	} catch (ex) {

		nothingPanel.hidden = false;
		onlinePanel.hidden = true;
		offlinePanel.hidden = true;
		loggedinPanel.hidden = true;
		loggedoutPanel.hidden = true;
	}

	try {

		if (vega.connected()) {
			
			if (orion.loggedin()) {

				runlevelDescription.value = "3";
				runlevelBox0.hidden = false;
				runlevelBox1.hidden = false;
				runlevelBox2.hidden = false;
				runlevelBox3.hidden = false;
			} else {

				runlevelDescription.value = "2";
				runlevelBox0.hidden = false;
				runlevelBox1.hidden = false;
				runlevelBox2.hidden = false;
				runlevelBox3.hidden = true;
			}
		} else {

			runlevelDescription.value = "1";
			runlevelBox0.hidden = false;
			runlevelBox1.hidden = false;
			runlevelBox2.hidden = true;
			runlevelBox3.hidden = true;
		}
	} catch (ex) {

		runlevelDescription.value = "0";
		runlevelBox0.hidden = false;
		runlevelBox1.hidden = true;
		runlevelBox2.hidden = true;
		runlevelBox3.hidden = true;
	}

	sol.setAutoFountainColor();
}

function onLoad() {

	runlevelDescription = this.document.getElementById("runlevelDescription");
	runlevelBox0 = this.document.getElementById("runlevelBox0");
	runlevelBox1 = this.document.getElementById("runlevelBox1");
	runlevelBox2 = this.document.getElementById("runlevelBox2");
	runlevelBox3 = this.document.getElementById("runlevelBox3");
	nothingPanel = this.document.getElementById("nothingPanel");
	onlinePanel = this.document.getElementById("onlinePanel");
	offlinePanel = this.document.getElementById("offlinePanel");
	loggedinPanel = this.document.getElementById("loggedinPanel");
	loggedoutPanel = this.document.getElementById("loggedoutPanel");

	sol.setStatus("@versionvega Runlevel Manager.");
	refresh();
}

function onUnload() {

}

function onRefresh() {
	
	refresh();
}

function onNothing() {
	
	refresh();
}

function onGoOffline() {

	var working =
	function() {

		if (orion.loggedin()) {

			try {

				sirius.del(orion.inumber() + "/$nodeid", "X3 Standard");
			} catch (ex) { }

			orion.logout();
		}
		vega.disconnect();
	};
	
	var main =
	function() {

		refresh();
	};

	sol.runThread(working, main);
}

function onGoOnline1() {
	
	var offlineConnectTo = this.document.getElementById("offlineConnectTo");

	var working =
	function() {

		vega.connect(null, offlineConnectTo.value, null, null);
	};

	var main =
	function() {
	
		refresh();
	};
	
	sol.runThread(working, main);
}

function onOfflineKeyPress(event) {
	
	if (event.keyCode == KeyEvent.DOM_VK_RETURN) onGoOnline1();
}

function onGoOnline2() {

	var working =
	function() {

		vega.connect(null, null, null, null);
	};

	var main =
	function() {
	
		refresh();
	};
	
	sol.runThread(working, main);
}

function onLogout() {

	var working =
	function() {

		try {

			sirius.del(orion.inumber() + "/$nodeid", "X3 Standard");
		} catch (ex) { }

		orion.logout();
	};
	
	var main =
	function() {

		refresh();
	};

	sol.runThread(working, main);
}

function onLogin() {
	
	var loggedoutIname = this.document.getElementById("loggedoutIname");
	var loggedoutPassword = this.document.getElementById("loggedoutPassword");
	var stayInvisible = this.document.getElementById("stayInvisible");

	var working =
	function() {

		orion.login(loggedoutIname.value, loggedoutPassword.value);
		
		if (! stayInvisible.checked)
			sirius.set(orion.inumber() + "/$nodeid/'" + vega.nodeId() + "'", null);
	};

	var main =
	function() {

		refresh();
	};

	sol.runThread(working, main);
}

function onLoggedoutKeyPress(event) {
	
	if (event.keyCode == KeyEvent.DOM_VK_RETURN) onLogin();
}