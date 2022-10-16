package pdt;

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

@WebServlet("/pdt_mon_q")
public class pdt_mon_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public pdt_mon_q() {
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
                 
                 String sYymm     = request.getParameter("Yymm");         //계획년월
                 
                 String sItnbr   =  request.getParameter("Itnbr");	        //품번

                 String sItdsc   =  request.getParameter("Itdsc");	        //품명
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sYymm,sItnbr,sItdsc));
                 break;  
             case "Rs": // 테이블 헤더
            	 response.getWriter().write(startSelectS().toString());
            	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sYymm, String sItnbr, String sItdsc) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sYymm, sItnbr, sItdsc);     
     
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
    
    //월간 생산계획 현황 조회
    public JSONObject startSelect(String sYymm, String sItnbr, String sItdsc) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = " SELECT A.ITNBR,  "
        		+ "    C.ITDSC,  "
        		+ "    C.ISPEC,  "
        		+ "    C.JIJIL,  "
        		+ "    (A.WEEKQTY1+A.WEEKQTY2+A.WEEKQTY3+A.WEEKQTY4+A.WEEKQTY5+A.WEEKQTY6) AS SUM,  "
        		+ "    A.WEEKQTY1 AS QTY_01,  "
        		+ "    A.WEEKQTY2 AS QTY_02,  "
        		+ "    A.WEEKQTY3 AS QTY_03,  "
        		+ "    A.WEEKQTY4 AS QTY_04,  "
        		+ "    A.WEEKQTY5 AS QTY_05,  "
        		+ "    A.WEEKQTY6 AS QTY_06,  "
        		+ "    NVL(A.MONQTY1, 0) AS M1,  "
        		+ "    NVL(A.MONQTY2, 0) AS M2,  "
        		+ "    0 AS M3,  "
        		+ " 0 AS M4,  "
        		+ "    '' AS SAUPJ,  "
        		+ "     DECODE(C.ITTYP, '1', FUN_GET_CARCODE(A.ITNBR), FUN_GET_CARTYPE(A.ITNBR)) AS CARCODE  "
        		+ " FROM MONPLAN_SUM A,  "
        		+ "     ITEMAS C  "
        		+ " WHERE A.CHASU = '1'  "
        		+ "  AND A.MONYYMM = ?  "
        		+ "  AND A.MOGUB = 0  "
        		+ "  AND A.ITNBR = C.ITNBR  "
        		+ "  AND A.ITNBR LIKE ?  "
        		+ "  AND NVL(C.ITDSC ,' ') LIKE ? "
        		+ "  ORDER BY A.ITNBR  ";
        
        JSONObject joStartData = new JSONObject();
        
        
        //품번
        if (sItnbr == null || sItnbr == "") {
            sItnbr = "%";
        }
        //품명
        if (sItdsc == null || sItdsc == "") {
            sItdsc = "%";
        }
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
        parameters.add(new comm_dataPack(1, sYymm));
        parameters.add(new comm_dataPack(2, sItnbr));
        parameters.add(new comm_dataPack(3, sItdsc));
/*
        System.out.println("sYymm : " + sYymm);
        System.out.println("sCvcod : " + sCvcod);
        System.out.println("sSaupj : " + sSaupj);
        System.out.println("sItnbr : " + sItnbr);
        System.out.println("sItdsc : " + sItdsc);
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
    			+ "         ' ' AS M1, "
    			+ "         ' ' AS M2, "
    			+ "         ' ' AS CARCODE "
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
   
}
