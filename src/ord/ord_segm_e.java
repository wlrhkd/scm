package ord;

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

@WebServlet("/ord_segm_e")
public class ord_segm_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ord_segm_e() {
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
            case "ittyp":
                //joListData = ittyp.getIttyp();
                joListData = rfcod.getReffpf("15");
                break;
            case "pojang":
                //joListData = pojang.getPojang();
                joListData = rfcod.getReffpf("2T");
                //System.out.println(joListData);
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
                 String sFdate     = request.getParameter("Fdate");         //시작일
                 String sTdate     = request.getParameter("Tdate");         //종료일
                 String sCvcod   = request.getParameter("Cvcod");           //업체코드
                 String sSaupj = request.getParameter("Saupj");	            //사업장
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sFdate,sTdate,sCvcod,sSaupj));
                 break;
                 
             case "D": // 상세 조회
            	 String sCvcod2   = request.getParameter("Cvcod");           //업체코드
                 String sMayymm     = request.getParameter("Mayymm");         //년월
                 String sMayysq = request.getParameter("Mayysq");	            //마감순번
                 response.getWriter().write(getJson_s(sCvcod2,sMayymm,sMayysq));
                 break;
                 
             case "Rs": // 상단 헤더
            	 response.getWriter().write(startSelectS().toString());
            	 break;
            	 
             case "Ds": // 하단 헤더
            	 response.getWriter().write(detailSelectS().toString());
            	 break;
             case "getAuth":	// 시스템관리자 / 사용자 구분
            	 String sID  = request.getParameter("ID");	     
            	 response.getWriter().write(getAuth(sID).toString());
            	 break;
        }
    }
    
    // 테이블
    public String getJson(String sPage, String sPageLength, String sFdate, String sTdate, String sCvcod,
            String sSaupj) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        
        if(sPage.equals("")){
            iPageNo = 1;
        } else {
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sFdate, sTdate, sCvcod, sSaupj);
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    
    public String getJson_s(String sCvcod2, String sMayymm, String sMayysq) throws IOException{
    	
    	JSONObject joListData = null;

        joListData = detailSelect(sCvcod2, sMayymm, sMayysq); 
        
        return joListData.toString();
    }
    
    // 거래처코드 조회
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
    
    //매출확정 조회
    public JSONObject startSelect(String sFdate,String sTdate,String sCvcod, String sSaupj) {
        String sResult = null;
      
        String SQL = " SELECT A.MAYYMM  , "
        		+ "        A.MAYYSQ  , "
        		+ "        A.CVCOD   , "
        		+ "        A.MAGUBN  , "
        		+ "        A.MAAMT   , "
        		+ "        A.MAVAT   , "        		
        		+ "        A.MASTDAT , "
        		+ "        A.MAEDDAT , "
        		+ "        A.CRTDAT  , "
        		+ "        A.POLCNO  , "
        		+ "        A.POBLNO  , "
        		+ "        A.POCURR  , "
        		+ "        A.PRATE   , "
        		+ "        A.PWAIAMT , "
        		+ "        A.SAUPJ   , "
        		+ "        A.IPAMT   , "
        		+ "        A.GONGAMT , "
     //   		+ "        0 AS CLAMT , "
//        		+ "        '계산서발행' AS D1 , "
        		+ "        NULL AS GIBGBN  , "
        		+ "        NULL AS MAGBSQ  , "
        		+ "        FUN_GET_CVNAS(A.CVCOD) AS CVNAS, "
        		+ "        FUN_GET_REFFPF('AD', A.SAUPJ) AS SAUPJ, "
        		+ "        DECODE(C.BUY_DEPT, NULL, '미발행', '발행') AS GUBUN , "
        		+ "        B.SALEDT, "
        		+ "        B.SALENO, "
        		+ "        '0' AS ROWSTATUS, "
        		+ "        0 AS IS_CHEK "
        		+ "   	   FROM MAHIST A, "
        		+ "        MAEIPH B, "
        		+ "        ERPACC.KIF01OT0 C "
        		+ " WHERE ( A.MAYYMM  BETWEEN ? AND ? ) AND "
        		+ "       ( A.CVCOD LIKE ? ) AND "
        		+ "       ( A.SAUPJ LIKE ? ) AND "
        		+ "       ( A.MAYYMM = B.MAYYMM  (+)) AND "
        		+ "       ( A.MAYYSQ = B.MAYYSQ (+)) AND "
        		+ "       ( A.CVCOD  = B.CVCOD   (+)) AND "
        		+ "       ( A.MAYYMM = C.MAYYMM  (+)) AND "
        		+ "       ( A.MAYYSQ = C.MAYYSEQ (+)) AND "
        		+ "       ( A.CVCOD  = C.CVCOD   (+)) "
        		+ " ORDER BY A.CVCOD, A.MAYYSQ ";
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
        
//        System.out.println(sFdate);
//        System.out.println(sTdate);
//        System.out.println(sCvcod);
//        System.out.println(sSaupj);
        
        comm_transaction controler = new comm_transaction();     
      
        try {
            joStartData = controler.selectData(SQL,parameters);
            System.out.println("joStartData = " + joStartData);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }
        return joStartData;
    }
  //매출확정 상세 조회
    public JSONObject detailSelect(String sCvcod2, String sMayymm, String sMayysq) {
        String sResult = null;
      
        String SQL = " SELECT A.CVCOD, "
        		+ "         E.CVNAS2, "
        		+ "         A.MAYYMM, "
        		+ "         A.MAYYSQ, "
        		+ "         A.CRTDAT, "
        		+ "         A.MAGUBN, "
        		+ "         A.MAAMT, "
        		+ "         A.MAVAT, "
        		+ "         A.IPAMT, "
        		+ "         A.GONGAMT, "
        		+ "         A.SAUPJ, "
        		+ "         A.MASTDAT, "
        		+ "         A.MAEDDAT, "
        		+ "         B.INSDAT, "
        		+ "         B.IOJPNO, "
        		+ "         B.IOGBN, "
        		+ "         B.ITNBR, "
        		+ "         D.ITDSC, "
        		+ "         D.ISPEC, "
        		+ "         D.JIJIL , "
        		+ "         (B.IOPEQTY + B.IOSUQTY) * C.CALVALUE AS CNQTY, "
        		+ "         B.IOPRC, "
        		+ "         TRUNC(DECODE(C.AMTGU,'Y', B.IOAMT * C.CALVALUE, "
        		+ "                     (B.IOPEQTY + B.IOSUQTY) * B.IOPRC * C.CALVALUE), 0)- TRUNC(NVL(B.GONGQTY,0) * NVL(B.GONGPRC,0), 0) AS IOAMT, "
        		+ "         TRUNC(DECODE(C.AMTGU,'Y', B.IOAMT * C.CALVALUE, "
        		+ "                     (B.IOPEQTY + B.IOSUQTY) * B.IOPRC * C.CALVALUE), 0) AS SAMT, "
        		+ "          TRUNC(NVL(B.GONGQTY,0) * NVL(B.GONGPRC,0), 0) AS GAMT, "
        		+ "         DECODE(O.BUYDT, NULL, 'N', 'Y') AS GUBUN, "
        		+ "		ROUND(IOAMT * 0.1,0) AS VOAMT, "
        		+ "      0 as is_chek "
        		+ "     FROM MAHIST A, IMHIST B, IOMATRIX C, ITEMAS D, VNDMST E, ERPACC.KIF01OT0 O "
        		+ "     WHERE ( A.CVCOD = ? ) "
        		+ "     AND ( A.MAYYMM = ?   ) "
        		+ "     AND ( A.MAYYSQ = ?  ) "
        		+ "     AND ( A.SAUPJ = B.SAUPJ ) "
        		+ "     AND ( A.MAYYMM = B.MAYYMM ) "
        		+ "     AND ( A.MAYYSQ = B.MAYYSQ ) "
        		+ "     AND ( A.CVCOD  = B.CVCOD ) "
        		+ "     AND ( B.IOGBN  = C.IOGBN ) "
        		+ "     AND   ( B.ITNBR  = D.ITNBR ) "
        		+ "     AND ( A.CVCOD  = E.CVCOD ) "
        		+ "     AND ( A.MAYYMM = O.MAYYMM  (+)) "
        		+ "     AND ( A.MAYYSQ = O.MAYYSEQ (+)) "
        		+ "     AND ( A.CVCOD  = O.CVCOD   (+)) "
        		+ " 	ORDER BY B.INSDAT ";
        
        JSONObject joStartData = new JSONObject();
        
      //거래처 코드
        if (sCvcod2 == null || sCvcod2 == "") {
        	sCvcod2 = "300008"; 
        }
        
        if (sMayymm == null || sMayymm == "") {
        	sMayymm = "200912";
        } 
        
        if (sMayysq == null || sMayysq == "") {
        	sMayysq = "1";
        } 
        
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sCvcod2));
        parameters.add(new comm_dataPack(2, sMayymm));
        parameters.add(new comm_dataPack(3, sMayysq));
        
	        System.out.println(sCvcod2);
	        System.out.println(sMayymm);
	        System.out.println(sMayysq);
        
        comm_transaction controler = new comm_transaction();      
      
        try {
            joStartData = controler.selectData(SQL,parameters);
            	System.out.println("jostartData :" + joStartData);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }
        return joStartData;
    }
 // 메뉴 오픈 시 상단 테이블 헤더만 노출
    public JSONObject startSelectS() {
    	String sResult = null;
    	
    	String SQL = " SELECT ' ' AS CVCOD, "
    			+ "         ' ' AS CVNAS, "
    			+ "         ' ' AS MAYYMM, "
    			+ "         ' ' AS MAYYSQ, "
    			+ "         ' ' AS CRTDAT, "
    			+ "         ' ' AS MAGUBN, "
    			+ "			' ' AS CNQTY, "
    			+ "			' ' AS IOPRC, "
    			+ "			' ' AS VOAMT, "
    			+ "         ' ' AS MAAMT, "
    			+ "         ' ' AS MAVAT, "
    			+ "         ' ' AS IPAMT, "
    			+ "         ' ' AS GONGAMT, "
    			+ "         ' ' AS SAUPJ, "
    			+ "         ' ' AS MASTDAT, "
    			+ "         ' ' AS MAEDDAT, "
    			+ "         ' ' AS INSDAT, "
    			+ "         ' ' AS IOJPNO, "
    			+ "         ' ' AS IOGBN, "
    			+ "         ' ' AS ITNBR, "
    			+ "         ' ' AS ITDSC, "
    			+ "         ' ' AS ISPEC, "
    			+ "         ' ' AS JIJIL , "
    			+ "         ' ' AS IOAMT, "
    			+ "         ' ' AS SAMT, "
    			+ "         ' ' AS D1, "
    			+ "         ' ' AS GUBUN, "
    			+ "           0 AS IS_CHEK "
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
    
    // 메뉴 오픈 시 하단 테이블 헤더만 노출
    public JSONObject detailSelectS() {
    	String sResult = null;
    	
    	String SQL = " SELECT ' ' AS CVCOD, "
    			+ "         ' ' AS CVNAS2, "
    			+ "         ' ' AS MAYYMM, "
    			+ "         ' ' AS MAYYSQ, "
    			+ "         ' ' AS CRTDAT, "
    			+ "         ' ' AS MAGUBN, "
    			+ "			' ' AS CNQTY, "
    			+ "			' ' AS IOPRC, "
    			+ "			' ' AS VOAMT, "
    			+ "         ' ' AS MAAMT, "
    			+ "         ' ' AS MAVAT, "
    			+ "         ' ' AS IPAMT, "
    			+ "         ' ' AS GONGAMT, "
    			+ "         ' ' AS SAUPJ, "
    			+ "         ' ' AS MASTDAT, "
    			+ "         ' ' AS MAEDDAT, "
    			+ "         ' ' AS INSDAT, "
    			+ "         ' ' AS IOJPNO, "
    			+ "         ' ' AS IOGBN, "
    			+ "         ' ' AS ITNBR, "
    			+ "         ' ' AS ITDSC, "
    			+ "         ' ' AS ISPEC, "
    			+ "         ' ' AS JIJIL , "
    			+ "         ' ' AS IOAMT, "
    			+ "         ' ' AS SAMT, "
    			+ "         ' ' AS GAMT, "
    			+ "         ' ' AS GUBUN, "
    			+ "           0 AS IS_CHEK "
    			+ "           FROM DUAL "
    			+ "     CONNECT BY LEVEL <= 20 ";
    	
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
