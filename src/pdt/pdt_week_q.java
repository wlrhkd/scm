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

@WebServlet("/pdt_week_q")
public class pdt_week_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public pdt_week_q() {
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
                 
                 String sYymd     = request.getParameter("Yymd");        	//계획일자
                 
                 String sItnbr   =  request.getParameter("Itnbr");	        //품번
                 String sItdsc     = request.getParameter("Itdsc");	        //품명
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sYymd,sItnbr,sItdsc));
                 break;  
             case "Rs": // 테이블 헤더
            	 response.getWriter().write(startSelectS().toString());
            	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sYymd, String sItnbr, String sItdsc) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sYymd, sItnbr, sItdsc);     
     
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
    
    //주간 상품계획 조회
    public JSONObject startSelect(String sYymd, String sItnbr, String sItdsc) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = " SELECT rownum,  "
        		+ "          A.ITNBR,  "
        		+ "          C.ITDSC,  "
        		+ "          C.ISPEC,  "
        		+ "          C.JIJIL,  "
        		+ "          (A.DDQTY1 + A.DDQTY2 + A.DDQTY3 + A.DDQTY4 + A.DDQTY5 + A.DDQTY6 + A.DDQTY7) as sum ,  "
        		+ "          A.DDQTY1 as D1,  "
        		+ "          A.DDQTY2 as D2,  "
        		+ "          A.DDQTY3 as D3,  "
        		+ "          A.DDQTY4 as D4,  "
        		+ "          A.DDQTY5 as D5,  "
        		+ "          A.DDQTY6 as D6,  "
        		+ "          A.DDQTY7 as D7,  "
        		+ "          0 as D8,  "
        		+ "          0 as D9,  "
        		+ "          0 as D10,  "
        		+ "          0 as D11,  "
        		+ "          0 as D12,  "
        		+ "          0 as D13,  "
        		+ "          0 as D14,  "
        		+ "          '10'  AS SAUPJ,  "
        		+ "            decode(c.ittyp, '1', fun_get_carcode(a.itnbr), fun_get_cartype(a.itnbr)) as carcode  "
        		+ "    FROM weekplan_sum A,  "
        		+ "          ITEMAS C  "
        		+ "  WHERE A.PDTGU = '1'  "
        		+ "     AND A.YYMMDD = ?  "
        		+ "     AND A.ITNBR = C.ITNBR  "
        		+ "    AND A.MOGUB = 0  "
        		+ "    AND C.ITNBR LIKE ? "
        		+ "    AND NVL(C.ITDSC,' ') LIKE ? ";
        
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
        parameters.add(new comm_dataPack(1, sYymd));
        parameters.add(new comm_dataPack(2, sItnbr));
        parameters.add(new comm_dataPack(3, sItdsc));
/*
        System.out.println("sYymd : " + sYymd);
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
    			+ "         ' ' AS D1, "
    			+ "         ' ' AS D2, "
    			+ "			' ' AS D3, "
    			+ "			' ' AS D4, "
    			+ "			' ' AS D5, "
    			+ "         ' ' AS D6, "
    			+ "         ' ' AS D7, "
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
