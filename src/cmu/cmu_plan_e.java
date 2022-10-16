/*
 * To change this license header, choose License Headers in Project Properties.

 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cmu;

//import com.oreilly.servlet.MultipartRequest;
//
//
//import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;
//import com.oreilly.servlet.multipart.FileRenamePolicy;
//import com.scm.order.*;
//import com.scm.start.*;
//import com.scm.database.ORDDAO;

import java.io.File;


import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import static java.lang.Integer.parseInt;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import java.text.SimpleDateFormat;

import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.jni.OS;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import comm.comm_dataPack;
import comm.comm_message;
import comm.comm_transaction;
import comm.comm_util;
import comm.combo.comm_reffpf_c;

/**
 *
 * @author Administrator
 */
@WebServlet("/cmu_plan_e")
public class cmu_plan_e extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public cmu_plan_e() {
		super();
	}
	
//    private static String OS = System.getProperty("os.name").toLowerCase();        
//    private Connection conn;
//    private Statement stmt;
//    private PreparedStatement pstmt = null;
//    private PreparedStatement pstmt1 = null;
//    private CallableStatement cstmt = null;
//    private ResultSet rs;
//    private boolean chkErr   = true;
	private int iStartPage,iLength;
	private String sErrMessage = "";

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
            case "inputChgid":
                String sChgid = request.getParameter("Chgid");
                joListData = getChgname(sChgid);
                break;
            case "message":
                String sCode = request.getParameter("Code");
                joListData = message.getMessage(sCode);
                break;            
        }
        response.getWriter().write(joListData.toString());
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        
        String sModifyData = "";
        String sActGubun = request.getParameter("ActGubun");
        
        switch(sActGubun){
        case "R": // 조회
        	String sPage      = request.getParameter("Page");
        	String sPageLength= request.getParameter("PageLength");  	   //페이지당 row 갯수
            
        	String sMonth     = request.getParameter("Month");	    	// 작성일
            
            String sSubjt 	  = request.getParameter("Subjt");	           //제목
            
            iStartPage = Integer.parseInt(sPage);
            iLength = 10;
            sPageLength = "20";
            response.getWriter().write(getJson(sPage,sPageLength,sMonth,sSubjt));
            break;
            
        case "noSelect":  //행 선택 (상세 정보)
        	 String sNo = request.getParameter("No");
        	 response.getWriter().write(getJsonSel(sNo));
        	 break;
        	 
        case "I":  //추가
        	sModifyData = request.getParameter("JsonData");
        	response.getWriter().write(startInsert(sModifyData));
        	break;
        	
        case "U":  //저장
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
        }
