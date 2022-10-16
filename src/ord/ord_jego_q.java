/*
	Document : 현 재고현황
	작성자 : 김준형
	작성일자 : 2021-08-23
*/
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

import org.apache.poi.util.SystemOutLogger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import comm.comm_transaction;
import comm.comm_util;
import comm.comm_dataPack;
import comm.comm_dbConnect;
import comm.comm_message;
import comm.combo.comm_reffpf_c;
import comm.combo.comm_vndmst_c;

@WebServlet("/ord_jego_q")
public class ord_jego_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ord_jego_q() {
        super();
    }
  
    private int iStartPage,iLength;
    private String sErrMessage = "";
    private CallableStatement sCstmt = null;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        String sGubunCode = request.getParameter("SearchGubun");
        
        comm_reffpf_c rfcod = new comm_reffpf_c();
        comm_vndmst_c Ipjogun = new comm_vndmst_c();
        comm_message message = new comm_message();
        
        JSONObject joListData = null;
        switch(sGubunCode) {
            case "saupj": // 사업장
                joListData = rfcod.getReffpf("AD");
                break;           

            case "depot_no": // 창고
                joListData = Ipjogun.getVndmst("5");
                break;
                
            case "ittyp": // 품목구분
            	joListData = rfcod.getReffpf("05");
            	break;
            	
            case "inputItnbr":
            	String sItnbr = request.getParameter("Itnbr");
            	joListData = getItnbr(sItnbr);
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
                 
                 String sSaupj = request.getParameter("Saupj");	            //사업장
                 
                 String sDepot_no = request.getParameter("Depot_no");	    //창고
                 
                 String sIttyp     = request.getParameter("Ittyp");	        //품목구분
                 
                 String sItnbr   =  request.getParameter("Itnbr");	        //품번
                 String sItdsc   =  request.getParameter("Itdsc");	    	//품명
                 
                 iStartPage = Integer.parseInt(sPage);
                 response.getWriter().write(getJson(sPage, sPageLength, sSaupj, sDepot_no, sIttyp, sItnbr, sItdsc));
                 break;
                 
            case "S":	// 테이블 형태
            	 response.getWriter().write(startSelectS().toString());
            	 break;  
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sSaupj, String sDepot_no, String sIttyp, String sItnbr, String sItdsc) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sSaupj, sDepot_no, sIttyp, sItnbr, sItdsc);     
        
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
        return joCvnas;
    }
    
    //현 재고현황 조회
    public JSONObject startSelect(String sSaupj, String sDepot_no, String sIttyp, String sItnbr, String sItdsc) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = "  SELECT ROWNUM, "
        		+ "			A.DEPOT_NO,    "
        		+ "         A.LOCFR,    "
        		+ "         A.LOCTO,    "
        		+ "         A.LOCFR2,    "
        		+ "         A.LOCTO2,    "
        		+ "         A.ITNBR,    "
        		+ "         A.PSPEC,    "
        		+ "         B.ITDSC,    "
        		+ "         B.ISPEC AS AAA, "
        		+ "         NVL(A.JEGO_QTY, '0') AS JEGO_QTY,    "
        		+ "         A.HOLD_QTY, "
        		+ "         A.VALID_QTY,  "
        		+ "         A.LAST_IN_DATE,    "
        		+ "         A.LAST_OUT_DATE,    "
        		+ "         NVL(A.BALJU_QTY, '0') AS BALJU_QTY,    "
        		+ "         A.JISI_QTY,  "
        		+ "			A.POB_QC_QTY + A.GI_QC_QTY AS GUMDE,  "
        		+ "			A.PROD_QTY + A.INS_QTY + A.GITA_IN_QTY AS DAEGI,  "
        		+ "			A.ORDER_QTY,  "
        		+ "			A.JEGO_QTY + A.JISI_QTY + A.PROD_QTY  + A.BALJU_QTY + "
        		+ "         A.POB_QC_QTY + A.INS_QTY  + A.GI_QC_QTY + A.GITA_IN_QTY  "
        		+ "           - ( A.HOLD_QTY + A.ORDER_QTY ) AS YEQTY, "
        		+ "			NULL AS SHTNM, "
        		+ "			D.RFNA1, "
        		+ "			E.CVNAS, "
        		+ "			FUN_GET_REFFPF('28', B.ITGU) AS ITGU, "
        		+ "         B.USEYN "
        		+ "    FROM STOCK A, ITEMAS B, ITNCT C, REFFPF D, VNDMST E "
        		+ "   WHERE D.RFGUB LIKE ? "
        		+ "     AND A.DEPOT_NO LIKE ? "
        		+ "     AND B.ITTYP LIKE ? "
        		+ "     AND A.ITNBR LIKE ? "
        		+ "     AND B.ITDSC LIKE ? "
        		+ "     AND D.RFCOD =  'AD' "
        		+ "     AND D.RFGUB <> '00' "
        		+ "     AND E.CVGU = '5' "
        		+ "     AND A.ITNBR = B.ITNBR "
        		+ "     AND B.ITTYP = C.ITTYP "
        		+ "     AND B.ITCLS = C.ITCLS "
        		+ "     AND A.DEPOT_NO = E.CVCOD ";
        
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
        parameters.add(new comm_dataPack(1, sSaupj));
        parameters.add(new comm_dataPack(2, sDepot_no));
        parameters.add(new comm_dataPack(3, sIttyp));
        parameters.add(new comm_dataPack(4, sItnbr));
        parameters.add(new comm_dataPack(5, sItdsc));
        
        comm_transaction controler = new comm_transaction();      
        try {
            joStartData = controler.selectData(SQL,parameters);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }

        return joStartData;
    }
    
    // 테이블 형태
    public JSONObject startSelectS() {
    	String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = "	SELECT ROWNUM,   "
    			+ "			   ' ' AS ITNBR,    "
    			+ "			   ' ' AS ITDSC,	"
    			+ "			   ' ' AS AAA,	    "
    			+ "			   ' ' AS PSPEC,	"
    			+ "			   ' ' AS ITGU,  	"
    			+ "			   ' ' AS CVNAS,	"
    			+ "			   ' ' AS MIDSAF,	"
    			+ "			   ' ' AS JEGO_QTY,	"
    			+ "			   ' ' AS BUJOC,	"
    			+ "			   ' ' AS BALJU_QTY,	"
    			+ "			   ' ' AS GUMDE,	"
    			+ "			   ' ' AS DAEGI,	"
    			+ "			   ' ' AS LAST_IN_DATE,	"
    			+ "			   ' ' AS LAST_OUT_DATE    "
    			+ "		   FROM DUAL "
    			+ "		CONNECT BY LEVEL <= 12 ";
    	JSONObject joStartData = new JSONObject();
    	comm_transaction controler = new comm_transaction();      
    	try {
    		joStartData = controler.selectData(SQL);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	
    	return joStartData;
    }
}
