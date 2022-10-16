/*
	Document : 프로그램 등록
	작성자 : 김준형
	작성일자 : 2021-10-12
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

@WebServlet("/sys_menupage_e")
public class sys_menupage_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public sys_menupage_e() {
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
        	case "sub2IdCheck":  // 소분류ID 중복 유효성 검사
        		String cMainId = request.getParameter("mainId");
        		String cSub1Id = request.getParameter("sub1Id");
	          	String cSub2Id = request.getParameter("sub2Id");
	          	joListData = getSub2IdCheck(cMainId, cSub1Id, cSub2Id);
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
                 response.getWriter().write(startSelect().toString());
                 break;
                 
             case "infoSelect":	//상세정보
            	 String sMain_id = request.getParameter("Main_id");
            	 String sSub1_id = request.getParameter("Sub1_id");
            	 String sSub2_id = request.getParameter("Sub2_id");
            	 
            	 response.getWriter().write(getJsonSel(sMain_id, sSub1_id, sSub2_id));
            	 break;
                 
             case "U":  //저장 (수정)
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startUpdate(sModifyData));
            	 break;
            	 
             case "D":  //삭제
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startDelete(sModifyData));
            	 break;
             
             case "I":  //추가
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startInsert(sModifyData));
            	 break;
        }
    }
    
    // 상세정보
    public String getJsonSel(String sMain_id, String sSub1_id, String sSub2_id) throws IOException{
    	JSONObject joListData = null;
    	joListData = infoSelect(sMain_id, sSub1_id, sSub2_id);     
    	
    	return joListData.toString();
    }
    
    //조회
    public JSONObject startSelect() {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = "   SELECT A.MAIN_ID          , "
        		+ "         A.SUB2_NAME, "
        		+ "         DECODE(LAG(A.MAIN_ID) OVER (ORDER BY A.MAIN_ID, B.SUB1_ID, C.SUB2_ID), A.MAIN_ID, '', A.SUB2_NAME) AS TIT1,  "
        		+ "         B.SUB1_ID          , "
        		+ "         DECODE(LAG(B.SUB1_ID) OVER (ORDER BY A.MAIN_ID, B.SUB1_ID, C.SUB2_ID), B.SUB1_ID, '', B.SUB1_ID) AS SORT3,  "
        		+ "         B.SUB2_NAME, "
        		+ "         DECODE(LAG(B.SUB1_ID) OVER (ORDER BY A.MAIN_ID, B.SUB1_ID, C.SUB2_ID), B.SUB1_ID, '', B.SUB2_NAME) AS TIT2,           "
        		+ "         C.SUB2_ID AS SORT4 , "
        		+ "         C.SUB2_NAME AS TIT3,  "
        		+ "			C.SUB2_ID, "
        		+ "         C.WINDOW_NAME,  "
        		+ "         C.IO_GUBUN,  "
        		+ "         C.PAGE_URL "
        		+ "    FROM   "
        		+ "         ( SELECT MAIN_ID,  "
        		+ "                  SUB1_ID,  "
        		+ "                  SUB2_ID,  "
        		+ "                  SUB2_NAME  "
        		+ "             FROM SCM_SUB2_T  "
        		+ "            WHERE IO_GUBUN = 'T' ) A,  "
        		+ "         ( SELECT MAIN_ID,  "
        		+ "                  SUB1_ID,  "
        		+ "                  SUB2_ID,  "
        		+ "                  SUB2_NAME  "
        		+ "             FROM SCM_SUB2_T  "
        		+ "            WHERE IO_GUBUN = 'A' ) B,  "
        		+ "         ( SELECT MAIN_ID,  "
        		+ "                  SUB1_ID,  "
        		+ "                  SUB2_ID,  "
        		+ "                  SUB2_NAME,  "
        		+ "                  WINDOW_NAME,  "
        		+ "                  IO_GUBUN,  "
        		+ "                  PAGE_URL  "
        		+ "             FROM SCM_SUB2_T  "
        		+ "            WHERE SUB2_ID <> '100' ) C  "
        		+ "   WHERE A.MAIN_ID =    B.MAIN_ID  "
        		+ "     AND B.MAIN_ID =    C.MAIN_ID  "
        		+ "     AND B.SUB1_ID =    C.SUB1_ID  ";
        
//        		+ " WHERE SUB1_ID <> 35 "   // 중분류 ISIR 관리 제외 
//				+ "   AND SUB2_ID <> 90 "	// 소분류 BOX 수불현황, 거래처정보 UPLOAD 제외
//				+ "   AND SUB2_ID <> 96 "
        
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
    
    // 선택한 프로그램 상세 정보 출력
    public JSONObject infoSelect(String sMain_id, String sSub1_id, String sSub2_id) {
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = " SELECT '0' ROWSTATUS, "
    			+ "           MAIN_ID, "
    			+ "           SUB1_ID, "
    			+ "           SUB2_ID, "
    			+ "           SUB2_NAME, "
    			+ "           WINDOW_NAME, "
    			+ "           IO_GUBUN, "
    			+ "           IO_GUBUN AS OLD_GUBUN, "
    			+ "           RMKS, "
    			+ "           PAGE_URL "
    			+ "      FROM SCM_SUB2_T "
    			+ "     WHERE ( MAIN_ID = ? ) AND "
    			+ "           ( SUB1_ID = ? ) AND "
    			+ "           ( SUB2_ID = ? ) ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sMain_id));
    	parameters.add(new comm_dataPack(2, sSub1_id));
    	parameters.add(new comm_dataPack(3, sSub2_id));
    	
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
    public String startUpdate(String sModifyData) {
    	try {
	    	JSONParser jpParser = new JSONParser();
	    	JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
	    	
	        for (int i = 0; i < jaArray.size(); i++) {
	        	//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
	            JSONObject joParamObject = (JSONObject) jaArray.get(i);
	            
	            // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
	            String SQL = " UPDATE SCM_SUB2_T "
	            		+ "		SET  		"
	            		+ "			MAIN_ID = ?, "
	            		+ "			SUB1_ID = ?, "
	            		+ "			SUB2_ID = ?, "
	            		+ "			SUB2_NAME = ?, "
	            		+ "			WINDOW_NAME = ?, "
	            		+ "			IO_GUBUN = ?, "
	            		+ "			RMKS = ?, "
	            		+ "			PAGE_URL = ? "
	            		+ "	  WHERE MAIN_ID = ? "
	            		+ "     AND SUB1_ID = ? "
	            		+ "     AND SUB2_ID = ? ";
	            
	            ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
	            parameters.add(new comm_dataPack(1, joParamObject.get("MainId").toString()));
	            parameters.add(new comm_dataPack(2, joParamObject.get("Sub1Id").toString()));
	            parameters.add(new comm_dataPack(3, joParamObject.get("Sub2Id").toString()));
	            parameters.add(new comm_dataPack(4, joParamObject.get("uSub2Name").toString()));
	            parameters.add(new comm_dataPack(5, joParamObject.get("uWindowName").toString().replace(".","")));
	            
	            if(joParamObject.get("uOldGubun").toString() == joParamObject.get("uIoGubun").toString()){
	            	parameters.add(new comm_dataPack(6, joParamObject.get("uOldGubun").toString()));
	            } else {
	            	parameters.add(new comm_dataPack(6, joParamObject.get("uIoGubun").toString()));
	            }
	            
	            parameters.add(new comm_dataPack(7, joParamObject.get("uRmks").toString()));
	            parameters.add(new comm_dataPack(8, joParamObject.get("uPageUrl").toString()));
	            parameters.add(new comm_dataPack(9, joParamObject.get("MainId").toString()));
	            parameters.add(new comm_dataPack(10, joParamObject.get("Sub1Id").toString()));
	            parameters.add(new comm_dataPack(11, joParamObject.get("Sub2Id").toString()));
	            
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
    public String startDelete(String JsonString) {
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
                    		+ " FROM SCM_SUB2_T "
                    		+ " WHERE MAIN_ID = ? "
                    		+ "	  AND SUB1_ID = ? "
                    		+ "	  AND SUB2_ID = ? ";
                    
                    ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
                    parameter.add(new comm_dataPack(1, joParamObject.get("MainId").toString()));
                    parameter.add(new comm_dataPack(2, joParamObject.get("Sub1Id").toString()));
                    parameter.add(new comm_dataPack(3, joParamObject.get("Sub2Id").toString()));
                
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
    
    // 프로그램 추가
    public String startInsert(String sModifyData) {
    	try {
	    	JSONParser jpParser = new JSONParser();
	    	JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
	    	
	        for (int i = 0; i < jaArray.size(); i++) {
	        	//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
	            JSONObject joParamObject = (JSONObject) jaArray.get(i);
	            
	            // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
	            String SQL = " INSERT INTO SCM_SUB2_T "
	            		+ "		( MAIN_ID, "
	            		+ "		  SUB1_ID, "
	            		+ "		  SUB2_ID, "
	            		+ "		SUB2_NAME, "
	            		+ "	  WINDOW_NAME, "
	            		+ "		 IO_GUBUN, "
	            		+ "			 RMKS, "
	            		+ "		 PAGE_URL ) "
	            		+ "	VALUES "
	            		+ "		( ?, "
	            		+ "		  ?, "
	            		+ "		  ?, "
	            		+ "		  ?, "
	            		+ "		  ?, "
	            		+ "		  ?, "
	            		+ "		  ?, "
	            		+ "		  ? ) ";
	            
	            ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
	            parameters.add(new comm_dataPack(1, joParamObject.get("MainId").toString()));
	            parameters.add(new comm_dataPack(2, joParamObject.get("Sub1Id").toString()));
	            parameters.add(new comm_dataPack(3, joParamObject.get("Sub2Id").toString()));
	            parameters.add(new comm_dataPack(4, joParamObject.get("uSub2Name").toString()));
	            parameters.add(new comm_dataPack(5, joParamObject.get("uWindowName").toString()));
	            
	            if(joParamObject.get("uOldGubun").toString() == joParamObject.get("uIoGubun").toString()){
	            	parameters.add(new comm_dataPack(6, joParamObject.get("uOldGubun").toString()));
	            } else {
	            	parameters.add(new comm_dataPack(6, joParamObject.get("uIoGubun").toString()));
	            }
	            
	            parameters.add(new comm_dataPack(7, joParamObject.get("uRmks").toString()));
	            parameters.add(new comm_dataPack(8, joParamObject.get("uPageUrl").toString()));
	            
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
    
    // 소분류 ID 중복 유효성 검사
    public JSONObject getSub2IdCheck(String cMainId, String cSub1Id, String cSub2Id) {
    	JSONObject joCheck = new JSONObject();
    	
            String SQL = " SELECT COUNT(*) AS COUNT "
            		+ "      FROM SCM_SUB2_T "
            		+ "     WHERE MAIN_ID = ? "
            		+ "		  AND SUB1_ID = ? "
            		+ "		  AND SUB2_ID = ? ";
            
            ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
            
            parameter.add(new comm_dataPack(1, cMainId));
            parameter.add(new comm_dataPack(2, cSub1Id));
            parameter.add(new comm_dataPack(3, cSub2Id));
        
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
