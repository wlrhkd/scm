package comm;

import java.util.ArrayList;

import org.json.simple.JSONObject;

public class comm_message {
    public JSONObject getMessage(String messageNo) {
        String SQL = "SELECT MSG_TXT1, MSG_TXT2"
                    + " FROM MSGFILE"
                    + " WHERE MSG_NO = ?";
        JSONObject joObject = new JSONObject();
        
        ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
        
        parameter.add(new comm_dataPack(1, messageNo));
        
        comm_transaction controler = new comm_transaction();
        try {
            joObject = controler.selectData(SQL, parameter);
        } catch(Exception e) {
            e.printStackTrace();
        }
        return joObject;
    }
}
