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

@WebServlet("/sys_menuuser_e")
public class sys_menuuser_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public sys_menuuser_e() {
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
        		String cChgId = request.getParameter("chgId");
        		String cMainId = request.getParameter("mainId");
        		String cSub1Id = request.getParameter("sub1Id");
	          	String cSub2Id = request.getParameter("sub2Id");
	          	joListData = getSub2IdCheck(cChgId, cMainId, cSub1Id, cSub2Id);
	          	break;
	        
            case "message":    
                String sCode = request.getParameter("Code");
                joListData = message.getMessage(sCode);
                break;
            case "inputChgid":
                String sChgid = request.getParameter("Chgid");
                joListData = getChgname(sChgid);
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
        String sResult = "";
        
        switch(sActGubun) {
             case "R":	//조회
                 response.getWriter().write(startSelect().toString());
                 break;
                 
             case "C":	//상세정보
            	 String sChg_id = request.getParameter("Chg_id");

            	 response.getWriter().write(getJsonSel(sChg_id));
            	 break;
                 
             case "I":  //저장
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startSave(sModifyData));
            	 break;
            	 
             case "D":  //삭제
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startDelete(sModifyData));
            	 break;
            	 
             case "mediumCheck":  //중분류 유무 체크
            	 String mcChgId = request.getParameter("mcId");
            	 String mcMainId = request.getParameter("mcMain");
            	 String mcSub1Id = request.getParameter("mcSub1");
            	 
            	 response.getWriter().write(mediumCheck(mcChgId, mcMainId, mcSub1Id));
            	 break;
            	 
             case "smallCheck":  //소분류 유무 체크
            	 String scChgId = request.getParameter("scId");
            	 String scMainId = request.getParameter("scMain");
            	 String scSub1Id = request.getParameter("scSub1");
            	 
            	 response.getWriter().write(smallCheck(scChgId, scMainId, scSub1Id));
            	 break;
            	 
             case "InMdu":  //중분류 추가
            	 String inChgId = request.getParameter("id");
            	 String inMainId = request.getParameter("mainId");
            	 String inSub1Id = request.getParameter("sub1Id");
            	 String inSub2Name = request.getParameter("sub2Name");
            	 
            	 response.getWriter().write(inMdu(inChgId, inMainId, inSub1Id, inSub2Name).toString());
            	 break;
            	 
             case "MduDe":  //중분류 삭제
            	 String deChgId = request.getParameter("CHG_ID");
            	 String deMainId = request.getParameter("MAIN_ID");
            	 String deSub1Id = request.getParameter("SUB1_ID");
            	 
            	 response.getWriter().write(deMdu(deChgId, deMainId, deSub1Id).toString());
            	 break;
             
        }
    }
    
    // 사용자 메뉴
    public String getJsonSel(String sChg_id) throws IOException{
    	JSONObject joListData = null;
    	joListData = infoSelect(sChg_id);     
    	
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
        
        JSONObject joStartData = new JSONObject();
        comm_transaction controler = new comm_transaction();      
      
        try {
            joStartData = controler.selectData(SQL);
            System.out.println("joStartData : " + joStartData);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }
        return joStartData;
    }
    
    // 사용자 기존 메뉴 조회
    public JSONObject infoSelect(String sChg_id) {
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = "  SELECT A.MAIN_ID          ,  "
    			+ "         A.SUB2_NAME,  "
    			+ "         DECODE(LAG(A.MAIN_ID) OVER (ORDER BY A.MAIN_ID, B.SUB1_ID, C.SUB2_ID), A.MAIN_ID, '', A.SUB2_NAME) AS TIT1,   "
    			+ "         B.SUB1_ID          ,  "
    			+ "         DECODE(LAG(B.SUB1_ID) OVER (ORDER BY A.MAIN_ID, B.SUB1_ID, C.SUB2_ID), B.SUB1_ID, '', B.SUB1_ID) AS SORT3,   "
    			+ "         B.SUB2_NAME,  "
    			+ "         DECODE(LAG(B.SUB1_ID) OVER (ORDER BY A.MAIN_ID, B.SUB1_ID, C.SUB2_ID), B.SUB1_ID, '', B.SUB2_NAME) AS TIT2,            "
    			+ "         C.SUB2_ID AS SORT4 ,  "
    			+ "         C.SUB2_NAME AS TIT3,   "
    			+ "            C.SUB2_ID,  "
    			+ "         C.WINDOW_NAME,   "
    			+ "         C.IO_GUBUN,   "
    			+ "         C.PAGE_URL "
    			+ "    		FROM    "
    			+ "         ( SELECT MAIN_ID,  "
    			+ "                  SUB2_NAME   "
    			+ "             FROM SCM_SUB2_T   "
    			+ "            WHERE IO_GUBUN = 'T' ) A,   "
    			+ "         ( SELECT MAIN_ID,   "
    			+ "                  SUB1_ID,   "
    			+ "                  SUB2_NAME   "
    			+ "             FROM SCM_SUB2_T   "
    			+ "            WHERE IO_GUBUN = 'A' ) B,   "
    			+ "         ( SELECT MAIN_ID,   "
    			+ "                  SUB1_ID,   "
    			+ "                  SUB2_ID,   "
    			+ "                  SUB2_NAME,   "
    			+ "                  WINDOW_NAME,   "
    			+ "                  IO_GUBUN,   "
    			+ "                  PAGE_URL   "
    			+ "             FROM SCM_SUB2_T "
    			+ "             WHERE IO_GUBUN NOT IN ('T','A') ) C, "
    			+ "             ( SELECT MAIN_ID,   "
    			+ "                  SUB1_ID,   "
    			+ "                  SUB2_ID,   "
    			+ "                  SUB2_NAME, "
    			+ "                  CHG_ID "
    			+ "             FROM SCM_USER_T "
    			+ "             WHERE CHG_ID = ? ) D "
    			+ "   WHERE A.MAIN_ID =    B.MAIN_ID   "
    			+ "     AND B.MAIN_ID =    C.MAIN_ID "
    			+ "     AND B.SUB1_ID =    C.SUB1_ID "
    			+ "     AND C.MAIN_ID =    D.MAIN_ID  "
    			+ "     AND C.SUB1_ID =    D.SUB1_ID  "
    			+ "     AND C.SUB2_ID =    D.SUB2_ID ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sChg_id));
    	
    	comm_transaction controler = new comm_transaction();      
    	
    	try {
    		joStartData = controler.selectData(SQL,parameters);
    		//System.out.println("joStartData : " + joStartData);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	
    	return joStartData;
    }
    
    // 저장
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
    
    // 사용자 메뉴 삭제
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
                    		+ " FROM SCM_USER_T "
                    		+ " WHERE CHG_ID = ? "
                    		+ "   AND MAIN_ID = ? "
		                    + "   AND SUB1_ID = ? "
		                    + "   AND SUB2_ID = ? ";
                    
                    ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
                    //System.out.println("===>"+joParamObject.get("KEY").toString());
                    parameter.add(new comm_dataPack(1, joParamObject.get("CHG_ID").toString()));
                    parameter.add(new comm_dataPack(2, joParamObject.get("MAIN_ID").toString()));
                    parameter.add(new comm_dataPack(3, joParamObject.get("SUB1_ID").toString()));
                    parameter.add(new comm_dataPack(4, joParamObject.get("SUB2_ID").toString()));
                    
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
    
    // 저장
    public String startSave(String sModifyData) {
    	try {
	    	JSONParser jpParser = new JSONParser();
	    	JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
	    	
	        for (int i = 0; i < jaArray.size(); i++) {
	        	//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
	            JSONObject joParamObject = (JSONObject) jaArray.get(i);
	            
	            // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
	            String SQL = " INSERT INTO SCM_USER_T "
	            		+ "		(  CHG_ID, "
	            		+ "		  MAIN_ID, "
	            		+ "		  SUB1_ID, "
	            		+ "		  SUB2_ID, "
	            		+ "		SUB2_NAME, "
	            		+ "	  WINDOW_NAME ) "
	            		+ "	VALUES "
	            		+ "		( ?, "
	            		+ "		  ?, "
	            		+ "		  ?, "
	            		+ "		  ?, "
	            		+ "		  ?, "
	            		+ "		  ? ) ";
	            
	            ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
	            parameters.add(new comm_dataPack(1, joParamObject.get("CHG_ID").toString()));
	            parameters.add(new comm_dataPack(2, joParamObject.get("MAIN_ID").toString()));
	            parameters.add(new comm_dataPack(3, joParamObject.get("SUB1_ID").toString()));
	            parameters.add(new comm_dataPack(4, joParamObject.get("SUB2_ID").toString()));
	            parameters.add(new comm_dataPack(5, joParamObject.get("SUB2_NAME").toString()));
	            parameters.add(new comm_dataPack(6, joParamObject.get("WINDOW_NAME").toString()));
	            	
	            System.out.println("1========= @@@#### " + joParamObject.get("WINDOW_NAME").toString());
	            System.out.println("2========= @@@#### " + joParamObject.get("SUB2_NAME").toString());
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
    public JSONObject getSub2IdCheck(String cChgId, String cMainId, String cSub1Id, String cSub2Id) {
    	JSONObject joCheck = new JSONObject();
    	
            String SQL = " SELECT COUNT(*) AS COUNT "
            		+ "      FROM SCM_USER_T "
            		+ "     WHERE CHG_ID = ? "
            		+ "		  AND MAIN_ID = ? "
            		+ "		  AND SUB1_ID = ? "
            		+ "		  AND SUB2_ID = ? ";
            
            ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
            
            parameter.add(new comm_dataPack(1, cChgId));
            parameter.add(new comm_dataPack(2, cMainId));
            parameter.add(new comm_dataPack(3, cSub1Id));
            parameter.add(new comm_dataPack(4, cSub2Id));
        
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
    // 중분류 유무 체크
    public String mediumCheck(String mcChgId, String mcMainId, String mcSub1Id) {
    	JSONObject joCheck = new JSONObject();
    	
    	String SQL = " SELECT COUNT(*) AS SUB_MDU "
    			+ "      FROM SCM_USER_T "
    			+ "     WHERE CHG_ID = ? "
    			+ "		  AND MAIN_ID = ? "
    			+ "		  AND SUB1_ID = ? "
    			+ "		  AND SUB2_ID = '100' ";
    	
    	ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
    	
    	parameter.add(new comm_dataPack(1, mcChgId));
    	parameter.add(new comm_dataPack(2, mcMainId));
    	parameter.add(new comm_dataPack(3, mcSub1Id));
    	
    	System.out.println("mc사용자ID = " + mcChgId);
    	System.out.println("mc대분류 = " + mcMainId);
    	System.out.println("mc중분류 = " + mcSub1Id);
    	
    	comm_transaction controler = new comm_transaction();
    	try {
    		joCheck = controler.selectData(SQL, parameter);
    	} catch (Exception ex) {
    		System.out.println(ex.getMessage());
    		ex.printStackTrace();
    		sErrMessage = "DB Error : " + ex.getMessage();
    	}
    	
    	return joCheck.toString();
     }
    // 소분류 정보 받아오기
    public String smallCheck(String scChgId, String scMainId, String scSub1Id) {
    	JSONObject joCheck = new JSONObject();
    	String SQL = " SELECT MAX(SUB1_ID) AS SUB_SML,"
    			+ "			  COUNT(*) AS CNT_SML "
    			+ "      FROM SCM_USER_T "
    			+ "     WHERE CHG_ID = ? "
    			+ "		  AND MAIN_ID = ? "
    			+ "		  AND SUB1_ID = ? "
    			+ "		  AND SUB2_ID <> '100' ";
    	
    	ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
    	
    	parameter.add(new comm_dataPack(1, scChgId));
    	parameter.add(new comm_dataPack(2, scMainId));
    	parameter.add(new comm_dataPack(3, scSub1Id));
    	
    	System.out.println("sc사용자ID = " + scChgId);
    	System.out.println("sc대분류 = " + scMainId);
    	System.out.println("sc중분류 = " + scSub1Id);
    	
    	comm_transaction controler = new comm_transaction();
    	try {
    		joCheck = controler.selectData(SQL, parameter);
    	} catch (Exception ex) {
    		System.out.println(ex.getMessage());
    		ex.printStackTrace();
    		sErrMessage = "DB Error : " + ex.getMessage();
    	}
    	
    	return joCheck.toString();
    }
    
    // 중분류 추가
    public String inMdu(String inChgId, String inMainId, String inSub1Id, String inSub2Name) {
    	JSONObject joCheck = new JSONObject();
    	
    	String SQL = " INSERT INTO SCM_USER_T "
    			+ "					( CHG_ID, "
    			+ "					  MAIN_ID, "
    			+ "                   SUB1_ID, "
    			+ "                   SUB2_ID, "
    			+ "                   SUB2_NAME, "
    			+ "                   WINDOW_NAME, "
    			+ "                   SUB2_NAME_KO, "
    			+ "                   SUB2_NAME_EN, "
    			+ "                   SUB2_NAME_CH, "
    			+ "                   SUB2_NAME_JP ) "
    			+ "              VALUES ( ?, ?, ?, '100', ?, '', '', '', '', '') ";
    	
    	ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
    	
    	parameter.add(new comm_dataPack(1, inChgId));
    	parameter.add(new comm_dataPack(2, inMainId));
    	parameter.add(new comm_dataPack(3, inSub1Id));
    	parameter.add(new comm_dataPack(4, inSub2Name));
    	
    	System.out.println("중분류 등록 시작");
    	System.out.println("inChgId = " + inChgId);
    	System.out.println("inMainId = " + inMainId);
    	System.out.println("inSub1Id = " + inSub1Id);
    	System.out.println("inSub2Name = " + inSub2Name);
    	
    	comm_transaction controler = new comm_transaction();
    	try {
    		controler.updateData(SQL, parameter);
    	} catch (Exception ex) {
    		System.out.println(ex.getMessage());
    		ex.printStackTrace();
    		sErrMessage = "DB Error : " + ex.getMessage();
    	}
    	
    	System.out.println("중분류 등록 종료");
    	return joCheck.toString();
    }
    
    // 중분류 삭제
    public String deMdu(String deChgId, String deMainId, String deSub1Id) {
    	JSONObject joCheck = new JSONObject();
    	
    	String SQL = " DELETE FROM SCM_USER_T "
    			+ "            WHERE CHG_ID = ? "
    			+ "            AND MAIN_ID = ? "
    			+ "            AND SUB1_ID = ? "
    			+ "            AND SUB2_ID = '100' ";
    	
    	ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
    	
    	parameter.add(new comm_dataPack(1, deChgId));
    	parameter.add(new comm_dataPack(2, deMainId));
    	parameter.add(new comm_dataPack(3, deSub1Id));
    	
    	System.out.println("중분류 삭제 시작");
    	System.out.println("deChgId = " + deChgId);
    	System.out.println("deMainId = " + deMainId);
    	System.out.println("deSub1Id = " + deSub1Id);
    	
    	comm_transaction controler = new comm_transaction();
    	try {
    		controler.updateData(SQL, parameter);
    	} catch (Exception ex) {
    		System.out.println(ex.getMessage());
    		ex.printStackTrace();
    		sErrMessage = "DB Error : " + ex.getMessage();
    	}
    	
    	System.out.println("중분류 삭제 종료");
    	return joCheck.toString();
    }
}
