var net;

function initNet() {

	net = { };
	
	var xrdCache = { };
	
	net.localUrl = 
	function(content) {

		var dataURI = "data:application/vnd.mozilla.xul+xml," + encodeURIComponent(content);
		return(dataURI);
	} 

	net.exists = 
	function(url) {

		try {

			var request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);  
			request.open("GET", url, false, null);
			request.overrideMimeType("text/plain");
			request.send(null);
			return(true);
		} catch (ex) {
			
			return(false);
		}
	}
	
	net.httpGet = 
	function(url, headers) {
		
		var request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);  
		request.open("GET", url, false, null);
		if (headers) for (header in headers) request.setRequestHeader(header, headers[header]);
		request.overrideMimeType("text/plain");
		request.send(null);
		if (url.indexOf("chrome://") != 0 && request.status != 200) throw request.statusText;

		return(request.responseText);
	}

	net.httpPost = 
	function(url, headers, body) {
	
		var request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);  
		request.open("POST", url, false, null);
		if (headers) for (header in headers) request.setRequestHeader(header, headers[header]);
		request.overrideMimeType("text/plain");
		request.send(body);
		if (request.status != 200) throw request.statusText;
	
		return(request.responseText);
	}

	net.isXriAbsolute = 
	function(xri) {
	
		if (xri.charAt(0) == "=") return(true);
		if (xri.charAt(0) == "@") return(true);
		if (xri.charAt(0) == "+") return(true);
		if (xri.charAt(0) == "$") return(true);
		
		return(false);
	}
	
	net.isXriRelative = 
	function(xri) {
	
		if (xri.charAt(0) == "*") return(true);
		if (xri.charAt(0) == "!") return(true);
		
		return(false);
	}
	
	net.isXri = 
	function(xri) {
	
		return(net.isXriAbsolute(xri) || net.isXriRelative(xri));
	}
	
	net.queryParams =
	function(query) {

		var params = {};
		if (query.length == 0) return params;

		var args = query.replace(/\+/g, " ").split('&');

		for (var i=0; i<args.length; i++) {

			var pair = args[i].split("=");
			var name = decodeURIComponent(pair[0]);

			var value = (pair.length==2) ? decodeURIComponent(pair[1]) : name;
			params[name] = value;
		}

		return params;
	}
}
