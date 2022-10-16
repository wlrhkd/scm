/*
	Document : 자료실등록
	작성자 : 염지광
	작성일자 : 2021-09-08
*/
package sys;

import java.io.File;
import java.io.IOException;

import java.sql.CallableStatement;
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
import comm.comm_message;
import comm.combo.comm_reffpf_c;

@WebServlet("/sys_apds_e")
public class sys_apds_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public sys_apds_e() {
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
	        case "inputCvcod":
	            String sCvcod = request.getParameter("Cvcod");
	            joListData = getCvnas(sCvcod);
	            break;
        	case "message":    
                String sCode = request.getParameter("Code");
                joListData = message.getMessage(sCode);
                break;            
        }
        response.getWriter().write(joListData.toString());
        
    }

	private JSONObject getCvnas(String sCvcod) {
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

                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage, sPageLength));
                 break;     
                 
             case "chgSelect":  //행 선택
              	String sCvcod = request.getParameter("Cvcod");
              	response.getWriter().write(getJsonSel(sCvcod));
              	break;
              	
             case "pnoSelect": 
            	 String sUserId = request.getParameter("Userid");
            	 String sPNO = request.getParameter("PNO");
            	 response.getWriter().write(getJsonSel2(sUserId,sPNO));
               	 break;
             case "pnoSelectT": 
            	 String tUserId = request.getParameter("Userid");
            	 String tPNO = request.getParameter("PNO");
            	 response.getWriter().write(getJsonSel3(tUserId,tPNO));
            	 break;

             case "R2":	// 2번 테이블 조회
