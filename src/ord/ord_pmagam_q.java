package ord;

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

@WebServlet("/ord_pmagam_q")
public class ord_pmagam_q extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ord_pmagam_q() {
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
                 
                 String sYymm     = request.getParameter("Yymm");         //마감년월
                 
                 String sCvcod   = request.getParameter("Cvcod");           //업체코드
                 String sSaupj = request.getParameter("Saupj");	            //사업장
                 
                 iStartPage = Integer.parseInt(sPage);
                 response.getWriter().write(getJson(sPage,sPageLength,sYymm,sCvcod,sSaupj));
                 break;
                 
            case "S":	// 테이블 형태
            	 response.getWriter().write(startSelectS().toString());
            	 break; 
            case "getAuth":	// 시스템관리자 / 사용자 구분
           	 String sID  = request.getParameter("ID");	     
           	 response.getWriter().write(getAuth(sID).toString());
           	 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sYymm, String sCvcod,
            String sSaupj) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        joListData = startSelect(sYymm, sCvcod, sSaupj);     
     
        comm_util util = new comm_util();
        return util.pageParse(joListData, iPageNo, iRecordPerPage);
    }

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
        return joCvnas;
    }
    
    //월 마감 전 현황 조회
    public JSONObject startSelect(String sYymm, String sCvcod, String sSaupj) {
        String sResult = null;
      
        // sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
        String SQL = "		 SELECT '1' AS SOR,  "
        		+ "             	A.CVCOD  AS CVCOD,  "
        		+ "                 D.CVNAS  AS CVNAS,  "
        		+ "                 A.ITNBR AS ITNBR,  "
        		+ "                 C.ITDSC||C.ISPEC AS ITDSC,  "
        		+ "                 FUN_GET_CARTYPE(A.ITNBR) AS CARTYPE,  "
        		+ "                 G.TITNM                  AS TITNM,  "
        		+ "                 C.ITCLS                  AS ITCLS,  "
        		+ "                 SUM(NVL(A.BALQTY,0))  AS BALQTY,  "
        		+ "                 MAX(NVL(A.IOPRC,0))   AS IOPRC,  "
        		+ "                 SUM(NVL(A.IOQTY,0)) AS IOQTY,  "
        		+ "                 SUM(NVL(A.IOAMT,0)) AS IOAMT,  "
        		+ "                 SUM(NVL(A.QTY1,0)) AS QTY1,       SUM(NVL(A.QTY2,0)) AS QTY2,       SUM(NVL(A.QTY3,0)) AS QTY3,       SUM(NVL(A.QTY4,0)) AS QTY4,  "
        		+ "                 SUM(NVL(A.QTY5,0)) AS QTY5,       SUM(NVL(A.QTY6,0)) AS QTY6,       SUM(NVL(A.QTY7,0)) AS QTY7,  "
        		+ "                 SUM(NVL(A.QTY8,0)) AS QTY8,       SUM(NVL(A.QTY9,0)) AS QTY9,       SUM(NVL(A.QTY10,0)) AS QTY10,     SUM(NVL(A.QTY11,0)) AS QTY11,  "
        		+ "                 SUM(NVL(A.QTY12,0)) AS QTY12,     SUM(NVL(A.QTY13,0)) AS QTY13,     SUM(NVL(A.QTY14,0)) AS QTY14,     SUM(NVL(A.QTY15,0)) AS QTY15,  "
        		+ "                 SUM(NVL(A.QTY16,0)) AS QTY16,     SUM(NVL(A.QTY17,0)) AS QTY17,     SUM(NVL(A.QTY18,0)) AS QTY18,     SUM(NVL(A.QTY19,0)) AS QTY19,  "
        		+ "                 SUM(NVL(A.QTY20,0)) AS QTY20,     SUM(NVL(A.QTY21,0)) AS QTY21,     SUM(NVL(A.QTY22,0)) AS QTY22,     SUM(NVL(A.QTY23,0)) AS QTY23,  "
        		+ "                 SUM(NVL(A.QTY24,0)) AS QTY24,     SUM(NVL(A.QTY25,0)) AS QTY25,     SUM(NVL(A.QTY26,0)) AS QTY26,     SUM(NVL(A.QTY27,0)) AS QTY27,  "
        		+ "                 SUM(NVL(A.QTY28,0)) AS QTY28,     SUM(NVL(A.QTY29,0)) AS QTY29,     SUM(NVL(A.QTY30,0)) AS QTY30,     SUM(NVL(A.QTY31,0)) AS QTY31,  "
        		+ "                 SUM(NVL(A.AMT1,0)) AS AMT1,       SUM(NVL(A.AMT2,0)) AS AMT2,       SUM(NVL(A.AMT3,0)) AS AMT3,       SUM(NVL(A.AMT4,0)) AS AMT4,  "
        		+ "                 SUM(NVL(A.AMT5,0)) AS AMT5,       SUM(NVL(A.AMT6,0)) AS AMT6,       SUM(NVL(A.AMT7,0)) AS AMT7,  "
        		+ "                 SUM(NVL(A.AMT8,0)) AS AMT8,       SUM(NVL(A.AMT9,0)) AS AMT9,       SUM(NVL(A.AMT10,0)) AS AMT10,     SUM(NVL(A.AMT11,0)) AS AMT11,  "
        		+ "                 SUM(NVL(A.AMT12,0)) AS AMT12,     SUM(NVL(A.AMT13,0)) AS AMT13,     SUM(NVL(A.AMT14,0)) AS AMT14,     SUM(NVL(A.AMT15,0)) AS AMT15,  "
        		+ "                 SUM(NVL(A.AMT16,0)) AS AMT16,     SUM(NVL(A.AMT17,0)) AS AMT17,     SUM(NVL(A.AMT18,0)) AS AMT18,     SUM(NVL(A.AMT19,0)) AS AMT19,  "
        		+ "                 SUM(NVL(A.AMT20,0)) AS AMT20,     SUM(NVL(A.AMT21,0)) AS AMT21,     SUM(NVL(A.AMT22,0)) AS AMT22,     SUM(NVL(A.AMT23,0)) AS AMT23,  "
        		+ "                 SUM(NVL(A.AMT24,0)) AS AMT24,     SUM(NVL(A.AMT25,0)) AS AMT25,     SUM(NVL(A.AMT26,0)) AS AMT26,     SUM(NVL(A.AMT27,0)) AS AMT27,  "
        		+ "                 SUM(NVL(A.AMT28,0)) AS AMT28,     SUM(NVL(A.AMT29,0)) AS AMT29,     SUM(NVL(A.AMT30,0)) AS AMT30,     SUM(NVL(A.AMT31,0)) AS AMT31,  "
        		+ "                 SUM(NVL(A.IWQTY,0)) AS IWQTY,     SUM(NVL(A.IWAMT,0)) AS IWAMT         "
        		+ "          FROM (  "
        		+ "                    SELECT A.CVCOD AS CVCOD,  "
        		+ "                             A.ITNBR AS ITNBR,  "
        		+ "                             0  AS BALQTY,  "
        		+ "                             MAX(NVL(A.IOPRC,0))   AS IOPRC,  "
        		+ "                             SUM((A.IOSUQTY + A.IOPEQTY - NVL(A.GONGQTY, 0)) * B.CALVALUE) AS IOQTY,  "
        		+ "                             SUM(NVL(A.IOAMT,0) * B.CALVALUE )                          AS IOAMT,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'01',  "
        		+ "                                          TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY) ),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY1,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'02',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY2,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'03',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY3,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'04',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY4,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'05',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY5,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'06',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY6,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'07',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY7,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'08',  "
        		+ "                                          TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY8,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'09',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY9,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'10',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY10,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'11',  "
        		+ "                                          TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY11,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'12',  "
        		+ "                                          TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY12,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'13',  "
        		+ "                                          TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY13,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'14',  "
        		+ "                                          TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY14,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'15',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY15,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'16',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY16,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'17',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY17,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'18',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY18,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'19',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY19,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'20',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY20,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'21',  "
        		+ "                                          TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY21,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'22',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY22,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'23',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY23,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'24',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY24,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'25',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY25,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'26',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY26,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'27',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY27,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'28',  "
        		+ "                                          TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY28,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'29',  "
        		+ "                                            TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY29,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'30',  "
        		+ "                                          TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY30,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'31',  "
        		+ "                                          TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)),0)  "
        		+ "                                        - TRUNC(NVL(A.GONGQTY,0) * B.CALVALUE, 0 ) , 0 ))                  AS QTY31,  "
        		+ "          "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'01', A.IOAMT * B.CALVALUE, 0))  AS AMT1,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'02', A.IOAMT * B.CALVALUE, 0))  AS AMT2,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'03', A.IOAMT * B.CALVALUE, 0))  AS AMT3,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'04', A.IOAMT * B.CALVALUE, 0))  AS AMT4,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'05', A.IOAMT * B.CALVALUE, 0))  AS AMT5,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'06', A.IOAMT * B.CALVALUE, 0))  AS AMT6,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'07', A.IOAMT * B.CALVALUE, 0))  AS AMT7,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'08', A.IOAMT * B.CALVALUE, 0))  AS AMT8,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'09', A.IOAMT * B.CALVALUE, 0))  AS AMT9,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'10', A.IOAMT * B.CALVALUE, 0))  AS AMT10,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'11', A.IOAMT * B.CALVALUE, 0))  AS AMT11,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'12', A.IOAMT * B.CALVALUE, 0))  AS AMT12,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'13', A.IOAMT * B.CALVALUE, 0))  AS AMT13,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'14', A.IOAMT * B.CALVALUE, 0))  AS AMT14,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'15', A.IOAMT * B.CALVALUE, 0))  AS AMT15,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'16', A.IOAMT * B.CALVALUE, 0))  AS AMT16,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'17', A.IOAMT * B.CALVALUE, 0))  AS AMT17,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'18', A.IOAMT * B.CALVALUE, 0))  AS AMT18,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'19', A.IOAMT * B.CALVALUE, 0))  AS AMT19,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'20', A.IOAMT * B.CALVALUE, 0))  AS AMT20,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'21', A.IOAMT * B.CALVALUE, 0))  AS AMT21,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'22', A.IOAMT * B.CALVALUE, 0))  AS AMT22,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'23', A.IOAMT * B.CALVALUE, 0))  AS AMT23,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'24', A.IOAMT * B.CALVALUE, 0))  AS AMT24,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'25', A.IOAMT * B.CALVALUE, 0))  AS AMT25,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'26', A.IOAMT * B.CALVALUE, 0))  AS AMT26,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'27', A.IOAMT * B.CALVALUE, 0))  AS AMT27,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'28', A.IOAMT * B.CALVALUE, 0))  AS AMT28,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'29', A.IOAMT * B.CALVALUE, 0))  AS AMT29,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'30', A.IOAMT * B.CALVALUE, 0))  AS AMT30,  "
        		+ "                             SUM(DECODE(SUBSTR(A.INSDAT,7,2),'31', A.IOAMT * B.CALVALUE, 0))  AS AMT31,  "
        		+ "                             0 AS IWQTY, 0 AS IWAMT  "
        		+ "                      FROM   IMHIST   A,  "
        		+ "                             IOMATRIX B  "
        		+ "                     WHERE  A.SAUPJ    = ?  "
