package ord;

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
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Properties;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import comm.LoggableStatement;
import comm.comm_transaction;
import comm.comm_dataPack;

public class ord_chul_DAO_e_copy2
{
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
    
//    //DB연결
//    public ord_chul_DAO_e() throws FileNotFoundException, IOException{
//        String CurrDir = this.getClass().getResource("/").getPath();
//        
//        Properties p = new Properties();
//        
//        p.load(new FileInputStream(CurrDir+"config.ini"));
//        
//        dbUser = p.getProperty("SCMuser");
//        dbPassword = p.getProperty("SCMpassword");
//        connectionUrl = p.getProperty("SCMhost");
//        
//        try {
//            Class.forName("oracle.jdbc.driver.OracleDriver");
//            sConn = DriverManager.getConnection(connectionUrl,dbUser,dbPassword);
//            //System.out.println("DB connectioning...");
//        } catch(ClassNotFoundException e) {
//            System.out.println("DB connection error : " + e.getMessage());
//        } catch(SQLException e) {
//            System.out.println("DB connection error : " + e.getMessage());
//        }
//    }
    
  //거래처코드 조회
  public JSONObject getCvnas(String sCvcod){
      String SQL = "SELECT CVCOD, CVNAS FROM VNDMST WHERE CVCOD = ?";
      JSONObject joCvnas = new JSONObject();
      
      ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
      parameters.add(new comm_dataPack(1, sCvcod));
      
      comm_transaction controler = new comm_transaction();
      try {
          joCvnas = controler.selectData(SQL,parameters);
      } catch (Exception e) {
          e.printStackTrace();
      }
      //System.out.println(joSaupj);
      return joCvnas;
  }
    
//    //출발처리 조회
//    public JSONObject startSelect(String sFdate,String sTdate,String sCvcod, String sSaupj,
//            String sItnbr, String sItdsc, String sIttyp) {
//
//        String sResult = null;
//        
//        String SQL = "SELECT "
//                +"         C.CVCOD,  "
//                +"         A.SAUPJ,  "
//                +"         A.BALJPNO,"
//                +"         A.BALSEQ, "
//                +"         A.ITNBR,  "
//                +"         B.ITDSC,  "
//                +"         B.ISPEC,  "
//                +"         B.JIJIL,  "
//                +"        B.UNMSR ,   "
//                +"         A.PSPEC,       "
//                +"         A.PORDNO,      "
//                +"         DECODE(C.DOCNO,NULL,'긴급','계획') AS GINGUB,"
//                +"         A.BALQTY, "
//                +"         '' AS BIN,"
//                +"         C.BALDATE,"
//                +"         A.GUDAT,  "
//                +"         DECODE(LENGTH(A.ORDER_NO),15,SUBSTR(A.ORDER_NO,1,10)||'-'||SUBSTR(A.ORDER_NO,11),A.ORDER_NO) AS ORDER_NO,   "
//                +"         A.BALQTY - FUN_GET_POINQTY(A.BALJPNO,A.BALSEQ) AS JANRU,"
//                +"         0 AS NAQTY,            "
//                +"         A.BALQTY AS WBALQTY,   "
//                +"     A.SAUPJ AS IPSAUPJ ,"
//                +"     A.IPDPT AS IPDPT ,  "
//                +"    '' AS PFILE ,        "
//                +"         '                    ' AS LOTNO,  "
//                +"    FUN_GET_CARTYPE(A.ITNBR) AS CARTYPE,"
//                +"         A.YEBI1 AS FACTORY,                   "
//                +"         '0' AS ROWSTATUS,                     "
//                +"     TO_CHAR(SYSDATE ,'YYYYMMDD') AS NAPDATE,"
//                +"    A.BIGO,                "
//                +"    A.ESTNO,               "
//                +"    D.CONTAINGU1 AS POJANG,"
//                +"    D.CONTAINQTY AS POQTY, "
//                +"     B.BALRATE             "
//                +" FROM POBLKT A,            "
//                +"           POMAST C,              "
//                +"           ITEMAS B,              "
//                +"           VNDMRP_NEW D           "
//                +" WHERE A.SABU = '1'        "
//                +"   AND A.GUDAT >= ? "
//                +"   AND A.GUDAT <= ? "
//                +"   AND A.BALSTS = '1'         "
//                +"   AND A.SABU = C.SABU        "
//                +"   AND A.BALJPNO = C.BALJPNO  "
//                +"   AND C.cvcod LIKE ?  /*업체코드*/      "
//                +"   AND C.BALGU IN ('1', '3')  "
//                +"   AND C.BAL_SUIP = '1' "
//                +"   AND A.SAUPJ LIKE ? /*사업장코드*/ "
//                +"   AND A.ITNBR = B.ITNBR "
//                +"   AND a.ITNBR LIKE ? /*사업장코드*/  "
//                +"   AND NVL(B.ITDSC, ' ') LIKE  ? /*품명*/ "
//                +"   AND NVL(B.ISPEC, ' ') LIKE  '%' "
//                +"   AND B.ITTYP LIKE '%'            "
//                +"   AND DECODE(NVL(ORDER_NO, 'O'), 'O', 'O', 'C') LIKE '%' "
//                +"   AND A.BALQTY - FUN_GET_POINQTY(A.BALJPNO,A.BALSEQ) > 0"
//                +"   AND A.YEBI1 = D.FACTORY(+)"
//                +"   AND A.ITNBR = D.ITNBR(+)"
//                +"   AND '%' = D.CVCOD(+)";
//        JSONObject joStartData = new JSONObject();
//        try {
//            sPstmt = sConn.prepareStatement(SQL);
//            sPstmt.setString(1, sFdate);
//            sPstmt.setString(2, sTdate);
//            //업체코드
//            if(sCvcod != null && sCvcod != "") {
//                sPstmt.setString(3, sCvcod);
//            }else {
//                sPstmt.setString(3, "%");
//            }
//            //사업장
//            if(sSaupj != null && sSaupj != "") {
//                sPstmt.setString(4, "10");
//            }else {
//                sPstmt.setString(4, "%");
//            }
//            //품번
//            if(sItnbr != null && sItnbr != "") {
//                sPstmt.setString(5, sItnbr);
//            }else {
//                sPstmt.setString(5, "%");
//            }
//            //품명
//            if(sItdsc != null && sItdsc != "") {
//                sPstmt.setString(6, sItdsc);
//            }else {
//                sPstmt.setString(6, "%");
//            }
//            sRs = sPstmt.executeQuery();
//            JSONArray jaStartData = new JSONArray();
//            int iTotal = 0;
//            while (sRs.next()) {
//                JSONObject joObj = new JSONObject();
//                
//                joObj.put("GINGUB",  sRs.getString("GINGUB") ); //구분
//                joObj.put("BALJPNO",  sRs.getString("BALJPNO")); //발주번호
//                joObj.put("ITNBR",   sRs.getString("ITNBR"));   //품번
//                joObj.put("ITDSC",   sRs.getString("ITDSC"));   //품명
//                joObj.put("ISPEC",   sRs.getString("ISPEC"));   //규격
//                joObj.put("JIJIL",   sRs.getString("JIJIL"));   //재질
//                joObj.put("JANRU",   sRs.getString("JANRU"));   //발주량
//                joObj.put("GUDAT",   sRs.getString("GUDAT"));   //납기요구일
//                joObj.put("NAPDATE", sRs.getString("NAPDATE"));   //납기일
//                joObj.put("WBALQTY", sRs.getString("WBALQTY")); //발주잔량
//                joObj.put("NAQTY",   sRs.getString("NAQTY"));   //납품수량
//                joObj.put("POJANG",  sRs.getString("POJANG")); //포장용기
//                joObj.put("POQTY",   sRs.getString("POQTY")); //용기적입수
//                joObj.put("UNMSR",   sRs.getString("UNMSR")); //단위
//                joObj.put("FACTORY", sRs.getString("FACTORY")); //공장
//                joObj.put("ESTNO",   sRs.getString("ESTNO")); //오더번호
//                joObj.put("ORDER_NO",sRs.getString("ORDER_NO")); //고객발주번호
//                joObj.put("BIGO",    sRs.getString("BIGO")); //비고
//                joObj.put("LOTNO",   sRs.getString("LOTNO")); //LOTNO
//                //---아래부터 화면 미표시 ---//
//                joObj.put("CVCOD",   sRs.getString("CVCOD"));
//                joObj.put("BALSEQ",  sRs.getString("BALSEQ")); //발주순번
//                joObj.put("PSPEC",   sRs.getString("PSPEC"));
//                joObj.put("PFILE",   sRs.getString("PFILE")); //파일
//                joObj.put("BALRATE", sRs.getString("BALRATE")); //발주단위
//                joObj.put("IPSAUPJ", sRs.getString("IPSAUPJ")); //사업장코드
//                joObj.put("IPDPT",   sRs.getString("IPDPT")); //창고코드
//
//                jaStartData.add(joObj);
//                iTotal++;
//            }      
//            joStartData.put("DATA", jaStartData);
//            //System.out.println(joStartData);
//            return joStartData;
//        } catch (Exception ex) {
//            System.out.println("Exc]StartSelect Error: " + ex.getMessage());
//            sErrMessage = ex.getMessage();
//            ex.printStackTrace();	//에러메시지 단계별로 출력
//        } finally {
//            disconnection();
//        }
//        return joStartData;
//    }
     
  
    //출발처리 조회
    public JSONObject startSelect(String sFdate,String sTdate,String sCvcod, String sSaupj,
                                  String sItnbr, String sItdsc, String sIttyp) {
      
        String sResult = null;
      
        String SQL = "SELECT "
                +"         C.CVCOD,  "
                +"         A.SAUPJ,  "
                +"         A.BALJPNO,"
                +"         A.BALSEQ, "
                +"         A.ITNBR,  "
                +"         B.ITDSC,  "
                +"         B.ISPEC,  "
                +"         B.JIJIL,  "
                +"        B.UNMSR ,   "
                +"         A.PSPEC,       "
                +"         A.PORDNO,      "
                +"         DECODE(C.DOCNO,NULL,'긴급','계획') AS GINGUB,"
                +"         A.BALQTY, "
                +"         '' AS BIN,"
                +"         C.BALDATE,"
                +"         A.GUDAT,  "
                +"         DECODE(LENGTH(A.ORDER_NO),15,SUBSTR(A.ORDER_NO,1,10)||'-'||SUBSTR(A.ORDER_NO,11),A.ORDER_NO) AS ORDER_NO,   "
                +"         A.BALQTY - FUN_GET_POINQTY(A.BALJPNO,A.BALSEQ) AS JANRU,"
                +"         0 AS NAQTY,            "
                +"         A.BALQTY AS WBALQTY,   "
                +"     A.SAUPJ AS IPSAUPJ ,"
                +"     A.IPDPT AS IPDPT ,  "
                +"    '' AS PFILE ,        "
                +"         '                    ' AS LOTNO,  "
                +"    FUN_GET_CARTYPE(A.ITNBR) AS CARTYPE,"
                +"         A.YEBI1 AS FACTORY,                   "
                +"         '0' AS ROWSTATUS,                     "
                +"     TO_CHAR(SYSDATE ,'YYYYMMDD') AS NAPDATE,"
                +"    A.BIGO,                "
                +"    A.ESTNO,               "
                +"    D.CONTAINGU1 AS POJANG,"
                +"    D.CONTAINQTY AS POQTY, "
                +"     B.BALRATE             "
                +" FROM POBLKT A,            "
                +"           POMAST C,              "
                +"           ITEMAS B,              "
                +"           VNDMRP_NEW D           "
                +" WHERE A.SABU = '1'        "
                +"   AND A.GUDAT >= ? "
                +"   AND A.GUDAT <= ? "
                +"   AND A.BALSTS = '1'         "
                +"   AND A.SABU = C.SABU        "
                +"   AND A.BALJPNO = C.BALJPNO  "
                +"   AND C.CVCOD LIKE ?  /*업체코드*/      "
                +"   AND C.BALGU IN ('1', '3')  "
                +"   AND C.BAL_SUIP = '1' "
                +"   AND A.SAUPJ LIKE ? /*사업장코드*/ "
                +"   AND A.ITNBR = B.ITNBR "
                +"   AND a.ITNBR LIKE ? /*사업장코드*/  "
                +"   AND NVL(B.ITDSC, ' ') LIKE  ? /*품명*/ "
                +"   AND NVL(B.ISPEC, ' ') LIKE  '%' "
                +"   AND B.ITTYP LIKE '%'            "
                +"   AND DECODE(NVL(ORDER_NO, 'O'), 'O', 'O', 'C') LIKE '%' "
                +"   AND A.BALQTY - FUN_GET_POINQTY(A.BALJPNO,A.BALSEQ) > 0"
                +"   AND A.YEBI1 = D.FACTORY(+)"
                +"   AND A.ITNBR = D.ITNBR(+)"
                +"   AND '%' = D.CVCOD(+)";
        JSONObject joStartData = new JSONObject();
        
        //거래처 코드
        if (sCvcod == null || sCvcod == "") {
            sCvcod = "%"; 
        }
        //사업장
        if (sSaupj == null || sSaupj == "") {
            sSaupj = "%";
        } else {
            sSaupj = "10";
        //품번
        }
        if (sItnbr == null || sItnbr == "") {
            sItnbr = "%";
        }
        //품명
        if (sItdsc == null || sItdsc == "") {
            sItdsc = "%";
        }
      
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sFdate));
        parameters.add(new comm_dataPack(2, sTdate));
        parameters.add(new comm_dataPack(3, sCvcod));
        parameters.add(new comm_dataPack(4, sSaupj));
        parameters.add(new comm_dataPack(5, sItnbr));
        parameters.add(new comm_dataPack(6, sItdsc));
        
        comm_transaction controler = new comm_transaction();      
      
        try {
            joStartData = controler.selectData(SQL,parameters);
            //System.out.println(joStartData);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }
      
        return joStartData;
    }
    
