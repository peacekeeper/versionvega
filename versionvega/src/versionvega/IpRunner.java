package versionvega;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.util.logging.Level;

class IpRunner extends Thread {

	private int ipPort;

	public IpRunner(int ipPort) {

		this.ipPort = ipPort;
	}

	@Override
	public void run() {

		VersionVegaLogger.logger.log(Level.INFO, "IP Runner " + Thread.currentThread().getId() + " starting.");

		try {

			DatagramSocket serverSocket = new DatagramSocket(this.ipPort);
			serverSocket.setReuseAddress(true);

			while (this.isAlive() && ! this.isInterrupted()) {

				byte[] receiveBuffer = new byte[256];
				byte[] sendBuffer;
				String receiveString;
				String sendString;

				DatagramPacket receivePacket = new DatagramPacket(receiveBuffer, receiveBuffer.length);
				serverSocket.receive(receivePacket);
				receiveString = new String(receiveBuffer).substring(0, receivePacket.getLength());

				if (! receiveString.equals(":)")) {

					VersionVegaLogger.logger.log(Level.INFO, "IP Runner " + Thread.currentThread().getId() + " got unexpected UDP data: " + receiveString);
					continue;
				}

				sendString = receivePacket.getAddress().getHostAddress() + " " + Integer.toString(receivePacket.getPort());
				sendBuffer = sendString.getBytes();
				VersionVegaLogger.logger.log(Level.INFO, "IP Runner " + Thread.currentThread().getId() + " sending response: " + sendString);

				DatagramPacket sendPacket = new DatagramPacket(sendBuffer, sendBuffer.length, receivePacket.getAddress(), receivePacket.getPort());
				serverSocket.send(sendPacket);
			}

			serverSocket.close();
		} catch (Throwable ex) {

			VersionVegaLogger.logger.log(Level.INFO, "IP Runner " + Thread.currentThread().getId() + " had exception: " + ex.getMessage(), ex);
		}

		VersionVegaLogger.logger.log(Level.INFO, "IP Runner " + Thread.currentThread().getId() + " stopped.");
	}
}