var working =
function() {

	var data = edit.value;
	data = orion.encrypt(data, args[0]);
	edit.value = data;
};

var main =
function() {
	
	sol.setStatus("Encrypted " + address);
};

sol.runThread(working, main);
