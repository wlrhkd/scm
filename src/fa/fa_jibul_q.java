package fa;

import java.io.IOException;




import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import comm.comm_transaction;
import comm.comm_util;
import comm.comm_dataPack;
import comm.comm_dbConnect;
import comm.comm_message;
import comm.combo.comm_reffpf_c;

@WebServlet("/fa_jibul_q")
public class fa_jibul_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public fa_jibul_q() {
        super();
    }
  
    private int iStartPage,iLength;
    private String sErrMessage = "";
    private CallableStatement sCstmt = null;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        String sGubunCode = request.getParameter("SearchGubun");
        
        comm_reffpf_c rfcod = new comm_reffpf_c();
        comm_message message = new comm_message();
        
        JSONObject joListData = null;
        switch(sGubunCode) {
            case "saupj":
                //joListData = saupj.getSaupj();
                joListData = rfcod.getReffpf("02");
                break;            
            case "inputCvcod":
                String sCvcod = request.getParameter("Cvcod");
                joListData = getCvnas(sCvcod);
                break;
            case "message":
                String sCode = request.getParameter("Code");
                joListData = message.getMessage(sCode);
                break;            
        }
        response.getWriter().write(joListData.toString());
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        
        String sModifyData = "";
        String sActGubun = request.getParameter("ActGubun");
        
        switch(sActGubun) {
             case "R":	//조회
                 String sPage      = request.getParameter("Page");
                 String sPageLength= request.getParameter("PageLength");    //페이지당 row 갯수
                 
                 String sYymm     = request.getParameter("Yymm");         //마감년월
                 
                 String sCvcod   = request.getParameter("Cvcod");           //업체코드
                 String sSaupj = request.getParameter("Saupj");	            //사업장
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sYymm,sCvcod,sSaupj));
                 break;                     
             case "RE":	// 테이블 형태
            	 response.getWriter().write(startSelectE().toString());
            	 break;
             case "getAuth":	// 시스템관리자 / 사용자 구분
            	 String sID  = request.getParameter("ID");	        //품목구분
            	 response.getWriter().write(getAuth(sID).toString());
            	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sYymm, String sCvcod,
            String sSaupj) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sYymm, sCvcod, sSaupj);     
     
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }

    //거래처코드 조회
    public JSONObject getCvnas(String sCvcod){
        String SQL = " SELECT CVCOD, CVNAS FROM VNDMST WHERE CVCOD = ? ";
        JSONObject joCvnas = new JSONObject();
        
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sCvcod));
        
        comm_transaction controler = new comm_transaction();
        try {
            joCvnas = controler.selectData(SQL,parameters);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return joCvnas;
    }
    
    // 조회
    public JSONObject startSelect(String sYymm, String sCvcod, String sSaupj) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = "	SELECT      TO_CHAR(TO_DATE(KFZ.GYEL_DATE) , 'YYYY.MM.DD') AS GYUL_DATE, "
        		+ "			 		NVL(SUM(KFZ.CASHAMT + KFZ.DEPOTAMT + KFZ.BILLAMT),0) AS TOTAMT, "
        		+ "			 		NVL(SUM(KFZ.CASHAMT + KFZ.DEPOTAMT),0) AS CASHAMT, "
        		+ "			 		NVL(SUM(KFZ.BILLAMT),0) AS BILLAMT, "
        		+ "					'' AS BIN, "
        		+ "					A.SAUPJ, "
        		+ "					A.SAUP_NO, "
        		+ "					SUBSTR(KFZ.GYEL_DATE,0,4) AS YY, "
        		+ "					SUBSTR(KFZ.GYEL_DATE,4,2) AS MM, "
        		+ "					FUN_GET_CVNAS(A.SAUP_NO) AS CVNAS "
        		+ "			 	FROM KFZ19OT3 KFZ, KFZ19OT2 A "
        		+ "			   WHERE KFZ.GYEL_DATE = A.GYEL_DATE "
        		+ "			   	 AND KFZ.SEQNO = A.SEQNO "
        		+ "			   	 AND A.GYEL_DATE LIKE ? "
        		+ "				 AND A.SAUPJ LIKE ? "
        		+ "				 AND A.SAUP_NO LIKE ? "
        		+ "			GROUP BY KFZ.GYEL_DATE, A.SAUPJ, A.SAUP_NO "
        		+ "";
        
        JSONObject joStartData = new JSONObject();
        
        
        //사업장
        if (sSaupj == null || sSaupj == "") {
        	sSaupj = "%";
        } else {
        	sSaupj = "10";
        }
        //거래처 코드
        if (sCvcod == null || sCvcod == "") {
            sCvcod = "%"; 
        }
        //지불년월
        if (sYymm == null || sYymm == "") {
        	sYymm = "%"; 
        }
        
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
        parameters.add(new comm_dataPack(1, sYymm));
        parameters.add(new comm_dataPack(2, sSaupj));
        parameters.add(new comm_dataPack(3, sCvcod));
/*
        System.out.println("sSaupj : " + sSaupj);
        System.out.println("sYymm : " + sYymm);
        System.out.println("sCvcod : " + sCvcod);
*/
        
        comm_transaction controler = new comm_transaction();      
      
        try {
            joStartData = controler.selectData(SQL,parameters);
            System.out.println("joStartData : " + joStartData);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }
        
        return joStartData;
    }
    // 테이블 형태
    public JSONObject startSelectE() {
    	String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = "	SELECT ' ' AS SAUPJ, "
    			+ "			   ' ' AS CVNAS,"
    			+ "			   ' ' AS GYUL_DATE,	"
    			+ "			   ' ' AS TOTAMT,	"
    			+ "			   ' ' AS CASHAMT,	"
    			+ "			   ' ' AS BILLAMT,	"
    			+ "			   ' ' AS BIN	"
    			+ "		   FROM DUAL "
    			+ "		CONNECT BY LEVEL <= 12 ";
    	JSONObject joStartData = new JSONObject();
    	comm_transaction controler = new comm_transaction();      
    	try {
    		joStartData = controler.selectData(SQL);
//    		System.out.println("joStartData : " + joStartData);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	
    	return joStartData;
    }
    // 시스템관리자 / 사용자 구분
    public JSONObject getAuth(String sID) {
    	String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = " SELECT AUTH FROM SCM_LOGIN_T WHERE CHG_ID = ? ";
    	
    	ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
    	parameter.add(new comm_dataPack(1, sID));
    	
    	JSONObject joStartData = new JSONObject();
    	comm_transaction controler = new comm_transaction();  
    	
    	try {
    		joStartData = controler.selectData(SQL,parameter);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	
    	return joStartData;
    }
}