//    public JSONObject cancelSelect(String sFdate, String sTdate, String sCvcod, String sIttyp, String sSaupj) {
//        String SQL = "";
//        
//        String sRst = null;
//        
//        SQL = "SELECT  SUBSTR(A.CRT_DT,1,8)   AS CRT_DT, "
//            + "        A.JPNO AS JPNO, "
//            + "        SUBSTR(A.JPNO,1,12) AS JPNO_HEAD , "
//            + "        SUBSTR(A.JPNO,13,3) AS JPNO_SEQ , "
//            + "        A.ITNBR, "
//            + "        B.ITDSC, "
//            + "        B.ISPEC, "
//            + "        B.JIJIL, "
//            + "        A.NAQTY, "
//            + "        C.UNPRC , "
//            + "        (A.NAQTY * C.UNPRC) as GYMEK, "
//            + "        A.BALJPNO, "
//            + "        A.BALSEQ, "
//            + "        DECODE(LENGTH(C.ORDER_NO),15,SUBSTR(C.ORDER_NO,1,10)||'-'||SUBSTR(C.ORDER_NO,11),C.ORDER_NO) AS ORDER_NO, "
//            + "/*        DECODE(A.STATUS, NULL, 'N', 'Y') AS IO_YN, "
//            + "        DECODE(A.STATUS, NULL, '미입하', DECODE(SIGN(D.IOFAQTY), -1, '반품', '입하')) IO_TXT,    */ "
//            + "        DECODE(E.JUMAECHUL, '4', DECODE(D.IO_DATE, NULL, 'N','Y'), DECODE(A.STATUS, NULL, 'N', 'Y')) AS IO_YN,        /* 물류업체인 경우는 제품인수가 안되면 삭제가능 */ "
//            + "        DECODE(E.JUMAECHUL, '4', DECODE(D.IO_DATE, NULL, '미입하','입하'), DECODE(A.STATUS, NULL, '미입하', DECODE(SIGN(D.IOFAQTY), -1, '반품', '입하'))) IO_TXT, "
//            + "        0 AS IS_CHEK, "
//            + "        B.JIJIL, "
//            + "        A.PSPEC, "
//            + "        C.PORDNO, "
//            + "        A.QAFILE , "
//            + "        '0' AS ROWSTATUS, "
//            + "        A.UPD_ID, "
//            + "        C.YEBI1 AS FACTORY, "
//            + "        A.IPSAUPJ as IPSAUJ , "
//            + "      A.DEPOT_NO, "
//            + "      A.POJANG, "
//            + "      A.POQTY, "
//            + "      A.BIGO "
//            + "FROM POBLKT_HIST A, "
//            + "    ITEMAS B, "
//            + "    POBLKT C, "
//            + "    IMHIST D, "
//            + "    VNDMST E "
//            + "WHERE A.NADATE BETWEEN ? AND ? "
//            + "AND A.CVCOD LIKE ? "
//            + "AND A.ITNBR = B.ITNBR "
//            + "AND B.ITTYP LIKE ? "
//            + "AND A.BALJPNO = C.BALJPNO "
//            + "AND A.BALSEQ = C.BALSEQ "
//            + "AND A.DEPOT_NO = E.CVCOD "
//            + "AND '1' = D.SABU(+) "
//            + "AND A.JPNO = D.IP_JPNO(+) "
//            + "AND A.BALJPNO = D.BALJPNO(+) "
//            + "AND A.BALSEQ = D.BALSEQ(+) "
//            + "AND C.SAUPJ LIKE ? " ;
//        
//        JSONObject joCancelData = new JSONObject();
//        try {
//            sPstmt = sConn.prepareStatement(SQL);
//            
//            if (sCvcod == null || sCvcod == "") {
//                sCvcod = "%";
//            }
//            if (sIttyp == null || sIttyp == "") {
//                sIttyp = "%";
//            }
//            if (sSaupj == null || sSaupj == "") {
//                sSaupj = "%";
//            } else {
//                sSaupj = "10";
//            }
//            System.out.println(sFdate + "||" + sTdate + "||" + sCvcod + "||" + sIttyp + "||" + sSaupj);
//            sPstmt.setString(1, sFdate);
//            sPstmt.setString(2, sTdate);
//            sPstmt.setString(3, sCvcod);
//            sPstmt.setString(4, sIttyp);
//            sPstmt.setString(5, sSaupj);
//            
//            sRs = sPstmt.executeQuery();
//            
//            JSONArray jaArray = new JSONArray();
//            
//            while (sRs.next()) {
//                JSONObject joObj = new JSONObject();
//                joObj.put("DEPOT_NO", sRs.getString("DEPOT_NO"));	//납품공장
//                joObj.put("JPNO_HEAD", sRs.getString("JPNO_HEAD"));	//납품번호
//                joObj.put("ITNBR", sRs.getString("ITNBR"));			//품번
//                joObj.put("ITDSC", sRs.getString("ITDSC"));			//품명
//                joObj.put("ISPEC", sRs.getString("ISPEC"));			//규격
//                joObj.put("JIJIL", sRs.getString("JIJIL"));			//재질
//                joObj.put("NAQTY", sRs.getString("NAQTY"));			//수량
//                joObj.put("FACTORY", sRs.getString("FACTORY"));		//공장
//                joObj.put("IO_TXT", sRs.getString("IO_TXT"));		//입고상태
//                joObj.put("BALJPNO", sRs.getString("BALJPNO"));		//발주번호
//                joObj.put("BALSEQ", sRs.getString("BALSEQ"));		//순번
//                joObj.put("ORDER_NO", sRs.getString("ORDER_NO"));	//고객발주번호
//                joObj.put("POJANG", sRs.getString("POJANG"));		//포장용기
//                joObj.put("POQTY", sRs.getString("POQTY"));			//용기적입수
//                joObj.put("BIGO", sRs.getString("BIGO"));			//비고
//                //--- 아래부터 화면 미표시 ---//
//                joObj.put("JPNO", sRs.getString("JPNO"));			//납품전표번호
//                
//                jaArray.add(joObj);
//            }
//            
//            joCancelData.put("DATA", jaArray);
//        } catch (SQLException ex) {
//            System.out.println("SQL]cancelSelect Error : " + ex.getMessage());
//        } catch (Exception ex) {
//            System.out.println("Exc]cancelSelect Error : " + ex.getMessage());
//        } finally {
//            disconnection();
//        }
//    return joCancelData;
//    }
    
    public JSONObject cancelSelect(String sFdate, String sTdate, String sCvcod, String sIttyp, String sSaupj) {
        String SQL = "";
        
        String sRst = null;
        
        SQL = "SELECT  SUBSTR(A.CRT_DT,1,8)   AS CRT_DT, "
            + "        A.JPNO AS JPNO, "
            + "        SUBSTR(A.JPNO,1,12) AS JPNO_HEAD , "
            + "        SUBSTR(A.JPNO,13,3) AS JPNO_SEQ , "
            + "        A.ITNBR, "
            + "        B.ITDSC, "
            + "        B.ISPEC, "
            + "        B.JIJIL, "
            + "        A.NAQTY, "
            + "        C.UNPRC , "
            + "        (A.NAQTY * C.UNPRC) as GYMEK, "
            + "        A.BALJPNO, "
            + "        A.BALSEQ, "
            + "        DECODE(LENGTH(C.ORDER_NO),15,SUBSTR(C.ORDER_NO,1,10)||'-'||SUBSTR(C.ORDER_NO,11),C.ORDER_NO) AS ORDER_NO, "
            + "/*        DECODE(A.STATUS, NULL, 'N', 'Y') AS IO_YN, "
            + "        DECODE(A.STATUS, NULL, '미입하', DECODE(SIGN(D.IOFAQTY), -1, '반품', '입하')) IO_TXT,    */ "
            + "        DECODE(E.JUMAECHUL, '4', DECODE(D.IO_DATE, NULL, 'N','Y'), DECODE(A.STATUS, NULL, 'N', 'Y')) AS IO_YN,        /* 물류업체인 경우는 제품인수가 안되면 삭제가능 */ "
            + "        DECODE(E.JUMAECHUL, '4', DECODE(D.IO_DATE, NULL, '미입하','입하'), DECODE(A.STATUS, NULL, '미입하', DECODE(SIGN(D.IOFAQTY), -1, '반품', '입하'))) IO_TXT, "
            + "        0 AS IS_CHEK, "
            + "        B.JIJIL, "
            + "        A.PSPEC, "
            + "        C.PORDNO, "
            + "        A.QAFILE , "
            + "        '0' AS ROWSTATUS, "
            + "        A.UPD_ID, "
            + "        C.YEBI1 AS FACTORY, "
            + "        A.IPSAUPJ as IPSAUJ , "
            + "      A.DEPOT_NO, "
            + "      A.POJANG, "
            + "      A.POQTY, "
            + "      A.BIGO "
            + "FROM POBLKT_HIST A, "
            + "    ITEMAS B, "
            + "    POBLKT C, "
            + "    IMHIST D, "
            + "    VNDMST E "
            + "WHERE A.NADATE BETWEEN ? AND ? "
            + "AND A.CVCOD LIKE ? "
            + "AND A.ITNBR = B.ITNBR "
            + "AND B.ITTYP LIKE ? "
            + "AND A.BALJPNO = C.BALJPNO "
            + "AND A.BALSEQ = C.BALSEQ "
            + "AND A.DEPOT_NO = E.CVCOD "
            + "AND '1' = D.SABU(+) "
            + "AND A.JPNO = D.IP_JPNO(+) "
            + "AND A.BALJPNO = D.BALJPNO(+) "
            + "AND A.BALSEQ = D.BALSEQ(+) "
            + "AND C.SAUPJ LIKE ? " ;
        
        JSONObject joCancelData = new JSONObject();
            
        if (sCvcod == null || sCvcod == "") {
            sCvcod = "%";
        }
        if (sIttyp == null || sIttyp == "") {
            sIttyp = "%";
        }
        if (sSaupj == null || sSaupj == "") {
            sSaupj = "%";
        } else {
            sSaupj = "10";
        }
            
        JSONArray jaArray = new JSONArray();
          
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sFdate));
        parameters.add(new comm_dataPack(2, sTdate));
        parameters.add(new comm_dataPack(3, sCvcod));
        parameters.add(new comm_dataPack(4, sIttyp));
        parameters.add(new comm_dataPack(5, sSaupj));
            
        comm_transaction controler = new comm_transaction();      
          
        try {
            joCancelData = controler.selectData(SQL,parameters);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[cancelSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }     
        return joCancelData;
    }
    
