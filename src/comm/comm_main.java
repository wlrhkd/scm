package comm;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.util.SystemOutLogger;
import org.json.simple.JSONObject;

@WebServlet("/comm_main")
public class comm_main extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public comm_main() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
	    String sGubunCode = request.getParameter("SearchGubun");
	    switch (sGubunCode) {
	        case "notice": // 최근 공지사항 게시물
	            response.getWriter().write(getNotice().toString());
	            break;
	        case "pds": // 최근 자료실 게시물
	            response.getWriter().write(getPds().toString());
	            break;
		    case "chul": // 금일 출발 건수
		    	String cCvcod = request.getParameter("CVCOD");
		    	response.getWriter().write(getChul(cCvcod).toString());
		    	break;
		    case "prebul": // 이번달 불량 건수
		    	String pCvcod = request.getParameter("CVCOD");
		    	response.getWriter().write(getPrebul(pCvcod).toString());
		    	break;
		    case "junsu": // 이번달 납입 준수율
		    	String jCvcod = request.getParameter("CVCOD");
		    	response.getWriter().write(getJunsu(jCvcod).toString());
		    	break;
	    }
	}
	// 금일 출발 건수
	public JSONObject getChul(String cCvcod) {
		JSONObject joNoticeData = new JSONObject();
		
		String SQL = " SELECT COUNT(JPNO) AS JPNO "
				 + " 	 FROM POBLKT_HIST "
				 + "    WHERE TO_CHAR(NADATE) = TO_CHAR(SYSDATE,'YYYYMMDD') "
				 + "      AND CVCOD = ? ";
		
		comm_transaction controler = new comm_transaction();
		
		ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, cCvcod));
		
		try {
			joNoticeData = controler.selectData(SQL, parameters);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return joNoticeData;
	}
	
	// 금월 불량 건수
	public JSONObject getPrebul(String pCvcod) {
		JSONObject joNoticeData = new JSONObject();
		
		String SQL = " SELECT NVL(SUM(BFAQTY),'0') AS BFAQTY "
				 + " 	 FROM POBLKT_HIST "
				 + "    WHERE NADATE BETWEEN (TO_CHAR(TRUNC(SYSDATE,'MM'),'YYYYMMDD')) AND (LAST_DAY(SYSDATE)) "
				 + "      AND CVCOD = ? ";
		
		comm_transaction controler = new comm_transaction();
		
		ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
		parameters.add(new comm_dataPack(1, pCvcod));
		
		try {
			joNoticeData = controler.selectData(SQL, parameters);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return joNoticeData;
	}
	
	// 금월 준수율
	public JSONObject getJunsu(String jCvcod) {
		JSONObject joNoticeData = new JSONObject();
		
		String SQL = " SELECT FUN_GET_NAPJUNSU(TRUNC(SYSDATE,'MM'),LAST_DAY(SYSDATE), ?) AS NAPJUNSU "
				+ " FROM DUAL ";
		
		comm_transaction controler = new comm_transaction();
		
		ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
		parameters.add(new comm_dataPack(1, jCvcod));
		
		try {
			joNoticeData = controler.selectData(SQL, parameters);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return joNoticeData;
	}
	
	// 최근 공지사항
	public JSONObject getNotice() {
	    JSONObject joNoticeData = new JSONObject();
	    System.out.println("notice");
	    String SQL = " SELECT NO, "
	            + " SUBJECT, "
	            + " NVL(CONTENT,' ') AS CONTENT, "
	            + " CRE_DT "
	            + " FROM SCM_NOTICE "
	            + " WHERE SUBSTR(CRE_DT,0,8) BETWEEN TRUNC(ADD_MONTHS(SYSDATE,-1)+1 - TO_CHAR(SYSDATE,'DD')) AND TRUNC(LAST_DAY(SYSDATE)) +0.99999421 "
	            + " ORDER BY CRE_DT DESC ";
	    
	    comm_transaction controler = new comm_transaction();
	    try {
	        joNoticeData = controler.selectData(SQL);
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return joNoticeData;
	}
	
	// 최근 자료 게시물
	public JSONObject getPds() {
	    JSONObject joPdsData = new JSONObject();
	   
	    String SQL = "  SELECT A.PNO, "
	    		+ " A.SUBJECT,   "
	    		+ " A.CRE_DT,   "
	    		+ " A.CRE_ID,   "
	    		+ " B.CHG_NAME,   "
	    		+ " NVL(A.CONTENT,' ') AS CONTENT  "
	    		+ " FROM SCM_PDS A,  "
	    		+ "      SCM_LOGIN_T B  "
	    		+ " WHERE SUBSTR(A.CRE_DT,0,8) BETWEEN TRUNC(ADD_MONTHS(SYSDATE,-1)+1 - TO_CHAR(SYSDATE,'DD')) AND TO_CHAR(TRUNC(LAST_DAY(SYSDATE)) +0.99999421) "
	    		+ "   AND A.CRE_ID = B.CHG_ID  "
	    		+ " ORDER BY CRE_DT DESC ";
	    
	    comm_transaction controler = new comm_transaction();
	    try {
	        joPdsData = controler.selectData(SQL);
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return joPdsData;
	}
}
