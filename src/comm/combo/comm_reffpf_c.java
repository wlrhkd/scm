package comm.combo;

import java.io.IOException;
import java.util.ArrayList;

import org.json.simple.JSONObject;

import comm.comm_transaction;
import comm.comm_dataPack;

public class comm_reffpf_c {
    public JSONObject getReffpf(String sRfcod) {
        String SQL = "SELECT RFCOD,RFGUB,RFNA1"
                    + " FROM REFFPF"
                    + " WHERE RFCOD = ? AND RFGUB <> '00'";
        JSONObject joObject = new JSONObject();
        
        ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
        
        parameter.add(new comm_dataPack(1, sRfcod));
        
        comm_transaction controler = new comm_transaction();
        try {
            joObject = controler.selectData(SQL, parameter);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return joObject;
    }
}
