var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var orion = Components.classes["@crossinglight/orion;1"].getService(Components.interfaces.nsIOrion);
var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);
var sirius = Components.classes["@crossinglight/sirius;1"].getService(Components.interfaces.nsISirius);
var polaris = Components.classes["@crossinglight/polaris;1"].getService(Components.interfaces.nsIPolaris);

var friendsBox;
var addFriendTextbox;

function addFriendRow(friend) {
	
	var row = document.createElement("row");
	row.setAttribute("align", "center");
	var box1 = document.createElement("box");
	box1.setAttribute("align", "center");
	var description = document.createElement("description");
	description.setAttribute("value", friend);
	var box2 = document.createElement("box");
	box2.setAttribute("align", "center");
	var deleteButton = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
	deleteButton.friend = friend;
	deleteButton.setAttribute("href", "#");
	deleteButton.appendChild(document.createTextNode("Delete"));
	deleteButton.onclick = function() { onDeleteFriend(this.friend); };
	var pingButton = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
	pingButton.friend = friend;
	pingButton.setAttribute("href", "#");
	pingButton.appendChild(document.createTextNode("Ping"));
	pingButton.onclick = function() { onPingFriend(this.friend); };
	var inviteChatButton = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
	inviteChatButton.friend = friend;
	inviteChatButton.setAttribute("href", "#");
	inviteChatButton.appendChild(document.createTextNode("Invite to Chat"));
	inviteChatButton.onclick = function() { onInviteChatFriend(this.friend); };

	friendsBox.appendChild(row);
	row.appendChild(box1);
	box1.appendChild(description);
	row.appendChild(box2);
	box2.appendChild(deleteButton);
	box2.appendChild(pingButton);
	box2.appendChild(inviteChatButton);
}

function refresh() {

	if (sol.runlevel() < 3) {
		
		debug.messageString("Need to be connected and logged in.");
		sol.closeRay();
		return;
	}

	var friends;

	var working =
	function() {
		
		friends = polaris.getReferences(orion.inumber() + "/+friend", { });
	}
	
	var main =
	function() {
		
		while(friendsBox.hasChildNodes()) friendsBox.removeChild(friendsBox.firstChild);
		
		for (i in friends) {
			
			addFriendRow(friends[i]);
		}
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

	friendsBox = this.document.getElementById("friendsBox");
	addFriendTextbox = this.document.getElementById("addFriendTextbox");

	sol.setStatus("Your Friends.");
	refresh();
}

function onUnload() {

}

function onRun(event) {

	var data = eval(event.data);

	try {

		eval(data.script);
	} catch (ex) {

		Components.utils.reportError(ex);
	}
}

function onAddFriend() {
	
	var friend = addFriendTextbox.value;

	var working =
	function() {
	
		polaris.add(orion.inumber() + "/+friend/" + friend, null);
	}

	var main =
	function() {
	
		refresh();
	}

	sol.runThread(working, main);
}

function onRefresh() {
	
	refresh();
}

function onDeleteFriend(friend) {
	
	var working =
	function() {
	
		polaris.del(orion.inumber() + "/+friend/" + friend, null);
	}

	var main =
	function() {
	
		refresh();
	}

	sol.runThread(working, main);
}

function onPingFriend(friend) {
	
	var working =
	function() {

		var inumber;
		var nodeid;

		if (friend.indexOf("=!") == 0 || friend.indexOf("@!") == 0) {

			inumber = friend;
			nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		} else if (friend.indexOf("=") == 0 || friend.indexOf("@") == 0) {
			
			inumber = orion.resolve(friend);
			nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		} else {
			
			nodeid = friend;
		}
		
		if (nodeid == null) {
	
			throw "Cannot find " + friend + " !";
		} else {
		
			vega.send(nodeid, "@vega", "*hello", "1", null);
		}
	}
	
	sol.runThread(working);
}

function onInviteChatFriend(friend) {
	
	var inumber;
	var nodeid;

	var working =
	function() {

		if (friend.indexOf("=!") == 0 || friend.indexOf("@!") == 0) {

			inumber = friend;
			nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		} else if (friend.indexOf("=") == 0 || friend.indexOf("@") == 0) {

			inumber = orion.resolve(friend);
			nodeid = sirius.getLiteral(inumber + "/$nodeid", null);
		} else {

			nodeid = friend;
		}

		if (nodeid == null) {

			throw "Cannot find " + friend + " !";
		} else {

			var extension = { };
			extension.focus = true;
			extension.singleton = false;
			extension.query = "iname=" + encodeURIComponent(orion.iname()) + "&nodeid=" + encodeURIComponent(vega.nodeId());
			
			vega.send(nodeid, "@vega", "@vega*chat", 2, JSON.stringify(extension));
		}
	}
	
	var main =
	function() {

		sol.openRay("@vega*chat", true, false, "iname=" + encodeURIComponent(friend) + "&nodeid=" + encodeURIComponent(nodeid));
	}

	sol.runThread(working, main);
}
