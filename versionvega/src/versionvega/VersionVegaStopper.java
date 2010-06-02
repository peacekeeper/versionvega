package versionvega;

import java.io.PrintWriter;
import java.net.Socket;

public class VersionVegaStopper {

	private static final String BOX_HOST = "127.0.0.1";
	private static final int BOX_PORT = 15050;

	public static void main(String[] args) throws Throwable {

		Socket socket = new Socket(BOX_HOST, BOX_PORT);
		PrintWriter writer = new java.io.PrintWriter(socket.getOutputStream(),true);

		writer.println("EXIT");
	}
}
