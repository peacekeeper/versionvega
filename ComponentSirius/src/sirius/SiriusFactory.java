package sirius;

import org.eclipse.higgins.xdi4j.Graph;
import org.eclipse.higgins.xdi4j.messaging.client.local.XDILocalClient;

import sirius.graph.VegaGraphFactory;
import vega.Vega;

public class SiriusFactory {

	private static Vega vega = null;
	private static Sirius sirius = null;

	private static Throwable ex;

	private SiriusFactory() { }

	public static Sirius getSirius(Object vega) {

		if (sirius != null) return(sirius);

		SiriusFactory.vega = (Vega) vega;

		try {

			// create the XDI client

			VegaGraphFactory graphFactory = new VegaGraphFactory();
			graphFactory.setVega((Vega) vega);

			Graph graph = graphFactory.openGraph();
			XDILocalClient client = new XDILocalClient(graph);

			// make Sirius

			sirius = new SiriusImpl((Vega) vega, client);

			// done

			return(sirius);
		} catch (Throwable ex) {

			SiriusFactory.ex = ex;
			return(null);
		}
	}

	public static Throwable getException() {

		return(ex);
	}

	public static Vega getVega() {

		return(vega);
	}
}
