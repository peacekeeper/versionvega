package polaris;

import java.io.StringReader;
import java.net.URL;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.higgins.xdi4j.Graph;
import org.eclipse.higgins.xdi4j.GraphComponent;
import org.eclipse.higgins.xdi4j.Literal;
import org.eclipse.higgins.xdi4j.Reference;
import org.eclipse.higgins.xdi4j.impl.memory.MemoryGraphFactory;
import org.eclipse.higgins.xdi4j.io.XDIReader;
import org.eclipse.higgins.xdi4j.io.XDIReaderRegistry;
import org.eclipse.higgins.xdi4j.messaging.Message;
import org.eclipse.higgins.xdi4j.messaging.MessageEnvelope;
import org.eclipse.higgins.xdi4j.messaging.MessageResult;
import org.eclipse.higgins.xdi4j.messaging.Operation;
import org.eclipse.higgins.xdi4j.messaging.client.http.XDIHttpClient;
import org.eclipse.higgins.xdi4j.xri3.impl.XRI3Segment;

import orion.Orion;

public class PolarisImpl implements Polaris {

	private static Log log = LogFactory.getLog(PolarisImpl.class);

	private Orion orion;
	private XDIHttpClient client;

	PolarisImpl(Orion orion, XDIHttpClient client) {

		this.orion = orion;
		this.client = client;
	}

	public void init() {

	}

	public void shutdown() {

	}

	/*
	 * Actions
	 */

	public String get(String data, String format) throws Exception {

		log.debug("get(" + data + "," + format + ")");

		if (! "1".equals(this.orion.loggedin())) throw new RuntimeException("Not signed in.");

		XDIReader reader = XDIReaderRegistry.getAuto();
		Graph graph = null;

		if (data != null) {

			graph = MemoryGraphFactory.getInstance().openGraph();
			reader.read(graph, data, null);
		}

		MessageEnvelope messageEnvelope = MessageEnvelope.newInstance();
		Message message = messageEnvelope.newMessage(new XRI3Segment(this.orion.inumber()));
		message.getSubject().createStatement(new XRI3Segment("$is$a"), new XRI3Segment("" + this.orion.inumber().charAt(0)));
		Operation operation = message.createGetOperation();
		if (graph != null) operation.createOperationGraph(graph);
		MessageResult messageResult;

		this.client.setUrl(new URL(this.orion.xdiUri()));
		messageResult = this.client.send(messageEnvelope, null);
		if (messageResult == null) throw new RuntimeException("No result");
		log.debug(messageResult.getGraph().toString());

		if (format == null) format = "X3J";

		return(messageResult.getGraph().toString(format, null));
	}

	public String add(String data, String format) throws Exception {

		log.debug("add(" + data + "," + format + ")");

		if (! "1".equals(this.orion.loggedin())) throw new RuntimeException("Not signed in.");

		XDIReader reader = XDIReaderRegistry.getAuto();
		Graph graph = null;

		if (data != null) {

			graph = MemoryGraphFactory.getInstance().openGraph();
			reader.read(graph, data, null);
		}

		MessageEnvelope messageEnvelope = MessageEnvelope.newInstance();
		Message message = messageEnvelope.newMessage(new XRI3Segment(this.orion.inumber()));
		message.getSubject().createStatement(new XRI3Segment("$is$a"), new XRI3Segment("" + this.orion.inumber().charAt(0)));
		Operation operation = message.createAddOperation();
		if (graph != null) operation.createOperationGraph(graph);
		MessageResult messageResult;

		this.client.setUrl(new URL(this.orion.xdiUri()));
		messageResult = this.client.send(messageEnvelope, null);
		if (messageResult == null) throw new RuntimeException("No result");
		log.debug(messageResult.getGraph().toString());

		if (format == null) format = "X3J";

		return(messageResult.getGraph().toString(format, null));
	}

	public String mod(String data, String format) throws Exception {

		log.debug("mod(" + data + "," + format + ")");

		if (! "1".equals(this.orion.loggedin())) throw new RuntimeException("Not signed in.");

		XDIReader reader = XDIReaderRegistry.getAuto();
		Graph graph = null;

		if (data != null) {

			graph = MemoryGraphFactory.getInstance().openGraph();
			reader.read(graph, data, null);
		}

		MessageEnvelope messageEnvelope = MessageEnvelope.newInstance();
		Message message = messageEnvelope.newMessage(new XRI3Segment(this.orion.inumber()));
		message.getSubject().createStatement(new XRI3Segment("$is$a"), new XRI3Segment("" + this.orion.inumber().charAt(0)));
		Operation operation = message.createModOperation();
		if (graph != null) operation.createOperationGraph(graph);
		MessageResult messageResult;

		this.client.setUrl(new URL(this.orion.xdiUri()));
		messageResult = this.client.send(messageEnvelope, null);
		if (messageResult == null) throw new RuntimeException("No result");
		log.debug(messageResult.getGraph().toString());

		if (format == null) format = "X3J";

		return(messageResult.getGraph().toString(format, null));
	}

	public String set(String data, String format) throws Exception {

		log.debug("set(" + data + "," + format + ")");

		if (! "1".equals(this.orion.loggedin())) throw new RuntimeException("Not signed in.");

		XDIReader reader = XDIReaderRegistry.getAuto();
		Graph graph = null;

		if (data != null) {

			graph = MemoryGraphFactory.getInstance().openGraph();
			reader.read(graph, data, null);
		}

		MessageEnvelope messageEnvelope = MessageEnvelope.newInstance();
		Message message = messageEnvelope.newMessage(new XRI3Segment(this.orion.inumber()));
		message.getSubject().createStatement(new XRI3Segment("$is$a"), new XRI3Segment("" + this.orion.inumber().charAt(0)));
		Operation operation = message.createSetOperation();
		if (graph != null) operation.createOperationGraph(graph);
		MessageResult messageResult;

		this.client.setUrl(new URL(this.orion.xdiUri()));
		messageResult = this.client.send(messageEnvelope, null);
		if (messageResult == null) throw new RuntimeException("No result");
		log.debug(messageResult.getGraph().toString());

		if (format == null) format = "X3J";

		return(messageResult.getGraph().toString(format, null));
	}

