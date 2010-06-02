var vega = Components.classes["@crossinglight/vega;1"].getService(Components.interfaces.nsIVega);

function luna(window, document) {
	
	this.pulses = document.getElementById("pulses");

	var luna = this;
	
	this.newPulse =
	function(packet) {

		var data = { };
		data.packet = packet;
		if (packet.id == vega.nodeId())
			data.color = 1;
		else
			data.color = 2;
		
		var event = this.pulses.contentWindow.document.createEvent("MessageEvent");
		event.initMessageEvent("newpulse", false, false, JSON.stringify(data), null, null, null);
		this.pulses.contentWindow.dispatchEvent(event);
	};
}