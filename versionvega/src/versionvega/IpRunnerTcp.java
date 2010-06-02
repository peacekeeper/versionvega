package versionvega;

import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.logging.Level;

class IpRunnerTcp extends Thread {

	private int ipPort;
	
	public IpRunnerTcp(int ipPort) {

		this.ipPort = ipPort;
	}

	@Override
	public void run() {

		VersionVegaLogger.logger.log(Level.INFO, "IP Runner " + Thread.currentThread().getId() + " starting.");

		try {

			ServerSocket serverSocket = new ServerSocket();
			serverSocket.bind(new InetSocketAddress(this.ipPort));

			while (this.isAlive() && ! this.isInterrupted()) {

				Socket socket = serverSocket.accept();
				PrintWriter writer = new java.io.PrintWriter(socket.getOutputStream(),true);
				VersionVegaLogger.logger.log(Level.INFO, "IP Runner got connection from " + socket.getInetAddress().getHostAddress() + ".");

				writer.println(socket.getInetAddress().getHostAddress());
				writer.flush();
				writer.close();
				socket.close();
			}

			serverSocket.close();
		} catch (Throwable ex) {

			VersionVegaLogger.logger.log(Level.INFO, "IP Runner " + Thread.currentThread().getId() + " had exception: " + ex.getMessage(), ex);
		}

		VersionVegaLogger.logger.log(Level.INFO, "IP Runner " + Thread.currentThread().getId() + " stopped.");
	}
}