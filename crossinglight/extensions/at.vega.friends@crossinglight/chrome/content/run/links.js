try {
	var graph = JSON.parse(sirius.get("+(" + uri + ")/$public+links", null));
	if (! graph.subjects[0]) {
		println("No links found.");
	} else {
		var predicates = graph.subjects[0].predicates;
		println("------------------------------------");
		for (var i in predicates) {
			var innerGraph = predicates[i].graph;
			var innerSubjects = innerGraph.subjects;
			for (var ii in innerSubjects) {
				println(">>> BY " + innerSubjects[ii].xri);
				var innerPredicates = innerSubjects[ii].predicates;
				for (var iii in innerPredicates) {
					var innerReferences = innerPredicates[iii].references;
					for (var iiii in innerReferences) {
						println(innerPredicates[iii].xri + " --> " + innerReferences[iiii]);
					}
				}
			}
		}
		println("------------------------------------");
	}
} catch (ex) {
	println(ex);
}
