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

@WebServlet("/ord_card_q")
public class ord_card_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ord_card_q() {
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
        
        switch(sActGubun) {
             case "R":	//??????
                 String sPage      = request.getParameter("Page");
                 String sPageLength= request.getParameter("PageLength");    //???????????? row ??????
                 
                 String sGubun     = request.getParameter("Gubun");		//????????? ????????? ???
                 
                 String sFdate     = request.getParameter("Fdate");         //?????????
                 String sTdate     = request.getParameter("Tdate");         //?????????

                 String sCvcod   = request.getParameter("Cvcod");           //????????????
                 String sSaupj = request.getParameter("Saupj");	            //?????????
                 
                 System.out.println("sGubun =" + sGubun);
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sGubun,sFdate,sTdate,sCvcod,sSaupj));
                 break;
             case "Rs": // ?????? ??????
            	 response.getWriter().write(startSelectS().toString());
            	 break;
             case "getAuth":	// ?????????????????? / ????????? ??????
            	 String sID  = request.getParameter("ID");	     
            	 response.getWriter().write(getAuth(sID).toString());
            	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sGubun, String sFdate, String sTdate, String sCvcod,String sSaupj) throws IOException{
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
        joListData = startSelect(sGubun, sFdate, sTdate, sCvcod, sSaupj);
        
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
    public JSONObject startSelect(String sGubun, String sFdate,String sTdate, String sCvcod, String sSaupj) {
        String sResult = null;
      
        String SQL = "	   SELECT SUBSTR(A.JPNO,1,12) AS JPNO, "
        		+ "        SUBSTR(A.JPNO,13,15) AS JPNO_SEQ, "
        		+ "        SUBSTR(A.JPNO,1,12) AS JPNUM, "
        		+ "        A.CRT_DT, "
        		+ "        A.BALJPNO, "
        		+ "        A.BALSEQ, "
        		+ "        A.ITNBR, "
        		+ "        B.ITDSC, "
        		+ "        B.ISPEC, "
        		+ "        B.JIJIL, "
        		+ "        B.UNMSR , "
        		+ "        A.NAQTY, "
        		+ "        0 AS IS_CHEK, "
        		+ "        '0' AS ROWSTATUS, "
        		+ "        A.IPSAUPJ, "
        		+ "        C.UNPRC  AS UNPRC, "
        		+ "        NVL(FUN_DANMST_PRC(A.NADATE, A.CVCOD, A.ITNBR, '.'), C.UNPRC) AS UNPRC, "
        		+ "        C.UNAMT AS UNAMT, "
        		+ "        FUN_GET_CARTYPE(A.ITNBR) AS CARTYPE, "
        		+ "        A.POJANG, "
        		+ "        FUN_GET_REFFPF('95', A.POJANG) AS POJANG_NM, "
        		+ "        A.POQTY, "
        		+ "        A.BIGO, "
        		+ "        C.YEBI1 AS FACTORY, "
        		+ "        FUN_GET_QCGUB(A.ITNBR, A.CVCOD, '2') AS QCGUB, "
        		+ "        FUN_GET_REFFPF('08', FUN_GET_QCGUB(A.ITNBR, A.CVCOD, '2')) AS QCGUB, "
        		+ "        FUN_GET_REFFPF('AD', A.IPSAUPJ) AS IPSAUPJ, "
        		+ "        C.ESTNO "
        		+ "  	   FROM POBLKT_HIST A, "
        		+ "        ITEMAS B, "
        		+ "        POBLKT C "
        		+ " 	   WHERE DECODE(A.PRINT_YN,NULL,'N',A.PRINT_YN) LIKE ? "
        		+ "        AND SUBSTR(A.CRT_DT,0,8) BETWEEN ? AND ? "
        		+ "        AND A.CVCOD LIKE ? "
        		+ "        AND A.IPSAUPJ LIKE ? "
        		+ "   	   AND A.ITNBR = B.ITNBR "
        		+ "   	   AND A.BALJPNO = C.BALJPNO "
        		+ "   	   AND A.BALSEQ = C.BALSEQ "
        		+ "		   AND C.BALSTS <> '3' "
        		+ "	  	   ORDER BY A.JPNO DESC";
        
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
        parameters.add(new comm_dataPack(1, sGubun));
        parameters.add(new comm_dataPack(2, sFdate));
        parameters.add(new comm_dataPack(3, sTdate));
        parameters.add(new comm_dataPack(4, sCvcod));
        parameters.add(new comm_dataPack(5, sSaupj));
        
        System.out.println(sSaupj);
        
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
    	
    	String SQL = " SELECT ' ' AS listChk, "
    			+ "         ' ' AS JPNO, "
    			+ "         ' ' AS BALJPNO, "
    			+ "         ' ' AS BALSEQ, "
    			+ "         ' ' AS IPSAUPJ, "
    			+ "         ' ' AS CRT_DT, "
    			+ "			' ' AS ITNBR, "
    			+ "			' ' AS ITDSC, "
    			+ "			' ' AS ISPEC, "
    			+ "         ' ' AS JIJIL, "
    			+ "         ' ' AS NAQTY, "
    			+ "         ' ' AS QCGUB, "
    			+ "         ' ' AS FACTORY "
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
