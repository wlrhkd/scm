package comm.popup;

import java.io.IOException;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

/**
 * Servlet implementation class comm_vndmst_f
 */
@WebServlet("/comm_vndmst_f")
public class comm_vndmst_f extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public comm_vndmst_f() {
        super();
        // TODO Auto-generated constructor stub
    }
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    String sSearchGubun;
    @Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        
        comm_vndmst_f_DAO dbDAO = new comm_vndmst_f_DAO();
        JSONObject sListData = null;
        String sSearchGubun = request.getParameter("SearchGubun");
        switch (sSearchGubun) {
            case "vndmst":
                String sPage = request.getParameter("Page");
                String sCheckGubun = request.getParameter("CheckGubun");            
                String sSearchValue = request.getParameter("SearchValue");
                System.out.println("page" + sPage );
                System.out.println(sCheckGubun);
                System.out.println(sSearchValue);
                sListData = dbDAO.getVndmstList(sPage,sCheckGubun,sSearchValue); //업체리스트
                response.getWriter().write(sListData.toString());
        }
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
