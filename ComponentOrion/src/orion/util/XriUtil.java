package orion.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.cert.Certificate;
import java.text.ParseException;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;

import org.apache.xml.security.keys.KeyInfo;
import org.apache.xml.security.keys.keyresolver.KeyResolverException;
import org.openxri.xml.CanonicalID;
import org.openxri.xml.Service;
import org.openxri.xml.Status;
import org.openxri.xml.XRD;

import orion.OrionLogger;

public class XriUtil {

	private static final String PROXY = "http://xri.net/";

	private static CacheManager cacheManager;
	private static Cache canonicalIdCache;
	private static Cache certificateCache;
	private static Cache xdiUrlCache;

	static {

		cacheManager = CacheManager.create(XriUtil.class.getResourceAsStream("ehcache.xml"));
		canonicalIdCache = cacheManager.getCache("canonicalIdCache");
		certificateCache = cacheManager.getCache("certificateCache");
		xdiUrlCache = cacheManager.getCache("xdiUrlCache");
	}

	private XriUtil() { }

	public static String discoverCanonicalId(String xri) throws IOException, URISyntaxException, ParseException {

		// get it from cache?

		Element element = canonicalIdCache.get(xri);
		OrionLogger.logger.fine("discoverCanonicalId(" + xri + "): CACHE " + (element != null ? "HIT" : "MISS"));
		if (element != null) return (String) element.getValue();

		// resolve it!

		URL url = new URL(
				PROXY +
				xri +
		"?_xrd_r=application/xrd+xml;sep=false");

		HttpURLConnection http = (HttpURLConnection) url.openConnection();
		http.setRequestMethod("GET");
		if (http.getResponseCode() != 200) return null;
		InputStream stream = http.getInputStream();
		BufferedReader reader = new BufferedReader(new InputStreamReader(stream));

		StringBuffer buffer = new StringBuffer();
		String line;
		while ((line = reader.readLine()) != null) buffer.append(line);

		XRD xrd = XRD.parseXRD(buffer.toString(), false);
		if (! xrd.getStatus().getCode().equals(Status.SUCCESS)) throw new RuntimeException(xrd.getStatus().getCode() + " " + xrd.getStatus().getText());

		CanonicalID canonicalIdElement = xrd.getCanonicalID();
		String canonicalId = canonicalIdElement == null ? null : canonicalIdElement.getValue();

		// put it into cache

		if (canonicalId != null) canonicalIdCache.put(new Element(xri, canonicalId));

		// done

		return canonicalId;
	}

	public static Certificate discoverCertificate(String xri) throws IOException, URISyntaxException, ParseException, KeyResolverException {

		// get it from cache?

		Element element = certificateCache.get(xri);
		OrionLogger.logger.fine("discoverCertificate(" + xri + "): CACHE " + (element != null ? "HIT" : "MISS"));
		if (element != null) return (Certificate) element.getValue();

		// resolve it!

		URL url = new URL(
				PROXY +
				xri +
		"?_xrd_r=application/xrd+xml;sep=true;nodefault_t=true&_xrd_t=xri://$certificate*($x.509)");

		HttpURLConnection http = (HttpURLConnection) url.openConnection();
		http.setRequestMethod("GET");
		if (http.getResponseCode() != 200) return null;
		InputStream stream = http.getInputStream();
		BufferedReader reader = new BufferedReader(new InputStreamReader(stream));

		StringBuffer buffer = new StringBuffer();
		String line;
		while ((line = reader.readLine()) != null) buffer.append(line);

		XRD xrd = XRD.parseXRD(buffer.toString(), false);
		if (! xrd.getStatus().getCode().equals(Status.SUCCESS)) throw new RuntimeException(xrd.getStatus().getCode() + " " + xrd.getStatus().getText());

		if (xrd.getNumServices() < 1) return null;
		Service service = xrd.getServiceAt(0);
		KeyInfo keyInfo = service.getKeyInfo();
		if (keyInfo == null) return null;
		Certificate certificate = keyInfo.getX509Certificate();

		// put it into cache

		if (certificate != null) certificateCache.put(new Element(xri, certificate));

		// done

		return certificate;
	}

	public static String discoverXdiUri(String xri) throws IOException {

		// get it from cache?

		Element element = xdiUrlCache.get(xri);
		OrionLogger.logger.fine("discoverXdiUrl(" + xri + "): CACHE " + (element != null ? "HIT" : "MISS"));
		if (element != null) return (String) element.getValue();

		// resolve it!

		URL url = new URL(
				PROXY +
				xri +
				"?_xrd_r=text/uri-list;sep=true;nodefault_t=true" + 
		"&_xrd_t=xri://$xdi!($v!1)");

		HttpURLConnection http = (HttpURLConnection) url.openConnection();
		http.setRequestMethod("GET");
		if (http.getResponseCode() != 200) return null;
		InputStream stream = http.getInputStream();
		BufferedReader reader = new BufferedReader(new InputStreamReader(stream));

		String xdiUrl = reader.readLine();
		if (xdiUrl == null) return null;
		if (! xdiUrl.startsWith("http://") && ! xdiUrl.startsWith("https://")) return null;

		// put it into cache

		if (xdiUrl != null) xdiUrlCache.put(new Element(xri, xdiUrl));

		// done

		return xdiUrl;
	}
}
