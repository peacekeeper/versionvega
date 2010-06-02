package orion;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.cert.Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.UUID;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.eclipse.higgins.xdi4j.Graph;
import org.eclipse.higgins.xdi4j.addressing.Addressing;
import org.eclipse.higgins.xdi4j.messaging.Message;
import org.eclipse.higgins.xdi4j.messaging.MessageEnvelope;
import org.eclipse.higgins.xdi4j.messaging.MessageResult;
import org.eclipse.higgins.xdi4j.messaging.Operation;
import org.eclipse.higgins.xdi4j.messaging.client.http.XDIHttpClient;
import org.eclipse.higgins.xdi4j.messaging.error.ErrorMessageResult;
import org.eclipse.higgins.xdi4j.xri3.impl.XRI3;
import org.eclipse.higgins.xdi4j.xri3.impl.XRI3Segment;

import orion.util.XriUtil;

public class OrionImpl implements Orion {

	private static final XRI3Segment XRI_PRIVATEKEY = new XRI3Segment("$key$private");
	private static final XRI3Segment XRI_PUBLICKEY = new XRI3Segment("$key$public");

	private static final String SIGNATURE_ALGORITHM = "SHA1withRSA";
	private static final String ENCRYPTION_ALGORITHM = "RSA";
	private static final String SYMENCRYPTION_ALGORITHM = "AES";
	private static final int SYMENCRYPTION_KEYSIZE = 128;

	private static final SecureRandom random = new SecureRandom();

	private String iname;
	private String password;
	private String inumber;
	private String xdiUri;
	private PrivateKey privateKey;
	private PublicKey publicKey;

	OrionImpl() {

		this.iname = null;
		this.password = null;
		this.inumber = null;
		this.xdiUri = null;
		this.privateKey = null;
		this.publicKey = null;
	}

	public void init() {

		OrionLogger.init();
	}

	public void shutdown() {

		OrionLogger.shutdown();
	}

	/*
	 * Actions
	 */

	public void login(String iname, String password) throws Exception {

		OrionLogger.logger.fine("login(" + iname + "," + "xxxxx" + ")");

		try {

			this.iname = iname;
			this.password = password;

			this.inumber = XriUtil.discoverCanonicalId(this.iname);
			if (this.inumber == null) throw new RuntimeException("No I-Number found for this I-Name.");
			OrionLogger.logger.finer("login: inumber=" + this.inumber);

			this.xdiUri = XriUtil.discoverXdiUri(this.iname);
			if (this.xdiUri == null) throw new RuntimeException("No XDI endpoint found for this I-Name.");
			if (! this.xdiUri.endsWith("/")) this.xdiUri += "/";
			OrionLogger.logger.finer("login: xdiUri=" + this.xdiUri);

			KeyFactory keyFactory = KeyFactory.getInstance(ENCRYPTION_ALGORITHM);

			// prepare XDI message

			MessageEnvelope messageEnvelope = MessageEnvelope.newInstance();
			Message message = messageEnvelope.newMessage(new XRI3Segment(this.inumber));
			message.getSubject().createStatement(new XRI3Segment("$is$a"), new XRI3Segment("" + this.inumber.charAt(0)));
			message.getSubject().createStatement(new XRI3Segment("$password"), this.password);
			Operation operation = message.createGetOperation();
			Graph operationGraph = operation.createOperationGraph(null);
			operationGraph.createSubject(new XRI3Segment(this.inumber));

			// send it and check result

			MessageResult messageResult = new XDIHttpClient(this.xdiUri).send(messageEnvelope, null);
			if (messageResult == null) throw new RuntimeException("No result");
			OrionLogger.logger.finest(messageResult.getGraph().toString());

			if (messageResult instanceof ErrorMessageResult)
				throw new RuntimeException(((ErrorMessageResult) messageResult).getErrorString());

			String privateKeyStr = Addressing.findLiteralData(messageResult.getGraph(), new XRI3(this.inumber + "/" + XRI_PRIVATEKEY));
			String publicKeyStr = Addressing.findLiteralData(messageResult.getGraph(), new XRI3(this.inumber + "/" + XRI_PUBLICKEY));

			if (privateKeyStr == null ||
					publicKeyStr == null) {

				throw new RuntimeException("Cannot read from XDI endpoint. Maybe your I-Name is not configured correctly, or the password is wrong.");
			}

			// get private key for xri

			PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(Base64.decodeBase64(privateKeyStr));
			this.privateKey = keyFactory.generatePrivate(privateKeySpec);
			OrionLogger.logger.finer("login: private key retrieved.");

			// get public key for xri

			X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(Base64.decodeBase64(publicKeyStr));
			this.publicKey = keyFactory.generatePublic(publicKeySpec);
			OrionLogger.logger.finer("login: public key retrieved.");
		} catch (Exception ex) {

			this.logout();

			throw ex;
		}
	}

