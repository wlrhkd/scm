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

@WebServlet("/ord_barcode_e")
public class ord_barcode_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ord_barcode_e() {
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
                
            case "inputItnbr":
            	String sItnbr = request.getParameter("Itnbr");
            	joListData = getItnbr(sItnbr);
            	break;
            	
            case "ittyp": // 품목구분
            	joListData = rfcod.getReffpf("05");
            	break;
            
            case "JP": // 기 발행 라벨 확인
	           	String vJpno = request.getParameter("Jpno");
	           	joListData = getJpnoChk(vJpno);
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
                 
                 String sFromDate     = request.getParameter("FromDate");     //출발일자
                 String sToDate     = request.getParameter("ToDate");         
                 
                 String sCvcod   = request.getParameter("Cvcod");           //업체코드
                 String sSaupj = request.getParameter("Saupj");	            //사업장
                 
                 String sIttyp   = request.getParameter("Ittyp");           //품목구분
                 String sJpno = request.getParameter("Jpno");	            //납품번호
                 
                 iStartPage = Integer.parseInt(sPage);
                 response.getWriter().write(getJson(sPage,sPageLength,sFromDate,sToDate,sCvcod,sSaupj,sIttyp,sJpno));
                 break;
                 
             case "S":	// 테이블 형태
            	 response.getWriter().write(startSelectS().toString());
            	 break;  
            	 
             case "JpIns":	// lot insert
            	 sModifyData = request.getParameter("JsonData");
                 response.getWriter().write(jpInsert(sModifyData));
            	 break;
            	 