//        		+ "                        AND A.YEBI1 LIKE ?  "
        		+ "                        AND A.CVCOD    = ?  "
        		+ "                        AND B.JNPCRT   = '007'  "
        		+ "                        AND A.IOGBN    = B.IOGBN  "
        		+ "                        AND A.INSDAT   BETWEEN ?||'01' AND ?||'31'  "
        		+ "                    GROUP BY  A.CVCOD, A.ITNBR  "
        		+ " "
        		+ "                  UNION ALL  "
        		+ " "
        		+ "                    SELECT A.CVCOD AS CVCOD,  "
        		+ "                             A.ITNBR AS ITNBR,  "
        		+ "                             0  AS BALQTY,  "
        		+ "                             0  AS IOPRC,  "
        		+ "                             SUM((A.IOSUQTY + A.IOPEQTY - NVL(A.GONGQTY, 0)) * B.CALVALUE) AS IOQTY,  "
        		+ "                             SUM(A.IOAMT * B.CALVALUE )  AS IOAMT,  "
        		+ "                             0  AS QTY1, 0  AS QTY2, 0   AS QTY3, 0  AS QTY4, 0  AS QTY5, 0  AS QTY6, 0  AS QTY7, 0  AS QTY8,  "
        		+ "                             0  AS QTY9, 0  AS QTY10, 0  AS QTY11, 0 AS QTY12, 0 AS QTY13, 0 AS QTY14, 0 AS QTY15, 0 AS QTY16,  "
        		+ "                             0  AS QTY17, 0 AS QTY18, 0  AS QTY19, 0 AS QTY20, 0 AS QTY21, 0 AS QTY22, 0 AS QTY23, 0 AS QTY24,  "
        		+ "                             0  AS QTY25, 0 AS QTY26, 0  AS QTY27, 0 AS QTY28, 0 AS QTY29, 0 AS QTY30, 0 AS QTY31,  "
        		+ "                             0  AS AMT1, 0  AS AMT2, 0   AS AMT3, 0  AS AMT4, 0  AS AMT5, 0  AS AMT6, 0  AS AMT7, 0  AS AMT8,  "
        		+ "                             0  AS AMT9, 0  AS AMT10, 0  AS AMT11, 0 AS AMT12, 0 AS AMT13, 0 AS AMT14, 0 AS AMT15, 0 AS AMT16,  "
        		+ "                             0  AS AMT17, 0 AS AMT18, 0  AS AMT19, 0 AS AMT20, 0 AS AMT21, 0 AS AMT22, 0 AS AMT23, 0 AS AMT24,  "
        		+ "                             0  AS AMT25, 0 AS AMT26, 0  AS AMT27, 0 AS AMT28, 0 AS AMT29, 0 AS AMT30, 0 AS AMT31,  "
        		+ "                             SUM(TRUNC(DECODE(B.AMTGU, 'Y', A.IOQTY * B.CALVALUE,(A.IOSUQTY + A.IOPEQTY)), 0)  "
        		+ "                                                                      - TRUNC(NVL(A.GONGQTY, 0) * B.CALVALUE, 0 ) )  AS IWQTY,   "
        		+ "                             SUM(A.IOAMT * B.CALVALUE)  AS IWAMT  "
        		+ "                      FROM IMHIST   A,  "
        		+ "                             IOMATRIX B  "
        		+ "                     WHERE  "
        		+ "                        A.SAUPJ     = ?  "
