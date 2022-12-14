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

@WebServlet("/ord_chul_e")
public class ord_chul_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ord_chul_e() {
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
            case "ittyp":
                joListData = rfcod.getReffpf("05");
                break;
            case "pojang":
                joListData = rfcod.getReffpf("2T");
                break;
            case "inputCvcod":
                String sCvcod = request.getParameter("Cvcod");
                joListData = getCvnas(sCvcod);
                break;
            case "inputItnbr":
            	String sItnbr = request.getParameter("Itnbr");
            	joListData = getItnbr(sItnbr);
            	break;
            case "message":
                String sCode = request.getParameter("Code");
                joListData = message.getMessage(sCode);
                break;
            //case "junpyo":
                //String sDate = request.getParameter("Date");
                //String sGubun = request.getParameter("Gubun");
                //String sJunpyo = getJunpyo(sDate, sGubun);
                //response.getWriter().write(sJunpyo);
                //return;
                //break;
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
                 String sGubun     = request.getParameter("Gubun");		    //????????? ????????? ???
                 String sFdate     = request.getParameter("Fdate");         //?????????
                 String sTdate     = request.getParameter("Tdate");         //?????????
                 String sCvcod   = request.getParameter("Cvcod");           //????????????
                 String sSaupj = request.getParameter("Saupj");	            //?????????
                 String sItnbr   =  request.getParameter("Itnbr");	        //??????
                 String sItdsc     = request.getParameter("Itdsc");	        //??????
                 String sIttyp  = request.getParameter("Ittyp");	        //????????????
                 
