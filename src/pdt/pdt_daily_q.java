package pdt;

import java.io.IOException;
import java.sql.CallableStatement;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import comm.comm_dataPack;
import comm.comm_message;
import comm.comm_transaction;
import comm.comm_util;
import comm.combo.comm_reffpf_c;

@WebServlet("/pdt_daily_q")
public class pdt_daily_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public pdt_daily_q() {
        super();
    }
  
    private int iStartPage,iLength;
    private String sErrMessage = "";
    private CallableStatement sCstmt = null;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        String sGubunCode = request.getParameter("SearchGubun");
        //ord_chul_DAO_e dbDAO = new ord_chul_DAO_e();
        
        comm_reffpf_c rfcod = new comm_reffpf_c();
        comm_message message = new comm_message();
        
        JSONObject joListData = null;
        switch(sGubunCode) {
            case "saupj":
                //joListData = saupj.getSaupj();
                joListData = rfcod.getReffpf("02");
                break;            
            case "inputCvcod":
                String sCvcod = request.getParameter("Cvcod");
                joListData = getCvnas(sCvcod);
                break;
            case "message":
                String sCode = request.getParameter("Code");
                joListData = message.getMessage(sCode);
                //System.out.println(sCode);
                //System.out.println(joListData);
                break;            
        }
        response.getWriter().write(joListData.toString());
        //response.getWriter().write(joMsgData.toString());
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        
        String sModifyData = "";
        String sActGubun = request.getParameter("ActGubun");
        
        //ord_chul_DAO_e dbDAO = new ord_chul_DAO_e();
        
        switch(sActGubun) {
             case "R":	//조회
                 String sPage      = request.getParameter("Page");
                 String sPageLength= request.getParameter("PageLength");    //페이지당 row 갯수
                 
                 String sFdate     = request.getParameter("Fdate");         //시작일
                 
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sFdate));
                 break;
             case "Rs": // 상단 헤더
            	 response.getWriter().write(startSelectS().toString());
            	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sFdate) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sFdate);     
     
        //System.out.println("iPageNo : " + iPageNo);
        //System.out.println("joListData : " + joListData);
        
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }
    
    //거래처코드 조회
    public JSONObject getCvnas(String sCvcod){
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
        //System.out.println(joSaupj);
        return joCvnas;
    }
    
    //일일 생산 계획
    public JSONObject startSelect(String sFdate) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로 from 절을 찾지 못한다. 

        String SQL = " SELECT A.GUB AS GUB, "
        		+ "       A.WKCTR, "
        		+ "       B.JOCOD, "
        		+ "       B.JONAM, "
        		+ "       C.ITTYP, "
        		+ "       C.ITCLS, "
        		+ "       D.TITNM, "
        		+ "       FUN_GET_CARCODE(A.ITNBR) AS CARTYPE, "
        		+ "       A.ITNBR, "
        		+ "       C.ISPEC, "
        		+ "       A.JISISU, "
        		+ "       A.PLAN_JISISU, "
        		+ "       C.ITDSC, "
        		+ "       F.WCDSC, "
        		+ "       A.RMKS "
        		+ "  FROM (    SELECT '1' AS GUB, "
        		+ "                 B.WKCTR, "
        		+ "                     A.ITNBR, "
        		+ "                     A.PDQTY AS JISISU, "
        		+ "                     B.RMKS, "
        		+ "                     NVL(D.PLAN_JISISU,0) AS PLAN_JISISU "
        		+ "              FROM MOMAST     A, "
        		+ "                     MOROUT     B, "
        		+ "                     (    SELECT A.ITNBR, "
        		+ "                                 SUM(NVL(A.ITM_QTY1,0)) AS PLAN_JISISU "
        		+ "                          FROM SM04_DAILY_ITEM A "
        		+ "                         WHERE A.YYMMDD = TO_CHAR(TO_DATE('%','YYYYMMDD')+1,'YYYYMMDD') "
        		+ "                         GROUP BY A.ITNBR) D "
        		+ "             WHERE A.PORDNO = B.PORDNO "
        		+ "                AND A.JIDAT  = '%' "
        		+ "            AND A.ITNBR  = D.ITNBR(+) "
        		+ "        UNION ALL "
        		+ "            SELECT '1' AS GUB, "
        		+ "                 MAX(B.WKCTR) AS WKCTR, "
        		+ "                     A.ITNBR, "
        		+ "                     0 AS JISISU, "
        		+ "                     ' ' AS RMKS, "
        		+ "                     SUM(NVL(A.ITM_QTY1,0)) AS PLAN_JISISU "
        		+ "              FROM SM04_DAILY_ITEM A, "
        		+ "                     (SELECT ITNBR,MAX(WKCTR) WKCTR "
        		+ "                         FROM ROUTNG "
        		+ "                        GROUP BY ITNBR) B "
        		+ "             WHERE A.YYMMDD = ? "
        		+ "                AND A.ITNBR  = B.ITNBR "
        		+ "            AND NOT EXISTS (SELECT Z.ITNBR FROM MOMAST Z WHERE Z.JIDAT LIKE '%' "
        		+ "                                                           AND A.ITNBR = Z.ITNBR) "
        		+ "             GROUP BY A.ITNBR "
        		+ "            HAVING SUM(NVL(A.ITM_QTY1,0)) > 0 ) A, "
        		+ "         JOMAST B, "
        		+ "         ITEMAS C, "
        		+ "         ITNCT  D, "
        		+ "         WRKCTR F "
        		+ "   WHERE A.ITNBR = C.ITNBR "
        		+ "     AND A.WKCTR = F.WKCTR "
        		+ "     AND F.JOCOD = B.JOCOD "
        		+ "     AND C.ITTYP = D.ITTYP "
        		+ "     AND C.ITCLS = D.ITCLS ";
        
        JSONObject joStartData = new JSONObject();
        
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, sFdate));  
        
        System.out.println("sFdate : " + sFdate);
        
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
    // 매뉴 오픈 시 테이블 헤더 출력
    public JSONObject startSelectS() {
    	String sResult = null;
    	
    	String SQL = " SELECT ' ' AS JONAM, "
    			+ "         ' ' AS WCDSC, "
    			+ "         ' ' AS TITNM, "
    			+ "         ' ' AS ITNBR, "
    			+ "         ' ' AS ITDSC, "
    			+ "         ' ' AS ISPEC, "
    			+ "			' ' AS MOSEQ, "
    			+ "			' ' AS JISISU, "
    			+ "			' ' AS PLAN_JISISU, "
    			+ "         ' ' AS RMKS "
    			+ "           FROM DUAL "
    			+ "     CONNECT BY LEVEL <= 21 ";
    	
    	JSONObject joStartData = new JSONObject();
    	
    	
    	comm_transaction controler = new comm_transaction();      
    	
    	try {
    		joStartData = controler.selectData(SQL);
    		System.out.println("jostartData :" + joStartData);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	return joStartData;
    }
}
