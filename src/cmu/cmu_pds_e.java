package cmu;

import java.io.File;
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

@WebServlet("/cmu_pds_e")
public class cmu_pds_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public cmu_pds_e() {
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
            case "inputChgid":
                String sChgid = request.getParameter("Chgid");
                joListData = getChgname(sChgid);
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
                 
                 String sMonth     = request.getParameter("Month");	    	// ?????????
                 
                 String sChgid   = request.getParameter("Chgid");           //????????????
                 
                 System.out.println("????????? =" + sMonth);
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sMonth,sChgid));
                 break;
                 
             case "pnoSelect":  //??? ?????? (?????? ??????)
             	 String sPno = request.getParameter("pno");
             	 response.getWriter().write(getJsonSel(sPno));
             	 break;
             	 
             case "I":  //??????
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startInsert(sModifyData));
            	 break;
            	 
             case "U":  //??????
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startUpdate(sModifyData));
            	 break;
            	 
             case "D":  //??????
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(cancelDelete(sModifyData));
            	 break;
             case "getAuth":	// ?????????????????? / ????????? ??????
            	 String sID  = request.getParameter("ID");	        //????????????
            	 response.getWriter().write(getAuth(sID).toString());
            	 break;
             case "deleteFile":  //????????????
                	String sFile = request.getParameter("File");
                	response.getWriter().write(getJsonDel(sFile));
                	break;
             case "FD":  //??????????????????
             	 String sUploadUrl = request.getParameter("uploadUrl");
             	 break;
        }
    }
    //????????????
  	private String getJsonDel(String sFile) throws IOException {
  		
  		return deleteFile(sFile);
  	}
    
    public String getJson(String sPage, String sPageLength, String sMonth, String sChgid) throws IOException{
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
        joListData = startSelect(sMonth, sChgid);
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    
    // ????????????
    public String getJsonSel(String sPno) throws IOException{
    	JSONObject joListData = null;
    	joListData = pnoSelect(sPno);
    	
    	return joListData.toString();
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
    
    //?????????
    public JSONObject getChgname(String sChgid){
    	String SQL = " SELECT CHG_ID, "
    			+ "           CHG_NAME "
    			+ "    FROM SCM_LOGIN_T "
    			+ "    WHERE CHG_ID = ? ";
    	JSONObject joCvnas = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sChgid));
    	
    	comm_transaction controler = new comm_transaction();
    	try {
    		joCvnas = controler.selectData(SQL,parameters);
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    	//System.out.println(joSaupj);
    	return joCvnas;
    }
    
    //????????? ??????
    public JSONObject startSelect(String sMonth, String sChgid) {
        String sResult = null;
      
        String SQL = " 		SELECT "
        		+ " 		ROW_NUMBER() OVER(ORDER BY A.PNO ASC) AS ROWNUM1, "
        		+ " 		A.PNO, "
        		+ "         DECODE(A.DEPTH,0,A.SUBJECT,LPAD(' ',A.DEPTH*3)||'??? '||DECODE(A.DELYN,'Y','??????',A.SUBJECT)) AS SUBJECT2, "
        		+ "         A.SUBJECT, "
        		+ "         A.CRE_ID, "
        		+ "         SUBSTR(A.CRE_DT,0,8) AS CRE_DT, "
        		+ "         A.CHG_ID, "
        		+ "         DECODE(A.DELYN ,'Y',NULL,A.CHG_FILE) AS CHG_FILE, "
        		+ "         A.NTHREAD, "
        		+ "         A.DEPTH, "
        		+ "         A.DELYN, "
        		+ "         A.ADMIN_ID , "
        		+ "         B.CHG_NAME , "
        		+ "         A.IP_PNO "
        		+ "    FROM SCM_PDS A, "
        		+ "         SCM_LOGIN_T B "
        		+ "   WHERE A.CRE_ID = B.CHG_ID "
        		+ "		AND SUBSTR(A.CRE_DT,1,8) > ? "
        		+ "		AND (A.CHG_ID LIKE ? OR A.CHG_ID = 'TOTAL' OR  A.CRE_ID = ? ) "
        		+ " 	ORDER BY A.PNO DESC ";
        
        JSONObject joStartData = new JSONObject();
        
        //????????? ??????
        if (sChgid == null || sChgid == "") {
        	sChgid = "%";
        }
        sMonth = sMonth.replaceAll("-", "");
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sMonth));
        System.out.println(sMonth);
        parameters.add(new comm_dataPack(2, sChgid));
        parameters.add(new comm_dataPack(3, sChgid));
        
        
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
    // ????????? ?????? ?????? ?????? ??????
    public JSONObject pnoSelect(String sPno) {
    	
    	// sql ??? ????????? "  " ???????????? ????????? ??????????????? ????????? ????????? D1FROM ??????  from ?????? ?????? ?????????. 
    	String SQL = " SELECT "
    			+ " 		A.PNO, "
    			+ "         A.SUBJECT, "
    			+ "         A.CONTENT, "
    			+ "         A.CRE_ID, "
    			+ "         B.CHG_NAME AS CNAME, "
    			+ "         A.CRE_DT, "
    			+ "         A.CHG_ID, "
    			+ "         C.CHG_NAME AS VNAME, "
    			+ "         A.CHG_FILE, "
    			+ "         A.ADMIN_ID, "
    			+ "         A.NTHREAD, "
    			+ "         A.DEPTH, "
    			+ "         A.DELYN  , "
    			+ "         A.IP_PNO , "
    			+ "         'SYSTEM' AS LOGIN_ID , "
    			+ "         '0' as rowstatus "
    			+ "    		FROM SCM_PDS A , "
    			+ "         SCM_LOGIN_T B , "
    			+ "         SCM_LOGIN_T C "
    			+ "   		WHERE A.CRE_ID = B.CHG_ID "
    			+ "       AND A.CRE_ID = C.CHG_ID "
    			+ "		  AND A.PNO = ? ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sPno));
    	System.out.println(sPno);
    	
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
 // ?????? ??????
    public String startInsert(String sModifyData) {
    	try {
    		JSONParser jpParser = new JSONParser();
    		JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
    		
    		for (int i = 0; i < jaArray.size(); i++) {
    			//?????? ?????? ?????? ????????? JSON ??????????????? JSON Object??? ??????
    			JSONObject joParamObject = (JSONObject) jaArray.get(i);
    			
    			// sql ??? ????????? "  " ???????????? ????????? ??????????????? ????????? ????????? D1FROM ??????  from ?????? ?????? ?????????.
    			String SQL = " INSERT INTO SCM_PDS( "
    					+"					  PNO       ,     "
    					+"					  SUBJECT   ,     "
    					+"					  CRE_ID    ,     "
    					+"					  CRE_DT    ,     "
    					+"					  CHG_ID    ,     "
    					+"					  CHG_FILE  ,     "
    					+"					  CONTENT   ,     "
    					+"					  ADMIN_ID  ,     "
    					+"					  NTHREAD   ,     "
    					+"					  DEPTH     ,     "
    					+"					  DELYN     ,     "
    					+"					  IP_PNO     )    "
    					+"             		  VALUES(( SELECT TO_CHAR(SYSDATE, 'YYYY') || DECODE(MAX(SUBSTR(PNO, 5, 6)),NULL,'000001',TO_CHAR(LPAD(MAX(SUBSTR(PNO, 5, 6)) + 1, 6, '0'))) FROM SCM_PDS),  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     '', "
    					+"                     '', "
    					+"                     'N', "
    					+"                     ''  ) " ;
    			
    			ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    			parameters.add(new comm_dataPack(1, joParamObject.get("Subject").toString()));
    			parameters.add(new comm_dataPack(2, joParamObject.get("Cre_id").toString()));
    			parameters.add(new comm_dataPack(3, joParamObject.get("Cre_dt").toString()));
    			parameters.add(new comm_dataPack(4, joParamObject.get("Chg_id").toString()));
    			parameters.add(new comm_dataPack(5, joParamObject.get("File").toString()));
    			parameters.add(new comm_dataPack(6, joParamObject.get("Content").toString()));
    			parameters.add(new comm_dataPack(7, joParamObject.get("Username").toString()));
    			
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
    // ??????
    public String startUpdate(String sModifyData) {
    	try {
	    	JSONParser jpParser = new JSONParser();
	    	JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
	    	
	        for (int i = 0; i < jaArray.size(); i++) {
	        	//?????? ?????? ?????? ????????? JSON ??????????????? JSON Object??? ??????
	            JSONObject joParamObject = (JSONObject) jaArray.get(i);
	            
	            // sql ??? ????????? "  " ???????????? ????????? ??????????????? ????????? ????????? D1FROM ??????  from ?????? ?????? ?????????.
	            String SQL = " UPDATE SCM_PDS "
	            		+ "			SET  		"
	            		+ "			SUBJECT = ?, "
	            		+ "			CHG_ID = ?, "
	            		+ "			CHG_FILE = ?, "
	            		+ "			CONTENT = ? "
	            		+ "	  WHERE PNO = ? ";
	            
	            ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
	            parameters.add(new comm_dataPack(1, joParamObject.get("Subject").toString()));
	            parameters.add(new comm_dataPack(2, joParamObject.get("Chg_id").toString()));
	            parameters.add(new comm_dataPack(3, joParamObject.get("File").toString()));
	            parameters.add(new comm_dataPack(4, joParamObject.get("Content").toString()));
	            parameters.add(new comm_dataPack(5, joParamObject.get("Pno").toString().replace(".","")));
	            
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
    
    // ?????? ??????
    public String cancelDelete(String JsonString) {
        boolean bChkErr = true;
        String sErrMessage = "";
        
        int iCnt = 0;
    
        JSONArray jaArray = new JSONArray();
        JSONParser jpParser = new JSONParser();
        try {
            jaArray = (JSONArray) jpParser.parse(JsonString);
            for (int i=0; i < jaArray.size(); i++) {
                JSONObject joParamObject = (JSONObject) jaArray.get(i);
                iCnt++;
                try {
                    String SQL = " DELETE "
                    		+ " FROM SCM_PDS "
                    		+ " WHERE PNO = ? ";
                    
                    ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
                    //System.out.println("===>"+joParamObject.get("KEY").toString());
                    parameter.add(new comm_dataPack(1, Integer.parseInt(joParamObject.get("KEY").toString())));
                    
                    System.out.println("jopram"+joParamObject.get("KEY").toString());
                    
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
    // ?????? ??????
    private String deleteFile(String sFile) {
    	String sResult = null;
    	
    	String SQL = " UPDATE SCM_PDS SET CHG_FILE = ' '  WHERE PNO = ? ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sFile));
    	
    	
    	try {
    		 comm_transaction controler = new comm_transaction();
             controler.updateData(SQL, parameters);
//    		 System.out.println("joStartData : " + joStartData);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	  JSONObject joSendJson = new JSONObject();
          joSendJson.put("Message", sErrMessage);
    	
    	 return joSendJson.toString();
    }
    
    public void deleteFileUrl(String sUploadUrl) {
        
        // ????????? ?????? + ?????????
        String filePath = "D:\\??????\\testscm\\WEB_SCM\\scm\\WebContent\\Upload\\" + sUploadUrl;
        
        File deleteFile = new File(filePath);
 
        // ????????? ??????????????? ?????? ??????????????? true, ???????????????????????? false
        if(deleteFile.exists()) {
            
            // ????????? ???????????????.
            deleteFile.delete(); 
            
            System.out.println("????????? ?????????????????????.");
            
        } else {
            System.out.println("????????? ???????????? ????????????.");
        }
    }
}
