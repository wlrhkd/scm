/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package comm;

import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;

/**
 *
 * @author smg25
 */
@WebServlet("/comm_login")
public class comm_login extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private ResultSet rs;
    
    public comm_login() {
		super();
	}
    private String sErrMessage = "";
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        response.addHeader("X-UA-Compatible", "IE=edge");
        
        String userId      = request.getParameter("id");
        String userPass    = request.getParameter("pass");  
        
        
    	
   	 	comm_userData userInfo = new comm_userData();
   	 	userInfo.setUserID(userId);
   	 	userInfo.setUserPw(userPass);
   	 	userInfo = login(userInfo);
   	 	
   	 	if(userInfo.getUserResult() == 1){
   	 		//로그인 성공처리 & 센션 설정
   	 		HttpSession session = request.getSession(true);// true : 세션이 없을경우 생성, false : 세션이 없을경우 생성안함
   	 		//session.setMaxInactiveInterval(60); // 1분간 유지 (default : 30분)
   	 		if(session !=null) {
   	 			session.setAttribute("currentSessionUser",userInfo);
   	 			//response.sendRedirect("userLogged.jsp"); //logged-in page
   	 		}
   	 	}
   	 	JSONObject obj = new JSONObject();   
   	 	obj.put("result",userInfo.getUserResult());
   	 	obj.put("userId",userInfo.getUserID());
   	 	obj.put("userCvcod",userInfo.getUserCvcod());
   	 	obj.put("userCvnas",userInfo.getUserCvnas());
   	 	obj.put("userAuth",userInfo.getUserAuth());
   	 	obj.put("userGubun",userInfo.getUserGubun());
   	 	obj.put("userSaupj",userInfo.getUserSaupj());
   	 	response.getWriter().write( obj.toJSONString() );
    }
    
    public comm_userData login(comm_userData userInfo) {
       String SQL = "SELECT CHG_ID, "
                  + " CVCOD, "
                  + " CHG_NAME, "
                  + " AUTH, "
                  + " GUBUN, "
                  + " SAUPJ "
                  + " FROM SCM_LOGIN_T "
                  + " WHERE CHG_ID = ? "
                  + " AND CHG_PW = ? ";
       try{
           comm_dbConnect dbCon = new comm_dbConnect();
           ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
           parameters.add(new comm_dataPack(1, userInfo.getUserID()));
           parameters.add(new comm_dataPack(2, userInfo.getUserPw()));
           rs = dbCon.excuteQuery(SQL, parameters);
           if(rs.next()) {
               if(rs.getRow() == 1){
                   //userInfo.setSaupj(rs.CHG_ID)
                   userInfo.setUserID(rs.getString("CHG_ID"));
                   userInfo.setUserCvcod(rs.getString("CVCOD")); //거래처코드
                   userInfo.setUserCvnas(rs.getString("CHG_NAME"));//거래처명
                   userInfo.setUserAuth(rs.getString("AUTH"));//권한
                   userInfo.setUserGubun(rs.getString("GUBUN"));
                   userInfo.setUserSaupj(rs.getString("SAUPJ"));
                   userInfo.setUserResult(1);
                   
                   //로그인 내역 추가
               	   logHist(rs.getString("CVCOD"));
               	   
                   return userInfo; // 로그인 성공
               }
           }else{
               userInfo.setUserResult(0);
               return userInfo; //아이디 및 패스워드 불일치
           }
       } catch(Exception e){
       }        
       userInfo.setUserResult(-2);
       return userInfo ; //데이타베이스 오류
   }
 // 로그인 정보 기록
    public String logHist(String inUserid) {
    	JSONObject joCheck = new JSONObject();
    	
    	String SQL = " INSERT INTO POPMAN.LOGIN_HISTORY  " 
    			+ "    		( L_USERID,  "
    			+ "    		  L_DATE,  "
    			+ "    		  L_TIME,  "
    			+ "    		  L_PCNAME,  "
    			+ "           L_OSNAME,  "
    			+ "     	  L_IP )  "
    			+ "    VALUES ( ?, "
    			+ "    	 	  TO_CHAR(SYSDATE,'YYYYMMDD'),  "
    			+ "    		  TO_CHAR(SYSDATE,'HH24MISS'),  "
    			+ "    		  SYS_CONTEXT('USERENV','TERMINAL'), "   // PCNAME 파라미터
    			+ "    		  SYS_CONTEXT('USERENV','OS_USER'), " 	 // OSNAME 파라미터로
    			+ "           SYS_CONTEXT('USERENV','IP_ADDRESS')) "; // IP 변수 받기
    	
    	ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
    	
    	parameter.add(new comm_dataPack(1, inUserid));
    	comm_transaction controler = new comm_transaction();
    	try {
    		controler.updateData(SQL, parameter);
    	} catch (Exception ex) {
    		System.out.println(ex.getMessage());
    		ex.printStackTrace();
    	}
    	joCheck.put("Message", sErrMessage);
    	
    	return joCheck.toJSONString();
    }
}
