package orion;


public interface Orion {

	public void init();
	public void shutdown();

	public void login(String iname, String password) throws Exception;
	public void logout() throws Exception;
	public String loggedin() throws Exception;
	public String iname() throws Exception;
	public String inumber() throws Exception;
	public String xdiUri() throws Exception;
	public String resolve(String iname) throws Exception;
	public String sign(String str) throws Exception;
	public String verify(String str, String signature, String xri) throws Exception;
	public String encrypt(String str, String xri) throws Exception;
	public String decrypt(String str) throws Exception;
	public String symGenerateKey() throws Exception;
	public String symEncrypt(String str, String key) throws Exception;
	public String symDecrypt(String str, String key) throws Exception;
	public String guid() throws Exception;
	public String timeToken1(String data) throws Exception;
	public String timeToken24(String data) throws Exception;
	public String timeToken30(String data) throws Exception;
	public String timeLeft1() throws Exception;
	public String timeLeft24() throws Exception;
	public String timeLeft30() throws Exception;
	public String verifyTimeToken(String data, String timeToken, String xri) throws Exception;
}
