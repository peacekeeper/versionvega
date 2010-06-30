package vega.util;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class NonceUtil {

	private static Log log = LogFactory.getLog(NonceUtil.class);

	private static CacheManager cacheManager;
	private static Cache nonceCache;

	static {

		cacheManager = CacheManager.create(ClassLoader.getSystemResource("ehcache.xml"));
		nonceCache = cacheManager.getCache("nonceCache");
	}

	private NonceUtil() { }

	public static boolean checkNonce(String nonce) {

		// have it in the cache already?

		Element element = nonceCache.get(nonce);
		log.debug("checkNonce(" + nonce + "): CACHE " + (element != null ? "HIT" : "MISS"));

		// put it into cache

		nonceCache.put(new Element(nonce, Long.valueOf(0)));
		return true;
	}
}