//            	 String sCre_dt = request.getParameter("Cre_dt");
//            	 String sChg_id = request.getParameter("Chg_id");
//            	 String sUserid = request.getParameter("Userid");
            	 
            	 response.getWriter().write(getJsonT());
            	 break;     

             case "R3":	// 2번 테이블 조회
            	 String s2Cre_dt = request.getParameter("Cre_dt");
            	 String s2Chg_id = request.getParameter("Chg_id");
            	 String s2Userid = request.getParameter("Userid");
            	 response.getWriter().write(getJsonA(s2Cre_dt,s2Chg_id,s2Userid));
            	 break;     

             case "Rs": // 테이블 헤더
            	 response.getWriter().write(startSelectS().toString());
            	 break;
            	 
             case "U":  //저장
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startSaveU(sModifyData));
            	 break;
             case "I":  //수정
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startUpdate(sModifyData));
            	 break;
             case "GetPno":  //pno뽑기
            	 String sSubject = request.getParameter("Subject");
            	 response.getWriter().write(getPno(sSubject));
            	 break;
             case "D":  //삭제
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(cancelDelete(sModifyData));
            	 break;
             case "deleteFile":  //파일삭제
               	String sFile = request.getParameter("File");
               	response.getWriter().write(getJsonDel(sFile));
               	break;
             case "filePno":  //파일명 뽑기
            	 String sfPno = request.getParameter("fPno");
            	 response.getWriter().write(getfileName(sfPno));
            	 break;
        }
        
    }

	private String getJsonA(String s2Cre_dt, String s2Chg_id, String s2Userid) {
		JSONObject joListData = null;
		 
		joListData =  detailSelect(s2Cre_dt, s2Chg_id, s2Userid);
		
		return joListData.toString();
	}

	private JSONObject detailSelect(String s2Cre_dt, String s2Chg_id, String s2Userid) {
        String sResult = null;
        
        String SQL = "  SELECT ROW_NUMBER() OVER(ORDER BY A.PNO ASC) AS ROWNUM1, A.PNO ,     "
        		+ "         DECODE(A.DEPTH,0,A.SUBJECT,LPAD(' ',A.DEPTH*3)||'⇒ '||DECODE(A.DELYN,'Y','삭제',A.SUBJECT)) AS SUBJECT2,  "
        		+ "         A.SUBJECT ,  "
        		+ "         A.CRE_ID,     "
        		+ "         A.CRE_DT,     "
        		+ "         A.CHG_ID,     "
//        		+ "         A.CHG_FILE,   "
//        		+ "         DECODE(A.DELYN ,'Y', NULL ,A.CHG_FILE) AS CHG_FILE,  "
        		+ "         NVL(A.CHG_FILE, ' ') AS CHG_FILE, "
        		+ "         A.NTHREAD,     "
        		+ "         A.DEPTH,     "
        		+ "         A.DELYN,     "
        		+ "         A.ADMIN_ID  ,  "
        		+ "         B.CHG_NAME  ,  "
        		+ "         A.IP_PNO  "
        		+ "    FROM SCM_PDS A   ,  "
        		+ "         SCM_LOGIN_T B  "
        		+ "   WHERE A.CHG_ID = B.CHG_ID  "
        		+ "    AND SUBSTR(A.CRE_DT,1,8) >= ? "
        		+ "    AND A.CHG_ID = ? "
        		+ "    AND A.ADMIN_ID = ? "
        		+ "   ORDER BY A.PNO DESC, ROWNUM1 DESC ";
        JSONObject joStartData = new JSONObject();
//        
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, s2Cre_dt));
        parameters.add(new comm_dataPack(2, s2Chg_id));
        parameters.add(new comm_dataPack(3, s2Userid));
        
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

	//파일삭제
	private String getJsonDel(String sFile) throws IOException {
		
		return deleteFile(sFile);
	}
    
	public String getJson(String sPage, String sPageLength) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelectA();     
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    
	public String getJsonSel(String sCvcod) throws IOException{
		JSONObject joListData = null;
		joListData = chgSelect(sCvcod);     
		
		return joListData.toString();
	}
	
	public String getJsonSel2(String sUserId,String sPNO) throws IOException{
		JSONObject joListData = null;
		joListData = pnoSelect(sUserId, sPNO);     
		
		return joListData.toString();
	}
	
	private String getJsonSel3(String tUserId, String tPNO) throws IOException{
		JSONObject joListData = null;
		joListData = pnoSelectT(tUserId, tPNO);     
		
		return joListData.toString();
	}

	private JSONObject pnoSelect(String sUserId, String sPNO) {
		String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = "  SELECT A.PNO,  "
    			+ "			   A.SUBJECT,  "
    			+ "            A.CONTENT,  "
    			+ "            A.CRE_ID,  "
    			+ "            A.CRE_DT,  "
    			+ "            A.CHG_ID,  "
    			+ "            A.CHG_FILE,  "
    			+ "            A.ADMIN_ID,  "
    			+ "            A.NTHREAD,  "
    			+ "            A.DEPTH,  "
    			+ "            A.DELYN,  "
    			+ "            A.IP_PNO, "
    			+ "            B.CHG_NAME "
    			+ "       FROM SCM_PDS A, "
    			+ "            SCM_LOGIN_T B  "
    			+ "      WHERE CRE_ID = ?  "
    			+ "        AND A.CHG_ID = B.CHG_ID "
    			+ "        AND PNO = ? ";
    	
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sUserId));
    	parameters.add(new comm_dataPack(2, sPNO));
    	
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

	private JSONObject pnoSelectT(String tUserId, String tPNO) {
String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = " SELECT PNO,  "
    			+ "           SUBJECT,  "
    			+ "           CONTENT,  "
    			+ "           CRE_ID,  "
    			+ "           CRE_DT,  "
    			+ "           CHG_ID,  "
    			+ "           CHG_FILE,  "
    			+ "           ADMIN_ID,  "
    			+ "           NTHREAD,  "
    			+ "           DEPTH,  "
    			+ "           DELYN,  "
    			+ "           IP_PNO "
    			+ "     FROM SCM_PDS  "
    			+ "    WHERE CRE_ID = ? "
    			+ "      AND CHG_ID = 'TOTAL' "
    			+ "      AND PNO = ? ";
    	
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, tUserId));
    	parameters.add(new comm_dataPack(2, tPNO));
    	
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
	
	private String getJsonT() {
		JSONObject joListData = null;
		joListData =  totalSelect();
		return joListData.toString();
	}

	//거래처 조회(넘겨줄 파라미터 없어도 됨)
    public JSONObject startSelectA() {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = " SELECT ROWNUM AS ROWNO, "
        		+ "         A.CVCOD,    "
        		+ "         A.CHG_NAME,  "
        		+ "         A.CHG_ID "
        		+ "   FROM  SCM_LOGIN_T A "
        		+ "  WHERE  A.AUTH <> '1' "
        		+ "  UNION ALL "
        		+ "  SELECT 0 AS ROWNO , "
        		+ "        'TOTAL' AS CVCOD , "
        		+ "        '전체' AS CHG_NAME ,   "
        		+ "          'TOTAL' AS CHG_ID  "
        		+ "   FROM DUAL "
        		+ " ORDER BY ROWNO ";
        
        JSONObject joStartData = new JSONObject();

        comm_transaction controler = new comm_transaction();      
      
        try {
            joStartData = controler.selectData(SQL);
//            System.out.println("joStartData : " + joStartData);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }

        return joStartData;
    }
    
    
 
 // 선택한 사용자 상세 정보 출력
    public JSONObject chgSelect(String sCvcod) {
    	String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = " SELECT CHG_NAME,CVCOD "
    			+ "      FROM SCM_LOGIN_T "
    			+ "     WHERE CVCOD = ? "
    			+ " UNION ALL SELECT 'TOTAL' AS CVCOD ,  '전체' AS CHG_NAME "
    			+ " FROM DUAL  ";
    	
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sCvcod));
    	
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

    //2번 테이블
    private JSONObject totalSelect() {
    	String sResult = null;
        
        String SQL = " SELECT ROW_NUMBER() OVER(ORDER BY PNO DESC) AS ROWNUM1,"
        		+ " PNO,      "
        		+ " SUBJECT,  "
        		+ " CONTENT,  "
        		+ " CRE_ID,   "
        		+ " CRE_DT,   "
        		+ " CHG_ID,   "
        		+ " NVL(CHG_FILE, ' ') AS CHG_FILE, "
        		+ " ADMIN_ID,"
        		+ " NTHREAD,"
        		+ " DEPTH,"
        		+ " IP_PNO,"
        		+ " DELYN     "
        		+ " FROM SCM_PDS ";
        JSONObject joStartData = new JSONObject();
//        
//        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
//        parameters.add(new comm_dataPack(1, sCre_dt));
//        parameters.add(new comm_dataPack(2, sChg_id));
////        parameters.add(new comm_dataPack(3, sCre_id));
//        parameters.add(new comm_dataPack(3, sUserid));
//        parameters.add(new comm_dataPack(4, sCre_dt));
        
        comm_transaction controler = new comm_transaction();      
      
        try {
            joStartData = controler.selectData(SQL);
            System.out.println(joStartData);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }

        return joStartData;
    }
    
 // 메뉴 오픈 시 테이블 헤더 출력
    public JSONObject startSelectS() {
    	String sResult = null;
    	
    	String SQL = " SELECT ' ' AS ROWNUM1, "
    			+ "         ' ' AS SUBJECT, "
    			+ "         ' ' AS CRE_ID, "
    			+ "         ' ' AS CHG_FILE, "
    			+ "         ' ' AS CRE_DT "
    			+ "           FROM DUAL "
    			+ "     CONNECT BY LEVEL <= 20 ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	comm_transaction controler = new comm_transaction();      
    	
    	try {
    		joStartData = controler.selectData(SQL);
//    		System.out.println("jostartData :" + joStartData);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	return joStartData;
    }
    
    // 저장 버튼
    public String startSaveU(String sModifyData) {
    	
    	try {
    		JSONParser jpParser = new JSONParser();
    		JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
    		
    		for (int i = 0; i < jaArray.size(); i++) {
    			//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
    			JSONObject joParamObject = (JSONObject) jaArray.get(i);
    			
    			// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
    			String SQL = " INSERT INTO SCM_PDS( PNO       ,      "
    					+"					  SUBJECT   ,     "
    					+"					  CONTENT   ,     "
    					+"					  CRE_ID    ,     "
    					+"					  CRE_DT    ,     "
    					+"					  CHG_ID    ,     "
    					+"					  CHG_FILE  ,     "
    					+"					  ADMIN_ID  ,     "
    					+"					  NTHREAD   ,     "
    					+"					  DEPTH     ,     "
    					+"					  DELYN     ,     "
    					+"					  IP_PNO     )     "
    					+"             VALUES( (SELECT TO_CHAR(SYSDATE, 'YYYY') || DECODE(MAX(SUBSTR(PNO, 5, 6)),NULL,'000001',TO_CHAR(LPAD(MAX(SUBSTR(PNO, 5, 6)) + 1, 6, '0'))) "
    					+ "                       FROM SCM_PDS),      "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     ?,    "
    					+"                     ?,    "
    					+"                     ?,    "
    					+"                     ?,  "
    					+"                     ?,  "
    					+"                     '', "
    					+"                     '' ,    "
    					+"                     'N',             "
    					+"                     ''  )   " ;
    			
    			
    			
    			ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
//    			parameters.add(new comm_dataPack(1, joParamObject.get("Pno").toString()));
    			parameters.add(new comm_dataPack(1, joParamObject.get("Subject").toString()));
    			parameters.add(new comm_dataPack(2, joParamObject.get("Content").toString()));
    			parameters.add(new comm_dataPack(3, joParamObject.get("Cre_id").toString()));
    			parameters.add(new comm_dataPack(4, joParamObject.get("Cre_dt").toString()));
    			parameters.add(new comm_dataPack(5, joParamObject.get("Chg_id").toString()));
    			parameters.add(new comm_dataPack(6, joParamObject.get("File").toString()));
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
    // 자료실 수정
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
	            		+ "			CONTENT = ?, "
	            		+ "			CHG_FILE = ? "
	            		+ "	  WHERE PNO = ? ";
	            
	            ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
	            parameters.add(new comm_dataPack(1, joParamObject.get("Subject").toString()));
	            parameters.add(new comm_dataPack(2, joParamObject.get("Content").toString()));
	            parameters.add(new comm_dataPack(3, joParamObject.get("File").toString()));
	            parameters.add(new comm_dataPack(4, joParamObject.get("Pno").toString().replace(".","")));
	            
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
    
    // 자료실 삭제
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
    // 저장시 pno 뽑기
    public JSONObject pSelect(String sSubject) {
    	String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = "SELECT PNO FROM SCM_PDS WHERE SUBJECT = ? " ;
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sSubject));
    	
    	comm_transaction controler = new comm_transaction();      
    	
    	try {
    		joStartData = controler.selectData(SQL,parameters);
//    		System.out.println("pno뽑기 : " + joStartData);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	return joStartData;
    }

    public String getPno(String sSubject) throws IOException{
		JSONObject joListData = null;
		joListData = pSelect(sSubject);     
		
		return joListData.toString();
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
    
   // 파일명 찾기
   public String getfileName(String sfPno) throws IOException{
		JSONObject joListData = null;
		joListData = fnameSelect(sfPno);     
		
		return joListData.toString();
	}
   
   public JSONObject fnameSelect(String sfPno) {
   	String sResult = null;
   	
   	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
   	String SQL = "SELECT CHG_FILE FROM SCM_PDS WHERE PNO = ? " ;
   	
   	JSONObject joStartData = new JSONObject();
   	
   	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
   	parameters.add(new comm_dataPack(1, sfPno));
   	
   	comm_transaction controler = new comm_transaction();      
   	
   	try {
   		joStartData = controler.selectData(SQL,parameters);
   		System.out.println("파일명 : " + joStartData);
   	} catch (Exception e) {
   		sErrMessage = e.getMessage();
   		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
   		e.printStackTrace();
   	}
   	return joStartData;
   }
}
