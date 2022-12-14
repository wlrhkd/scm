package qlt;

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

@WebServlet("/qlt_prebul_q")
public class qlt_prebul_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public qlt_prebul_q() {
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
        
        //ord_chul_DAO_e dbDAO = new ord_chul_DAO_e();
        
        switch(sActGubun) {
             case "R":	//??????
                 String sPage      = request.getParameter("Page");
                 String sPageLength= request.getParameter("PageLength");    //???????????? row ??????
                 
                 String sFdate     = request.getParameter("Fdate");         //?????????
                 String sTdate     = request.getParameter("Tdate");         //?????????
                 
                 String sCvcod   = request.getParameter("Cvcod");           //????????????
                 
                 iStartPage = Integer.parseInt(sPage);
//                 iLength = 10;
//                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sFdate,sTdate,sCvcod));
                 break;  
                 
             case "Rs": // ????????? ??????
            	 response.getWriter().write(startSelectS().toString());
            	 break;
             case "getAuth":	// ?????????????????? / ????????? ??????
            	 String sID  = request.getParameter("ID");	        //????????????
            	 response.getWriter().write(getAuth(sID).toString());
            	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sFdate, String sTdate, String sCvcod
           ) throws IOException{
        int iTotalRecords = 0;	//????????????
        int iRecordPerPage = Integer.parseInt(sPageLength);	//???????????? ????????? ???
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sFdate, sTdate, sCvcod);     
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    
    private JSONObject startSelect(String sFdate, String sTdate, String sCvcod) {
    	String sResult = null;
        
        // sql ??? ????????? "  " ???????????? ????????? ??????????????? ????????? ????????? D1FROM ??????  from ?????? ?????? ?????????. 
        String SQL = "select a.crt_date,  "
        		+ "       a.shpjpno,  "
//        		+ "     /*  b.pinbr, */ -- ???????????? "
        		+ "       b.itnbr,  "
        		+ "       c.itdsc,  "
        		+ "       c.ispec,   "
        		+ "       c.jijil,  "
        		+ "       fun_get_cartype(b.itnbr) as cartype,  "
        		+ "       a.gucod,  "
        		+ "       d.rfna2 as hcode_name,  "
        		+ "       b.guqty  "
//        		+ "     /*  b.ioprc  */ -- ???????????? "
//        		+ "     /*  b.ioamt, */ "
//        		+ "  /*     a.ioamt   */ "
        		+ "  from shpfat    a,  "
        		+ "       shpfat b,  "
        		+ "       itemas           c,  "
        		+ "       reffpf           d  "
        		+ " where a.crt_date   between substr(?,1,6) and substr(?,1,6)||'31'  "
        		+ "   and a.cvcod   like ?  "
        		+ "   and a.fat_gbn = '2'  /* ?????? ?????? ?????? */  "
        		+ "   and a.gubun    = b.gubun  "
        		+ "   and a.shpjpno = b.shpjpno  "
        		+ "   and b.itnbr   = c.itnbr  "
//        		+ "  /* and d.rfgub    = '1'  */   -- ???????????? "
        		+ "   and d.rfcod   = '33'  "
        		+ "   and a.gucod   = d.rfgub  "
        		+ " order by   b.ITNBR, a.crt_date  ";
        
        JSONObject joStartData = new JSONObject();
        
        
        //????????? ??????
        if (sCvcod == null || sCvcod == "") {
            sCvcod = "%"; 
        }

        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
        parameters.add(new comm_dataPack(1, sFdate));
        parameters.add(new comm_dataPack(2, sTdate));
        parameters.add(new comm_dataPack(3, sCvcod));
        
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

    // ?????? ?????? ??? ????????? ?????? ??????
    public JSONObject startSelectS() {
    	String sResult = null;
    	
    	String SQL = " SELECT ' ' AS ITNBR, "
    			+ "         ' ' AS ITDSC, "
    			+ "         ' ' AS ISPEC, "
    			+ "         ' ' AS JIJIL, "
    			+ "         ' ' AS SUM, "
    			+ "         ' ' AS CRT_DATE, "
    			+ "         ' ' AS GUCOD, "
    			+ "			' ' AS GUQTY "
    			+ "           	FROM DUAL "
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
	//??????????????? ??????
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
        return joCvnas;
    }
    // ?????????????????? / ????????? ??????
    public JSONObject getAuth(String sID) {
    	String sResult = null;
    	
    	// sql ??? ????????? "  " ???????????? ????????? ??????????????? ????????? ????????? D1FROM ??????  from ?????? ?????? ?????????. 
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