             case "JpUpd":	// lot update
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(jpUpdate(sModifyData));
            	 break;
             case "getAuth":	// 시스템관리자 / 사용자 구분
            	 String sID  = request.getParameter("ID");	     
            	 response.getWriter().write(getAuth(sID).toString());
            	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sFromDate, String sToDate, String sCvcod,
            String sSaupj, String sIttyp, String sJpno) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sFromDate, sToDate, sCvcod, sSaupj, sIttyp, sJpno);     
     
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }

    //거래처코드 조회
    public JSONObject getCvnas(String sCvcod){
        String SQL = " SELECT CVCOD, CVNAS FROM VNDMST WHERE CVCOD = ? ";
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
    
    //조회
    public JSONObject startSelect(String sFromDate, String sToDate, String sCvcod, String sSaupj, String sIttyp, String sJpno) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = " SELECT SUBSTR(A.CRT_DT,1,8)   AS CRT_DT, "
        		+ "		A.JPNO AS JPNO, "
        		+ "		SUBSTR(A.JPNO,1,12) AS JPNO_HEAD , "
        		+ "		SUBSTR(A.JPNO,13,3) AS JPNO_SEQ , "
        		+ "		A.ITNBR, "
        		+ "		B.ITDSC, "
        		+ "		B.ISPEC, "
        		+ "		B.JIJIL, "
        		+ "		A.NAQTY, "
        		+ "		C.UNPRC , "
        		+ "		(A.NAQTY * C.UNPRC) AS GYMEK, "
        		+ "		A.BALJPNO, "
        		+ "		A.BALSEQ, "
        		+ "		DECODE(LENGTH(C.ORDER_NO),15,SUBSTR(C.ORDER_NO,1,10)||'-'||SUBSTR(C.ORDER_NO,11),C.ORDER_NO) AS ORDER_NO, "
        		+ "		0 AS IS_CHEK, "
        		+ "		B.JIJIL, "
        		+ "		A.PSPEC, "
        		+ "		C.pordno, "
        		+ "		A.QAFILE , "
        		+ "		'0' as ROWSTATUS, "
        		+ "		A.UPD_ID, "
        		+ "		C.YEBI1 AS FACTORY, "
        		+ "		A.IPSAUPJ as IPSAUPJ, "
        		+ "      A.DEPOT_NO, "
        		+ "      A.POJANG, "
        		+ "      A.POQTY, "
        		+ "	  A.NADATE, "
        		+ "	  A.NADATE AS LOTNO, "
        		+ "      A.BIGO,"
        		+ "	  A.NAQTY / A.POQTY AS POJQTY "
        		+ " FROM POBLKT_HIST A, "
        		+ "	ITEMAS B, "
        		+ "	POBLKT C, "
        		+ "	IMHIST D, "
        		+ "	VNDMST E "
        		+ " WHERE A.JPNO LIKE ? "
        		+ " AND A.NADATE BETWEEN ? AND ? "
        		+ " AND A.CVCOD LIKE ? "
        		+ " AND B.ITTYP LIKE ? "
        		+ " AND C.SAUPJ LIKE ? "
        		+ " AND C.BALSTS <> '3' "
        		+ " AND A.ITNBR = B.ITNBR "
        		+ " AND A.BALJPNO = C.BALJPNO "
        		+ " AND A.BALSEQ = C.BALSEQ "
        		+ " AND A.DEPOT_NO = E.CVCOD "
        		+ " AND A.JPNO = D.IP_JPNO(+) "
        		+ " AND A.BALJPNO = D.BALJPNO(+) "
        		+ " AND A.BALSEQ = D.BALSEQ(+)"
        		+ " ORDER BY A.JPNO DESC ";
        
        JSONObject joStartData = new JSONObject();
        
        //납품번호
        if (sJpno == null || sJpno == "") {
        	sJpno = "%"; 
        }
        //사업장
        if (sSaupj == null || sSaupj == "") {
        	sSaupj = "%";
        } else {
        	sSaupj = "10";
        }
        //거래처 코드
        if (sCvcod == null || sCvcod == "") {
            sCvcod = "%"; 
        }
        
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
        parameters.add(new comm_dataPack(1, sJpno));
        parameters.add(new comm_dataPack(2, sFromDate));
        parameters.add(new comm_dataPack(3, sToDate));
        parameters.add(new comm_dataPack(4, sCvcod));
        parameters.add(new comm_dataPack(5, sIttyp));
        parameters.add(new comm_dataPack(6, sSaupj));
        
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
    	String SQL = "	SELECT ' ' AS listChk, "
    			+ "			   ' ' AS JPNO, "
    			+ "			   ' ' AS ITNBR,	"
    			+ "			   ' ' AS ITDSC,	"
    			+ "			   ' ' AS ISPEC,	"
    			+ "			   ' ' AS NAQTY,	"
    			+ "			   ' ' AS FACTORY,	"
    			+ "			   ' ' AS IO_TXT,	"
    			+ "			   ' ' AS POQTY,	"
    			+ "			   ' ' AS POJQTY,	"
    			+ "			   ' ' AS LOTNO,	"
    			+ "			   ' ' AS BIGO,	"
    			+ "			   ' ' AS ORDER_NO,	"
    			+ "			   ' ' AS BALJPNO,	"
    			+ "			   ' ' AS BALSEQ	"
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
    
    // 기 발행 라벨 확인
    public JSONObject getJpnoChk(String vJpno) {
    	JSONObject joCheck = new JSONObject();
    	
        String SQL = " SELECT COUNT('X') AS CNT "
        		+ "      FROM IMHIST_LOT_TH "
        		+ "     WHERE IOJPNO = ? "
        		+ "       AND ROWNUM = 1 ";
        
        ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
        
        parameter.add(new comm_dataPack(1, vJpno));
    
        comm_transaction controler = new comm_transaction();
        
	    try {
	        joCheck = controler.selectData(SQL, parameter);
	    } catch (Exception ex) {
	        System.out.println(ex.getMessage());
	        ex.printStackTrace();
	        sErrMessage = "DB Error : " + ex.getMessage();
	    }
	    
	    return joCheck;
    }
    
    // lot insert
    public String jpInsert(String sModifyData) {
    	boolean bChkErr = true;
        String sErrMessage = "";
        int iCnt = 0;   //처리 건수
        try{
            JSONParser jpParser = new JSONParser();
            JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData.replaceAll("null", ""));
            
            for (int i=0; i<jaArray.size(); i++) {
                //배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
                JSONObject joParamObject = (JSONObject) jaArray.get(i);
                    iCnt++;
                    String SQL = "";
                    SQL = " INSERT INTO IMHIST_LOT_TH ";
                    SQL += "      (  BARNO     "; 
                    SQL += "        ,IOJPNO    "; 
                    SQL += "        ,ITNBR     "; 
                    SQL += "        ,LOTNO     "; 
                    SQL += "        ,LOT_QTY   "; 
                    SQL += "        ,COILNO    "; 
                    SQL += "        ,BIGO      "; 
                    SQL += "        ,CRT_DATE  "; 
                    SQL += "        ,CRT_TIME  "; 
                    SQL += "        ,CRT_USER  "; 
                    SQL += "        ,UPD_DATE  "; 
                    SQL += "        ,UPD_TIME  "; 
                    SQL += "        ,UPD_USER  "; 
                    SQL += "        ,IO_DATE   "; 
                    SQL += "        )          ";
                    SQL += "        VALUES     ";
                    SQL += "       ( ? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,'' ";
                    SQL += "        ,'' ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "       )   ";

                    ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
                    parameter.add(new comm_dataPack(1, joParamObject.get("BARNO").toString()));
                    parameter.add(new comm_dataPack(2, joParamObject.get("IOJPNO").toString()));
                    parameter.add(new comm_dataPack(3, joParamObject.get("ITNBR").toString()));
                    parameter.add(new comm_dataPack(4, joParamObject.get("LOTNO").toString()));
                    parameter.add(new comm_dataPack(5, joParamObject.get("LOTQTY").toString()));
                    parameter.add(new comm_dataPack(6, joParamObject.get("CRTDATE").toString()));
                    parameter.add(new comm_dataPack(7, joParamObject.get("CRTTIME").toString()));
                    parameter.add(new comm_dataPack(8, joParamObject.get("CRTUSER").toString()));
                    parameter.add(new comm_dataPack(9, joParamObject.get("UPDDATE").toString()));
                    parameter.add(new comm_dataPack(10, joParamObject.get("UPDTIME").toString()));
                    parameter.add(new comm_dataPack(11, joParamObject.get("UPDUSER").toString()));
                    parameter.add(new comm_dataPack(12, joParamObject.get("IODATE").toString()));
                    
                    comm_transaction controler = new comm_transaction();
                    controler.updateData(SQL, parameter);
                }
        }
        catch(Exception ex){
            System.out.println(ex.getMessage());
            ex.printStackTrace();
            bChkErr = false;
            sErrMessage = "DB Error: " + ex.getMessage();
        }
        JSONObject joSendJson = new JSONObject();
        joSendJson.put("Result", bChkErr);
        joSendJson.put("InsertCnt", iCnt);
        joSendJson.put("Message", sErrMessage);
        
        return joSendJson.toString();
    }
    
    // lot update
    public String jpUpdate(String sModifyData) {
    	try {
	    	JSONParser jpParser = new JSONParser();
	    	JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
	    	
	        for (int i = 0; i < jaArray.size(); i++) {
	        	//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
	            JSONObject joParamObject = (JSONObject) jaArray.get(i);
	            
	            // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
	            String SQL = " UPDATE IMHIST_LOT_TH "
	            		+ "	 	  SET  UPD_DATE = ?,    "
	            		+ "			   UPD_TIME = ?,    "
	            		+ "            UPD_USER = ?     "
	            		+ "       WHERE IOJPNO = ?  ";
	            
	            ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
	            parameters.add(new comm_dataPack(1, joParamObject.get("UPDDATE").toString()));
	            parameters.add(new comm_dataPack(2, joParamObject.get("UPDTIME").toString()));
	            parameters.add(new comm_dataPack(3, joParamObject.get("UPDUSER").toString()));
	            parameters.add(new comm_dataPack(4, joParamObject.get("IOJPNO").toString()));
	            
	            comm_transaction controler = new comm_transaction();      
	            controler.updateData(SQL,parameters);
	        }
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[DB ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	
    	JSONObject joSendJson = new JSONObject();
    	
        return joSendJson.toString();
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