//        		+ "                        AND A.YEBI1 LIKE ?  "
        		+ "                        AND A.CVCOD    = ?  "
        		+ "                        AND B.JNPCRT   = '007'  "
        		+ "                        AND A.IOGBN    = B.IOGBN  "
        		+ "                        AND A.INSDAT   BETWEEN ?||'01' AND ?||'31'  "
        		+ "                    GROUP BY  A.CVCOD, A.ITNBR  "
        		+ " "
        		+ "                  UNION ALL  "
        		+ " "
        		+ "                    SELECT B.CVCOD AS CVCOD,  "
        		+ "                             A.ITNBR AS ITNBR,  "
        		+ "                             SUM(A.BALQTY)  AS BALQTY,  "
        		+ "                             0  AS IOPRC,  "
        		+ "                             0  AS IOQTY,  "
        		+ "                             0  AS IOAMT,  "
        		+ "                             0  AS QTY1, 0  AS QTY2, 0   AS QTY3, 0  AS QTY4, 0  AS QTY5, 0  AS QTY6, 0  AS QTY7, 0  AS QTY8,  "
        		+ "                             0  AS QTY9, 0  AS QTY10, 0  AS QTY11, 0 AS QTY12, 0 AS QTY13, 0 AS QTY14, 0 AS QTY15, 0 AS QTY16,  "
        		+ "                             0  AS QTY17, 0 AS QTY18, 0  AS QTY19, 0 AS QTY20, 0 AS QTY21, 0 AS QTY22, 0 AS QTY23, 0 AS QTY24,  "
        		+ "                             0  AS QTY25, 0 AS QTY26, 0  AS QTY27, 0 AS QTY28, 0 AS QTY29, 0 AS QTY30, 0 AS QTY31,  "
        		+ "                             0  AS AMT1, 0  AS AMT2, 0   AS AMT3, 0  AS AMT4, 0  AS AMT5, 0  AS AMT6, 0  AS AMT7, 0  AS AMT8,  "
        		+ "                             0  AS AMT9, 0  AS AMT10, 0  AS AMT11, 0 AS AMT12, 0 AS AMT13, 0 AS AMT14, 0 AS AMT15, 0 AS AMT16,  "
        		+ "                             0  AS AMT17, 0 AS AMT18, 0  AS AMT19, 0 AS AMT20, 0 AS AMT21, 0 AS AMT22, 0 AS AMT23, 0 AS AMT24,  "
        		+ "                             0  AS AMT25, 0 AS AMT26, 0  AS AMT27, 0 AS AMT28, 0 AS AMT29, 0 AS AMT30, 0 AS AMT31,  "
        		+ "                             0 AS IWQTY, 0 AS IWAMT  "
        		+ "                      FROM POBLKT A,  "
        		+ "                            POMAST B  "
        		+ "                     WHERE  "
        		+ "                        A.SAUPJ     = ?  "
        		+ "                        AND A.NADAT    BETWEEN ?||'01' AND ?||'31'  "
        		+ "                        AND B.CVCOD    = ?  "
        		+ "                        AND A.BALJPNO  = B.BALJPNO  "
        		+ "                        AND B.BALGU IN ('1', '3')  "
        		+ "                    GROUP BY  B.CVCOD, A.ITNBR  "
        		+ "              ) A,  "
        		+ "             ITEMAS   C,  "
        		+ "             VNDMST   D,  "
        		+ "             ITNCT    G  "
        		+ "         WHERE A.ITNBR    = C.ITNBR  "
        		+ "            AND A.CVCOD    = D.CVCOD  "
        		+ "            AND C.ITTYP    = G.ITTYP  "
        		+ "            AND C.ITCLS    = G.ITCLS  "
        		+ "         GROUP BY A.CVCOD,  D.CVNAS, A.ITNBR, C.ITDSC||C.ISPEC, G.TITNM, C.ITCLS  "
        		+ " "
        		+ "  UNION ALL  "
        		+ " "
        		+ "        SELECT '2' AS SOR,  "
        		+ "             A.CVCOD      AS CVCOD,  "
        		+ "                 A.CVNAS      AS CVNAS,  "
        		+ "                 A.ITNBR      AS ITNBR,  "
        		+ "                 MAX(A.IONAM) AS ITDSC,  "
        		+ "                 '   ' AS CARTYPE,  "
        		+ "                 '   ' AS TITNM,  "
        		+ "                 '   ' AS ITCLS,  "
        		+ "                 0     AS BALQTY,  "
        		+ "                 0     AS IOPRC,  "
        		+ "                 SUM(A.IOQTY) AS IOQTY,  "
        		+ "                 SUM(A.IOAMT) AS IOAMT,  "
        		+ "                 0  AS QTY1,0  AS QTY2,0   AS QTY3,0  AS QTY4,0  AS QTY5,0  AS QTY6,0  AS QTY7,0  AS QTY8,  "
        		+ "                 0  AS QTY9,0  AS QTY10,0  AS QTY11,0 AS QTY12,0 AS QTY13,0 AS QTY14,0 AS QTY15,0 AS QTY16,  "
        		+ "                 0  AS QTY17,0 AS QTY18,0  AS QTY19,0 AS QTY20,0 AS QTY21,0 AS QTY22,0 AS QTY23,0 AS QTY24,  "
        		+ "                 0  AS QTY25,0 AS QTY26,0  AS QTY27,0 AS QTY28,0 AS QTY29,0 AS QTY30,0 AS QTY31,  "
        		+ "                 0  AS AMT1,0  AS AMT2,0   AS AMT3,0  AS AMT4,0  AS AMT5,0  AS AMT6,0  AS AMT7,0  AS AMT8,  "
        		+ "                 0  AS AMT9,0  AS AMT10,0  AS AMT11,0 AS AMT12,0 AS AMT13,0 AS AMT14,0 AS AMT15,0 AS AMT16,  "
        		+ "                 0  AS AMT17,0 AS AMT18,0  AS AMT19,0 AS AMT20,0 AS AMT21,0 AS AMT22,0 AS AMT23,0 AS AMT24,  "
        		+ "                 0  AS AMT25,0 AS AMT26,0  AS AMT27,0 AS AMT28,0 AS AMT29,0 AS AMT30,0 AS AMT31,  "
        		+ "                 0 AS IWQTY, 0 AS IWAMT        "
        		+ "              FROM (  "
        		+ "                    SELECT A.CVCOD AS CVCOD,  "
        		+ "                             A.IOGBN AS ITNBR,  "
        		+ "                      MAX(B.IONAM) AS IONAM,  "
        		+ "                      MAX(C.CVNAS) AS CVNAS,  "
        		+ "                             SUM((A.IOSUQTY + A.IOPEQTY - NVL(A.GONGQTY,0))*B.CALVALUE) AS IOQTY,  "
        		+ "                             SUM(A.IOAMT * B.CALVALUE )                          AS IOAMT  "
        		+ "                      FROM   IMHIST   A,  "
        		+ "                             IOMATRIX B,  "
        		+ "                          VNDMST   C  "
        		+ "                     WHERE  "
        		+ "                        A.SAUPJ     = ?  "