                 iStartPage = Integer.parseInt(sPage);
                 response.getWriter().write(getJson(sPage,sPageLength,sGubun,sFdate,sTdate,sCvcod,sSaupj,sItnbr,sItdsc,sIttyp));
                 break;
             case "I":  //??????
                 sModifyData = request.getParameter("JsonData");
                 response.getWriter().write(startUpdate(sModifyData));
                 break;
             case "D":  //??????
                 sModifyData = request.getParameter("JsonData");
                 response.getWriter().write(cancelDelete(sModifyData));
                 break;
             case "S":	// ?????? ?????? ????????? ??????
            	 response.getWriter().write(startSelectS().toString());
            	 break;
             case "C":	// ?????? ?????? ????????? ??????
            	 response.getWriter().write(startSelectC().toString());
            	 break;
             case "getAuth":	// ?????????????????? / ????????? ??????
            	 String sID  = request.getParameter("ID");	
            	 response.getWriter().write(getAuth(sID).toString());
            	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sGubun, String sFdate, String sTdate, String sCvcod,
            String sSaupj, String sItnbr, String sItdsc, String sIttyp) throws IOException{
        int iTotalRecords = 0;	//????????????
        int iRecordPerPage = Integer.parseInt(sPageLength);	//???????????? ????????? ???
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        
        if(sGubun.equals("I")) {
            //?????? ????????? ??????
            joListData = startSelect(sFdate, sTdate, sCvcod, sSaupj, sItnbr, sItdsc, sIttyp); 
        }else {
            joListData = cancelSelect(sFdate,sTdate, sCvcod, sIttyp, sSaupj);
        }
        
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
        return joCvnas;
    }
    
    //?????? ??????
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
    
    //???????????? ??????
    public JSONObject startSelect(String sFdate,String sTdate,String sCvcod, String sSaupj,
                                  String sItnbr, String sItdsc, String sIttyp) {
        String sResult = null;
      
        String SQL = " SELECT "
        		+ "	C.CVCOD, "
        		+ "	A.saupj, "
        		+ "	A.BALJPNO, "
        		+ "	A.BALSEQ, "
        		+ "	A.ITNBR, "
        		+ "	B.ITDSC, "
        		+ "	B.ISPEC, "
        		+ "	B.JIJIL, "
        		+ "    B.UNMSR , "
        		+ "	A.PSPEC, "
        		+ "	A.pordno, "
        		+ "	A.balqty, "
        		+ "	'' AS bin, "
        		+ "	C.BALDATE, "
        		+ "	A.GUDAT, "
        		+ "	DECODE(LENGTH(A.ORDER_NO),15,SUBSTR(A.ORDER_NO,1,10)||'-'||SUBSTR(A.ORDER_NO,11),A.ORDER_NO) AS ORDER_NO, "
        		+ "	A.BALQTY - Fun_Get_Poinqty(A.BALJPNO,A.BALSEQ) AS janru, "
        		+ "	0 AS naqty, "
        		+ "	A.BALQTY AS WBALQTY, "
        		+ "    A.SAUPJ AS IPSAUPJ , "
        		+ "    A.IPDPT AS IPDPT , "
        		+ "   '' AS PFILE , "
        		+ "	'                    ' AS LOTNO, "
        		+ "   fun_get_cartype(a.itnbr) as cartype, "
        		+ "	'0' AS rowstatus, "
        		+ "   A.BIGO, "
        		+ "   '' AS POJANG, "
        		+ "   0   AS POQTY, "
        		+ "    '.' "
        		+ "FROM POBLKT A, "
        		+ "	  POMAST C, "
        		+ "	  ITEMAS B "
        		+ "WHERE A.GUDAT >= ? "
        		+ "  AND A.GUDAT <= ? "
        		+ "  AND C.cvcod LIKE ? "
        		+ "  AND A.SAUPJ LIKE ? "
        		+ "  AND a.ITNBR LIKE ? "
        		+ "  AND NVL(B.ITDSC, ' ') LIKE  ? "
        		+ "  AND B.ITTYP LIKE  ? "
        		+ "  AND A.BALSTS = '1' "
        		+ "  AND A.BALJPNO = C.BALJPNO "
        		+ "  AND C.BALGU IN ('1', '3') "
        		+ "  AND C.BAL_SUIP = '1' "
        		+ "  AND A.ITNBR = B.ITNBR "
        		+ "  AND A.BALQTY - Fun_Get_Poinqty(A.BALJPNO,A.BALSEQ) > 0 "
        		+ " ORDER BY baljpno, fun_get_cartype(a.itnbr),a.itnbr ";
//        		+ "  AND NVL(B.ISPEC, ' ') LIKE  :sIspec "
//        		+ "  AND DECODE(NVL(ORDER_NO, 'O'), 'O', 'O', 'C') LIKE :sGubun "
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
        //??????
        }
        if (sItnbr == null || sItnbr == "") {
            sItnbr = "%";
        }
        //??????
        if (sItdsc == null || sItdsc == "") {
            sItdsc = "%";
        }
        
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sFdate));
        parameters.add(new comm_dataPack(2, sTdate));
        parameters.add(new comm_dataPack(3, sCvcod));
        parameters.add(new comm_dataPack(4, sSaupj));
        parameters.add(new comm_dataPack(5, sItnbr));
        parameters.add(new comm_dataPack(6, sItdsc));
        parameters.add(new comm_dataPack(7, sIttyp));
        
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
    //???????????? ?????? ??????
    public JSONObject cancelSelect(String sFdate, String sTdate, String sCvcod, String sIttyp, String sSaupj) {
        String SQL = "";
        
        String sRst = null;
        
        SQL = " SELECT 	substr(A.CRT_DT,1,8)   AS CRT_DT, "
        		+ "		A.JPNO AS JPNO, "
        		+ "		SUBSTR(A.JPNO,1,12) AS JPNO_HEAD , "
        		+ "		SUBSTR(A.JPNO,13,3) AS JPNO_SEQ , "
        		+ "		A.ITNBR, "
        		+ "		B.ITDSC, "
        		+ "		B.ISPEC, "
        		+ "		B.JIJIL, "
        		+ "		A.NAQTY, "
        		+ "		C.UNPRC , "
        		+ "		(A.NAQTY * C.UNPRC) as GYMEK, "
        		+ "		A.BALJPNO, "
        		+ "		A.BALSEQ, "
        		+ "		DECODE(LENGTH(C.ORDER_NO),15,SUBSTR(C.ORDER_NO,1,10)||'-'||SUBSTR(C.ORDER_NO,11),C.ORDER_NO) AS ORDER_NO, "
        		+ "		DECODE(A.STATUS, NULL, 'N', 'Y') AS IO_YN, "
        		+ "		DECODE(A.STATUS, NULL, '?????????', DECODE(SIGN(D.IOFAQTY), -1, '??????', '??????')) IO_TXT, "
        		+ "		0 AS IS_CHEK, "
        		+ "		B.JIJIL, "
        		+ "		A.PSPEC, "
        		+ "		C.pordno, "
        		+ "		A.QAFILE , "
        		+ "		'0' as rowstatus, "
        		+ "		A.UPD_ID, "
        		+ "		C.YEBI1 AS FACTORY, "
        		+ "		A.IPSAUPJ as ipsaupj , "
        		+ "      A.DEPOT_NO, "
        		+ "      A.POJANG, "
        		+ "      A.POQTY, "
        		+ "      A.BIGO "
        		+ " FROM POBLKT_HIST A, "
        		+ "	ITEMAS B, "
        		+ "	POBLKT C, "
        		+ "	IMHIST_PUR D, "
        		+ "	VNDMST_SUB E "
        		+ " WHERE A.NADATE BETWEEN ? AND ? "
        		+ " AND A.CVCOD LIKE ? "
        		+ " AND B.ITTYP LIKE ? "
        		+ " AND C.SAUPJ LIKE ? "
        		+ "	AND C.BALSTS <> '3' "
        		+ " AND A.ITNBR = B.ITNBR "
        		+ " AND A.BALJPNO = C.BALJPNO "
        		+ " AND A.BALSEQ = C.BALSEQ "
        		+ " AND A.DEPOT_NO = E.CVCOD "
        		+ " AND A.JPNO = D.IP_JPNO(+) "
        		+ " AND A.BALJPNO = D.BALJPNO(+) "
        		+ " AND A.BALSEQ = D.BALSEQ(+) "
        		+ "	ORDER BY JPNO_HEAD DESC ";
        
        JSONObject joCancelData = new JSONObject();
            
        if (sCvcod == null || sCvcod == "") {
            sCvcod = "%";
        }
        if (sIttyp == null || sIttyp == "") {
            sIttyp = "%";
        }
        if (sSaupj == null || sSaupj == "") {
            sSaupj = "%";
        } else {
            sSaupj = "10";
        }
            
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sFdate));
        parameters.add(new comm_dataPack(2, sTdate));
        parameters.add(new comm_dataPack(3, sCvcod));
        parameters.add(new comm_dataPack(4, sIttyp));
        parameters.add(new comm_dataPack(5, sSaupj));
            
        comm_transaction controler = new comm_transaction();      
          
        try {
            joCancelData = controler.selectData(SQL,parameters);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[cancelSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }     
        return joCancelData;
    }
    
    //??????
    public String startUpdate(String sModifyData) {
        
        boolean bChkErr = true;
        String sErrMessage = "";
        SimpleDateFormat sDate = new SimpleDateFormat("yyyyMMdd");
        String sToDate = sDate.format(new java.util.Date()); //?????? ??????
        int iCnt = 0;   //?????? ??????
        try{
            JSONParser jpParser = new JSONParser();
            JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData.replaceAll("null", ""));
            
            for (int i=0; i<jaArray.size(); i++) {
                //?????? ?????? ?????? ????????? JSON ??????????????? JSON Object??? ??????
                JSONObject joParamObject = (JSONObject) jaArray.get(i);
                    iCnt++;
                    //???????????? ??????
                    //String sJunNo = getJunpyo(sToDate, "P1"); 
                    //if (sJunNo == "-1") {
                    //    System.out.println("???????????? ??????");
                    //    bChkErr = false;
                    //    break;
                    //}
                    //String sJunpyo = sToDate + sJunNo + String.format("%03d",  iCnt);
                    //System.out.println("????????????: "+sJunPyo);
                    String SQL = "";
                    SQL = " INSERT INTO POBLKT_HIST  ";
                    SQL += "      (  JPNO  "; // ????????????
                    SQL += "        ,CVCOD "; // ???????????????
                    SQL += "        ,BALJPNO   "; // ????????????
                    SQL += "        ,BALSEQ    "; // ????????????
                    SQL += "        ,ITNBR "; // ????????????
                    SQL += "        ,NAQTY "; // ????????????
                    SQL += "        ,NADATE    "; // ?????????
                    SQL += "        ,RCQTY "; // 0
                    SQL += "        ,RCDATE    "; // null
                    SQL += "        ,BFAQTY    "; // 0
                    SQL += "        ,BPEQTY    "; // 0
                    SQL += "        ,BTEQTY    "; // 0
                    SQL += "        ,BJOQTY    "; // 0
                    SQL += "        ,STATUS    "; // null
                    SQL += "        ,CRT_DT    "; // ??????????????????
                    SQL += "        ,CRT_ID    "; // ??????????????????ID
                    SQL += "        ,FILENAME  "; // ??????????????????
                    SQL += "        ,PRINT_YN  "; // ??????????????? ????????????
                    SQL += "        ,PRT_JPNO  "; // ??????????????? ????????????
                    SQL += "        ,PSPEC "; // ????????? ????????? PSPEC ???
                    SQL += "        ,IPSAUPJ   "; // ????????? ????????? ???????????????
                    SQL += "        ,LOTNO "; // LOT NO
                    SQL += "        ,QAFILE    "; // ??????????????????
                    SQL += "        ,DEPOT_NO  "; // ????????? ????????? IPDPT ???(????????????)
                    SQL += "        ,POJANG    "; // ????????????
                    SQL += "        ,POQTY "; // ???????????????
                    SQL += "        ,BIGO  "; // ??????
                    SQL += "        )                                  ";
                    SQL += "        VALUES                             ";
                    SQL += "      (  ? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "        ,? ";
                    SQL += "       )    ";

                    ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
                    parameter.add(new comm_dataPack(1, joParamObject.get("1").toString()));
                    parameter.add(new comm_dataPack(2, joParamObject.get("2").toString()));
                    parameter.add(new comm_dataPack(3, joParamObject.get("3").toString().replace("-", "")));
                    parameter.add(new comm_dataPack(4, joParamObject.get("4").toString()));
                    parameter.add(new comm_dataPack(5, joParamObject.get("5").toString()));
                    parameter.add(new comm_dataPack(6, joParamObject.get("6").toString()));
                    parameter.add(new comm_dataPack(7, joParamObject.get("7").toString().replace(".", "")));
                    parameter.add(new comm_dataPack(8, joParamObject.get("8").toString()));
                    parameter.add(new comm_dataPack(9, joParamObject.get("9").toString()));
                    parameter.add(new comm_dataPack(10, joParamObject.get("10").toString()));
                    parameter.add(new comm_dataPack(11, joParamObject.get("11").toString()));
                    parameter.add(new comm_dataPack(12, joParamObject.get("12").toString()));
                    parameter.add(new comm_dataPack(13, joParamObject.get("13").toString()));
                    parameter.add(new comm_dataPack(14, joParamObject.get("14").toString()));
                    parameter.add(new comm_dataPack(15, joParamObject.get("15").toString()));
                    parameter.add(new comm_dataPack(16, joParamObject.get("16").toString()));
                    parameter.add(new comm_dataPack(17, joParamObject.get("17").toString()));
                    parameter.add(new comm_dataPack(18, joParamObject.get("18").toString()));
                    parameter.add(new comm_dataPack(19, joParamObject.get("19").toString()));
                    parameter.add(new comm_dataPack(20, joParamObject.get("20").toString()));
                    parameter.add(new comm_dataPack(21, joParamObject.get("21").toString()));
                    parameter.add(new comm_dataPack(22, joParamObject.get("22").toString()));
                    parameter.add(new comm_dataPack(23, joParamObject.get("23").toString()));
                    parameter.add(new comm_dataPack(24, joParamObject.get("24").toString()));
                    parameter.add(new comm_dataPack(25, joParamObject.get("25").toString()));
                    parameter.add(new comm_dataPack(26, joParamObject.get("26").toString()));
                    parameter.add(new comm_dataPack(27, joParamObject.get("27").toString()));
                    
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
    
    //??????
    public String cancelDelete(String JsonString) {
        boolean bChkErr = true;
        String sErrMessage = "";
        
        int iCnt = 0;
    
        String sKeyJson = JsonString.replaceAll(" ", "");
        JSONArray jaArray = new JSONArray();
        JSONParser jpParser = new JSONParser();
        try {
            jaArray = (JSONArray) jpParser.parse(sKeyJson);
            for (int i=0; i<jaArray.size(); i++) {
                JSONObject joParamObject = (JSONObject) jaArray.get(i);
                iCnt++;
                try {
                    String SQL = " DELETE FROM POBLKT_HIST WHERE JPNO = ? ";
                    
                    ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
                    parameter.add(new comm_dataPack(1, joParamObject.get("KEY").toString()));
                
                    comm_transaction controler = new comm_transaction();
                    controler.updateData(SQL, parameter);
                } catch(Exception ex) {
                    System.out.println(ex.getMessage());
                    ex.printStackTrace();
                    bChkErr = false;
                    sErrMessage = "DB Error : " + ex.getMessage();
                }
            }
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            ex.printStackTrace();
            bChkErr = false;
            sErrMessage = "DB Error : " + ex.getMessage();
        }
    
        JSONObject joSendJson = new JSONObject();
        joSendJson.put("Result", bChkErr);
        joSendJson.put("DeleteCnt", iCnt);
        joSendJson.put("Message", sErrMessage);
        return joSendJson.toString();
    }
    
    // ?????? ?????? ????????? ??????
    public JSONObject startSelectS() {
    	String sResult = null;
    	
    	// sql ??? ????????? "  " ???????????? ????????? ??????????????? ????????? ????????? D1FROM ??????  from ?????? ?????? ?????????. 
    	String SQL = "	SELECT ' ' AS listChk, "
    			+ "			   ' ' AS GINGUB,"
    			+ "			   ' ' AS BALJPNO,	"
    			+ "			   ' ' AS ITNBR,	"
    			+ "			   ' ' AS ITDSC,	"
    			+ "			   ' ' AS ISPEC,	"
    			+ "			   ' ' AS JIJIL,	"
    			+ "			   ' ' AS WBALQTY,	"
    			+ "			   ' ' AS GUDAT,	"
    			+ "			   ' ' AS NAPDATE,	"
    			+ "			   ' ' AS JANRU,	"
    			+ "			   ' ' AS NAQTY,	"
//    			+ "			   ' ' AS pojang,	"
    			+ "			   ' ' AS POQTY,	"
    			+ "			   ' ' AS UNMSR,	"
    			+ "			   ' ' AS FACTORY,	"
    			+ "			   ' ' AS ESTNO,	"
    			+ "			   ' ' AS ORDER_NO,	"
    			+ "			   ' ' AS BIGO,	"
    			+ "			   ' ' AS LOTNO	"
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
    
    // ?????? ?????? ????????? ??????
    public JSONObject startSelectC() {
    	String sResult = null;
    	
    	// sql ??? ????????? "  " ???????????? ????????? ??????????????? ????????? ????????? D1FROM ??????  from ?????? ?????? ?????????. 
    	String SQL = "	SELECT ' ' AS listChk, "
    			+ "			   ' ' AS DEPOT_NO,"
    			+ "			   ' ' AS JPNO_HEAD,	"
    			+ "			   ' ' AS ITNBR,	"
    			+ "			   ' ' AS ITDSC,	"
    			+ "			   ' ' AS ISPEC,	"
    			+ "			   ' ' AS JIJIL,	"
    			+ "			   ' ' AS NAQTY,	"
    			+ "			   ' ' AS FACTORY,	"
    			+ "			   ' ' AS IO_TXT,	"
    			+ "			   ' ' AS BALJPNO,	"
    			+ "			   ' ' AS BALSEQ,	"
				+ "			   ' ' AS POQTY,	"
				+ "			   ' ' AS ORDER_NO,	"
				+ "			   ' ' AS POJANG,	"
				+ "			   ' ' AS POQTY,	"
				+ "			   ' ' AS BIGO,	"
				+ "			   ' ' AS JPNO	"
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
