package comm;

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
import java.util.ArrayList;
import java.util.Properties;

public class comm_dbConnect  {
    
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
        public comm_dbConnect() throws FileNotFoundException, IOException{
//            String CurrDir = this.getClass().getResource("/").getPath();
//            
//            Properties p = new Properties();
//            
//            p.load(new FileInputStream(CurrDir+"config.ini"));
//            
//            dbUser = p.getProperty("SCMuser");
//            dbPassword = p.getProperty("SCMpassword");
//            connectionUrl = p.getProperty("SCMhost");
            
    	      dbUser = "ERPMAN";
    	      dbPassword = "ERPMAN";
    	      connectionUrl = "jdbc:oracle:thin:@58.72.85.254:1521:hhpnt";
            
            try {
                Class.forName("oracle.jdbc.driver.OracleDriver");
                sConn = DriverManager.getConnection(connectionUrl,dbUser,dbPassword);
                //System.out.println("DB connectioning...");
            } catch(ClassNotFoundException e) {
                System.out.println("DB connection error : " + e.getMessage());
            } catch(SQLException e) {
                System.out.println("DB connection error : " + e.getMessage());
            }
        }
    
    //DB connect
    public Connection getconnection() {
        return sConn;
    }
    
    public void disconnection() {
        if (sConn != null) {
            try {
                sConn.close();
            } catch (SQLException e) {
                System.out.println("Disconnection Error: " + e.getMessage());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        if (sRs != null) {
            try {
                sRs.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
//------------------------------------------------------------------------------
// 기능 : 조회조건이 있는 SELECT SQL문 실행
// 인자 : commandText -> SELECT SQL문
//       parameters -> 조회조건의 배열
// 반환 : 조회된 결과의 집합 (행갯수, 컬럼명, 데이터 등등)  
// 작성 : 2021.03.26 by dykim
//------------------------------------------------------------------------------
    public ResultSet excuteQuery(String commandText, ArrayList<comm_dataPack> parameters) {
        try {
            sPstmt = sConn.prepareStatement(commandText);
            //System.out.println(parameters.get(0).getCode());
            //System.out.println(parameters.get(0).getValue());
            for (int i = 0; i < parameters.size(); i++) {
                sPstmt.setString(Integer.valueOf(parameters.get(i).getCode().toString()), parameters.get(i).getValue().toString());
            }
            
            sRs = sPstmt.executeQuery();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return sRs;
    }
//------------------------------------------------------------------------------
// 기능 : 조회조건이 없는 SELECT SQL문 실행
// 인자 : commandText -> SELECT SQL문
// 반환 : 조회된 결과의 집합 (행갯수, 컬럼명, 데이터 등등)  
// 작성 : 2021.03.26 by dykim
//------------------------------------------------------------------------------    
    public ResultSet excuteQuery(String commandText) {
        try {
            sStmt = sConn.createStatement();
            sRs = sStmt.executeQuery(commandText);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return sRs;
    }
//------------------------------------------------------------------------------
// 기능 : INSERT, UPDATE, DELETE 실행
// 인자 : commandText -> 실행할 SQL
// 반환 : 없음  
// 작성 : 2021.03.30 by dykim
//------------------------------------------------------------------------------    
    public void excuteUpdate(String commandText, ArrayList<comm_dataPack> parameters) {
        try {
            sPstmt = sConn.prepareStatement(commandText);
            
            for (int i = 0; i < parameters.size(); i++) {
                sPstmt.setString(Integer.valueOf(parameters.get(i).getCode().toString()), parameters.get(i).getValue().toString());
            }
            
            sPstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
//    public CallableStatement excuteProc(String commandText, ArrayList<comm_dataPack> parameters) {
//        try {
//            sCstmt = sConn.prepareCall(commandText);
//            for (int i = 0; i < parameters.size(); i++) {
//                sPstmt.setString(Integer.valueOf(parameters.get(i).getCode().toString()), parameters.get(i).getValue().toString());
//            }
//            
//            sCstmt.execute();
//        } catch (Exception e) {
//            e.printStackTrace();
//            
//        }
//        return sCstmt;
//    }
}