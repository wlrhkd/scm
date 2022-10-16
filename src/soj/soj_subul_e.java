package soj;

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

@WebServlet("/soj_subul_e")
public class soj_subul_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public soj_subul_e() {
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
                 
                 String sYymm     = request.getParameter("Yymm");         //기준년월
                 
                 String sCvcod   = request.getParameter("Cvcod");           //업체코드
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sYymm,sCvcod));
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
    
    public String getJson(String sPage, String sPageLength, String sYymm, String sCvcod) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sYymm, sCvcod);     
     
        //System.out.println("iPageNo : " + iPageNo);
        //System.out.println("joListData : " + joListData);
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
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
    
    //사급 요청 등록
    public JSONObject startSelect(String sYymm, String sCvcod) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = " SELECT S1.CVCOD, S1.ITNBR, S1.PSPEC,  "
//        		+ "             NVL(SUM(S1.IWOL_STOCK_QTY),0) AS JUN_QTY, "
//        		+ "             NVL(SUM(S1.IN_QTY),0) AS IN_QTY, "
//        		+ "				NVL(SUM(S1.OUT_QTY),0) AS OUT_QTY, "
//        		+ "             NVL(SUM(S1.IWOL_PAYQTY),0) AS JUN_PQTY, "
//        		+ "             NVL(SUM(S1.IN_PAYQTY),0) AS IN_PQTY, "
//        		+ "				NVL(SUM(S1.OUT_PAYQTY),0) AS OUT_PQTY, "
        		+ "             V.CVNAS2, I.ITDSC, "
//        		+ "             DECODE(I.ISPEC_CODE,NULL,I.JIJIL,I.JIJIL||'-'||I.ISPEC_CODE) AS JIJIL, "
        		+ "             I.ISPEC AS ISPEC, I.UNMSR, "
        		+ "             DECODE(S1.OPSEQ, '9999', '전체', FUN_GET_OPDSC(S1.ITNBR, S1.OPSEQ)) AS OPDSC, "
//        		+ " 		 JUN_QTY + S1.IN_QTY - S1.OUT_QTY AS JEGO_QTY, "
        		+ "          fun_danmst_waiju_jaje( S1.ITNBR, S1.CVCOD, TO_CHAR(SYSDATE,'YYYYMMDD')) AS DANGA "
        		+ "      FROM STOCKMONTH_VENDOR S1, VNDMST V, ITEMAS I "
        		+ "     WHERE S1.BASE_YYMM LIKE ? "
        		+ "        AND (S1.CVCOD LIKE ?) "
        		+ "        AND S1.CVCOD = V.CVCOD (+) "
        		+ "        AND S1.ITNBR = I.ITNBR (+) "
//        		+ " GROUP BY S1.CVCOD, S1.ITNBR, S1.PSPEC, V.CVNAS2, I.ITDSC, "
//        		+ "          I.JIJIL, I.UNMSR, S1.OPSEQ "
        		+ " ORDER BY S1.CVCOD, S1.ITNBR ";
        
        JSONObject joStartData = new JSONObject();
        
        
        //거래처 코드
        if (sCvcod == null || sCvcod == "") {
            sCvcod = "%"; 
        }

        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
        parameters.add(new comm_dataPack(1, sYymm));
        parameters.add(new comm_dataPack(2, sCvcod));

        System.out.println("sYymm : " + sYymm);
        System.out.println("sCvcod : " + sCvcod);
        
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
    			+ "         ' ' AS UNMSR, "
    			+ "         ' ' AS JUN_QTY, "
    			+ "         ' ' AS IN_QTY, "
    			+ "         ' ' AS OUT_QTY, "
    			+ "			' ' AS JEGO_QTY, "
    			+ "			' ' AS CVNAS2, "
    			+ "			' ' AS DANGA "
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
