package versionvegaterminal;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.Socket;

import versionvegaterminal.util.IOUtil;

public class VersionVegaTerminal {

	private static final String BOXHOST = "127.0.0.1";
	private static final int BOXPORT = 15099;

	public static void main(String[] args) throws Throwable {

		String host = (args.length > 0) ? args[0] : BOXHOST;
		int port = (args.length > 1) ? Integer.parseInt(args[1]) : BOXPORT;

		System.out.println("Connecting... ");

		Socket socket = new Socket();
		socket.connect(new InetSocketAddress(host, port));
		BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(socket.getInputStream()));
		PrintWriter writer = new java.io.PrintWriter(socket.getOutputStream(),true);

		System.out.println("GO or EXIT?");
		System.out.print("> ");

		BufferedReader keyboardReader = new BufferedReader(new InputStreamReader(System.in));
		String line = keyboardReader.readLine();

		if ("GO".equals(line)) {

			writer.println(line);
			writer.flush();
			line = reader.readLine();
			if (! line.equals("OK")) throw new RuntimeException("No OK:" + line);
		} else if ("EXIT".equals(line)) {

			writer.println(line);
			writer.flush();
			reader.close();
			writer.close();
			socket.close();
			return;
		} else {

			reader.close();
			writer.close();
			socket.close();
			return;
		}

		System.out.println("Talking to @versionvega at " + host + ":" + Integer.toString(port) + ".");

		while (true) {

			System.out.print("> ");
			System.out.flush();

			line = keyboardReader.readLine();
			if (line == null) break;
			String[] parts = line.split(" ");

			if (parts.length < 2) {

				System.out.println("Syntax: <object> <method> <arg1> <arg2> ...");
				System.out.println("with <object> being one of orion, vega, sirius.");
				System.out.println("with <method> being the command to be invoked, e.g. connect.");
				System.out.println("with <argX> being the arguments to the command (must match the expected number)");
				continue;
			}

			String object = parts[0];
			String method = parts[1];

			writer.println(object + " " + method + " " + (parts.length - 2));
			for (int i=2; i<parts.length; i++) if (parts[i].toLowerCase().equals("null")) parts[i] = null;
			for (int i=2; i<parts.length; i++) writer.println(IOUtil.writeArg(parts[i]));

			Object ret = IOUtil.readRet(reader.readLine());
			if (ret instanceof String[]) {

				for (String str : (String[]) ret) System.out.println(">>> " + str);
			} else if (ret instanceof String) {

				System.out.println(">>> " + (String) ret);
			} else {

				System.out.println(">>> " + ret);
			}
		}

		reader.close();
		writer.close();
		socket.close();
	}
}
