var versionVega = Components.classes["@crossinglight/versionvega;1"].getService(Components.interfaces.nsIVersionVega);
var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

function sol(window, document) {
	
	this.window = window;
	this.document = document;
	
	this.rayicons = document.getElementById("rayicons");
	this.taskicons = document.getElementById("taskicons");
	this.appcontent = document.getElementById("appcontent");
	this.statusbardisplay = document.getElementById("statusbar-display");
	this.input = document.getElementById("input");
	this.fountain = document.getElementById("fountain");
	this.rays = [ ];
	this.rayindex = 0;
	this.historylines = [ ];
	this.historyindex = [ ];
	this.availableWorkingThreads = [ ];
	this.queuedWorkingsAndMainsAndErrors = [ ];

	var sol = this;

	/*
	 * Thread support.
	 */

	for (var i=0; i<prefs.getIntPref("sol.workingthreads"); i++) {

		this.availableWorkingThreads[i] = Components.classes["@mozilla.org/thread-manager;1"].getService().newThread(0);
		versionVega.provisionThread(this.availableWorkingThreads[i]);
	}

	this.manageThreads =
	function() {

		// the main thread will select queued workings for execution in an available working thread

		if (! Components.classes["@mozilla.org/thread-manager;1"].getService().isMainThread) return;
		if (this.availableWorkingThreads.length <= 0) return;
		if (this.queuedWorkingsAndMainsAndErrors.length <= 0) return;

		var workingThread = this.availableWorkingThreads.pop();
		var workingAndMainAndError = this.queuedWorkingsAndMainsAndErrors.pop();
		var working = workingAndMainAndError[0];
		var main = workingAndMainAndError[1];
		var error = workingAndMainAndError[2];

		var mainThread = Components.classes["@mozilla.org/thread-manager;1"].getService().mainThread;

		// prepare the main and error and working runnables

		var mainRunnable = function() { }

		mainRunnable.prototype = {
			run: function() {
				sol.taskicons.removeChild(sol.taskicons.lastChild);
				sol.availableWorkingThreads.push(workingThread);
				sol.manageThreads();
				try {
					if (typeof(main) == "function") main();
				} catch(ex) { Components.utils.reportError(ex); }
			},
			QueryInterface: function(iid) {
				if (iid.equals(Components.interfaces.nsIRunnable) || iid.equals(Components.interfaces.nsISupports)) return this;
				throw Components.results.NS_ERROR_NO_INTERFACE;
			}
		};

		var errorRunnable = function(ex) { this.ex = ex; }

		errorRunnable.prototype = {
			run: function() {
				sol.taskicons.removeChild(sol.taskicons.lastChild);
				sol.availableWorkingThreads.push(workingThread);
				sol.manageThreads();
				try {
					if (typeof(error) == "function") error(this.ex);
					else debug.messageString(this.ex);
				} catch(ex) { Components.utils.reportError(ex); }
			},
			QueryInterface: function(iid) {
				if (iid.equals(Components.interfaces.nsIRunnable) || iid.equals(Components.interfaces.nsISupports)) return this;
				throw Components.results.NS_ERROR_NO_INTERFACE;
			}
		};

		var workingRunnable = function() { }

		workingRunnable.prototype = {
			run: function() {
				try {
					working();
					mainThread.dispatch(new mainRunnable(), mainThread.DISPATCH_NORMAL);
				} catch(ex) { 
					mainThread.dispatch(new errorRunnable(ex), mainThread.DISPATCH_NORMAL);
				}
			},
			QueryInterface: function(iid) {
				if (iid.equals(Components.interfaces.nsIRunnable) || iid.equals(Components.interfaces.nsISupports)) return this;
				throw Components.results.NS_ERROR_NO_INTERFACE;
			}
		};

		// set up and add the task's icon

		var icon = document.createElement("cl-taskicon");
		sol.taskicons.removeChild(sol.taskicons.firstChild);
		sol.taskicons.appendChild(icon);

		// execute worker thread

		setTimeout(function() {
			workingThread.dispatch(new workingRunnable(), workingThread.DISPATCH_NORMAL);
		}, 0);
	};

	this.runThread =
	function(working, main, error) {

		// the main thread can queue new workings

		if (! Components.classes["@mozilla.org/thread-manager;1"].getService().isMainThread) return;

		// set up and add a queued icon

		var icon = document.createElement("cl-taskqueuedicon");
		if (typeof(sol.taskicons.firstChild) != "undefined")
			sol.taskicons.insertBefore(icon, sol.taskicons.firstChild);
		else
			sol.taskicons.appendChild(icon);

		// queue the new working and see if we can run it right away

		this.queuedWorkingsAndMainsAndErrors.push([ working, main, error ]);
		this.manageThreads();
	};

	/*
	 * Functions for managing rays.
	 */
	
	this.currentRay =
	function() {
		
		return(sol.rays[sol.rayindex]);
	};

	this.openRay =
	function(xri, focus, singleton, query) {

		// if singleton is requested, see if we have that ray already
		
		if (singleton) {
		
			for (var i=0; i<sol.rays.length; i++) {

				if (sol.rays[i].xri == xri) {

					sol.focusRay(i);
					return;
				}
			}
		}
		
		// map the XRI to a chrome URI
		
		if (xri.indexOf("?") != -1) {
			
			query = xri.substring(xri.indexOf("?") + 1);
			xri = xri.substring(0, xri.indexOf("?"));
		}
		
		var src = 
			"chrome://" + 
			code.xriToChromeUri(xri) +
			"/content/ray.xul" +
			(query ? "?" + query : "");
		
		if (! net.exists(src)) return;

		// set up the ray

		var ray = document.createElement("browser");
		ray.setAttribute("src", src);
		ray.setAttribute("type", "content");
		ray.xri = xri;
		ray.src = src;
		ray.status = "";
		ray.addEventListener("load", function() { 

			ray.contentWindow.wrappedJSObject.debug = debug;
			ray.contentWindow.wrappedJSObject.net = net;
			ray.contentWindow.wrappedJSObject.code = code;
			ray.contentWindow.wrappedJSObject.sol = sol;
		}, true);

		// set up the ray's icon

		var icon = document.createElement("cl-rayicon");
		icon.setAttribute("value", xri);
		icon.setAttribute("alt", xri);
		icon.setAttribute("context", "raypopup");
		icon.index = sol.rays.length;
		icon.activesrc = "chrome://crossinglight/skin/images/rayactive.png";
		icon.inactivesrc = "chrome://crossinglight/skin/images/rayinactive.png";
		icon.onclick = function() { sol.focusRay(icon.index); };

		// set up the ray's history

		sol.historylines[sol.rays.length] = [ "" ];
		sol.historyindex[sol.rays.length] = 0;

		// add the ray and the ray's icon

		sol.rays.push(ray);
		sol.appcontent.appendChild(ray);

		if (focus) {

			sol.appcontent.selectedPanel = ray;
			icon.setAttribute("src", icon.activesrc);
			
			if (sol.rayicons.childNodes.length > 0) sol.rayicons.childNodes[sol.rayindex].src = sol.rayicons.childNodes[sol.rayindex].inactivesrc;
			sol.rayindex = sol.rays.length - 1;
		} else {

			icon.setAttribute("src", icon.inactivesrc);
		}

		sol.rayicons.appendChild(icon);

		// subscribe to the ray so we receive its packets
		
		try {
		
			vega.subscribeRay("crossinglight", xri);
		} catch (ex) {
			
			Components.utils.reportError(ex);
		}
		
		// done

		sol.input.focus();
		return(ray);
	};

	this.openDefaultRay =
	function(focus, singleton, query) {

		sol.openRay(prefs.getCharPref("sol.init.xri"), focus, singleton, query);
	};

	this.openRunlevelRay =
	function(focus, singleton, query) {

		sol.openRay(prefs.getCharPref("sol.runlevel.xri"), focus, singleton, query);
	};

	this.closeRay =
	function(evenFirstRay) {

		// can't close the first ray
		
		if (sol.rayindex == 0 && (! evenFirstRay)) return;

		// unsubscribe from the ray so we don't receive its packets
		
		vega.unsubscribeRay("crossinglight", sol.rays[sol.rayindex].xri);

		// remove the ray and ray's icon
		
		sol.rays.splice(sol.rayindex, 1);
		sol.appcontent.removeChild(sol.appcontent.childNodes[sol.rayindex]);
		sol.rayicons.removeChild(sol.rayicons.childNodes[sol.rayindex]);

		for (var i=sol.rayindex; i<sol.rayicons.childNodes.length; i++) sol.rayicons.childNodes[i].index--;

		if (sol.rayindex >= sol.rays.length) sol.rayindex--;
		if (sol.rayindex < 0) sol.rayindex = 0;

		if (sol.rayicons.childNodes.length > 0) {
		
			sol.appcontent.selectedIndex = sol.rayindex;
			sol.rayicons.childNodes[sol.rayindex].src = sol.rayicons.childNodes[sol.rayindex].activesrc;
			this.setStatus(sol.rays[sol.rayindex].status);
		}

		sol.input.focus();
	};

	this.closeRays =
	function(evenFirstRay) {
		
		while (sol.rays.length > 0) {

			this.focusRay(sol.rays.length - 1);
			this.closeRay(evenFirstRay);
		}
	};
	
	this.cycleRay =
	function() {

		if (sol.rays.length == 0) return;

		sol.rayicons.childNodes[sol.rayindex].src = sol.rayicons.childNodes[sol.rayindex].inactivesrc;

		sol.rayindex++;
		if (sol.rayindex >= sol.rays.length) sol.rayindex = 0;
		sol.appcontent.selectedIndex = sol.rayindex;

		sol.rayicons.childNodes[sol.rayindex].src = sol.rayicons.childNodes[sol.rayindex].activesrc;

		if (sol.historylines[sol.rayindex][sol.historyindex[sol.rayindex]])
			sol.input.value = sol.historylines[rayindex][sol.historyindex[sol.rayindex]];
		else
			sol.input.value = "";

		this.setStatus(sol.rays[sol.rayindex].status);
		sol.input.focus();
	};

	this.cycleRayBack =
	function() {

		if (sol.rays.length == 0) return;

		sol.rayicons.childNodes[sol.rayindex].src = sol.rayicons.childNodes[sol.rayindex].inactivesrc;

		sol.rayindex--;
		if (sol.rayindex < 0) sol.rayindex = sol.rays.length - 1;
		sol.appcontent.selectedIndex = sol.rayindex;

		sol.rayicons.childNodes[sol.rayindex].src = sol.rayicons.childNodes[sol.rayindex].activesrc;

		if (sol.historylines[sol.rayindex][sol.historyindex[sol.rayindex]])
			sol.input.value = sol.historylines[sol.rayindex][sol.historyindex[sol.rayindex]];
		else
			sol.input.value = "";

		this.setStatus(sol.rays[sol.rayindex].status);
		sol.input.focus();
	};

	this.focusRay =
	function(index) {

		if (sol.rays.length == 0) return;
		if (index < 0 || index > sol.rays.length - 1) return;
		if (index == sol.rayindex) return;

		sol.rayicons.childNodes[sol.rayindex].src = sol.rayicons.childNodes[sol.rayindex].inactivesrc;

		sol.rayindex = index;
		sol.appcontent.selectedIndex = index;

		sol.rayicons.childNodes[sol.rayindex].src = sol.rayicons.childNodes[sol.rayindex].activesrc;

		if (sol.historylines[sol.rayindex][sol.historyindex[sol.rayindex]])
			sol.input.value = sol.historylines[sol.rayindex][sol.historyindex[sol.rayindex]];
		else
			sol.input.value = "";

		this.setStatus(sol.rays[sol.rayindex].status);
		sol.input.focus();
	};
	
	/*
	 * Functions for managing line history.
	 */

	this.historyPrev =
	function() {

		if (sol.historyindex[sol.rayindex] > 0) {

			sol.historyindex[sol.rayindex]--;
			sol.input.value = sol.historylines[sol.rayindex][sol.historyindex[sol.rayindex]];
		}
	};

	this.historyNext =
	function() {

		if (sol.historyindex[sol.rayindex] < sol.historylines[sol.rayindex].length - 1) {

			sol.historyindex[sol.rayindex]++;
			sol.input.value = sol.historylines[sol.rayindex][sol.historyindex[sol.rayindex]];
		}
	};

	this.historyAppend =
	function(line) {

		sol.historylines[sol.rayindex][sol.historylines[sol.rayindex].length - 1] = line;
		sol.historyindex[sol.rayindex] = sol.historylines[sol.rayindex].length;
		sol.historylines[sol.rayindex][sol.historylines[sol.rayindex].length] = "";
		while (sol.historyindex[sol.rayindex] > prefs.getIntPref("sol.history.size")) { sol.historylines[sol.rayindex].shift(); sol.historyindex[sol.rayindex]--; }
	};

	/*
	 * Functions for managing status.
	 */
	
	this.client =
	function() {
		
		return "crossinglight";
	}
	
	this.setStatus =
	function(text) {

		var ray = sol.currentRay();

		ray.status = text;
		if (ray == sol.rays[sol.rayindex]) sol.statusbardisplay.label = text;
	};

	this.runlevel =
	function() {
		
		try {
			
			if (vega.connected())
				if (orion.loggedin())
					return 3;
				else
					return 2;
			else
				return 1;
		} catch (ex) {
	
			return 0;
		}
	};

	this.checkRunlevel =
	function() {
		
		if (this.runlevel() != 3) {
			
			var message = "Your node runlevel is currently " + this.runlevel() + ". This means that you are not yet fully connected and identified. Click OK to fix this.";
			var title = "Node Runlevel";
			var buttons = ["OK.", "Cancel."];

			if (debug.messageString(message, title, buttons) == 0) {
				
				this.openRunlevelRay(true, true);
			}
		}
	};

	this.setAutoFountainColor =
	function() {

		var data = { };
		data.color = sol.runlevel();

		var event = this.fountain.contentWindow.document.createEvent("MessageEvent");
		event.initMessageEvent("color", false, false, JSON.stringify(data), null, null, null);
		this.fountain.contentWindow.dispatchEvent(event);
	};

	/*
	 * Functions for dispatching events to rays.
	 */
	
	this.dispatchBeforeRun =
	function(line, ray) {

		var data = { };
		data.line = line;
	
		var event = ray.contentWindow.document.createEvent("MessageEvent");
		event.initMessageEvent("beforerun", false, false, JSON.stringify(data), null, null, null);
		ray.contentWindow.dispatchEvent(event);
	};

	this.dispatchRun =
	function(script, ray) {

		var data = { };
		data.script = script;

		var event = ray.contentWindow.document.createEvent("MessageEvent");
		event.initMessageEvent("run", false, false, JSON.stringify(data), null, null, null);
		ray.contentWindow.dispatchEvent(event);
	};

	this.dispatchAfterRun =
	function(line, ray) {

		var data = { };
		data.line = line;
	
		var event = ray.contentWindow.document.createEvent("MessageEvent");
		event.initMessageEvent("afterrun", false, false, JSON.stringify(data), null, null, null);
		ray.contentWindow.dispatchEvent(event);
	};
	
	this.dispatchPacket =
	function(packet) {
	
		for (index in sol.rays) {
	
			var ray = sol.rays[index];
			if (ray.xri != packet.ray) continue;
		
			var data = { };
			data.packet = packet;
	
			var event = ray.contentWindow.document.createEvent("MessageEvent");
			event.initMessageEvent("packet", false, false, JSON.stringify(data), null, null, null);
			ray.contentWindow.dispatchEvent(event);
		}
	};
	
	this.dispatchPacketAsRun =
	function(packet) {

		for (index in sol.rays) {

			var ray = sol.rays[index];
			if (ray.xri != packet.ray) continue;

			var data = { };
			data.script = packet.content;

			var event = ray.contentWindow.document.createEvent("MessageEvent");
			event.initMessageEvent("run", false, false, JSON.stringify(data), null, null, null);
			ray.contentWindow.dispatchEvent(event);
		}
	};
}
