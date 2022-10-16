package comm.combo;

import java.io.IOException;
import java.util.ArrayList;

import org.json.simple.JSONObject;

import comm.comm_dataPack;
import comm.comm_transaction;

public class comm_vndmst_c {
	public JSONObject getVndmst(String sCvgu) {
        String SQL = "SELECT CVCOD, CVNAS2 "
        		+ "    FROM VNDMST "
        		+ "   WHERE CVGU = ? "
        		+ "     AND CVSTATUS = '0' ";
        JSONObject joObject = new JSONObject();
        
        ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
        
        parameter.add(new comm_dataPack(1, sCvgu));
        
        comm_transaction controler = new comm_transaction();
        
        try {
            joObject = controler.selectData(SQL, parameter);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return joObject;
    }
}
