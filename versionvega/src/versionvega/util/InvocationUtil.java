package versionvega.util;

import java.lang.reflect.Method;

public class InvocationUtil {

	private InvocationUtil() { }

	public static Method findMethod(Object object, String methodString) {

		for (Method method : object.getClass().getMethods()) {

			if (method.getName().equals(methodString)) return(method);
		}

		return(null);
	}
}