//        		+ "                        AND A.YEBI1    LIKE ?  "
        		+ "                        AND A.CVCOD    = ?   "
        		+ "                        AND B.JNPCRT   <> '007'  "
        		+ "                        AND A.IOGBN    = B.IOGBN  "
        		+ "                  AND A.CVCOD    = C.CVCOD  "
        		+ "                    GROUP BY  A.CVCOD, A.IOGBN) A  "
        		+ "         GROUP BY A.CVCOD,  A.CVNAS, A.ITNBR  ";
        
        JSONObject joStartData = new JSONObject();
        
        
        //사업장
        if (sSaupj == null || sSaupj == "") {
        	sSaupj = "10";
        }
        //거래처 코드
        if (sCvcod == null || sCvcod == "") {
            sCvcod = "%"; 
        }
        //마감년월
        if (sYymm == null || sYymm == "") {
        	sYymm = "%"; 
        }
        
        System.out.println("sSaupj = " + sSaupj);
        System.out.println("sCvcod = " + sCvcod);
        System.out.println("sYymm = " + sYymm);
        
        ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>(); 
        parameters.add(new comm_dataPack(1, sSaupj));
        parameters.add(new comm_dataPack(2, sCvcod));
        parameters.add(new comm_dataPack(3, sYymm));
        parameters.add(new comm_dataPack(4, sYymm));
        parameters.add(new comm_dataPack(5, sSaupj));
        parameters.add(new comm_dataPack(6, sCvcod));
        parameters.add(new comm_dataPack(7, sYymm));
        parameters.add(new comm_dataPack(8, sYymm));
        parameters.add(new comm_dataPack(9, sSaupj));
        parameters.add(new comm_dataPack(10, sYymm));
        parameters.add(new comm_dataPack(11, sYymm));
        parameters.add(new comm_dataPack(12, sCvcod));
        parameters.add(new comm_dataPack(13, sSaupj));
        parameters.add(new comm_dataPack(14, sCvcod));
        
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
   
    // 테이블 형태
    public JSONObject startSelectS() {
    	String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = "	SELECT ' ' AS ITNBR, "
    			+ "			   ' ' AS ITDSC,"
    			+ "			   ' ' AS TITNM,	"
    			+ "			   ' ' AS IOAMT,	"
    			+ "			   ' ' AS IOQTY,	"
    			+ "			   ' ' AS IOPRC,	"
    			+ "			   ' ' AS CARTYPE,	"
    			+ "			   ' ' AS IWQTY,	"
    			+ "			   ' ' AS QTY1,	"
    			+ "			   ' ' AS QTY2,	"
    			+ "			   ' ' AS QTY3,	"
    			+ "			   ' ' AS QTY4,	"
    			+ "			   ' ' AS QTY5,	"
    			+ "			   ' ' AS QTY6,	"
    			+ "			   ' ' AS QTY7,	"
    			+ "			   ' ' AS QTY8,	"
    			+ "			   ' ' AS QTY9,	"
    			+ "			   ' ' AS QTY10,	"
    			+ "			   ' ' AS QTY11,	"
    			+ "			   ' ' AS QTY12,	"
    			+ "			   ' ' AS QTY13,	"
    			+ "			   ' ' AS QTY14,	"
    			+ "			   ' ' AS QTY15,	"
    			+ "			   ' ' AS QTY16,	"
    			+ "			   ' ' AS QTY17,	"
    			+ "			   ' ' AS QTY18,	"
    			+ "			   ' ' AS QTY19,	"
    			+ "			   ' ' AS QTY20,	"
    			+ "			   ' ' AS QTY21,	"
    			+ "			   ' ' AS QTY22,	"
    			+ "			   ' ' AS QTY23,	"
    			+ "			   ' ' AS QTY24,	"
    			+ "			   ' ' AS QTY25,	"
    			+ "			   ' ' AS QTY26,	"
    			+ "			   ' ' AS QTY27,	"
    			+ "			   ' ' AS QTY28,	"
    			+ "			   ' ' AS QTY29,	"
    			+ "			   ' ' AS QTY30,	"
    			+ "			   ' ' AS QTY31	"
    			+ "		   FROM DUAL "
    			+ "		CONNECT BY LEVEL <= 12 ";
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
    
    // 시스템관리자 / 사용자 구분
    public JSONObject getAuth(String sID) {
    	String sResult = null;
    	
    	// sql 문 안에서 "  " 쌍따옴표 안쪽에 띄어쓰기를 해준다 안하면 D1FROM 으로  from 절을 찾지 못한다. 
    	String SQL = " SELECT AUTH FROM SCM_LOGIN_T WHERE CHG_ID = ? ";
    	
    	ArrayList<comm_dataPack> parameter = new ArrayList<comm_dataPack>();
    	parameter.add(new comm_dataPack(1, sID));
    	
    	JSONObject joStartData = new JSONObject();
    	comm_transaction controler = new comm_transaction();  
    	
    	try {
    		joStartData = controler.selectData(SQL,parameter);
    	} catch (Exception e) {
    		sErrMessage = e.getMessage();
    		System.out.println("[startSelect ERROR!!!]" + sErrMessage);
    		e.printStackTrace();
    	}
    	
    	return joStartData;
    }
}
