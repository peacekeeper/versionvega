var working =
function() {

	sirius.set("[" + address + "[$text$value[\"" + code.encode64(edit.value) + "\"]]]", null);
	sirius.set("[" + address + "[$public+reply[]]]", null);
};

var main =
function() {
	
	sol.setStatus("Saved " + address);
};

sol.runThread(working, main);
