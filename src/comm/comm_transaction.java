/* 
    Program : SQL 데이터를 처리하는 프로그램 
    작성일자   : 2021.03.25 
    작성자    : dykim
*/
package comm;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class comm_transaction {
    private boolean bChkErr = true;
    private String sErrMessage = "";
//------------------------------------------------------------------------------
// 기능 : 조회조건이 없는 자료 조회 후 JSONObject로 변환
// 인자 : queryString -> SELECT SQL문
// 반환 : JSONObject로 변환 된 조회된 데이터 들의 배열.
//       배열들은 DATA라는 임의로 지정한 코드값에 담겨있음.  
// 작성 : 2021.03.26 by dykim
//------------------------------------------------------------------------------
    public JSONObject selectData(String queryString) throws FileNotFoundException, IOException {
        comm_dbConnect dbAccess = new comm_dbConnect();
        ResultSet sRs = null;
        JSONObject joObject = new JSONObject();
        
        try {
            sRs = dbAccess.excuteQuery(queryString);
            ResultSetMetaData sRsmd = sRs.getMetaData();
            int iColumnCnt = sRsmd.getColumnCount();
            JSONArray jaResult = new JSONArray();
            int i;
            while(sRs.next()) {
                JSONObject joObj = new JSONObject();
                for (i = 1; i <= iColumnCnt; i++) {
                    joObj.put(sRsmd.getColumnName(i), sRs.getString(i));
                }
                jaResult.add(joObj);
            }
            joObject.put("DATA", jaResult);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        } finally {
            if (dbAccess != null) {
                dbAccess.disconnection();
            }
            if (sRs != null) {
                try {
                    sRs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return joObject;
    }
//------------------------------------------------------------------------------
// 기능 : 결과값이 한 개인 자료에 대한 select문 실행
// 인자 : queryString -> SELECT SQL문
// 반환 : 실행한 select문의 String 결과값  
// 작성 : 2021.05.20 by dykim
//------------------------------------------------------------------------------    
    public String selectString(String queryString) throws FileNotFoundException, IOException {
        comm_dbConnect dbAccess = new comm_dbConnect();
        ResultSet sRs = null;
        String sData = null;
        try {
            sRs = dbAccess.excuteQuery(queryString);
            while (sRs.next()) {
                sData = sRs.getString(1);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return sData;
    }
//------------------------------------------------------------------------------
// 기능 : 조회조건이 있는 결과값이 한 개인 자료에 대한 select문 실행
// 인자 : queryString -> SELECT SQL문
// 반환 : 실행한 select문의 String 결과값  
// 작성 : 2021.05.20 by dykim
//------------------------------------------------------------------------------    
    public String selectStringData(String queryString, ArrayList<comm_dataPack> parameters) throws FileNotFoundException, IOException {
    	comm_dbConnect dbAccess = new comm_dbConnect();
    	ResultSet sRs = null;
    	String sData = null;
    	try {
    		sRs = dbAccess.excuteQuery(queryString, parameters);
    		while (sRs.next()) {
    			sData = sRs.getString(1);
    		}
    		
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    	return sData;
    }
//------------------------------------------------------------------------------
// 기능 : 조회조건이 있는 자료 조회 후 JSONObject로 변환
// 인자 : queryString -> SELECT SQL문
// 반환 : JSONObject로 변환 된 조회된 데이터 들의 배열.
//        배열들은 DATA라는 임의로 지정한 코드값에 담겨있음.  
// 작성 : 2021.03.26 by dykim
//------------------------------------------------------------------------------    
    public JSONObject selectData(String queryString, ArrayList<comm_dataPack> parameters) throws FileNotFoundException, IOException {
        comm_dbConnect dbAccess = new comm_dbConnect();
        ResultSet sRs = null;
        JSONObject joObject = new JSONObject();
        
        try {
            sRs = dbAccess.excuteQuery(queryString, parameters);
            ResultSetMetaData sRsmd = sRs.getMetaData();
            int iColumnCnt = sRsmd.getColumnCount();
            JSONArray jaResult = new JSONArray();
            
            while (sRs.next()) {
                JSONObject joObj = new JSONObject();
                for (int i = 1; i <= iColumnCnt; i++ ) {
                    joObj.put(sRsmd.getColumnName(i), sRs.getString(i));
                }
                jaResult.add(joObj);
            }
            joObject.put("DATA", jaResult);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (dbAccess != null) {
                dbAccess.disconnection();
            }
            if (sRs != null) {
                try {
                    sRs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return joObject;
    }
  //------------------------------------------------------------------------------
// 기능 : INSERT, UPDATE, DELETE 실행
// 인자 : queryString -> SQL문
//       parameters -> 조건의 배열
// 반환 : 없음  
// 작성 : 2021.03.26 by dykim
//------------------------------------------------------------------------------        
    public void updateData(String queryString, ArrayList<comm_dataPack> parameters) throws FileNotFoundException, IOException {
        
    	comm_dbConnect dbAccess = new comm_dbConnect();
        
        try {
            dbAccess.excuteUpdate(queryString, parameters);
        } catch(Exception e) {
            System.out.println(e.getMessage());
            bChkErr = false;
            sErrMessage = e.getMessage();
        } finally {
            if (dbAccess != null) {
                dbAccess.disconnection();
            }
        }
    }
}
