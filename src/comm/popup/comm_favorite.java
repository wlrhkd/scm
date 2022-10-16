package comm.popup;

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

@WebServlet("/comm_favorite")
public class comm_favorite extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	public comm_favorite() {
        super();
    }
	
	private int iStartPage,iLength;
	private String sErrMessage = "";
	private CallableStatement sCstmt = null;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        String sGubunCode = request.getParameter("SearchGubun");
        
        JSONObject joListData = null;
        switch(sGubunCode) {
        	case "favCheck":  // 소분류ID 중복 유효성 검사
        		String cUserid = request.getParameter("Userid");
        		String cSub2name = request.getParameter("Sub2_name");
	          	String cPageurl = request.getParameter("Page_url");
	          	joListData = getFavCheck(cUserid, cSub2name, cPageurl);
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
	       case "I":  
		       	 sModifyData = request.getParameter("JsonData");
		       	 response.getWriter().write(favInsert(sModifyData));
	       	     break;
//	       case "R":	//조회
//	            response.getWriter().write(startSelect().toString());
//	            break;  
	       case "R":  //행 선택
             	String sUserid = request.getParameter("Userid");
             	response.getWriter().write(getJsonSel(sUserid));
             	break;
	       case "D":  //삭제
           	 sModifyData = request.getParameter("JsonData");
           	 response.getWriter().write(delete(sModifyData));
           	 break;
	       case "S":	//검색
	        	String sName = request.getParameter("Name");
	        	 response.getWriter().write(getJson(sName));
	        	break;     
   }
	
}
	
	public String getJsonSel(String sUserid) throws IOException{
		JSONObject joListData = null;
		joListData = startSelect(sUserid);     
		
		return joListData.toString();
	}

	public String getJson(String sName) throws IOException{
        
        JSONObject joListData = null;
        joListData = searchSelect(sName);     
     
        return joListData.toString();
    }
	
	// 메뉴검색
	private JSONObject searchSelect(String sName) {
		String sResult = null;
	      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = "SELECT SUB2_NAME, PAGE_URL FROM SUB2_USER_FAV WHERE SUB2_NAME LIKE ? ";
        
        JSONObject joStartData = new JSONObject();

        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
        parameters.add(new comm_dataPack(1, sName));
        
        comm_transaction controler = new comm_transaction();      
        
        try {
            joStartData = controler.selectData(SQL,parameters);
//            System.out.println("joStartData : " + joStartData);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }

        return joStartData;
    }
	// 즐겨찾기
	private JSONObject startSelect(String sUserid) {
		String sResult = null;
	      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = "SELECT SUB2_NAME, PAGE_URL FROM SUB2_USER_FAV WHERE L_USERID = ? ";
        
        JSONObject joStartData = new JSONObject();

    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sUserid));
        
        comm_transaction controler = new comm_transaction();      
        
        try {
            joStartData = controler.selectData(SQL,parameters);
//            System.out.println("joStartData : " + joStartData);
        } catch (Exception e) {
            sErrMessage = e.getMessage();
            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
            e.printStackTrace();
        }

        return joStartData;
    }

	// 즐겨찾기 추가
	public String favInsert(String sModifyData) {
		try {
			JSONParser jpParser = new JSONParser();
			JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
			
			for (int i = 0; i < jaArray.size(); i++) {
				//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
				JSONObject joParamObject = (JSONObject) jaArray.get(i);
				
				// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.
				String SQL = " INSERT INTO SUB2_USER_FAV ( L_USERID       ,       "
						+ "                      SUB2_NAME   ,      "
						+ "                      PAGE_URL,          "
						+ "                      GROUP_ID,          "
						+ "                      WINDOW_NAME )      "
						+ "             VALUES( ? ,       "
						+ "                     ? ,   "
						+ "                     ? ,   "
						+ "                     ? ,   "
						+ "                     ?  ) " ;
				
				ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
				parameters.add(new comm_dataPack(1, joParamObject.get("Userid").toString()));
				parameters.add(new comm_dataPack(2, joParamObject.get("Name").toString()));
				parameters.add(new comm_dataPack(3, joParamObject.get("Url").toString()));
				parameters.add(new comm_dataPack(4, joParamObject.get("Sub1id").toString()));
				parameters.add(new comm_dataPack(5, joParamObject.get("Windowname").toString()));
				
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
	
	// 즐겨찾기 삭제
    public String delete(String JsonString) {
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
                    		+ " FROM SUB2_USER_FAV "
                    		+ " WHERE SUB2_NAME = ? ";
                    
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
    // 즐겨찾기 추가 중복 유효성 검사
    public JSONObject getFavCheck(String cUserid, String cSub2name, String cPageurl) {
    	JSONObject joCheck = new JSONObject();
    	
            String SQL = " SELECT COUNT(*) AS COUNT "
            		+ "      FROM SUB2_USER_FAV "
            		+ "     WHERE L_USERID = ? "
            		+ "		  AND SUB2_NAME = ? "
            		+ "		  AND PAGE_URL = ? ";
            
            System.out.println(SQL);
            
            ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
            
            parameter.add(new comm_dataPack(1, cUserid));
            parameter.add(new comm_dataPack(2, cSub2name));
            parameter.add(new comm_dataPack(3, cPageurl));
        
            comm_transaction controler = new comm_transaction();
        try {
            joCheck = controler.selectData(SQL, parameter);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            ex.printStackTrace();
            sErrMessage = "DB Error : " + ex.getMessage();
        }
        
        System.out.println(joCheck);
        return joCheck;
    }
}
