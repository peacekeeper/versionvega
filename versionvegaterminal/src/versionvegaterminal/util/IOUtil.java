package versionvegaterminal.util;

import org.apache.commons.codec.binary.Base64;

public class IOUtil {

	private IOUtil() { }

	public static Object readRet(String retString) throws Throwable {

		String[] retParts = retString.split(" ");

		String retClass = retParts.length > 0 ? retParts[0] : null;
		String retValue = retParts.length > 1 ? retParts[1] : null;
		Object ret;

		if (retClass.equals("string")) {

			if (retValue != null) {

				ret = new String(Base64.decodeBase64(retValue), "UTF-8");
			} else {

				ret = "";
			}
		} else if (retClass.equals("string[]")) {

			if (retValue != null) {

				String[] retValues = retValue.split(",");
				ret = new String[retValues.length];
				for (int i=0; i<((String[]) ret).length; i++) ((String[]) ret)[i] = new String(Base64.decodeBase64(retValues[i]), "UTF-8");
			} else {

				ret = new String[0];
			}
		} else if (retClass.equals("NULL") && retValue.equals("NULL")){

			ret = null;
		} else if (retClass.equals("exception")) {

			throw new RuntimeException(new String(Base64.decodeBase64(retValue), "UTF-8"));
		} else {

			throw new RuntimeException("Invalid return value: " + retString);
		}

		return(ret);
	}

	public static String writeArg(Object arg) throws Throwable {

		if (arg == null) return("NULL NULL");

		String argClass = arg.getClass().getCanonicalName();
		StringBuffer buffer = new StringBuffer();

		if (argClass.equals(String.class.getCanonicalName())) {

			buffer.append("string" + " ");
			buffer.append(new String(Base64.encodeBase64(((String) arg).getBytes("UTF-8"))));
		} else if (argClass.equals(String[].class.getCanonicalName())) {

			buffer.append("string[]" + " ");
			boolean first = true;
			for (int i=0; i<((String[]) arg).length; i++) {

				if (! first) buffer.append(","); else first = false;
				buffer.append(new String(Base64.encodeBase64(((String[]) arg)[i].getBytes("UTF-8"))));
			}
		} else {

			throw new RuntimeException("Invalid argument: " + argClass);
		}

		return(buffer.toString());
	}
}
