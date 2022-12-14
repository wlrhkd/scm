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

@WebServlet("/qlt_proqa_e")
public class qlt_proqa_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public qlt_proqa_e() {
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
             case "R":	//??????
                 String sPage      = request.getParameter("Page");
                 String sPageLength= request.getParameter("PageLength");    //???????????? row ??????
                 
                 String sFdate     = request.getParameter("Fdate");         //?????????
                 String sTdate     = request.getParameter("Tdate");         //?????????

                 String sCvcod   = request.getParameter("Cvcod");           //????????????
                 String sSaupj   = request.getParameter("Saupj");           //?????????
                 
                 iStartPage = Integer.parseInt(sPage);
//                 iLength = 10;
//                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sFdate,sTdate,sCvcod,sSaupj));
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
    
    public String getJson(String sPage, String sPageLength, String sFdate, String sTdate, String sCvcod, String sSaupj) throws IOException{
        int iTotalRecords = 0;	//????????????
        int iRecordPerPage = Integer.parseInt(sPageLength);	//???????????? ????????? ???
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        //SQL?????? ?????????
        joListData = startSelect(sFdate, sTdate, sCvcod, sSaupj);
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
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
        //System.out.println(joSaupj);
        return joCvnas;
    }
    
    //?????? ?????? ?????? ??????
    public JSONObject startSelect(String sFdate,String sTdate, String sCvcod, String sSaupj) {
        String sResult = null;
      
        String SQL = "SELECT ROWNUM AS NO, Y.FAGBN AS IONAM  , "
        		+ "       fun_get_cvnas(Y.CVCOD) as CVCOD, "
        		+ "         Y.BALSITE_DT   AS INSDAT , "
        		+ "         Y.ITNBR    AS ITNBR  , "
        		+ "         Z.ITDSC    AS ITDSC  , "
        		+ "         Y.BALQTY  AS IOFAQTY , "
        		+ "         replace(REPLACE(Y.BALTXT , CHR(10) , ' ')  , chr(13), ' ') as IOFATXT, "
        		+ "         Y.FAGNO      AS IOJPNO , "
        		+ "         Y.SUBMIT_YDT AS JOCHYDAT, "
        		+ "         Y.JOCHWDAT   AS JOCHWDAT, "
        		+ "         NVL(Y.SUBMIT_YN , 'N')  AS SUBMIT_YN, "
        		+ "         ''  AS BIN, "
        		+ "       ''  AS DAE, "
        		+ "         Y.SAUPJ "
        		+ "  FROM IMHFAG Y , "
        		+ "         ITEMAS Z "
        		+ " WHERE Y.ITNBR  = Z.ITNBR "
//        		+ "/*   AND Y.STATUS = 'Y'    */ "
        		+ "   AND Y.SAUPJ like ? "
        		+ "   AND Y.BALSITE_DT BETWEEN ? AND ? "
        		+ "   AND Y.CVCOD like ? "
        		+ "    AND EXISTS ( SELECT 'X' FROM VNDMST WHERE CVCOD = Y.CVCOD AND CVGU IN ('1','2') ) "
//        		+ "/*    AND EXISTS ( SELECT 'X' FROM VNDMST WHERE CVCOD = Y.CVCOD AND CVGU IN ('1','2') AND (GUMAEYN = 'Y' OR OYJUYN = 'Y' OR OYJUGAYN = 'Y') )    */ "
        		+ "ORDER BY Y.BALSITE_DT";
        JSONObject joStartData = new JSONObject();
        
        //????????? ??????
        if (sCvcod == null || sCvcod == "") {
            sCvcod = "%"; 
        }
        //?????????
        if (sSaupj == null || sSaupj == "") {
            sSaupj = "%";
        } else {
            sSaupj = "10";
        }
            
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sSaupj));
        parameters.add(new comm_dataPack(2, sFdate));
        parameters.add(new comm_dataPack(3, sTdate));
        parameters.add(new comm_dataPack(4, sCvcod));
        
        comm_transaction controler = new comm_transaction();      
      
        try {
            joStartData = controler.selectData(SQL,parameters);
            System.out.println(joStartData);
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
    	
    	String SQL = " SELECT ' ' AS NO, "
    			+ "         ' ' AS CVCOD, "
    			+ "         ' ' AS IONAM, "
    			+ "         ' ' AS INSDAT, "
    			+ "         ' ' AS ITNBR, "
    			+ "         ' ' AS ITDSC, "
    			+ "         ' ' AS IOFAQTY, "
    			+ "			' ' AS IOFATXT, "
    			+ "			' ' AS JOCHYDAT, "
    			+ "			' ' AS BIN, "
    			+ "         ' ' AS DAE, "
    			+ "         ' ' AS SUBMIT_YN, "
    			+ "         ' ' AS JOCHWDAT, "
    			+ "         ' ' AS SAUPJ "
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

