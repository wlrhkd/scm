package comm.combo;

import java.io.IOException;
import java.util.ArrayList;

import org.json.simple.JSONObject;

import comm.comm_transaction;

public class comm_saupj_c {
  //사업장 콤보박스
    public JSONObject getSaupj(){
        String SQL = "SELECT RFCOD,RFGUB,RFNA1"
                    + " FROM REFFPF"
                    + " WHERE RFCOD = '02' AND RFGUB NOT IN('00','99')";
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
