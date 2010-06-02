package versionvega.util;

import org.apache.commons.codec.binary.Base64;

public class IOUtil {

	private IOUtil() { }

	public static Object readArg(String argString) throws Throwable {

		String[] argParts = argString.split(" ");

		String argClass = argParts.length > 0 ? argParts[0] : null;
		String argValue = argParts.length > 1 ? argParts[1] : null;
		Object arg;

		if (argClass.equals("string")) {

			if (argValue != null) {

				arg = new String(Base64.decodeBase64(argValue), "UTF-8");
			} else {
				
				arg = "";
			}
		} else if (argClass.equals("string[]")) {

			if (argValue != null) {

				String[] argValues = argValue.split(",");
				arg = new String[argValues.length];
				for (int i=0; i<((String[]) arg).length; i++) ((String[]) arg)[i] = new String(Base64.decodeBase64(argValues[i]), "UTF-8");
			} else {

				arg = new String[0];
			}
		} else if (argClass.equals("NULL") && argValue.equals("NULL")) {

			arg = null;
		} else {
			
			throw new RuntimeException("Invalid argument: " + argString);
		}

		return(arg);
	}

	public static String writeRet(Object ret) throws Throwable {

		if (ret == null) return("NULL NULL");

		String retClass = ret.getClass().getCanonicalName();
		StringBuffer buffer = new StringBuffer();

		if (retClass.equals(String.class.getCanonicalName())) {

			buffer.append("string" + " ");
			buffer.append(new String(Base64.encodeBase64(((String) ret).getBytes("UTF-8"))));
		} else if (retClass.equals(String[].class.getCanonicalName())) {

			buffer.append("string[]" + " ");
			boolean first = true;
			for (int i=0; i<((String[]) ret).length; i++) {

				if (! first) buffer.append(","); else first = false;
				buffer.append(new String(Base64.encodeBase64(((String[]) ret)[i].getBytes("UTF-8"))));
			}
		} else {

			throw new RuntimeException("Invalid return value: " + retClass);
		}

		return(buffer.toString());
	}

	public static String writeException(String exception) throws Throwable {

		StringBuffer buffer = new StringBuffer();

		buffer.append("exception" + " ");
		buffer.append(new String(Base64.encodeBase64(exception.getBytes("UTF-8"))));

		return(buffer.toString());
	}
}