	public String del(String data, String format) throws Exception {

		log.debug("del(" + data + "," + format + ")");

		if (! "1".equals(this.orion.loggedin())) throw new RuntimeException("Not signed in.");

		XDIReader reader = XDIReaderRegistry.getAuto();
		Graph graph = null;

		if (data != null) {

			graph = MemoryGraphFactory.getInstance().openGraph();
			reader.read(graph, data, null);
		}

		MessageEnvelope messageEnvelope = MessageEnvelope.newInstance();
		Message message = messageEnvelope.newMessage(new XRI3Segment(this.orion.inumber()));
		message.getSubject().createStatement(new XRI3Segment("$is$a"), new XRI3Segment("" + this.orion.inumber().charAt(0)));
		Operation operation = message.createDelOperation();
		if (graph != null) operation.createOperationGraph(graph);
		MessageResult messageResult;

		this.client.setUrl(new URL(this.orion.xdiUri()));
		messageResult = this.client.send(messageEnvelope, null);
		if (messageResult == null) throw new RuntimeException("No result");
		log.debug(messageResult.getGraph().toString());

		if (format == null) format = "X3J";

		return(messageResult.getGraph().toString(format, null));
	}

	public String[] getLiterals(String data) throws Exception {

		log.debug("getLiterals(" + data + ")");

		if (! "1".equals(this.orion.loggedin())) throw new RuntimeException("Not signed in.");

		XDIReader reader = XDIReaderRegistry.getAuto();
		Graph graph = null;

		if (data != null) {

			graph = MemoryGraphFactory.getInstance().openGraph();
			reader.read(graph, data, null);
		}

		MessageEnvelope messageEnvelope = MessageEnvelope.newInstance();
		Message message = messageEnvelope.newMessage(new XRI3Segment(this.orion.inumber()));
		message.getSubject().createStatement(new XRI3Segment("$is$a"), new XRI3Segment("" + this.orion.inumber().charAt(0)));
		Operation operation = message.createGetOperation();
		if (graph != null) operation.createOperationGraph(graph);
		MessageResult messageResult;

		this.client.setUrl(new URL(this.orion.xdiUri()));
		messageResult = this.client.send(messageEnvelope, null);
		if (messageResult == null) throw new RuntimeException("No result");
		log.debug(messageResult.getGraph().toString());

		List<String> literals = new Vector<String> ();
		for (Iterator<GraphComponent> i = messageResult.getGraph().getGraphComponents(true, Literal.class); i.hasNext(); ) literals.add(((Literal) i.next()).getData());

		return(literals.toArray(new String[literals.size()]));
	}

	public String getLiteral(String xri) throws Exception {

		log.debug("getLiteral(" + xri + ")");

		String[] literals = this.getLiterals(xri);
		if (literals == null || literals.length < 1) return(null);

		return(literals[0]);
	}

	public String[] getReferences(String data) throws Exception {

		log.debug("getReferences(" + data + ")");

		if (! "1".equals(this.orion.loggedin())) throw new RuntimeException("Not signed in.");

		XDIReader reader = XDIReaderRegistry.getAuto();
		Graph graph = null;

		if (data != null) {

			graph = MemoryGraphFactory.getInstance().openGraph();
			reader.read(graph, data, null);
		}

		MessageEnvelope messageEnvelope = MessageEnvelope.newInstance();
		Message message = messageEnvelope.newMessage(new XRI3Segment(this.orion.inumber()));
		message.getSubject().createStatement(new XRI3Segment("$is$a"), new XRI3Segment("" + this.orion.inumber().charAt(0)));
		Operation operation = message.createGetOperation();
		if (graph != null) operation.createOperationGraph(graph);
		MessageResult messageResult;

		this.client.setUrl(new URL(this.orion.xdiUri()));
		messageResult = this.client.send(messageEnvelope, null);
		if (messageResult == null) throw new RuntimeException("No result");
		log.debug(messageResult.getGraph().toString());

		List<String> references = new Vector<String> ();
		for (Iterator<GraphComponent> i = messageResult.getGraph().getGraphComponents(true, Reference.class); i.hasNext(); ) references.add(((Reference) i.next()).getReferenceXri().toString());

		return(references.toArray(new String[references.size()]));
	}

	public String getReference(String xri) throws Exception {

		log.debug("getReference(" + xri + ")");

		String[] references = this.getReferences(xri);
		if (references == null) return(null);

		return(references[0]);
	}

	public String execute(String message, String format) throws Exception {

		log.debug("execute(" + message + "," + format + ")");

		if (! "1".equals(this.orion.loggedin())) throw new RuntimeException("Not signed in.");

		Graph graph = MemoryGraphFactory.getInstance().openGraph();
		XDIReaderRegistry.getAuto().read(graph, new StringReader(message), null);
		MessageEnvelope messageEnvelope = MessageEnvelope.fromGraph(graph, null);
		MessageResult messageResult;

		messageResult = this.client.send(messageEnvelope, null);
		if (messageResult == null) throw new RuntimeException("No result");
		log.debug(messageResult.getGraph().toString());

		if (format == null) format = "X3J";

		return(messageResult.getGraph().toString(format, null));
	}
}
