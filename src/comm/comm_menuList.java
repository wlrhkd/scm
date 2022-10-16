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

@WebServlet("/comm_menuList")
public class comm_menuList extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public comm_menuList() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
	    String mGubunCode = request.getParameter("ActGubun");
	    switch (mGubunCode) {
	        case "getMenuList": // 메뉴
	        	String MID = request.getParameter("MID");
	            response.getWriter().write(getMenuList(MID).toString());
	            break;
	        case "getMenuDetail": // 메뉴
	        	String DID = request.getParameter("DID");
	        	String CHG_ID = request.getParameter("CHG_ID");
	        	response.getWriter().write(getMenuDetail(DID,CHG_ID).toString());
	        	break;
	    }
	}
	// 메뉴 리스트
	public JSONObject getMenuList(String MID) {
	    JSONObject joMenuData = new JSONObject();
	    
	    String SQL = " SELECT B.SUB1_ID, B.SUB2_NAME "
	    		+ "	   	FROM SCM_SUB2_T A, "
	    		+ "          SCM_USER_T B "
	    		+ "		WHERE A.IO_GUBUN = 'A' "
	    		+ "     AND B.CHG_ID = ? "
	    		+ "     AND A.MAIN_ID = B.MAIN_ID "
	    		+ "     AND A.SUB1_ID = B.SUB1_ID "
	    		+ "     AND A.SUB2_ID = B.SUB2_ID "
	    		+ "		ORDER BY B.SUB1_ID ";
	    
	    comm_transaction controler = new comm_transaction();
	    
	    ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
        parameters.add(new comm_dataPack(1, MID));
	    try {
	    	joMenuData = controler.selectData(SQL,parameters);
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
//	    System.out.println("###$@$@  " + joMenuData);
	    return joMenuData;
	}
	public JSONObject getMenuDetail(String DID, String CHG_ID) {
		JSONObject joMenuData2 = new JSONObject();
		
		String SQL = "  SELECT "
				+ "		A.SUB1_ID, "
				+ "     A.SUB2_ID, "
				+ "     B.SUB2_NAME, "
				+ "     A.PAGE_URL "
				+ "     FROM SCM_SUB2_T A, "
				+ "     SCM_USER_T B "
				+ "     WHERE A.IO_GUBUN NOT IN('A','T')  "
				+ "     AND B.SUB1_ID = ? "
				+ "     AND B.CHG_ID = ? "
				+ "     AND A.MAIN_ID = B.MAIN_ID "
				+ "     AND A.SUB1_ID = B.SUB1_ID "
				+ "     AND A.SUB2_ID = B.SUB2_ID "
				+ "     ORDER BY A.SUB1_ID, A.SUB2_ID ";
		
		comm_transaction controler = new comm_transaction();
		
		ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
		parameters.add(new comm_dataPack(1, DID));
		parameters.add(new comm_dataPack(2, CHG_ID));
		try {
			joMenuData2 = controler.selectData(SQL,parameters);
		} catch (Exception e) {
			e.printStackTrace();
		}
//	    System.out.println("###$@$@  " + joMenuData2);
		return joMenuData2;
	}
}
