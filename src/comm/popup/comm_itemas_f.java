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

@WebServlet("/comm_itemas_f")
public class comm_itemas_f extends HttpServlet {
	private static final long serialVersionUID = 1L;

	 public comm_itemas_f() {
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
	            case "saupj":
	                joListData = rfcod.getReffpf("02");
	                break;
	            case "ittyp":
	                joListData = rfcod.getReffpf("05");
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
                String sSaupj = request.getParameter("Saupj");
                String sIttyp  = request.getParameter("Ittyp");
                String sGubun     = request.getParameter("Gubun");
                String sItcls     = request.getParameter("ITCLS");
                String sItnbr     = request.getParameter("ITNBR");
                String sItdsc     = request.getParameter("ITDSC");
                
                iStartPage = Integer.parseInt(sPage);
                iLength = 10;
                sPageLength = "20";
//                response.getWriter().write(getJson(sPage, sPageLength));
                response.getWriter().write(getJson(sPage, sPageLength,sSaupj,sIttyp,sGubun,sItcls,sItnbr,sItdsc));
                break;     
       }
	 
	 }
	 public String getJson(String sPage, String sPageLength, String sSaupj, String sIttyp, String sGubun, String sItcls, String sItnbr, String sItdsc) throws IOException{
	        int iTotalRecords = 0;	//전체건수
	        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
	        int iPageNo = 0;
	        if(sPage.equals("")){
	            iPageNo = 1;
	        }else{
	            iPageNo = Integer.parseInt(sPage);
	        }
	        
//	        System.out.println(sSaupj);
//	        System.out.println("품목구분 : " + sIttyp);
//	        System.out.println("품목분류 : " + sItcls);
//	        System.out.println("품번 : " + sItnbr);
//	        System.out.println("품명 : " + sItdsc);
//	        System.out.println("사용구분 : " + sGubun);
	        
	      //품목분류
	        if (sItcls == null || sItcls == "") {
	        	sItcls = "%";
	        }
	        //품번
	        if (sItnbr == null || sItnbr == "") {
	            sItnbr = "%";
	        }
	        //품명
	        if (sItdsc == null || sItdsc == "") {
	            sItdsc = "%";
	        }
	        
	        JSONObject joListData = null;
	            joListData = startSelect(sSaupj, sIttyp, sGubun, sItcls, sItnbr, sItdsc); 
	            
	            comm_util util = new comm_util();
		        return util.pageParse(joListData, iPageNo, iRecordPerPage);
	    }

	 public JSONObject startSelect(String sSaupj, String sIttyp, String sGubun, String sItcls, String sItnbr, String sItdsc) {
	        String sResult = null;
	      
	        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
	        String SQL = " SELECT A.ITNBR,    "
	        		+ "            A.ITDSC,    "
	        		+ "            B.TITNM,    "
	        		+ "            A.USEYN,    "
	        		+ "            A.FILSK, "
	        		+ "            A.UNMSR, "
	        		+ "            A.ISPEC, "
	        		+ "            FUN_GET_ROUTNGCHK(A.ITNBR, A.USEYN) AS ROUTNG_YN  "
//	        		+ "            FUN_GET_BOMCHK(A.ITNBR) AS PUSE_YN  "
	        		+ "    FROM ITEMAS A,    "
	        		+ "         ITNCT  B "
	        		+ "    WHERE A.ITTYP = B.ITTYP(+)  "
	        		+ "       AND A.ITCLS = B.ITCLS(+) "
//	        		+ "       AND  A.EMPNO2 = '" + sSaupj + "'"
	        		+ "       AND  A.ITTYP LIKE '" + sIttyp + "'"
	        		+ "       AND  A.ITCLS LIKE '" + sItcls + "'"
	        		+ "       AND  A.ITNBR LIKE '" + sItnbr + "'"
	        		+ "       AND  A.ITDSC LIKE '" + sItdsc + "'"
	        		+ "       AND  A.USEYN LIKE '" + sGubun + "'"
	        		+ "       AND A.GBWAN = 'Y' ";
	        
	        
	        JSONObject joStartData = new JSONObject();
	        
//	        //품목분류
//	        if (sItcls == null || sItcls == "") {
//	        	sItcls = "%";
//	        }
//	        //품번
//	        if (sItnbr == null || sItnbr == "") {
//	            sItnbr = "%";
//	        }
//	        //품명
//	        if (sItdsc == null || sItdsc == "") {
//	            sItdsc = "%";
//	        }
	        
	        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
//	        parameters.add(new comm_dataPack(1, sSaupj));
	        parameters.add(new comm_dataPack(1, sIttyp));
	        parameters.add(new comm_dataPack(2, sItcls));
	        parameters.add(new comm_dataPack(3, sItnbr));
	        parameters.add(new comm_dataPack(4, sItdsc));
	        parameters.add(new comm_dataPack(5, sGubun));
	        
	        comm_transaction controler = new comm_transaction();      
	        
	        try {
	            joStartData = controler.selectData(SQL);
//	            joStartData = controler.selectData(SQL,parameters);
	            System.out.println("joStartData : " + joStartData);
	        } catch (Exception e) {
	            sErrMessage = e.getMessage();
	            System.out.println("[startSelect ERROR!!!]" + sErrMessage);
	            e.printStackTrace();
	        }

	        return joStartData;
	    }

}