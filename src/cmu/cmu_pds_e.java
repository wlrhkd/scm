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
             case "R":	//조회
                 String sPage      = request.getParameter("Page");
                 String sPageLength= request.getParameter("PageLength");    //페이지당 row 갯수
                 
                 String sMonth     = request.getParameter("Month");	    	// 작성일
                 
                 String sChgid   = request.getParameter("Chgid");           //업체코드
                 
                 System.out.println("작성일 =" + sMonth);
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sMonth,sChgid));
                 break;
                 
             case "pnoSelect":  //행 선택 (상세 정보)
             	 String sPno = request.getParameter("pno");
             	 response.getWriter().write(getJsonSel(sPno));
             	 break;
             	 
             case "I":  //저장
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startInsert(sModifyData));
            	 break;
            	 
             case "U":  //수정
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startUpdate(sModifyData));
            	 break;
            	 
             case "D":  //삭제
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(cancelDelete(sModifyData));
            	 break;
             case "getAuth":	// 시스템관리자 / 사용자 구분
            	 String sID  = request.getParameter("ID");	        //품목구분
            	 response.getWriter().write(getAuth(sID).toString());
            	 break;
             case "deleteFile":  //파일삭제
                	String sFile = request.getParameter("File");
                	response.getWriter().write(getJsonDel(sFile));
                	break;
             case "FD":  //파일경로삭제
             	 String sUploadUrl = request.getParameter("uploadUrl");
             	 break;
        }
    }
    //파일삭제
  	private String getJsonDel(String sFile) throws IOException {
  		
  		return deleteFile(sFile);
  	}
    
    public String getJson(String sPage, String sPageLength, String sMonth, String sChgid) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        //SQL문의 물음표
        joListData = startSelect(sMonth, sChgid);
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    
    // 상세정보
    public String getJsonSel(String sPno) throws IOException{
    	JSONObject joListData = null;
    	joListData = pnoSelect(sPno);
    	
    	return joListData.toString();
    }
    
    //거래처코드 조회
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
    
    //수신처
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
    
    //자료실 목록
    public JSONObject startSelect(String sMonth, String sChgid) {
        String sResult = null;
      
        String SQL = " 		SELECT "
        		+ " 		ROW_NUMBER() OVER(ORDER BY A.PNO ASC) AS ROWNUM1, "
        		+ " 		A.PNO, "
        		+ "         DECODE(A.DEPTH,0,A.SUBJECT,LPAD(' ',A.DEPTH*3)||'⇒ '||DECODE(A.DELYN,'Y','삭제',A.SUBJECT)) AS SUBJECT2, "
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
        
        //거래처 코드
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
    // 선택한 자료 상세 정보 출력
    public JSONObject pnoSelect(String sPno) {
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
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
 // 저장 버튼
    public String startInsert(String sModifyData) {
    	try {
    		JSONParser jpParser = new JSONParser();
    		JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
    		
    		for (int i = 0; i < jaArray.size(); i++) {
    			//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
    			JSONObject joParamObject = (JSONObject) jaArray.get(i);
    			
    			// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
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
    // 수정
    public String startUpdate(String sModifyData) {
    	try {
	    	JSONParser jpParser = new JSONParser();
	    	JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
	    	
	        for (int i = 0; i < jaArray.size(); i++) {
	        	//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
	            JSONObject joParamObject = (JSONObject) jaArray.get(i);
	            
	            // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
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
    
    // 삭제 버튼
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
    // 파일 삭제
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
        
        // 파일의 경로 + 파일명
        String filePath = "D:\\소스\\testscm\\WEB_SCM\\scm\\WebContent\\Upload\\" + sUploadUrl;
        
        File deleteFile = new File(filePath);
 
        // 파일이 존재하는지 체크 존재할경우 true, 존재하지않을경우 false
        if(deleteFile.exists()) {
            
            // 파일을 삭제합니다.
            deleteFile.delete(); 
            
            System.out.println("파일을 삭제하였습니다.");
            
        } else {
            System.out.println("파일이 존재하지 않습니다.");
        }
    }
}
