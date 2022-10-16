/*
	Document : 사용자정보
	작성자 : 염지광
	작성일자 : 2021-09-13
*/
package cmu;

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

@WebServlet("/cmu_vndmst_e")
public class cmu_vndmst_e extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public cmu_vndmst_e() {
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
            case "inputCvcod": // 거래처 번호 (조회 조건)
                String sCvcod = request.getParameter("Cvcod");
                joListData = getCvnas(sCvcod);
                break;

            case "inputCvnas": // 거래처명
            	String sCvnas = request.getParameter("Cvnas");
            	joListData = getCvnas(sCvnas);
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
                 
                 String sCvcod = request.getParameter("Cvcod");	        //거래처 번호
                 //String sChg_name = request.getParameter("Cvnas");	    //거래처명
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage, sPageLength, sCvcod));
                 break;
                 
             case "U":  //저장
            	 sModifyData = request.getParameter("JsonData");
            	 response.getWriter().write(startSaveU(sModifyData));
            	 break;
             case "C":  //저장
            	 String sChg_id = request.getParameter("chg_id");
            	 response.getWriter().write(getJsonChk(sChg_id));
            	 break;
        }
    }
    
	// 저장
    public String startSaveU(String sModifyData) {
    	try {
	    	JSONParser jpParser = new JSONParser();
	    	JSONArray jaArray = (JSONArray) jpParser.parse(sModifyData);
	    	
	        for (int i = 0; i < jaArray.size(); i++) {
	        	//배열 안에 있는 자료도 JSON 형식이므로 JSON Object로 추출
	            JSONObject joParamObject = (JSONObject) jaArray.get(i);
	            
	            // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다.(물음표 순서대로)
	            String SQL = " UPDATE SCM_LOGIN_T SET "
	            		+ "			CHG_PW = ? "
	            		+ "  WHERE  CHG_ID = ? ";
	            
	            ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
	            parameters.add(new comm_dataPack(1, joParamObject.get("n_password").toString()));
	            parameters.add(new comm_dataPack(2, joParamObject.get("Chg_id").toString()));
	            
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

    private String getJsonChk(String sChg_id) throws IOException{
    	JSONObject joListData = null;
		joListData = checkPass(sChg_id);     
		
		return joListData.toString();
	}

    
	private JSONObject checkPass(String sChg_id) {
		String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = " SELECT CHG_PW FROM SCM_LOGIN_T WHERE CHG_ID = ? ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
    	parameters.add(new comm_dataPack(1, sChg_id));
    	
    	comm_transaction controler = new comm_transaction();      
    	
    	try {
    		joStartData = controler.selectData(SQL,parameters);
//    		System.out.println("joStartData : " + joStartData);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	return joStartData;
	}

	public String getJson(String sPage, String sPageLength, String sCvcod) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sCvcod);     
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    
//    public String getJsonSel(String sCvcod) throws IOException{
//    	JSONObject joListData = null;
//    	joListData = chgSelect(sCvcod);     
//    	
//    	return joListData.toString();
//    }
    
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
        //System.out.println(joSaupj);
        return joCvnas;
    }
    
    
    //거래처번호 조회
    public JSONObject startSelect(String sCvcod) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = " SELECT CVCOD, "
        		+ "	CVNAS, "
        		+ "	CVNAS2, "
        		+ "	SANO, "
        		+ "	OWNAM, "
        		+ "	TELNO1, "
        		+ "	TELNO2, "
        		+ "	TELNO3, "
        		+ "	FAXNO1, "
        		+ "	FAXNO2, "
        		+ "	FAXNO3, "
        		+ "	UPTAE, "
        		+ "	JONGK, "
        		+ "	POSNO, "
        		+ "	ADDR1, "
        		+ "	NVL(ADDR2 , ' ') AS ADDR2 "    // 컬럼명 따로 지정
        		+ "FROM VNDMST "
        		+ "WHERE  CVCOD =	? " ;
        
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
    
   
    
    
}
