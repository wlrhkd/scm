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

@WebServlet("/soj_sagub_q")
public class soj_sagub_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public soj_sagub_q() {
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
                joListData = rfcod.getReffpf("02");
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
                 
                 String sFdate     = request.getParameter("Fdate");         //시작일
                 String sTdate     = request.getParameter("Tdate");         //종료일
                 
                 String sCvcod   = request.getParameter("Cvcod");           //업체코드
                 String sSaupj = request.getParameter("Saupj");	            //사업장
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sFdate,sTdate,sCvcod,sSaupj));
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
    
    public String getJson(String sPage, String sPageLength, String sFdate, String sTdate, String sCvcod,
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
        joListData = startSelect(sFdate, sTdate, sCvcod, sSaupj);     
     
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
    
    //현황 조회
    public JSONObject startSelect(String sFdate,String sTdate,String sCvcod, String sSaupj) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = "    SELECT H.CVCOD, H.ITNBR, '2' AS SEQ, "
        		+ "       H.IO_DATE, H.IOJPNO, Z.IONAM, "
        		+ "       0 AS IPGO, "
        		+ "        H.IOQTY * Z.CALVALUE AS CHUL, "
        		+ "        H.IOAMT * Z.CALVALUE AS AMT, "
        		+ "       0 AS JEGO, 0 AS PJEGO, H.BIGO, "
        		+ "       V.CVNAS2, I.ITDSC,  "
//        		+ "       DECODE(I.ISPEC_CODE,NULL,I.JIJIL,I.JIJIL||'-'||I.ISPEC_CODE) AS JIJIL, "
        		+ "       I.ISPEC AS ISPEC ,H.PSPEC, I.UNMSR, H.IOGBN, H.OPSEQ, "
//        		+ "       DECODE(H.OPSEQ,'9999','전체', FUN_GET_OPDSC(H.ITNBR, H.OPSEQ)) AS OPDSC, "
        		+ "       H.IOPRC AS DANGA, "
        		+ "      H.SAUPJ "
        		+ "        FROM IMHIST H, VNDMST V, ITEMAS I, IOMATRIX Z "
        		+ "        WHERE H.SAUPJ = '1' AND "
        		+ "          H.IO_DATE BETWEEN ? AND ? AND "
        		+ "           H.CVCOD LIKE ? AND "
        		+ "           H.ITNBR = I.ITNBR AND "
        		+ "           H.CVCOD = V.CVCOD AND "
        		+ "          H.IOGBN = Z.IOGBN AND "
        		+ "          H.SAUPJ LIKE ? "
        		+ " AND ( Z.IOGBN = 'OY2' ) ";
        
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
        }
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sFdate));        
        parameters.add(new comm_dataPack(2, sTdate));
        parameters.add(new comm_dataPack(3, sCvcod));
        parameters.add(new comm_dataPack(4, sSaupj));
/*
        System.out.println("sFdate : " + sFdate);
        System.out.println("sTdate : " + sTdate);
        System.out.println("sCvcod : " + sCvcod);
        System.out.println("sSaupj : " + sSaupj);
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
 // 매뉴 오픈 시 테이블 헤더 출력
    public JSONObject startSelectS() {
    	String sResult = null;
    	
    	String SQL = " SELECT ' ' AS IO_DATE, "
    			+ "         ' ' AS IONAM, "
    			+ "         ' ' AS ITNBR, "
    			+ "         ' ' AS ITDSC, "
    			+ "         ' ' AS ISPEC, "
    			+ "         ' ' AS UNMSR, "
    			+ "         ' ' AS CHUL, "
    			+ "			' ' AS DANGA, "
    			+ "			' ' AS AMT, "
    			+ "			' ' AS IOJPNO, "
    			+ "			' ' AS BIGO, "
    			+ "			' ' AS CVNAS2 "
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
