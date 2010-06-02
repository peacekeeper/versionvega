var graph = JSON.parse(sirius.get("+(" + encodeURIComponent(uri) + ")/$public+links", "X3J"));

if (! graph["+(" + encodeURIComponent(uri) + ")"]) {

	println("No links found.");
} else {
	
	var subjects = graph["+(" + encodeURIComponent(uri) + ")"]["$public+links"];

	println("------------------------------------");
	
	for (var i in subjects) {
	
		println(">>> BY " + i);
		
		var predicates = subjects[i];
		
		for (var ii in predicates) {
		
			for (var iii in predicates[ii]) {

				println(ii + " --> " + decodeURIComponent(predicates[ii][iii]));
			}
		}
	}

	println("------------------------------------");
}
