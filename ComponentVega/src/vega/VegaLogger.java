package vega;

import java.io.File;
import java.io.FilenameFilter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Date;
import java.util.logging.FileHandler;
import java.util.logging.Formatter;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

public class VegaLogger {

	public static Logger logger;
	public static Handler handler;

	private VegaLogger() { }

	static void init() {

		logger = Logger.getLogger("vega");
		logger.setLevel(Level.FINEST);

		try {

			if (! new File("./logs/").exists()) new File("./logs/").mkdir();
			handler = new FileHandler("./logs/vega.log");
			handler.setLevel(Level.FINEST);
			handler.setFormatter(new MyFormatter());
			logger.addHandler(handler);
		} catch (Exception ex) {

			throw new RuntimeException(ex);
		}

		logger.info("Logger started.");
	}

	static void shutdown() {

		logger.info("Logger stopped.");

		if (handler != null) handler.close();
		logger = null;
		handler = null;

		String[] filenames = new File("./logs").list(new FilenameFilter() {

			public boolean accept(File file, String filename) {

				return(filename.startsWith("vega-") && filename.endsWith(".log"));
			}
		});

		for (String filename : filenames) new File("./logs/" + filename).delete();
	}

	private static class MyFormatter extends Formatter {

		@Override
		public String format(LogRecord record) {

			StringBuffer buffer = new StringBuffer();
			buffer.append(record.getLevel().getName() + ": ");
			buffer.append(new Date(record.getMillis()).toString() + ": ");
			buffer.append(record.getSourceClassName() + ".");
			buffer.append(record.getSourceMethodName() + "() ");
			buffer.append(record.getMessage());
			buffer.append("\n");

			if (record.getThrown() != null) {

				StringWriter writer = new StringWriter();
				record.getThrown().printStackTrace(new PrintWriter(writer));
				buffer.append("\n" + writer.getBuffer().toString());
			}

			return(buffer.toString());
		}
	}
}
