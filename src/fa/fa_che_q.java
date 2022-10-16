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

import com.sun.javafx.scene.paint.GradientUtils.Parser;

import comm.comm_transaction;
import comm.comm_util;
import comm.comm_dataPack;
import comm.comm_dbConnect;
import comm.comm_message;
import comm.combo.comm_reffpf_c;

@WebServlet("/fa_che_q")
public class fa_che_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public fa_che_q() {
        super();
    }
  
    private int iStartPage,iLength;
    private String sErrMessage = "";
    private CallableStatement sCstmt = null;
    
    String sScode = null;
    String sEcode = null;
    
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
        
        comm_util cUtil = new comm_util();
        
        switch(sActGubun) {
             case "R":	//좌측 조회
                 String sPage       = request.getParameter("Page");
                 String sPageLength = request.getParameter("PageLength");     //페이지당 row 갯수
                 
                 String sYymm       = request.getParameter("Yymm");           //마감년월
                 
                 String sCvcod      = request.getParameter("Cvcod");          //업체코드
                 String sSaupj      = request.getParameter("Saupj");	      //사업장
                 
                 sScode = cUtil.getDataname("A", "1", "9");         //SCODE
//                 System.out.println("@@@### sScode = " + sScode);
                 sEcode      = cUtil.getDataname("A", "1", "10");        //ECODE
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sYymm,sCvcod,sSaupj,sScode,sEcode));
                 break;
                 
             case "RS":	//우측 조회
            	 sYymm       = request.getParameter("Yymm");           //마감년월
            	 
            	 sCvcod      = request.getParameter("Cvcod");          //업체코드
            	 sSaupj      = request.getParameter("Saupj");	       //사업장
            	 
            	 sScode      = cUtil.getDataname("A", "1", "9");		   //SCODE
            	 sEcode      = cUtil.getDataname("A", "1", "10");        //ECODE
            	 
            	 String sRw  = request.getParameter("Rw");
            	 
            	 String sCode1 = "";
            	 String sCode2 = "";
            	 // scode
            	 if(sRw == "1") { // 외상매출금
            		 sCode1 = sScode.substring(0, 7);
            		 sCode2 = sScode.substring(7, 7);
            	 } else if(sRw == "2") { // 받을어음
            		 sCode1 = sScode.substring(14, 7);
            		 sCode2 = sScode.substring(21, 7);
            	 } else if(sRw == "3") { // 미수금
            		 sCode1 = sScode.substring(28, 7);
            		 sCode2 = sScode.substring(35, 7);
            	 } else if(sRw == "4") { // 선급금
            		 sCode1 = sScode.substring(42, 7);
            		 sCode2 = sScode.substring(49, 7);
            	 } 
            	 // ecode
            	 else if(sRw == "5") { // 외상매입금
            		 sCode1 = sEcode.substring(0, 7);
            		 sCode2 = sEcode.substring(7, 7);
            	 } else if(sRw == "6") { // 선수금
            		 sCode1 = sEcode.substring(42, 7);
            		 sCode2 = sEcode.substring(49, 7);
            	 } else if(sRw == "7") { // 미지급금
            		 sCode1 = sEcode.substring(28, 7);
            		 sCode2 = sEcode.substring(35, 7);
            	 } else if(sRw == "8") { // 지급어음
            		 sCode1 = sEcode.substring(14, 7);
            		 sCode2 = sEcode.substring(21, 7);
            	 }
            	 
            	 response.getWriter().write(getJsonS(sYymm,sCvcod,sSaupj,sScode,sEcode,sCode1,sCode2));
            	 break;                     
             case "RE":	//우측 테이블 형태만 
            	 response.getWriter().write(startSelectS().toString());
            	 break;     
             case "getAuth":	// 시스템관리자 / 사용자 구분
            	 String sID  = request.getParameter("ID");	        //품목구분
            	 response.getWriter().write(getAuth(sID).toString());
            	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sYymm, String sCvcod,
            String sSaupj, String sScode, String sEcode) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sYymm, sCvcod, sSaupj, sScode, sEcode);     
     
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    public String getJsonS(String sYymm, String sCvcod,
    		String sSaupj, String sScode, String sEcode, String sCode1, String sCode2) throws IOException{
    	JSONObject joListData = null;
    	joListData = startSelectS(sYymm, sCvcod, sSaupj, sScode, sEcode, sCode1, sCode2);     
    	
    	return joListData.toString();
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
    
    // 좌측 조회
    public JSONObject startSelect(String sYymm, String sCvcod, String sSaupj, String sScode, String sEcode) {
        String sResult = null;
      
        String sSdate = sYymm + "00";
        String sEdate = sYymm + "31";
        String sScode1 = sScode.substring(0, 7);			//외상매출금 From
        String sScode2 = sScode.substring(7, 14);			//외상매출금 To
        String sScode3 = sScode.substring(14, 21);			//받을어음 From
        String sScode4 = sScode.substring(21, 28);			//받을어음 To
        String sScode5 = sScode.substring(28, 35);			//미수금 From
        String sScode6 = sScode.substring(35, 42);			//미수금 To
        String sScode7 = sScode.substring(42, 49);			//선급금 From  --선급금의 경우 대표계정만 가져감
        String sScode8 = sScode.substring(49, 56);			//선급금 To  --선급금의 경우 대표계정만 가져감
        
//        System.out.println("sEdate = " + sEdate);
//        System.out.println("sSdate = " + sSdate);
//        System.out.println("sSaupj = " + sSaupj);
//        System.out.println("sCvcod = " + sCvcod);
//        System.out.println("sScode1 = " + sScode1);
//        System.out.println("sScode8 = " + sScode8);
        
        String sEcode1 = sEcode.substring(0, 7);			//외상매입금 From
        String sEcode2 = sEcode.substring(7, 14);			//외상매입금 To
        String sEcode3 = sEcode.substring(14, 21);			//지급어음 From
        String sEcode4 = sEcode.substring(21, 28);			//지급어음 To
        String sEcode5 = sEcode.substring(28, 35);			//미지급금 From
        String sEcode6 = sEcode.substring(35, 42);			//미지급금 To
        String sEcode7 = sEcode.substring(42, 49);			//선수금 From  
        String sEcode8 = sEcode.substring(49, 56);			//선수금 To  
        
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = " SELECT 'A' AS GRP, '1' AS RW, '외상매출금' AS COL, "
        		+ "			  NVL(IJAN1, 0) AS IA, "
        		+ "			  NVL(DJAN1, 0) AS DDRA, "
        		+ "			  NVL(CJAN1, 0) AS DCRA, "
        		+ "			  NVL(RJAN1, 0) AS RA "
        		+ "      FROM (SELECT 	SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , 0, A.DR_AMT - A.CR_AMT)) AS IJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.DR_AMT, 0)) AS DJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.CR_AMT, 0)) AS CJAN1, "
        		+ "						SUM(A.DR_AMT - A.CR_AMT) AS RJAN1 "
        		+ "				 FROM 	KFZ13OT0 A, KFZ01OM0 B "
        		+ "		   		WHERE 	A.ACC1_CD = B.ACC1_CD "
        		+ "			    	AND	A.ACC2_CD = B.ACC2_CD "
        		+ "			    	AND	A.SAUPJ LIKE ? "
        		+ "  			    AND	A.ACC_YY||A.ACC_MM  >= ? "
        		+ "			    	AND	A.ACC_YY||A.ACC_MM  <= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD >= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD <= ? "
        		+ " 			    AND	A.SAUP_NO LIKE ? ) "
        		+ "	UNION ALL "
        		+ "		SELECT 'A', '2', '받을어음', "
        		+ "				NVL(IJAN1, 0) AS IA, "
        		+ "				NVL(DJAN1, 0) AS DDRA, "
        		+ "				NVL(CJAN1, 0) AS DCRA, "
        		+ "				NVL(RJAN1, 0) AS RA "
        		+ "		  FROM (SELECT 	SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , 0, A.DR_AMT - A.CR_AMT)) AS IJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.DR_AMT, 0)) AS DJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.CR_AMT, 0)) AS CJAN1, "
        		+ "						SUM(A.DR_AMT - A.CR_AMT) AS RJAN1 "
        		+ "			 	  FROM 	KFZ13OT0 A, KFZ01OM0 B "
        		+ "		   		 WHERE 	A.ACC1_CD = B.ACC1_CD "
        		+ "			    	AND	A.ACC2_CD = B.ACC2_CD "
        		+ "			    	AND	A.SAUPJ LIKE ? "
        		+ "  			    AND	A.ACC_YY||A.ACC_MM  >= ? "
        		+ "			    	AND	A.ACC_YY||A.ACC_MM  <= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD >= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD <= ? "
        		+ " 			    AND	A.SAUP_NO LIKE ? ) "
        		+ "	UNION ALL "
        		+ "		SELECT 'A', '3', '미수금', "
        		+ "				NVL(IJAN1, 0) AS IA, "
        		+ "				NVL(DJAN1, 0) AS DDRA, "
        		+ "				NVL(CJAN1, 0) AS DCRA, "
        		+ "				NVL(RJAN1, 0) AS RA "
        		+ "		  FROM (SELECT 	SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , 0, A.DR_AMT - A.CR_AMT)) AS IJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.DR_AMT, 0)) AS DJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.CR_AMT, 0)) AS CJAN1, "
        		+ "						SUM(A.DR_AMT - A.CR_AMT) AS RJAN1 "
        		+ "				  FROM 	KFZ13OT0 A, KFZ01OM0 B "
        		+ "		  		 WHERE 	A.ACC1_CD = B.ACC1_CD "
        		+ "			   		AND	A.ACC2_CD = B.ACC2_CD "
        		+ "			    	AND	A.SAUPJ LIKE ? "
        		+ "  			    AND	A.ACC_YY||A.ACC_MM  >= ? "
        		+ "			    	AND	A.ACC_YY||A.ACC_MM  <= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD >= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD <= ? "
        		+ " 			    AND	A.SAUP_NO LIKE ? ) "
        		+ "	UNION ALL "
        		+ "		SELECT 'A', '4', '선급금', "
        		+ "				NVL(IJAN1, 0) AS IA, "
        		+ "				NVL(DJAN1, 0) AS DDRA, "
        		+ "				NVL(CJAN1, 0) AS DCRA, "
        		+ "				NVL(RJAN1, 0) AS RA "
        		+ "		  FROM (SELECT 	SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , 0, A.DR_AMT - A.CR_AMT)) AS IJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.DR_AMT, 0)) AS DJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.CR_AMT, 0)) AS CJAN1, "
        		+ "						SUM(A.DR_AMT - A.CR_AMT) AS RJAN1 "
        		+ "			 	 FROM 	KFZ13OT0 A, KFZ01OM0 B "
        		+ "		   		WHERE 	A.ACC1_CD = B.ACC1_CD "
        		+ "			    	AND	A.ACC2_CD = B.ACC2_CD "
        		+ "			    	AND	A.SAUPJ LIKE ? "
        		+ "  			    AND	A.ACC_YY||A.ACC_MM  >= ? "
        		+ "			    	AND	A.ACC_YY||A.ACC_MM  <= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD >= ? "
        		+ "			   		AND A.ACC1_CD||A.ACC2_CD <= ? "
        		+ " 			    AND	A.SAUP_NO LIKE ? ) "
        		+ "	UNION ALL "
        		+ "		SELECT 'A', '', '채권합', "
        		+ "				0 AS TIA, "
        		+ "				0 AS TDDRA, "
        		+ "				0 AS TDCRA, "
        		+ "				0 AS TRA "
        		+ "		  FROM DUAL "
        		+ "	UNION ALL "
        		+ "		SELECT 'B', '5' ,'외상매입금', "
        		+ "				NVL(IJAN1, 0) AS IA, "
        		+ "				NVL(DJAN1, 0) AS DDRA, "
        		+ "				NVL(CJAN1, 0) AS DCRA, "
        		+ "				NVL(RJAN1, 0) AS RA "
        		+ "		  FROM (SELECT 	SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , 0, A.DR_AMT - A.CR_AMT)) AS IJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.DR_AMT, 0)) AS DJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.CR_AMT, 0)) AS CJAN1, "
        		+ "						SUM(A.DR_AMT - A.CR_AMT) AS RJAN1 "
        		+ "			 	 FROM 	KFZ13OT0 A, KFZ01OM0 B "
        		+ "		   		WHERE 	A.ACC1_CD = B.ACC1_CD "
        		+ "			    	AND	A.ACC2_CD = B.ACC2_CD "
        		+ "			    	AND	A.SAUPJ LIKE ? "
        		+ "  			    AND	A.ACC_YY||A.ACC_MM  >= ? "
        		+ "			    	AND	A.ACC_YY||A.ACC_MM  <= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD >= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD <= ? "
        		+ " 			    AND	A.SAUP_NO LIKE ? ) "
        		+ "	UNION ALL "
        		+ "		SELECT 'B', '6','선수금', "
        		+ "				NVL(IJAN1, 0) AS IA, "
        		+ "				NVL(DJAN1, 0) AS DDRA, "
        		+ "				NVL(CJAN1, 0) AS DCRA, "
        		+ "				NVL(RJAN1, 0) AS RA "
        		+ "		  FROM (SELECT 	SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , 0, A.DR_AMT - A.CR_AMT)) AS IJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.DR_AMT, 0)) AS DJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.CR_AMT, 0)) AS CJAN1, "
        		+ "						SUM(A.DR_AMT - A.CR_AMT) AS RJAN1 "
        		+ "				 FROM 	KFZ13OT0 A, KFZ01OM0 B "
        		+ "			   	WHERE 	A.ACC1_CD = B.ACC1_CD "
        		+ "				    AND	A.ACC2_CD = B.ACC2_CD "
        		+ "				    AND	A.SAUPJ LIKE ? "
        		+ "  			    AND	A.ACC_YY||A.ACC_MM  >= ? "
        		+ "				    AND	A.ACC_YY||A.ACC_MM  <= ? "
        		+ "			   		AND A.ACC1_CD||A.ACC2_CD >= ? "
        		+ "			   		AND A.ACC1_CD||A.ACC2_CD <= ? "
        		+ " 			    AND	A.SAUP_NO LIKE ? ) "
        		+ "	UNION ALL "
        		+ "		SELECT 'B', '7','미지급금', "
        		+ "				NVL(IJAN1, 0) AS IA, "
        		+ "				NVL(DJAN1, 0) AS DDRA, "
        		+ "				NVL(CJAN1, 0) AS DCRA, "
        		+ "				NVL(RJAN1, 0) AS RA "
        		+ "		  FROM (SELECT 	SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , 0, A.DR_AMT - A.CR_AMT)) AS IJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.DR_AMT, 0)) AS DJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.CR_AMT, 0)) AS CJAN1, "
        		+ "						SUM(A.DR_AMT - A.CR_AMT) AS RJAN1 "
        		+ "				 FROM 	KFZ13OT0 A, KFZ01OM0 B "
        		+ "		   		WHERE 	A.ACC1_CD = B.ACC1_CD "
        		+ "			   	 	AND	A.ACC2_CD = B.ACC2_CD "
        		+ "			    	AND	A.SAUPJ LIKE ? "
        		+ "  			    AND	A.ACC_YY||A.ACC_MM  >= ? "
        		+ "			    	AND	A.ACC_YY||A.ACC_MM  <= ? "
        		+ "			    	AND    A.ACC1_CD||A.ACC2_CD >= ? "
        		+ "			    	AND    A.ACC1_CD||A.ACC2_CD <= ? "
        		+ " 			    AND	A.SAUP_NO LIKE ? ) "
        		+ "	UNION ALL "
        		+ "		SELECT 'B', '8','지급어음', "
        		+ "				NVL(IJAN1, 0) AS IA, "
        		+ "				NVL(DJAN1, 0) AS DDRA, "
        		+ "				NVL(CJAN1, 0) AS DCRA, "
        		+ "				NVL(RJAN1, 0) AS RA "
        		+ "		  FROM (SELECT 	SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , 0, A.DR_AMT - A.CR_AMT)) AS IJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.DR_AMT, 0)) AS DJAN1, "
        		+ "						SUM(DECODE(A.ACC_YY||A.ACC_MM, ? , A.CR_AMT, 0)) AS CJAN1, "
        		+ "						SUM(A.DR_AMT - A.CR_AMT) AS RJAN1 "
        		+ "				 FROM 	KFZ13OT0 A, KFZ01OM0 B "
        		+ "		  		 WHERE 	A.ACC1_CD = B.ACC1_CD "
        		+ "			  	  	AND	A.ACC2_CD = B.ACC2_CD "
        		+ "			   		AND	A.SAUPJ LIKE ? "
        		+ "  			    AND	A.ACC_YY||A.ACC_MM  >= ? "
        		+ "			    	AND	A.ACC_YY||A.ACC_MM  <= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD >= ? "
        		+ "			    	AND A.ACC1_CD||A.ACC2_CD <= ? "
        		+ " 			    AND	A.SAUP_NO LIKE ? ) "
        		+ " UNION ALL "
        		+ "     SELECT 'B', '', '채무합', "
        		+ "        	   0 AS TIA, "
        		+ "        	   0 AS TDDRA, "
        		+ "        	   0 AS TDCRA, "
        		+ "        	   0 AS TRA "
        		+ "       FROM DUAL ";
        
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
        
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
        parameters.add(new comm_dataPack(1, sEdate));
        parameters.add(new comm_dataPack(2, sEdate));
        parameters.add(new comm_dataPack(3, sEdate));
        parameters.add(new comm_dataPack(4, sSaupj));
        parameters.add(new comm_dataPack(5, sSdate));
        parameters.add(new comm_dataPack(6, sEdate));
        parameters.add(new comm_dataPack(7, sScode1));
        parameters.add(new comm_dataPack(8, sScode2));
        parameters.add(new comm_dataPack(9, sCvcod));
        
        parameters.add(new comm_dataPack(10, sEdate));
        parameters.add(new comm_dataPack(11, sEdate));
        parameters.add(new comm_dataPack(12, sEdate));
        parameters.add(new comm_dataPack(13, sSaupj));
        parameters.add(new comm_dataPack(14, sSdate));
        parameters.add(new comm_dataPack(15, sEdate));
        parameters.add(new comm_dataPack(16, sScode3));
        parameters.add(new comm_dataPack(17, sScode4));
        parameters.add(new comm_dataPack(18, sCvcod));
        
        parameters.add(new comm_dataPack(19, sEdate));
        parameters.add(new comm_dataPack(20, sEdate));
        parameters.add(new comm_dataPack(21, sEdate));
        parameters.add(new comm_dataPack(22, sSaupj));
        parameters.add(new comm_dataPack(23, sSdate));
        parameters.add(new comm_dataPack(24, sEdate));
        parameters.add(new comm_dataPack(25, sScode5));
        parameters.add(new comm_dataPack(26, sScode6));
        parameters.add(new comm_dataPack(27, sCvcod));
        
        parameters.add(new comm_dataPack(28, sEdate));
        parameters.add(new comm_dataPack(29, sEdate));
        parameters.add(new comm_dataPack(30, sEdate));
        parameters.add(new comm_dataPack(31, sSaupj));
        parameters.add(new comm_dataPack(32, sSdate));
        parameters.add(new comm_dataPack(33, sEdate));
        parameters.add(new comm_dataPack(34, sScode7));
        parameters.add(new comm_dataPack(35, sScode8));
        parameters.add(new comm_dataPack(36, sCvcod));
        
        parameters.add(new comm_dataPack(37, sEdate));
        parameters.add(new comm_dataPack(38, sEdate));
        parameters.add(new comm_dataPack(39, sEdate));
        parameters.add(new comm_dataPack(40, sSaupj));
        parameters.add(new comm_dataPack(41, sSdate));
        parameters.add(new comm_dataPack(42, sEdate));
        parameters.add(new comm_dataPack(43, sEcode1));
        parameters.add(new comm_dataPack(44, sEcode2));
        parameters.add(new comm_dataPack(45, sCvcod));
        
        parameters.add(new comm_dataPack(46, sEdate));
        parameters.add(new comm_dataPack(47, sEdate));
        parameters.add(new comm_dataPack(48, sEdate));
        parameters.add(new comm_dataPack(49, sSaupj));
        parameters.add(new comm_dataPack(50, sSdate));
        parameters.add(new comm_dataPack(51, sEdate));
        parameters.add(new comm_dataPack(52, sEcode7));
        parameters.add(new comm_dataPack(53, sEcode8));
        parameters.add(new comm_dataPack(54, sCvcod));
        
        parameters.add(new comm_dataPack(55, sEdate));
        parameters.add(new comm_dataPack(56, sEdate));
        parameters.add(new comm_dataPack(57, sEdate));
        parameters.add(new comm_dataPack(58, sSaupj));
        parameters.add(new comm_dataPack(59, sSdate));
        parameters.add(new comm_dataPack(60, sEdate));
        parameters.add(new comm_dataPack(61, sEcode5));
        parameters.add(new comm_dataPack(62, sEcode6));
        parameters.add(new comm_dataPack(63, sCvcod));
        
        parameters.add(new comm_dataPack(64, sEdate));
        parameters.add(new comm_dataPack(65, sEdate));
        parameters.add(new comm_dataPack(66, sEdate));
        parameters.add(new comm_dataPack(67, sSaupj));
        parameters.add(new comm_dataPack(68, sSdate));
        parameters.add(new comm_dataPack(69, sEdate));
        parameters.add(new comm_dataPack(70, sEcode3));
        parameters.add(new comm_dataPack(71, sEcode4));
        parameters.add(new comm_dataPack(72, sCvcod));
        
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
    
    // 우측 테이블 형태만
    public JSONObject startSelectS() {
    	String sResult = null;
    	
    	String SQL = " SELECT ' ' AS ACC_DATE, "
    			+ "			  ' ' AS JUN_NO,	"
    			+ "			  ' ' AS DR, "
    			+ "		      ' ' AS CR "
    			+ "		 FROM DUAL "
    			+ "     CONNECT BY LEVEL <= 10 ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	comm_transaction controler = new comm_transaction();      
    	
    	try {
    		joStartData = controler.selectData(SQL);
//    		System.out.println("jostartData :" + joStartData);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	return joStartData;
    }
    //우측조회
    public JSONObject startSelectS(String sYymm, String sCvcod, String sSaupj, String sScode, String sEcode, String sCode1, String sCode2) {
    	String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = " SELECT ACC_DATE, "
    			+ "			  JUN_NO,	"
    			+ "			  DECODE(DCR_GU, 1 , AMT,0) AS DR, "
    			+ "		      DECODE(DCR_GU, 2 , AMT,0) AS CR "
    			+ "		 FROM KFZ10OT0 "
    			+ "		WHERE SAUPJ Like ? "
    			+ "		  AND ACC_DATE like ? "
    			+ "		  AND SAUP_NO like ? "
    			+ "		  AND ACC1_CD||ACC2_CD >= ? "
    			+ "		  AND ACC1_CD||ACC2_CD <= ? ";
    	
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
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
    	parameters.add(new comm_dataPack(1, sSaupj));
    	parameters.add(new comm_dataPack(2, sYymm));
    	parameters.add(new comm_dataPack(3, sCvcod));
    	parameters.add(new comm_dataPack(4, sCode1));
    	parameters.add(new comm_dataPack(5, sCode2));
    	
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
