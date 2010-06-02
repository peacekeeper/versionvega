package sirius.graph;

import org.eclipse.higgins.xdi4j.Graph;
import org.eclipse.higgins.xdi4j.GraphFactory;
import org.eclipse.higgins.xdi4j.impl.keyvalue.KeyValueGraph;
import org.eclipse.higgins.xdi4j.impl.keyvalue.KeyValueStore;

import vega.Vega;

public class VegaGraphFactory implements GraphFactory {

	private Vega vega;

	public Graph openGraph() {

		// create new graph

		KeyValueStore keyValueStore = new VegaKeyValueStore(this.vega);
		KeyValueGraph graph = new KeyValueGraph(null, null, keyValueStore, "", false, false, false);

		return(graph);
	}

	public Vega getVega() {
		
		return this.vega;
	}

	public void setVega(Vega vega) {

		this.vega = vega;
	}
}
