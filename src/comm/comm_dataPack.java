package comm;

public class comm_dataPack {
    
    private Object oCode;
    private Object oValue;
    private Object oType;
    private String sColName;
    
    public comm_dataPack(String sColName) {
        this.sColName = sColName;
    }
    
    public comm_dataPack(Object oCode, Object oValue) {
        this.oCode = oCode;
        this.oValue = oValue;
    }
    
    public comm_dataPack(Object oCode, Object oValue, Object oType) {
        this.oCode = oCode;
        this.oValue = oValue;
        this.oType = oType;
    }
    
    public Object getCode() {
        return oCode;
    }
    
    public void setCode(Object oCode) {
        this.oCode = oCode;
    }
    
    public Object getValue() {
        return oValue;
    }
    
    public void setValue(Object oValue) {
        this.oValue = oValue;
    }
    
    public Object getType() {
        return oType;
    }
    
    public void setType(Object oType) {
        this.oType = oType;
    }
    
    public void setColname(String sColName) {
        this.sColName = sColName;
    }
    
    public String getColname() {
        return sColName;
    } 
}
