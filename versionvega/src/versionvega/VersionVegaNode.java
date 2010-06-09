package versionvega;

import java.io.BufferedReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import orion.Orion;
import polaris.Polaris;
import sirius.Sirius;
import vega.Vega;

public class VersionVegaNode {

	static final String DEFAULT_BOXHOST = "127.0.0.1";
	static final int DEFAULT_BOXPORT = 15099;
	static final int DEFAULT_IPPORT = 15019;

	private static Log log = LogFactory.getLog(VersionVegaNode.class);

	static Orion orionJava;
	static Vega vegaJava;
	static Sirius siriusJava;
	static Polaris polarisJava;

	private static String boxHost;
	private static int boxPort;
	private static int ipPort;

	private static IpRunner ipRunner;
	private static List<BoxRunner> boxRunners = new ArrayList<BoxRunner> ();

	public static void main(String[] args) throws Throwable {

		if (args.length > 0 && args[0].toLowerCase().equals("stop")) {

			VersionVegaStopper.main(args);
		} else {

			init(args);
			server();
			shutdown();
		}
	}

	private static void init(String[] args) throws Throwable {

		log.info("init()");

		boxHost = (args.length > 0) ? args[0] : DEFAULT_BOXHOST;
		boxPort = (args.length > 1) ? Integer.valueOf(args[1]).intValue() : DEFAULT_BOXPORT;
		ipPort = (args.length > 2) ? Integer.valueOf(args[2]).intValue() : DEFAULT_IPPORT;

		orionJava = orion.OrionFactory.getOrion();
		orionJava.init();
		if (orion.OrionFactory.getException() != null) throw orion.OrionFactory.getException();

		vegaJava = vega.VegaFactory.getVega(orionJava);
		vegaJava.init();
		if (vega.VegaFactory.getException() != null) throw vega.VegaFactory.getException();

		siriusJava = sirius.SiriusFactory.getSirius(vegaJava);
		siriusJava.init();
		if (sirius.SiriusFactory.getException() != null) throw sirius.SiriusFactory.getException();

		polarisJava = polaris.PolarisFactory.getPolaris(orionJava);
		polarisJava.init();
		if (polaris.PolarisFactory.getException() != null) throw polaris.PolarisFactory.getException();
	}

	private static void shutdown() {

		log.info("shutdown()");

		polarisJava.shutdown();
		polarisJava = null;

		siriusJava.shutdown();
		siriusJava = null;

		vegaJava.shutdown();
		vegaJava = null;

		orionJava.shutdown();
		orionJava = null;
	}

	private static void server() throws Throwable {

		log.info("server()");

		ipRunner = new IpRunner(ipPort);
		ipRunner.setDaemon(true);
		ipRunner.start();

		ServerSocket serverSocket = new ServerSocket();
		serverSocket.bind(new InetSocketAddress(boxHost, boxPort), 10);

		log.info("Waiting for connections.");

		while (true) {

			for (Iterator<BoxRunner> i = boxRunners.iterator(); i.hasNext(); ) {

				BoxRunner boxRunner = i.next();

				if (! boxRunner.isAlive()) {

					log.info("Cleaning up runner " + boxRunner.getId() + ".");
					boxRunner.join();
					i.remove();
					log.info("Runner " + boxRunner.getId() + " removed.");
				}
			}

			Socket socket = serverSocket.accept();
			BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(socket.getInputStream()));
			PrintWriter writer = new java.io.PrintWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8"), true);
			log.info("Server got connection from " + socket.getInetAddress().toString() + ".");

			String line = reader.readLine();
			log.info("< " + line);

			if ("GO".equals(line)) {

				BoxRunner boxRunner = new BoxRunner(socket, reader, writer);
				boxRunners.add(boxRunner);
				boxRunner.setDaemon(true);
				boxRunner.start();
			} else if ("EXIT".equals(line)) {

				log.info("Interrupting IP Runner " + ipRunner.getId() + ".");
				if (ipRunner.isAlive()) ipRunner.interrupt();
				ipRunner.join(1000);
				log.info("IP Runner " + ipRunner.getId() + " removed.");
				ipRunner = null;

				for (Iterator<BoxRunner> i = boxRunners.iterator(); i.hasNext(); ) {

					BoxRunner boxRunner = i.next();

					log.info("Interrupting BOX Runner " + boxRunner.getId() + ".");
					if (boxRunner.isAlive()) boxRunner.interrupt();
					boxRunner.join(1000);
					i.remove();
					log.info("BOX Runner " + boxRunner.getId() + " removed.");
				}
				break;
			} else {

				writer.println("This is the @versionvega access service.");

				reader.close();
				writer.close();
				socket.close();
			}
		}

		serverSocket.close();
	}
}
