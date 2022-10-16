package comm.combo;

import java.io.IOException;
import java.util.ArrayList;

import org.json.simple.JSONObject;

import comm.comm_transaction;

public class comm_ittyp_c {
    public JSONObject getIttyp(){
        String SQL = "SELECT RFCOD,RFGUB,RFNA1"
                    + " FROM REFFPF"
                    + " WHERE RFCOD = '15' AND RFGUB <> '00'";
        JSONObject joObject = new JSONObject();
        
        comm_transaction controler = new comm_transaction();
        try {
            joObject = controler.selectData(SQL);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return joObject;
    }
}