	public void logout() throws Exception {

		OrionLogger.logger.fine("logout()");

		this.iname = null;
		this.password = null;
		this.inumber = null;
		this.xdiUri = null;
		this.privateKey = null;
		this.publicKey = null;
	}

	public String loggedin() throws Exception {

		OrionLogger.logger.fine("loggedin()");

		if (this.iname != null && this.inumber != null && this.privateKey != null && this.publicKey != null) {

			return("1");
		} else {

			return(null);
		}
	}

	public String iname() throws Exception {

		OrionLogger.logger.fine("iname() = " + this.iname);

		return(this.iname);
	}

	public String inumber() throws Exception {

		OrionLogger.logger.fine("inumber() = " + this.inumber);

		return(this.inumber);
	}

	public String xdiUri() throws Exception {

		OrionLogger.logger.fine("xdiUri() = " + this.xdiUri);

		return(this.xdiUri);
	}

	public String resolve(String iname) throws Exception {

		OrionLogger.logger.fine("resolve(" + iname + ")");

		return XriUtil.discoverCanonicalId(iname);
	}
	
	public String sign(String str) throws Exception {

		OrionLogger.logger.fine("sign(" + str + ")");

		java.security.Signature s = java.security.Signature.getInstance(SIGNATURE_ALGORITHM);
		s.initSign(this.privateKey, random);
		s.update(str.getBytes("UTF-8"));
		return(new String(Base64.encodeBase64(s.sign())));
	}

	public String verify(String str, String signature, String xri) throws Exception {

		OrionLogger.logger.fine("verify(" + str + "," + signature + "," + xri + ")");

		Certificate certificate = XriUtil.discoverCertificate(xri);
		PublicKey publicKey = certificate.getPublicKey();
		java.security.Signature s = java.security.Signature.getInstance(SIGNATURE_ALGORITHM);
		s.initVerify(publicKey);
		s.update(str.getBytes("UTF-8"));

		if (s.verify(Base64.decodeBase64(signature))) {

			return("1");
		} else {

			return(null);
		}
	}

	public String encrypt(String str, String xri) throws Exception {

		OrionLogger.logger.fine("encrypt(" + str + "," + xri + ")");

		Certificate certificate = XriUtil.discoverCertificate(xri);
		PublicKey publicKey = certificate.getPublicKey();
		Cipher cipher = Cipher.getInstance(ENCRYPTION_ALGORITHM);
		cipher.init(Cipher.ENCRYPT_MODE, publicKey, random);
		cipher.update(str.getBytes("UTF-8"));
		return(new String(Base64.encodeBase64(cipher.doFinal())));
	}

	public String decrypt(String str) throws Exception {

		OrionLogger.logger.fine("decrypt(" + str + ")");

		Cipher cipher = Cipher.getInstance(ENCRYPTION_ALGORITHM);
		cipher.init(Cipher.DECRYPT_MODE, this.privateKey, random);
		cipher.update(Base64.decodeBase64(str));
		return(new String(cipher.doFinal(), "UTF-8"));
	}

	public String symGenerateKey() throws Exception {

		OrionLogger.logger.fine("symGenerateKey()");

		KeyGenerator keyGenerator = KeyGenerator.getInstance(SYMENCRYPTION_ALGORITHM);
		keyGenerator.init(SYMENCRYPTION_KEYSIZE, random);
		SecretKey secretKey = keyGenerator.generateKey();
		return(new String(Base64.encodeBase64(secretKey.getEncoded())));
	}

