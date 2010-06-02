if (orion.loggedin()) {

	var working =
	function() {
		
		sirius.del(orion.inumber() + "/$nodeid", "X3 Standard");
		orion.logout();
	};
	
	var main =
	function() {

		println("Logged out.");
	};

	sol.runThread(working, main);
} else {
	
	println("Already logged out.");
}
