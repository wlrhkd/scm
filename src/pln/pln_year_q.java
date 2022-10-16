package pln;

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

import org.apache.jasper.tagplugins.jstl.core.ForEach;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import comm.comm_transaction;
import comm.comm_util;
import comm.comm_dataPack;
import comm.comm_dbConnect;
import comm.comm_message;
import comm.combo.comm_reffpf_c;

@WebServlet("/pln_year_q")
public class pln_year_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public pln_year_q() {
        super();
}
  
    private int iStartPage,iLength;
    private String sErrMessage = "";
    private CallableStatement sCstmt = null;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        String sGubunCode = request.getParameter("SearchGubun");
        //ord_chul_DAO_e dbDAO = new ord_chul_DAO_e();
        
        comm_reffpf_c rfcod = new comm_reffpf_c();
        comm_message message = new comm_message();
        
        JSONObject joListData = null;
        switch(sGubunCode) {
            case "saupj":
                //joListData = saupj.getSaupj(); 
                joListData = rfcod.getReffpf("02"); // SABU컬럼 값이 없어서 조회X 추후 변경 예정
                break;
            case "inputCvcod":
                String sCvcod = request.getParameter("Cvcod");
                joListData = getCvnas(sCvcod);
                break;
            case "inputItnbr": // 품명
	            String sItnbr = request.getParameter("Itnbr");
	            joListData = getItnbr(sItnbr);
	            break;
            case "message":
                String sCode = request.getParameter("Code");
                joListData = message.getMessage(sCode);
                //System.out.println(sCode);
                //System.out.println(joListData);
                break;
        }
        response.getWriter().write(joListData.toString());
        //response.getWriter().write(joMsgData.toString());
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        
        String sModifyData = "";
        String sActGubun = request.getParameter("ActGubun");
        
        //ord_chul_DAO_e dbDAO = new ord_chul_DAO_e();
        
        switch(sActGubun) {
             case "R":	//조회
                 String sPage      = request.getParameter("Page");
                 String sPageLength= request.getParameter("PageLength");    //페이지당 row 갯수
                 
                 String sYyyy     = request.getParameter("Yyyy");         //계획년도
                 String sCvcod   = request.getParameter("Cvcod");           //업체코드
                 String sSaupj = request.getParameter("Saupj");	            //사업장
                 String sItnbr   =  request.getParameter("Itnbr");	        //품번
                 String sItdsc     = request.getParameter("Itdsc");	        //품명
                
                 System.out.println(sYyyy);
                 System.out.println(sCvcod);
                 System.out.println(sSaupj);
                 System.out.println(sItnbr);
                 System.out.println(sItdsc);
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sYyyy,sCvcod,sSaupj,sItnbr,sItdsc));
                 break;                     
             case "Rs": // 테이블 헤더
            	 response.getWriter().write(startSelectS().toString());
            	 break;
             case "getAuth":	// 시스템관리자 / 사용자 구분
            	 String sID  = request.getParameter("ID");	        //품목구분
            	 response.getWriter().write(getAuth(sID).toString());
            	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sYyyy, String sCvcod,
            String sSaupj, String sItnbr, String sItdsc) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sYyyy, sCvcod, sSaupj, sItnbr, sItdsc);     
     
        //System.out.println("iPageNo : " + iPageNo);
        //System.out.println("joListData : " + joListData);
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    
    //품번 조회
    public JSONObject getItnbr(String sItnbr){
    	String SQL = " SELECT ITNBR, "
    			+ "	          ITDSC "
    			+ "    FROM ITEMAS "
    			+ "    WHERE ITNBR = ? ";
    	JSONObject joCvnas = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sItnbr));
    	
    	comm_transaction controler = new comm_transaction();
    	try {
    		joCvnas = controler.selectData(SQL,parameters);
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    	//System.out.println(joSaupj);
    	return joCvnas;
    }
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
    

    //년간 자재계획 현황 조회
    public JSONObject startSelect(String sYyyy,String sCvcod, String sSaupj,
                                  String sItnbr, String sItdsc) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = "					 	SELECT "
        		+ " 	 					A.YYYY, "
        		+ "       					A.SAUPJ, "
        		+ "       					A.CVCOD,"
        		//+ 						" /*FUN_GET_CVNAS(A.CVCOD) AS CVNAS,*/"
        		+ "       					A.ITNBR, "
        		+ "        					C.ITDSC, "
        		+ "        					C.ISPEC , "
        		+ "          				C.JIJIL , "
        		+ "         				A.UNPRC, "
        		+ "          				A.MINQT, "
        		+ "        					A.MONMAX, "
        		+ "                         A.PORATE, "
        		+ "                         A.QTP_01, "
        		+ "                         A.QTY_01, "
        		+ "                            ROUND(A.QTY_01*A.UNPRC/1000,0) AS AMT_01, "
        		+ "                         A.QTP_02, "
        		+ "                         A.QTY_02, "
        		+ "                            ROUND(A.QTY_02*A.UNPRC/1000,0) AS AMT_02, "
        		+ "                         A.QTP_03, "
        		+ "                         A.QTY_03, "
        		+ "                            ROUND(A.QTY_03*A.UNPRC/1000,0) AS AMT_03, "
        		+ "                         A.QTP_04, "
        		+ "                         A.QTY_04, "
        		+ "                            ROUND(A.QTY_04*A.UNPRC/1000,0) AS AMT_04, "
        		+ "                         A.QTP_05, "
        		+ "                         A.QTY_05, "
        		+ "                            ROUND(A.QTY_05*A.UNPRC/1000,0) AS AMT_05, "
        		+ "                         A.QTP_06, "
        		+ "                         A.QTY_06, "
        		+ "                            ROUND(A.QTY_06*A.UNPRC/1000,0) AS AMT_06, "
        		+ "                         A.QTP_07, "
        		+ "                         A.QTY_07, "
        		+ "                            ROUND(A.QTY_07*A.UNPRC/1000,0) AS AMT_07, "
        		+ "                         A.QTP_08, "
        		+ "                         A.QTY_08, "
        		+ "                            ROUND(A.QTY_08*A.UNPRC/1000,0) AS AMT_08, "
        		+ "                         A.QTP_09, "
        		+ "                         A.QTY_09, "
        		+ "                            ROUND(A.QTY_09*A.UNPRC/1000,0) AS AMT_09, "
        		+ "                         A.QTP_10, "
        		+ "                         A.QTY_10, "
        		+ "                            ROUND(A.QTY_10*A.UNPRC/1000,0) AS AMT_10, "
        		+ "                         A.QTP_11, "
        		+ "                         A.QTY_11, "
        		+ "                            ROUND(A.QTY_11*A.UNPRC/1000,0) AS AMT_11, "
        		+ "                         A.QTP_12, "
        		+ "                         A.QTY_12, "
        		+ "                            ROUND(A.QTY_12*A.UNPRC/1000,0) AS AMT_12, "
        		+ "                             (A.QTY_01 + A.QTY_02 + A.QTY_03 + A.QTY_04 + A.QTY_05 + A.QTY_06 + A.QTY_07 + A.QTY_08 + A.QTY_09 + A.QTY_10 + A.QTY_11 + A.QTY_12 ) SUM , "
        		+ "                         A.CNFTIME, "
        		+ "                         A.VNDCNF, "
        		+ "                         A.VNDRMKS "
        		+ "                    FROM PU01_YEARPLAN A, "
        		+ "                            ITEMAS C "
        		+ "                    WHERE A.YYYY LIKE ? "
        		+ "                     AND A.CVCOD LIKE ? "
        		+ "                     AND A.SAUPJ LIKE ? "
        		+ "                     AND A.ITNBR = C.ITNBR "
        		+ "                     AND A.ITNBR LIKE ? "
        	    + "						AND NVL(C.ITDSC, ' ') LIKE ? ";
        
        JSONObject joStartData = new JSONObject();
        
        
        //거래처 코드
        if (sCvcod == null || sCvcod == "") {
            sCvcod = "%"; 
        }
        //사업장
        if (sSaupj == null || sSaupj == "") {
            sSaupj = "%";
        } else {
            //sSaupj = "1";
            sSaupj = "10";
        }
        //품번
        if (sItnbr == null || sItnbr == "") {
            sItnbr = "%";
        }
        //품명
        if (sItdsc == null || sItdsc == "") {
            sItdsc = "%";
        }
      
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
        parameters.add(new comm_dataPack(1, sYyyy));
        parameters.add(new comm_dataPack(2, sCvcod));
        parameters.add(new comm_dataPack(3, sSaupj));
        parameters.add(new comm_dataPack(4, sItnbr));
        parameters.add(new comm_dataPack(5, sItdsc));
