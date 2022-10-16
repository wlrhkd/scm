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
import comm.comm_message;
import comm.combo.comm_reffpf_c;

@WebServlet("/comm_favorite_f")
public class comm_favorite_f extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	public comm_favorite_f() {
        super();
    }
	
	private int iStartPage,iLength;
	private String sErrMessage = "";
	private CallableStatement sCstmt = null;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
    }
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	 	
	    request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        
        String sModifyData = "";
        String sActGubun = request.getParameter("ActGubun");
        
        switch(sActGubun) {
        case "R":	//조회
        	String rUserid = request.getParameter("Userid");
        	String rUserid2 = request.getParameter("Userid");
        	response.getWriter().write(getJson2(rUserid,rUserid2));
            break;     

        case "S":	//검색
        	String sName = request.getParameter("Name");
        	String sUserid = request.getParameter("Userid");
        	String sUserid2 = request.getParameter("Userid");
        	response.getWriter().write(getJson(sName,sUserid,sUserid2));
        	break;     
   }
}	

	private String getJson2(String rUserid, String rUserid2) {
		  JSONObject joListData = null;
	      joListData = startSelect(rUserid, rUserid2);     
	      return joListData.toString();
	}

	public String getJson(String sName, String sUserid, String sUserid2) throws IOException{
        
        JSONObject joListData = null;
        joListData = searchSelect(sName,sUserid,sUserid2);     
     
        return joListData.toString();
    }
	
	//메뉴이름 검색
	private JSONObject searchSelect(String sName,String sUserid, String sUserid2) {
		String sResult = null;
	      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
		String SQL = "SELECT A.MAIN_ID, "
        		+ "       A.SUB1_ID, "
        		+ "       A.SUB2_ID, "
        		+ "       A.SUB2_NAME, "
        		+ "       C.SUB2_ID AS SUB2_ID2, "
        		+ "       C.SUB2_NAME AS SUB2_NAME2, "
        		+ "       C.WINDOW_NAME, "
        		+ "       C.PAGE_URL, "
        		+ "       DECODE(LAG(A.SUB1_ID) OVER (ORDER BY A.MAIN_ID, A.SUB1_ID, A.SUB2_ID), A.SUB1_ID, '', A.SUB2_NAME) PLAG "
        		+ "  FROM SCM_SUB2_T A, "
        		+ "       SCM_USER_T B, "
        		+ "       ( SELECT A.MAIN_ID, A.SUB1_ID, A.SUB2_ID, B.CHG_ID, A.SUB2_NAME, A.WINDOW_NAME, A.PAGE_URL "
        		+ "    FROM SCM_SUB2_T A, "
        		+ "         SCM_USER_T B "
        		+ "   WHERE A.SUB1_ID <> 99 "
        		+ "     AND A.SUB2_ID <> 100 "
        		+ "     AND A.MAIN_ID =  B.MAIN_ID "
        		+ "     AND A.SUB1_ID =  B.SUB1_ID "
        		+ "     AND A.SUB2_ID =  B.SUB2_ID) C "
        		+ " WHERE B.CHG_ID   = ? "
        		+ "   AND A.SUB2_ID  = 100 "
        		+ "   AND A.IO_GUBUN = 'A' "
        		+ "   AND C.SUB1_ID  <> 99 "
        		+ "   AND C.SUB2_ID  <> 100 "
        		+ "   AND A.MAIN_ID  = B.MAIN_ID "
        		+ "   AND A.SUB1_ID  = B.SUB1_ID "
        		+ "   AND A.SUB2_ID  = B.SUB2_ID "
        		+ "   AND B.CHG_ID   = C.CHG_ID "
        		+ "   AND B.MAIN_ID  = C.MAIN_ID "
        		+ "   AND B.SUB1_ID  = C.SUB1_ID "
        		+ "   AND C.SUB2_NAME  LIKE ? "
        		+ "   AND NOT EXISTS (SELECT 'X' FROM SUB2_USER_FAV Z  WHERE  Z.SUB2_NAME = C.SUB2_NAME  AND Z.L_USERID = ? ) "
        		+ " ORDER BY A.MAIN_ID, A.SUB1_ID, A.SUB2_ID ";
        

	        		JSONObject joStartData = new JSONObject();

        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
        parameters.add(new comm_dataPack(1, sUserid));
        parameters.add(new comm_dataPack(2, sName));
        parameters.add(new comm_dataPack(3, sUserid2));
        
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
	
	 public JSONObject startSelect(String rUserid, String rUserid2) {
	        String sResult = null;
	      
	        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
	        String SQL = "SELECT A.MAIN_ID, "
	        		+ "       A.SUB1_ID, "
	        		+ "       A.SUB2_ID, "
	        		+ "       A.SUB2_NAME, "
	        		+ "       C.SUB2_ID AS SUB2_ID2, "
	        		+ "       C.SUB2_NAME AS SUB2_NAME2, "
	        		+ "       C.WINDOW_NAME, "
	        		+ "       C.PAGE_URL, "
	        		+ "       DECODE(LAG(A.SUB1_ID) OVER (ORDER BY A.MAIN_ID, A.SUB1_ID, A.SUB2_ID), A.SUB1_ID, '', A.SUB2_NAME) PLAG,"
	        		+ "       DECODE(LAG(A.SUB1_ID) OVER (ORDER BY A.MAIN_ID, A.SUB1_ID, A.SUB2_ID), A.SUB1_ID, '', A.SUB1_ID) PLAG2 "
	        		+ "  FROM SCM_SUB2_T A, "
	        		+ "       SCM_USER_T B, "
	        		+ "       ( SELECT A.MAIN_ID, A.SUB1_ID, A.SUB2_ID, B.CHG_ID, A.SUB2_NAME, A.WINDOW_NAME, A.PAGE_URL "
	        		+ "    FROM SCM_SUB2_T A, "
	        		+ "         SCM_USER_T B "
	        		+ "   WHERE A.SUB1_ID <> 99 "
	        		+ "     AND A.SUB2_ID <> 100 "
	        		+ "     AND A.MAIN_ID =  B.MAIN_ID "
	        		+ "     AND A.SUB1_ID =  B.SUB1_ID "
	        		+ "     AND A.SUB2_ID =  B.SUB2_ID) C "
	        		+ " WHERE B.CHG_ID   = ? "
	        		+ "   AND A.SUB2_ID  = 100 "
	        		+ "   AND A.IO_GUBUN = 'A' "
	        		+ "   AND C.SUB1_ID  <> 99 "
	        		+ "   AND C.SUB2_ID  <> 100 "
	        		+ "   AND A.MAIN_ID  = B.MAIN_ID "
	        		+ "   AND A.SUB1_ID  = B.SUB1_ID "
	        		+ "   AND A.SUB2_ID  = B.SUB2_ID "
	        		+ "   AND B.CHG_ID   = C.CHG_ID "
	        		+ "   AND B.MAIN_ID  = C.MAIN_ID "
	        		+ "   AND B.SUB1_ID  = C.SUB1_ID "
	        		+ "   AND NOT EXISTS (SELECT 'X' FROM SUB2_USER_FAV Z  WHERE  Z.SUB2_NAME = C.SUB2_NAME  AND Z.L_USERID = ? ) "
	        		+ " ORDER BY A.MAIN_ID, A.SUB1_ID, A.SUB2_ID ";
	        
	        JSONObject joStartData = new JSONObject();

	        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
	        parameters.add(new comm_dataPack(1, rUserid));
	        parameters.add(new comm_dataPack(2, rUserid2));
	        
	        comm_transaction controler = new comm_transaction();      
	        
	        try {
	            joStartData = controler.selectData(SQL, parameters);
//	            System.out.println("joStartData : " + joStartData);
	        } catch (Exception e) {
	            sErrMessage = e.getMessage();
	            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
	            e.printStackTrace();
	        }

	        return joStartData;
	    }

	
}
