package sirius;

public interface Sirius {

	public void init();
	public void shutdown();

	public String add(String xri, String format) throws Exception;
	public String get(String xri, String format) throws Exception;
	public String mod(String xri, String format) throws Exception;
	public String set(String xri, String format) throws Exception;
	public String del(String xri, String format) throws Exception;
	public String[] getLiterals(String xri) throws Exception;
	public String getLiteral(String xri) throws Exception;
	public String[] getReferences(String xri) throws Exception;
	public String getReference(String xri) throws Exception;
	public String execute(String message, String format) throws Exception;
}