/*
        System.out.println("sYyyy : " + sYyyy);
        System.out.println("sCvcod : " + sCvcod);
        System.out.println("sSaupj : " + sSaupj);
        System.out.println("sItnbr : " + sItnbr);
        System.out.println("sItdsc : " + sItdsc);
*/
        System.out.println(sYyyy);
        System.out.println(sCvcod);
        System.out.println(sSaupj);
        System.out.println(sItnbr);
        System.out.println(sItdsc);
        
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
    // 매뉴 오픈 시 테이블 헤더 출력
    public JSONObject startSelectS() {
    	String sResult = null;
    	
    	String SQL = " SELECT ' ' AS ITNBR, "
    			+ "         ' ' AS ITDSC, "
    			+ "         ' ' AS ISPEC, "
    			+ "         ' ' AS JIJIL, "
    			+ "         ' ' AS SUM, "
    			+ "         ' ' AS QTY_01, "
    			+ "         ' ' AS QTY_02, "
    			+ "			' ' AS QTY_03, "
    			+ "			' ' AS QTY_04, "
    			+ "			' ' AS QTY_05, "
    			+ "         ' ' AS QTY_06, "
    			+ "         ' ' AS QTY_07, "
    			+ "         ' ' AS QTY_08, "
    			+ "         ' ' AS QTY_09, "
    			+ "         ' ' AS QTY_10, "
    			+ "         ' ' AS QTY_11, "
    			+ "         ' ' AS QTY_12 "
    			+ "           FROM DUAL "
    			+ "     CONNECT BY LEVEL <= 21 ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	
    	comm_transaction controler = new comm_transaction();      
    	
    	try {
    		joStartData = controler.selectData(SQL);
    		System.out.println("jostartData :" + joStartData);
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
