var sound;

function initSound() {

	sound = { };

	var soundService = Components.classes["@mozilla.org/sound;1"].getService(Components.interfaces.nsISound);
	var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

	soundService.init();

	var keyUri = ioService.newURI("chrome://crossinglight/content/sound/key.wav", null, null);
	var enterUri = ioService.newURI("chrome://crossinglight/content/sound/enter.wav", null, null);

	sound.key = function() { 

		soundService.play(keyUri);
	}

	sound.enter = function() { 

		soundService.play(enterUri);
	}
}
