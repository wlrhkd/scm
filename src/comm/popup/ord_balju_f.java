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
import comm.combo.comm_reffpf_c;
import comm.comm_dataPack;
import comm.comm_dbConnect;
import comm.comm_message;

@WebServlet("/ord_balju_f")
public class ord_balju_f extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	public ord_balju_f() {
		super();
    }
	
	 private int iStartPage,iLength;
	 private String sErrMessage = "";
	 private CallableStatement sCstmt = null;
	 
	 protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	        request.setCharacterEncoding("UTF-8");
	        response.setContentType("text/html;charset=UTF-8");
	        
	        String sGubunCode = request.getParameter("SearchGubun");
	        
	        comm_message message = new comm_message();
	        
	        JSONObject joListData = null;
	        switch(sGubunCode) {
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
         case "balju":	//조회
             String sPage      = request.getParameter("Page");
             String sPageLength= request.getParameter("PageLength");    //페이지당 row 갯수
             String sBaljuno = request.getParameter("Baljuno");
             String sBalseq  = request.getParameter("Balseq");
             
             iStartPage = Integer.parseInt(sPage);
             iLength = 10;
             sPageLength = "20";
             response.getWriter().write(getJson(sPage, sPageLength, sBaljuno, sBalseq));
             break;     
	        }
	 }

	private String getJson(String sPage, String sPageLength, String sBaljuno, String sBalseq) {
		  int iTotalRecords = 0;	//전체건수
	        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
	        int iPageNo = 0;
	        if(sPage.equals("")){
	            iPageNo = 1;
	        }else{
	            iPageNo = Integer.parseInt(sPage);
	        }
	        
	        JSONObject joListData = null;
	        joListData = startSelect(sBaljuno, sBalseq);     
	        
	        comm_util util = new comm_util();
	        return util.pageParse(joListData, iPageNo, iRecordPerPage);
	}

	private JSONObject startSelect(String sBaljuno, String sBalseq) {
		 String sResult = null;
	      
	        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
	        String SQL = "select rownum,  "
	        		+ "		jpno,  "
	        		+ "		naqty,  "
	        		+ "		To_char(to_date(nadate),'YYYY.MM.DD') as nadate,  "
	        		+ "		rcqty,   "
	        		+ "		to_char(to_date(rcdate),'YYYY.MM.DD') as rdate,  "
	        		+ "            decode(status, null, '미입하', '입하') as yibha, "
	        		+ "		'' as bin , "
	        		+ "		BALJPNO  "
	        		+ "	from poblkt_hist  "
	        		+ "	where baljpno = ?   "
	        		+ "	and balseq = ? "
	        		+ "	order by jpno asc ";
	        
	        JSONObject joStartData = new JSONObject();
	        
	        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
	        parameters.add(new comm_dataPack(1, sBaljuno));
	        parameters.add(new comm_dataPack(2, sBalseq));
	        
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
