/*
	Document : 사용자등록
	작성자 : 김준형
	작성일자 : 2021-08-31
*/
package sys;

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

@WebServlet("/sys_login_e")
public class sys_login_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public sys_login_e() {
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
            case "saupj": // 사업장
                joListData = rfcod.getReffpf("02");
                break;           

            case "inputCvcod": // 거래처
                String sCvcod = request.getParameter("Cvcod");
                joListData = getCvnas(sCvcod);
                break;
                
            case "inputChg_id": // 사용자
            	String sChg_id = request.getParameter("Chg_id");
            	joListData = getChg_name(sChg_id);
            	break;

            case "inputChg_id_f": // 사용자ID (조회 조건)
            	String sChg_id_f = request.getParameter("Chg_id_f");
            	joListData = getChg_name_f(sChg_id_f);
            	break;
            	
            case "chgIdCheck":  // 사용자ID 중복 유효성 검사
	           	 String cChg_id = request.getParameter("Chg_id");
	           	 joListData = getChgIdCheck(cChg_id);
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
                 
                 String sChg_id = request.getParameter("Chg_id");	        //사용자ID
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage, sPageLength, sChg_id));
                 break;
                 
             case "chgSelect":  //행 선택 (상세 정보)
             	 sChg_id = request.getParameter("Chg_id");
             	 response.getWriter().write(getJsonSel(sChg_id));
             	 break;
             	
             case "U":  //저장
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startSaveU(sModifyData));
            	 break;
            	 
             case "D":  //삭제
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(cancelDelete(sModifyData));
            	 break;
             
             case "I":  //추가
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startInsert(sModifyData));
            	 break;
        }
    }
    
    // 조회
    public String getJson(String sPage, String sPageLength, String sChg_id) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sChg_id);     
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    
    // 상세정보
    public String getJsonSel(String sChg_id) throws IOException{
    	JSONObject joListData = null;
    	joListData = chgSelect(sChg_id);     
    	
    	return joListData.toString();
    }
    
    //거래처코드 조회
    public JSONObject getCvnas(String sCvcod){
        String SQL = " SELECT CVCOD, "
        		+ "	          CVNAS "
        		+ "    FROM VNDMST "
        		+ "    WHERE CVCOD = ? ";
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
    
    //사용자ID, 사용자명 조회
    public JSONObject getChg_name(String sChg_id){
    	String SQL = " SELECT CHG_ID, "
    			+ "           CHG_NAME "
    			+ "    FROM SCM_LOGIN_T "
    			+ "    WHERE CHG_ID = ? ";
    	JSONObject joCvnas = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sChg_id));
    	
    	comm_transaction controler = new comm_transaction();
    	try {
    		joCvnas = controler.selectData(SQL,parameters);
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    	return joCvnas;
    }
    
    //사용자ID, 사용자명 조회 ( 조회 조건 )
    public JSONObject getChg_name_f(String sChg_id){
    	String SQL = " SELECT CHG_ID AS CHG_ID_F,"
    			+ "           CHG_NAME AS CHG_NAME_F "
    			+ "    FROM SCM_LOGIN_T "
    			+ "    WHERE CHG_ID = ? ";
    	JSONObject joCvnas = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sChg_id));
    	
    	comm_transaction controler = new comm_transaction();
    	try {
    		joCvnas = controler.selectData(SQL,parameters);
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    	return joCvnas;
    }
    
    //사용자 조회
    public JSONObject startSelect(String sChg_id) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = " SELECT CHG_ID, "
        		+ "           CVCOD, "
        		+ "           FUN_GET_CVNAS(CVCOD) AS CVNAS, "
        		+ "           CHG_PW, "
        		+ "           CHG_NAME, "
        		+ "           CHG_BIRTH, "
        		+ "           CHG_FAX, "
        		+ "           CHG_HP, "
        		+ "           CHG_TEL, "
        		+ "           CHG_MAIL, "
        		+ "           AUTH, "
        		+ "           GUBUN, "
        		+ "           JIK_BMP, "
        		+ "           IP_ADDR, "
        		+ "           LOGIN_TIME, "
        		+ "           LOGOUT_TIME, "
        		+ "           CHG_ID AS CHG_ID2, "
        		+ "           FUN_GET_REFFPF('AD', SAUPJ) AS SAUPJ "
        		+ "      FROM SCM_LOGIN_T "
        		+ "     WHERE CHG_ID LIKE ?"
        		+ "		ORDER BY CHG_ID ";
        
        JSONObject joStartData = new JSONObject();
        
        //사용자ID
        if (sChg_id == null || sChg_id == "") {
        	sChg_id = "%";
        }
        
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sChg_id));
        
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
    
    // 선택한 사용자 상세 정보 출력
    public JSONObject chgSelect(String sChg_id) {
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = " SELECT '0' AS ROWSTATUS, "
    			+ "		 	  CHG_ID, "
    			+ "           CVCOD, "
    			+ "           CHG_PW, "
    			+ "           CHG_NAME, "
    			+ "           CHG_BIRTH, "
    			+ "           CHG_FAX, "
    			+ "           CHG_HP, "
    			+ "           CHG_TEL, "
    			+ "           CHG_MAIL, "
    			+ "           AUTH, "
    			+ "           GUBUN, "
    			+ "           JIK_BMP, "
    			+ "           IP_ADDR, "
    			+ "           LOGIN_TIME, "
    			+ "           LOGOUT_TIME, "
    			+ "           SAUPJ, "
    			+ "			  '' AS COPY_ID, "
    			+ "           CHG_ID AS CHG_ID2, "
    			+ "			  FUN_GET_CVNAS(CVCOD) AS CVNAS "
    			+ "      FROM SCM_LOGIN_T "
    			+ "     WHERE CHG_ID = ? ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sChg_id));
    	
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
    
    // 저장 (원본 데이터 수정)
    public String startSaveU(String sModifyData) {
    	try {
	    	JSONParser jpParser = new JSONParser();
	    	JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
	    	
	        for (int i = 0; i < jaArray.size(); i++) {
	        	//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
	            JSONObject joParamObject = (JSONObject) jaArray.get(i);
	            
	            // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
	            String SQL = " UPDATE SCM_LOGIN_T SET "
	            		+ "			CHG_ID = ?, "
	            		+ "			CVCOD = ?,  "
	            		+ "			CHG_PW = ?, "
	            		+ "			CHG_NAME = ?, "
	            		+ "			CHG_BIRTH = ?, "
	            		+ "			CHG_FAX = ?, "
	            		+ "			CHG_HP = ?, "
	            		+ "			CHG_TEL = ?, "
	            		+ "			CHG_MAIL = ?, "
	            		+ "			AUTH = ?, "
	            		+ "			GUBUN = ?, "
	            		+ "			IP_ADDR = SYS_CONTEXT('userenv', 'ip_address'), "
	            		+ "			SAUPJ = ? "
	            		+ "  WHERE  CHG_ID = ? ";
	            
	            ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
	            parameters.add(new comm_dataPack(1, joParamObject.get("Chg_id").toString()));
	            parameters.add(new comm_dataPack(2, joParamObject.get("Cvcod").toString()));
	            parameters.add(new comm_dataPack(3, joParamObject.get("Chg_pw").toString()));
	            parameters.add(new comm_dataPack(4, joParamObject.get("Chg_name").toString()));
	            parameters.add(new comm_dataPack(5, joParamObject.get("Chg_birth").toString().replace(".",""))); 
	            parameters.add(new comm_dataPack(6, joParamObject.get("Chg_fax").toString()));
	            parameters.add(new comm_dataPack(7, joParamObject.get("Chg_hp").toString()));
	            parameters.add(new comm_dataPack(8, joParamObject.get("Chg_tel").toString()));
	            parameters.add(new comm_dataPack(9, joParamObject.get("Chg_mail").toString()));
	            parameters.add(new comm_dataPack(10, joParamObject.get("Auth").toString()));
	            parameters.add(new comm_dataPack(11, joParamObject.get("Gubun").toString()));
	            parameters.add(new comm_dataPack(12, joParamObject.get("Saupj").toString()));
	            parameters.add(new comm_dataPack(13, joParamObject.get("Chg_id2").toString()));
	            
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
    
    // 사용자 삭제
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
                    		+ " FROM SCM_LOGIN_T "
                    		+ " WHERE CHG_ID = ? ";
                    
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
    
    // 사용자 추가 ( 빈 행 삽입 )
    public String startInsert(String sModifyData) {
    	try {
	    	JSONParser jpParser = new JSONParser();
	    	JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
	    	
	        for (int i = 0; i < jaArray.size(); i++) {
	        	//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
	            JSONObject joParamObject = (JSONObject) jaArray.get(i);
	            
	            // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
	            String SQL = " INSERT INTO SCM_LOGIN_T "
	            		+ "		  ( CHG_ID, "
	            		+ "			CVCOD,  "
	            		+ "			CHG_PW, "
	            		+ "			CHG_NAME, "
	            		+ "			CHG_BIRTH, "
	            		+ "			CHG_FAX, "
	            		+ "			CHG_HP, "
	            		+ "			CHG_TEL, "
	            		+ "			CHG_MAIL, "
	            		+ "			AUTH, "
	            		+ "			GUBUN, "
	            		+ "			JIK_BMP, "
	            		+ "			IP_ADDR, "
	            		+ "			LOGIN_TIME,"
	            		+ "			LOGOUT_TIME, "
	            		+ "			SAUPJ ) "
	            		+ "  VALUES ( ?, "
	            		+ "			  ?, "
	            		+ "			  ?, "
	            		+ "			  ?, "
	            		+ "			  TO_CHAR(SYSDATE, 'YYYYMMDD'), "
	            		+ "			  ?, "
	            		+ "			  ?, "
	            		+ "			  ?, "
	            		+ "			  ?, "
	            		+ "			  ?, "
	            		+ "			  ?, "
	            		+ "			  '', "
	            		+ "			  SYS_CONTEXT('userenv', 'ip_address'), "
	            		+ "			  TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'), " //로그인타임
	            		+ "			  TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'), " // 로그아웃타임 어떻게 넣는지 여쭤보기.
	            		+ "			  ? ) ";
	            
	            ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
	            parameters.add(new comm_dataPack(1, joParamObject.get("Chg_id").toString()));
	            parameters.add(new comm_dataPack(2, joParamObject.get("Cvcod").toString()));
	            parameters.add(new comm_dataPack(3, joParamObject.get("Chg_pw").toString()));
	            parameters.add(new comm_dataPack(4, joParamObject.get("Chg_name").toString()));
	            parameters.add(new comm_dataPack(5, joParamObject.get("Chg_fax").toString())); 
	            parameters.add(new comm_dataPack(6, joParamObject.get("Chg_hp").toString()));
	            parameters.add(new comm_dataPack(7, joParamObject.get("Chg_tel").toString()));
	            parameters.add(new comm_dataPack(8, joParamObject.get("Chg_mail").toString()));
	            parameters.add(new comm_dataPack(9, joParamObject.get("Auth").toString()));
	            parameters.add(new comm_dataPack(10, joParamObject.get("Gubun").toString()));
	            parameters.add(new comm_dataPack(11, joParamObject.get("Saupj").toString()));
	            
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
    
    // 사용자 ID 중복 유효성 검사
    public JSONObject getChgIdCheck(String sChg_id) {
    	JSONObject joCheck = new JSONObject();
    	
            String SQL = " SELECT COUNT(*) AS COUNT "
            		+ "      FROM SCM_LOGIN_T "
            		+ "     WHERE CHG_ID = ? ";
            
            ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
            
            parameter.add(new comm_dataPack(1, sChg_id));
        
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
}