	public String symEncrypt(String str, String key) throws Exception {

		OrionLogger.logger.fine("symEncrypt(" + str + "," + key + ")");

		SecretKeySpec secretKeySpec = new SecretKeySpec(Base64.decodeBase64(key), SYMENCRYPTION_ALGORITHM);
		Cipher cipher = Cipher.getInstance(SYMENCRYPTION_ALGORITHM);
		cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, random);
		cipher.update(str.getBytes("UTF-8"));
		return(new String(Base64.encodeBase64(cipher.doFinal())));
	}

	public String symDecrypt(String str, String key) throws Exception {

		OrionLogger.logger.fine("symDecrypt(" + str + "," + key + ")");

		SecretKeySpec secretKeySpec = new SecretKeySpec(Base64.decodeBase64(key), SYMENCRYPTION_ALGORITHM);
		Cipher cipher = Cipher.getInstance(SYMENCRYPTION_ALGORITHM);
		cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, random);
		cipher.update(Base64.decodeBase64(str));
		return(new String(cipher.doFinal(), "UTF-8"));
	}

	public String guid() throws Exception {

		OrionLogger.logger.fine("guid()");

		return(UUID.randomUUID().toString());
	}

	public String timeToken1(String data) throws Exception {

		return this.timeToken(data, "$timetoken$1");
	}

	public String timeToken24(String data) throws Exception {

		return this.timeToken(data, "$timetoken$24");
	}

	public String timeToken30(String data) throws Exception {

		return this.timeToken(data, "$timetoken$30");
	}

	public String timeLeft1() throws Exception {

		return this.timeLeft("$timetoken$1");
	}

	public String timeLeft24() throws Exception {

		return this.timeLeft("$timetoken$24");
	}

	public String timeLeft30() throws Exception {

		return this.timeLeft("$timetoken$30");
	}

	public String verifyTimeToken(String data, String timeToken, String xri) throws Exception {

		String[] parts = timeToken.split(" ");
		String subject = parts[0];
		String timeTokenTime = parts[1];
		String timeTokenValue = parts[2];

		String str = subject + " " + timeTokenTime + " " + data;

		return this.verify(str, timeTokenValue, xri);
	}

	private String timeToken(String data, String subject) throws Exception {

		// prepare XDI message

		MessageEnvelope messageEnvelope = MessageEnvelope.newInstance();
		Message message = messageEnvelope.newMessage(new XRI3Segment(this.inumber));
		message.getSubject().createStatement(new XRI3Segment("$is$a"), new XRI3Segment("" + this.inumber.charAt(0)));
		message.getSubject().createStatement(new XRI3Segment("$password"), this.password);
		message.getSubject().createStatement(new XRI3Segment("+data"), data);
		Operation operation = message.createGetOperation();
		Graph operationGraph = operation.createOperationGraph(null);
		operationGraph.createStatement(new XRI3Segment(subject), new XRI3Segment("$time"));
		operationGraph.createStatement(new XRI3Segment(subject), new XRI3Segment("$value"));

		// send it and check result

		MessageResult messageResult = new XDIHttpClient(this.xdiUri).send(messageEnvelope, null);
		if (messageResult == null) throw new RuntimeException("No result");
		OrionLogger.logger.finest(messageResult.getGraph().toString());

		if (messageResult instanceof ErrorMessageResult)
			throw new RuntimeException(((ErrorMessageResult) messageResult).getErrorString());

		String timeTokenTime = Addressing.findLiteralData(messageResult.getGraph(), new XRI3(subject + "/$time"));
		String timeTokenValue = Addressing.findLiteralData(messageResult.getGraph(), new XRI3(subject + "/$value"));

		if (timeTokenTime == null || 
				timeTokenValue == null ||
				timeTokenTime.trim().equals("") ||
				timeTokenValue.trim().equals("")) {

			throw new RuntimeException("Cannot read from XDI endpoint. Maybe your I-Name is not configured correctly, or the password is wrong.");
		}

		// done

		return subject + " " + timeTokenTime + " " + timeTokenValue;
	}

	private String timeLeft(String subject) throws Exception {

		// prepare XDI message

		MessageEnvelope messageEnvelope = MessageEnvelope.newInstance();
		Message message = messageEnvelope.newMessage(new XRI3Segment(this.inumber));
		message.getSubject().createStatement(new XRI3Segment("$is$a"), new XRI3Segment("" + this.inumber.charAt(0)));
		message.getSubject().createStatement(new XRI3Segment("$password"), this.password);
		Operation operation = message.createGetOperation();
		Graph operationGraph = operation.createOperationGraph(null);
		operationGraph.createStatement(new XRI3Segment(subject), new XRI3Segment("$timeleft"));

		// send it and check result

		MessageResult messageResult = new XDIHttpClient(this.xdiUri).send(messageEnvelope, null);
		if (messageResult == null) throw new RuntimeException("No result");
		OrionLogger.logger.finest(messageResult.getGraph().toString());

		if (messageResult instanceof ErrorMessageResult)
			throw new RuntimeException(((ErrorMessageResult) messageResult).getErrorString());

		String timeTokenTimeLeft = Addressing.findLiteralData(messageResult.getGraph(), new XRI3(subject + "/$timeleft"));

		if (timeTokenTimeLeft == null || 
				timeTokenTimeLeft.trim().equals("")) {

			throw new RuntimeException("Cannot read from XDI endpoint. Maybe your I-Name is not configured correctly, or the password is wrong.");
		}

		// done

		return timeTokenTimeLeft;
	}
}