//        case "DF": //파일삭제
//            String key  = request.getParameter("key");
//            joListData = DeleteFile(key);
//            break;                            
    }
    // 테이블
    public String getJson(String sPage, String sPageLength, String sMonth, String sSubjt) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sMonth, sSubjt);
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    
    // 상세정보
    public String getJsonSel(String sNo) throws IOException{
    	JSONObject joListData = null;
    	joListData = noSelect(sNo);
    	
    	return joListData.toString();
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
    
   //공지사항 조회
    public JSONObject startSelect(String sMonth, String sSubjt) {
    	String sResult = null;
    	
        String SQL = "	SELECT ROW_NUMBER() OVER(ORDER BY A.NO ASC) AS ROWNUM1, "
        		+ "		 A.SUBJECT, "
        		+ "		 A.NO, "
        		+ "		 CONTENT, "
        		+ "		 DECODE(A.CHG_ID , 'TOTAL','전체',FUN_GET_CVNAS(A.CHG_ID)) AS CVNAS, "
        		+ "		 A.CHG_ID, "
        		+ "		 SUBSTR(A.CRE_DT,0,8) AS CRE_DT, "
        		+ "		 FUN_GET_CVNAS(A.CRE_ID) AS CRE_ID, "
        		+ "		 '0' AS ROWSTATUS, "
        		+ "		 DECODE(A.CHG_FILE, NULL ,'무' , '유') AS CHG_FILE, "
        		+ "		 A.CHG_FILE AS CHG_FILENAME "
        		+ "  	 FROM SCM_NOTICE A "
        		+ "  	 WHERE SUBSTR(A.CRE_DT,1,8) > ? "
        		+ "		 AND NVL(A.SUBJECT,'%') LIKE ? "
        		+ "		 ORDER BY A.NO DESC, ROWNUM DESC ";
        
       JSONObject joStartData = new JSONObject();

       //제목
       if (sSubjt == null || sSubjt == "") {
    	   sSubjt = "%";
       }
       sMonth = sMonth.replaceAll("-", "");
       ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
       parameters.add(new comm_dataPack(1, sMonth));
       System.out.println(sMonth);
       parameters.add(new comm_dataPack(2, sSubjt));
       
//       System.out.println(sFdate);
//       System.out.println(sTdate);
//       System.out.println(sCvcod);
//       System.out.println(sSaupj);
       
       comm_transaction controler = new comm_transaction();     
     
       try {
           joStartData = controler.selectData(SQL,parameters);
           System.out.println("joStartData = " + joStartData);
       } catch (Exception e) {
           sErrMessage = e.getMessage();
           System.out.println("[startSelect ERROR!!!]" + sErrMessage);
           e.printStackTrace();
       }
       return joStartData;
    }
    // 선택한 자료 상세 정보 출력
    public JSONObject noSelect(String sNo) {
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = " SELECT "
    			+ "		 NO, "
    			+ "		 FUN_GET_CVNAS(A.CRE_ID) AS CRE_ID, "
    			+ "		 CHG_ID, "
    			+ "		 DECODE(A.CHG_ID , 'TOTAL','전체',FUN_GET_CVNAS(A.CHG_ID)) AS CVNAS, "
    			+ "		 SUBJECT, "
        		+ "		 CONTENT, "
        		+ "		 '0' AS ROWSTATUS, "
        		+ "		 DECODE(A.CHG_FILE, NULL ,'무' , '유') AS CHG_FILE, "
        		+ "		 CRE_DT, "
        		+ "		 A.CHG_FILE AS CHG_FILENAME "
        		+ "  FROM SCM_NOTICE A "
        		+ "  WHERE NO = ? ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sNo));
    	System.out.println(sNo);
    	
    	comm_transaction controler = new comm_transaction();
    	
    	try {
    		joStartData = controler.selectData(SQL,parameters);
    		System.out.println("joStartData : " + joStartData);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[noSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	
    	return joStartData;
    }
    
 // 새로운 데이터 저장
    public String startInsert(String sModifyData) {
    	try {
    		JSONParser jpParser = new JSONParser();
    		JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
    		
    		for (int i = 0; i < jaArray.size(); i++) {
    			//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
    			JSONObject joParamObject = (JSONObject) jaArray.get(i);
    			
    			// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
    			String SQL = " INSERT INTO SCM_NOTICE( "
    					+"					  NO       ,     "
    					+"					  CRE_ID   ,     "
    					+"					  CRE_NAME ,     "
    					+"					  CHG_ID   ,     "
    					+"					  SUBJECT  ,     "
    					+"					  CONTENT  ,     "
    					+"					  CHG_FILE ,     "
    					+"					  CRE_DT   ,	 "
    					+"					  UP_DT    ,     "
    					+"					  UP_ID    )     "
    					+"             		  VALUES(( SELECT TO_CHAR(SYSDATE, 'YYYY') || DECODE(MAX(SUBSTR(NO, 5, 6)),NULL,'000001',TO_CHAR(LPAD(MAX(SUBSTR(NO, 5, 6)) + 1, 6, '0'))) FROM SCM_NOTICE),  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     '',  "
    					+"                     '' ) ";
    			
    			ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    			parameters.add(new comm_dataPack(1, joParamObject.get("Cre_id").toString()));
    			parameters.add(new comm_dataPack(2, joParamObject.get("Cre_name").toString()));
    			parameters.add(new comm_dataPack(3, joParamObject.get("Chg_id").toString()));
    			parameters.add(new comm_dataPack(4, joParamObject.get("Subject").toString()));
    			parameters.add(new comm_dataPack(5, joParamObject.get("Content").toString()));
    			parameters.add(new comm_dataPack(6, joParamObject.get("File").toString()));
    			parameters.add(new comm_dataPack(7, joParamObject.get("Cre_dt").toString()));
    			
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
    
 // 원본 데이터 수정
    public String startUpdate(String sModifyData) {
    	try {
	    	JSONParser jpParser = new JSONParser();
	    	JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
	    	
	        for (int i = 0; i < jaArray.size(); i++) {
	        	//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
	            JSONObject joParamObject = (JSONObject) jaArray.get(i);
	            
	            // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
	            String SQL = " UPDATE SCM_NOTICE "
	            		+ "			SET  		"
	            		+ "			CHG_ID = ?,	"
	            		+ "			SUBJECT = ?, "
	            		+ "			CONTENT = ?, "
	            		+ "			CHG_FILE = ? "
	            		+ "	  WHERE NO = ? ";
	            
	            ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
	            parameters.add(new comm_dataPack(1, joParamObject.get("Chg_id").toString()));
	            parameters.add(new comm_dataPack(2, joParamObject.get("Subject").toString()));
	            parameters.add(new comm_dataPack(3, joParamObject.get("Content").toString()));
	            parameters.add(new comm_dataPack(4, joParamObject.get("File").toString()));
	            parameters.add(new comm_dataPack(5, Integer.parseInt(joParamObject.get("No").toString())));
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
                    		+ " FROM SCM_NOTICE "
                    		+ " WHERE NO = ? ";
                    
                    ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
                    //System.out.println("===>"+joParamObject.get("KEY").toString());
                    parameter.add(new comm_dataPack(1, Integer.parseInt(joParamObject.get("KEY").toString())));
                
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
    
}
