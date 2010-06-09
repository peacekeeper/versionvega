package versionvega;

import java.io.BufferedReader;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.Socket;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import versionvega.util.IOUtil;
import versionvega.util.InvocationUtil;


class BoxRunner extends Thread {

	private static Log log = LogFactory.getLog(BoxRunner.class);

	private Socket socket;
	private BufferedReader reader;
	private PrintWriter writer;

	public BoxRunner(Socket socket, BufferedReader reader, PrintWriter writer) {

		this.socket = socket;
		this.reader = reader;
		this.writer = writer;
	}

	@Override
	public void run() {

		log.info("BOX Runner " + Thread.currentThread().getId() + " starting.");

		String line;
		
		line = "OK";
		log.info("> " + line);
		this.writer.println(line);
		this.writer.flush();

		try {

			while (this.isAlive() && ! this.isInterrupted()) {

				line = this.reader.readLine();
				if (line == null) break;
				log.info("< " + line);

				String objectString = line.split(" ")[0];
				String methodString = line.split(" ")[1];
				String argscountString = line.split(" ")[2];

				String[] argsStrings = new String[Integer.valueOf(argscountString).intValue()];
				for (int i=0; i<Integer.valueOf(argscountString).intValue(); i++) {

					line = this.reader.readLine();
					if (line == null) break;
					log.info("< " + line);

					argsStrings[i] = line;
				}
				if (line == null) break;

				Object object;
				Method method;
				Object[] args;

				object = null;
				if (objectString.equals("orion")) object = VersionVegaNode.orionJava;
				if (objectString.equals("vega")) object = VersionVegaNode.vegaJava;
				if (objectString.equals("sirius")) object = VersionVegaNode.siriusJava;
				if (objectString.equals("polaris")) object = VersionVegaNode.polarisJava;
				if (object == null) throw new RuntimeException("Invalid object: " + objectString);

				method = InvocationUtil.findMethod(object, methodString);
				if (method == null) throw new RuntimeException("Invalid method: " + methodString);

				args = new Object[argsStrings.length];
				for (int i=0; i<argsStrings.length; i++) args[i] = IOUtil.readArg(argsStrings[i]);

				Object ret;

				try {

					ret = method.invoke(object, args);
				} catch (InvocationTargetException ex) {

					Throwable targetException = ex.getTargetException();
					if (targetException == null) throw ex;

					String exception = targetException.getMessage();
					if (exception == null) exception = targetException.getClass().getSimpleName();
					line = IOUtil.writeException(exception);

					log.warn(exception, targetException);

					log.info("> " + line);
					this.writer.println(line);
					this.writer.flush();

					continue;
				}

				line = IOUtil.writeRet(ret);
				log.info("> " + line);
				this.writer.println(line);
				this.writer.flush();
			}
		} catch (Throwable ex) {

			log.error("BOX Runner " + Thread.currentThread().getId() + " had exception: " + ex.getMessage(), ex);
		} finally {

			try {

				if (this.reader != null) this.reader.close();
				if (this.writer != null) this.writer.close();
				if (this.socket != null) this.socket.close();
			} catch (Throwable ex) { }
		}

		log.info("BOX Runner " + Thread.currentThread().getId() + " stopped.");
	}
}