//    public String startUpdate(String sModifyData, String sOrgData) {
//        
//        boolean bChkErr = true;
//        String sErrMessage = "";
//        SimpleDateFormat sDate = new SimpleDateFormat("yyyyMMdd");
//        String sToDate = sDate.format(new java.util.Date()); //오늘 날짜
//        
//        int iCnt = 0;	//처리 건수
//        try{
//            JSONParser jpParser = new JSONParser();
//            JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData.replaceAll("null", ""));
//            JSONArray jaOrgArray = (JSONArray) jpParser.parse(sOrgData);
//            
//            for (int i=0; i<jaArray.size(); i++) {
//                //배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
//                JSONObject joParamObject = (JSONObject) jaArray.get(i);
//                JSONObject joOrgObject = (JSONObject) jaOrgArray.get(i);
//                
//                if (!joParamObject.get("NAQTY").equals(joOrgObject.get("NAQTY"))) {
//                    iCnt++;
//                    String sJunPyo = sToDate + getJunPyo(sToDate) + String.format("%03d",  iCnt);
//                    //System.out.println("전표번호: "+sJunPyo);
//                    try {
//                         String SQL ="";
//                         SQL  = " INSERT INTO POBLKT_HIST  ";
//                         SQL += "      (  JPNO	";		//전표번호
//                         SQL += "        ,CVCOD	";      //거래처코드
//                         SQL += "        ,BALJPNO	";	//발주번호
//                         SQL += "        ,BALSEQ	";	//발주항번
//                         SQL += "        ,ITNBR	";	//품번코드
//                         SQL += "        ,NAQTY	";	//납품수량
//                         SQL += "        ,NADATE	";	//납기일
//                         SQL += "        ,RCQTY	";		//0
//                         SQL += "        ,RCDATE	";		//null
//                         SQL += "        ,BFAQTY	";		//0
//                         SQL += "        ,BPEQTY	";		//0
//                         SQL += "        ,BTEQTY	";		//0
//                         SQL += "        ,BJOQTY	";		//0
//                         SQL += "        ,STATUS	";		//null
//                         SQL += "        ,CRT_DT	";	//자료생성날짜
//                         SQL += "        ,CRT_ID	";	//로그인한유저ID
//                         SQL += "        ,FILENAME	";	//첨부파일이름
//                         SQL += "        ,PRINT_YN	";	//거래명세서 발행여부
//                         SQL += "        ,PRT_JPNO	";	//거래명세서 전표번호
//                         SQL += "        ,PSPEC	";		//조회한 자료의 PSPEC 값
//                         SQL += "        ,IPSAUPJ	";		//조회한 자료의 사업장코드
//                         SQL += "        ,LOTNO	";		//LOT NO
//                         SQL += "        ,QAFILE	";		//첨부파일코드
//                         SQL += "        ,DEPOT_NO	";	//조회한 자료의 IPDPT 값(창고코드)
//                         SQL += "        ,POJANG	";		//포장용기
//                         SQL += "        ,POQTY	";		//용기적입수
//                         SQL += "        ,BIGO	";			//비고
//                         SQL += "        )                                  ";
//                         SQL += "        VALUES                             ";
//                         SQL += "      (  ?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "        ,?	";
//                         SQL += "       )	 ";
//
//                         PreparedStatement sPstmt = sConn.prepareStatement(SQL);
//                         
//                         sPstmt.setString(1,  sJunPyo);  //전표번호
//                         sPstmt.setString(2,  joParamObject.get("CVCOD"   ).toString() );   //거래처코드
//                         sPstmt.setString(3,  joParamObject.get("BALJPNO" ).toString());    //발주번호
//                         sPstmt.setString(4,  joParamObject.get("BALSEQ"  ).toString());    //발주항번
//                         sPstmt.setString(5,  joParamObject.get("ITNBR"   ).toString() );   //품번코드
//                         sPstmt.setString(6,  joParamObject.get("NAQTY"   ).toString() );   //납품수량
//                         sPstmt.setString(7,  joParamObject.get("NAPDATE" ).toString());    //납기일
//                         sPstmt.setString(8,  "0"                       );                //0
//                         sPstmt.setString(9,  ""                       );                //null
//                         sPstmt.setString(10, "0"                       );                //0
//                         sPstmt.setString(11, "0"                       );                //0
//                         sPstmt.setString(12, "0"                       );                //0
//                         sPstmt.setString(13, "0"                       );                //0
//                         sPstmt.setString(14, ""                        );                //null
//                         sPstmt.setString(15, sToDate                    );    //자료생성날짜
//                         sPstmt.setString(16, "300007"                  );    //로그인한유저ID
//                         sPstmt.setString(17, joParamObject.get("PFILE"   ).toString());    //첨부파일이름
//                         sPstmt.setString(18, "Y"                       );    //거래명세서 발행여부
//                         sPstmt.setString(19, sToDate+String.format("%04d", iCnt) );    //거래명세서 전표번호
//                         sPstmt.setString(20, joParamObject.get("PSPEC"   ).toString());    //조회한 자료의 PSPEC 값
//                         sPstmt.setString(21, joParamObject.get("IPSAUPJ" ).toString());    //조회한 자료의 사업장코드
//                         sPstmt.setString(22, joParamObject.get("LOTNO"   ).toString());    //LOT NO
//                         sPstmt.setString(23, ""                                     );    //첨부파일코드
//                         sPstmt.setString(24, joParamObject.get("IPDPT"   ).toString() );    //조회한 자료의 IPDPT 값(창고코드)
//                         sPstmt.setString(25, joParamObject.get("POJANG"  ).toString());    //포장용기
//                         sPstmt.setString(26, joParamObject.get("POQTY"   ).toString());    //용기적입수
//                         sPstmt.setString(27, joParamObject.get("BIGO"    ).toString());    //
//
//                         sPstmt.executeUpdate();
//                    } catch(Exception ex) {
//                        System.out.println(ex.getMessage());
//                        ex.printStackTrace();
//                        bChkErr = false;
//                        sErrMessage = "DB Error: " + ex.getMessage();
//                    }
//                }
//            }
//        }
//        catch(Exception ex){
//            System.out.println(ex.getMessage());
//            ex.printStackTrace();
//            bChkErr = false;
//            sErrMessage = "DB Error: " + ex.getMessage();
//        }
//        finally{
//            disconnection();
//        }
//        
//        JSONObject joSendJson = new JSONObject();
//        joSendJson.put("Result", bChkErr);
//        joSendJson.put("InsertCnt", iCnt);
//        joSendJson.put("Message", sErrMessage);
//        return joSendJson.toString();
//    }
    
    public String startUpdate(String sModifyData, String sOrgData) {
        
        boolean bChkErr = true;
        String sErrMessage = "";
        SimpleDateFormat sDate = new SimpleDateFormat("yyyyMMdd");
        String sToDate = sDate.format(new java.util.Date()); //오늘 날짜
        
        int iCnt = 0;   //처리 건수
        try{
            JSONParser jpParser = new JSONParser();
            JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData.replaceAll("null", ""));
            JSONArray jaOrgArray = (JSONArray) jpParser.parse(sOrgData);
            
            for (int i=0; i<jaArray.size(); i++) {
                //배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
                JSONObject joParamObject = (JSONObject) jaArray.get(i);
                JSONObject joOrgObject = (JSONObject) jaOrgArray.get(i);
                
                if (!joParamObject.get("NAQTY").equals(joOrgObject.get("NAQTY"))) {
                    iCnt++;
                    String sJunPyo = sToDate + getJunPyo(sToDate) + String.format("%03d",  iCnt);
                    //System.out.println("전표번호: "+sJunPyo);
                         String SQL ="";
                         SQL  = " INSERT INTO POBLKT_HIST  ";
                         SQL += "      (  JPNO  ";      //전표번호
                         SQL += "        ,CVCOD ";      //거래처코드
                         SQL += "        ,BALJPNO   ";  //발주번호
                         SQL += "        ,BALSEQ    ";  //발주항번
                         SQL += "        ,ITNBR ";  //품번코드
                         SQL += "        ,NAQTY ";  //납품수량
                         SQL += "        ,NADATE    ";  //납기일
                         SQL += "        ,RCQTY ";      //0
                         SQL += "        ,RCDATE    ";      //null
                         SQL += "        ,BFAQTY    ";      //0
                         SQL += "        ,BPEQTY    ";      //0
                         SQL += "        ,BTEQTY    ";      //0
                         SQL += "        ,BJOQTY    ";      //0
                         SQL += "        ,STATUS    ";      //null
                         SQL += "        ,CRT_DT    ";  //자료생성날짜
                         SQL += "        ,CRT_ID    ";  //로그인한유저ID
                         SQL += "        ,FILENAME  ";  //첨부파일이름
                         SQL += "        ,PRINT_YN  ";  //거래명세서 발행여부
                         SQL += "        ,PRT_JPNO  ";  //거래명세서 전표번호
                         SQL += "        ,PSPEC ";      //조회한 자료의 PSPEC 값
                         SQL += "        ,IPSAUPJ   ";      //조회한 자료의 사업장코드
                         SQL += "        ,LOTNO ";      //LOT NO
                         SQL += "        ,QAFILE    ";      //첨부파일코드
                         SQL += "        ,DEPOT_NO  ";  //조회한 자료의 IPDPT 값(창고코드)
                         SQL += "        ,POJANG    ";      //포장용기
                         SQL += "        ,POQTY ";      //용기적입수
                         SQL += "        ,BIGO  ";          //비고
                         SQL += "        )                                  ";
                         SQL += "        VALUES                             ";
                         SQL += "      (  ? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "        ,? ";
                         SQL += "       )    ";
                         
                         ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
                         parameter.add(new comm_dataPack(1, sJunPyo));                                  //전표번호
                         parameter.add(new comm_dataPack(2, joParamObject.get("CVCOD").toString()));    //거래처코드
                         parameter.add(new comm_dataPack(3, joParamObject.get("BALJPNO").toString()));  //발주번호
                         parameter.add(new comm_dataPack(4, joParamObject.get("BALSEQ").toString()));   //발주항번
                         parameter.add(new comm_dataPack(5, joParamObject.get("ITNBR").toString()));    //품번코드
                         parameter.add(new comm_dataPack(6, joParamObject.get("NAQTY").toString()));    //납품수량
                         parameter.add(new comm_dataPack(7, joParamObject.get("NAPDATE").toString()));  //납기일
                         parameter.add(new comm_dataPack(8, "0"));
                         parameter.add(new comm_dataPack(9, ""));
                         parameter.add(new comm_dataPack(10, "0"));
                         parameter.add(new comm_dataPack(11, "0"));
                         parameter.add(new comm_dataPack(12, "0"));
                         parameter.add(new comm_dataPack(13, "0"));
                         parameter.add(new comm_dataPack(14, ""));
                         parameter.add(new comm_dataPack(15, sToDate));                                 //자료생성날짜
                         parameter.add(new comm_dataPack(16, "300007"));                                //로그인한 유저 ID
                         parameter.add(new comm_dataPack(17, joParamObject.get("PFILE").toString()));   //첨부파일이름
                         parameter.add(new comm_dataPack(18, "Y"));                                     //거래명세서 발행여부
                         parameter.add(new comm_dataPack(19, sToDate+String.format("%04d",  iCnt)));    //거래명세서 전표번호
                         parameter.add(new comm_dataPack(20, joParamObject.get("PSPEC").toString()));   //조회한 자료의 PSPEC 값
                         parameter.add(new comm_dataPack(21, joParamObject.get("IPSAUPJ").toString())); //조회한 자료의 사업장 코드
                         parameter.add(new comm_dataPack(22, joParamObject.get("LOTNO").toString()));   //LOT NO
                         parameter.add(new comm_dataPack(23, ""));                                      //첨부파일코드
                         parameter.add(new comm_dataPack(24, joParamObject.get("IPDPT").toString()));   //조회한 자료의 IPDPT 값(창고코드)
                         parameter.add(new comm_dataPack(25, joParamObject.get("POJANG").toString()));  //포장용기
                         parameter.add(new comm_dataPack(26, joParamObject.get("POQTY").toString()));   //용기적입수
                         parameter.add(new comm_dataPack(27, joParamObject.get("BIGO").toString()));    //비고
                         
                         comm_transaction controler = new comm_transaction();
                         controler.updateData(SQL, parameter);
                }
            }
        }
        catch(Exception ex){
            System.out.println(ex.getMessage());
            ex.printStackTrace();
            bChkErr = false;
            sErrMessage = "DB Error: " + ex.getMessage();
        }
        JSONObject joSendJson = new JSONObject();
        joSendJson.put("Result", bChkErr);
        joSendJson.put("InsertCnt", iCnt);
        joSendJson.put("Message", sErrMessage);
        
        return joSendJson.toString();
    }
    
    public String cancelDelete(String JsonString) {
        boolean bChkErr = true;
        String sErrMessage = "";
        
        int iCnt = 0;
        
        String sKeyJson = JsonString.replaceAll(" ", "");
        JSONArray jaArray = new JSONArray();
        JSONParser jpParser = new JSONParser();
        try {
            jaArray = (JSONArray) jpParser.parse(sKeyJson);
            for (int i=0; i<jaArray.size(); i++) {
                JSONObject joParamObject = (JSONObject) jaArray.get(i);
                iCnt++;
                try {
                    String SQL = " DELETE FROM POBLKT_HIST WHERE JPNO = ? ";
                    
                    sPstmt = sConn.prepareStatement(SQL);
                    //System.out.println("===>"+joParamObject.get("KEY").toString());
                    sPstmt.setString(1, joParamObject.get("KEY").toString());
                    sPstmt.executeUpdate();
                    sPstmt.close();
                } catch(Exception ex) {
                    System.out.println(ex.getMessage());
                    ex.printStackTrace();
                    bChkErr = false;
                    sErrMessage = "DB Error : " + ex.getMessage();
                }
            }
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            ex.printStackTrace();
            bChkErr = false;
            sErrMessage = "DB Error : " + ex.getMessage();
        }
        
        JSONObject joSendJson = new JSONObject();
        joSendJson.put("Result", bChkErr);
        joSendJson.put("DeleteCnt", iCnt);
        joSendJson.put("Message", sErrMessage);
        return joSendJson.toString();
    }
    
    public String getJunPyo(String sToDate) {
        String sJunPyo = "";
        String SQL = "{Call SP_GET_JUNPYO(?, 'P1', ?)}";
        try {
            sCstmt = sConn.prepareCall(SQL);
            sCstmt.setString(1, sToDate);
            sCstmt.registerOutParameter(2, Types.VARCHAR);
            sCstmt.execute();
            sJunPyo = String.format("%04d", sCstmt.getInt(2));
            //System.out.println("=======>" + sJunPyo);
            return sJunPyo;			
        } catch (Exception e) {
            System.out.println("getJunPyo Error: " + e.getMessage());
        }
        return "-1";
    }
    
    //DB connect
    public Connection getconnection() {
        return sConn;
    }
    
    public void disconnection() {
        try {
            sConn.close();
            //System.out.println("Disconnection");
        } catch (SQLException e) {
            System.out.println("Disconnection Error: " + e.getMessage());
        }
    }
}
