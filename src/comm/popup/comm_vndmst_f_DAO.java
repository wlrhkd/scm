package comm.popup;

import java.io.FileInputStream;


import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class comm_vndmst_f_DAO {
    private String dbUser;
    private String dbPassword;
    private String connectionUrl;
    
    private Connection sConn;
    private Statement sStmt;
    private PreparedStatement sPstmt = null;
    private CallableStatement sCstmt = null;
    private ResultSet sRs;
    
    private boolean bChkErr = true;
    private String sErrMessage = "";
    
    //DB연결
    public comm_vndmst_f_DAO() throws FileNotFoundException, IOException{
//        String CurrDir = this.getClass().getResource("/").getPath();
//        
//        Properties p = new Properties();
//        
//        p.load(new FileInputStream(CurrDir+"config.ini"));
        
        dbUser = "ERPMAN";
	    dbPassword = "ERPMAN";
	    connectionUrl = "jdbc:oracle:thin:@58.72.85.254:1521:hhpnt";
        
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            sConn = DriverManager.getConnection(connectionUrl,dbUser,dbPassword);
//            System.out.println("DB connectioning...");
        } catch(ClassNotFoundException e) {
            System.out.println("DB connection error : " + e.getMessage());
        } catch(SQLException e) {
            System.out.println("DB connection error : " + e.getMessage());
        }
    }
  //업체리스트
    public JSONObject getVndmstList(String sPage,String sCheckGubun,String sSearchValue) {
        int iTotalRecords = 0; //전체건수
        int iRecordPerPage = 20; //페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        } 
        String sSearchSQL = "";
        
        if(!sSearchValue.equals("")){     
           switch(sCheckGubun){
             case "1":sSearchSQL = " AND CVCOD LIKE '%"+sSearchValue+"%'"; 
                break;
             case "2":sSearchSQL = " AND CVNAS LIKE '%"+sSearchValue+"%'"; 
                break;
           }         
        } else {
            sSearchSQL = " AND CVCOD LIKE '%' ";
        }
       // System.out.println(SearchSQL);
        String SQL = "SELECT COUNT(*) FROM VNDMST WHERE 1 = 1 ";
        try{
            sPstmt = sConn.prepareStatement(SQL+sSearchSQL);
            sRs = sPstmt.executeQuery();
            if(sRs.next()) {
                iTotalRecords = sRs.getInt(1);
            }
        } catch(Exception e){
            System.out.println("DB Error[getFirmList]:"+e.getMessage());
        }
        
        int iStartRow = (iPageNo - 1) * iRecordPerPage + 1;        //시작점
        int iEndRow = iStartRow + iRecordPerPage - 1;            //종료점                
        if(iRecordPerPage == -1)
            iEndRow = iTotalRecords;       
        
        if(iTotalRecords < (iPageNo * iRecordPerPage)){
            iEndRow = iTotalRecords;            // 자료 종료
        }                
        int iTotalPages = (int) Math.ceil((float)iTotalRecords/(float)iRecordPerPage);
        
        SQL = " SELECT * FROM ( "
            +"                 SELECT ROWNUM AS RNUM,CVCOD, CVNAS FROM VNDMST ";
        if(sSearchSQL.equals("")){
            SQL = SQL +"                  WHERE ROWNUM <= ? ";
        }else{
            SQL = SQL +"                  WHERE ROWNUM <= ? "+sSearchSQL;            
        }
        //SQL = SQL +"                ORDER BY CVCOD " 
        SQL = SQL +") WHERE ? <= RNUM "; //로우 카운터만큼 가져오기
        
        //SQL = "SELECT ROWNUM AS RNUM,CVCOD, CVNAS FROM VNDMST ORDER BY CVCOD"        ;
        JSONObject jObject = new JSONObject();             
        try{
            //System.out.println(SQL);
            sPstmt = sConn.prepareStatement(SQL);
            sPstmt.setInt(1, iEndRow); //END ROW
            sPstmt.setInt(2, iStartRow); //START ROW
            sRs = sPstmt.executeQuery();
                    
            JSONArray jArray = new JSONArray();             
            while (sRs.next()) {
                 JSONObject obj=new JSONObject();
                 obj.put("SEQ",sRs.getString(1)); //순번
                 obj.put("CVCOD",sRs.getString(2)); //업체코드
                 obj.put("CVNAS",sRs.getString(3)); //업체명
                jArray.add(obj);
            }
            jObject.put("DATA", jArray);
            jObject.put("TOTAL",iTotalRecords );  //전체레코드수           
            jObject.put("PAGEROW",iRecordPerPage );//페이지당 ROW 수
            jObject.put("PageNo", iPageNo);
            //System.out.println(jObject);
        } catch(Exception e){
            System.out.println("DB Error[getFirmList]:"+e.getMessage());
        }
        return jObject;
    }     
    
    //DB connect
    public Connection getconnection() {
        return sConn;
    }
    
    public void disconnection() {
        try {
            sConn.close();
            System.out.println("Disconnection");
        } catch (SQLException e) {
            System.out.println("Disconnection Error: " + e.getMessage());
        }
    }
}
