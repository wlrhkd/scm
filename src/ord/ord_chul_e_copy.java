package ord;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import comm.comm_message;
import comm.combo.comm_reffpf_c;

@WebServlet("/ord_chul_e_copy")
public class ord_chul_e_copy extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ord_chul_e_copy() {
        super();
    }

    private int iStartPage,iLength;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        String sGubunCode = request.getParameter("SearchGubun");
        ord_chul_DAO_e dbDAO = new ord_chul_DAO_e();
        
        comm_reffpf_c rfcod = new comm_reffpf_c();
        comm_message message = new comm_message();
        
        JSONObject joListData = null;
        switch(sGubunCode) {
            case "saupj":
                //joListData = saupj.getSaupj();
                joListData = rfcod.getReffpf("02");
                break;
            case "ittyp":
                //joListData = ittyp.getIttyp();
                joListData = rfcod.getReffpf("15");
                break;
            case "pojang":
                //joListData = pojang.getPojang();
                joListData = rfcod.getReffpf("2T");
                //System.out.println(joListData);
                break;
            case "inputCvcod":
                String sCvcod = request.getParameter("Cvcod");
                joListData = dbDAO.getCvnas(sCvcod);
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
        ord_chul_DAO_e dbDAO = new ord_chul_DAO_e();
        
        switch(sActGubun) {
             case "R":	//조회
                 String sPage      = request.getParameter("Page");
                 String sPageLength= request.getParameter("PageLength");    //페이지당 row 갯수
                 String sGubun     = request.getParameter("Gubun");		    //라디오 버튼의 값
                 String sFdate     = request.getParameter("Fdate");         //시작일
                 String sTdate     = request.getParameter("Tdate");         //종료일
                 String sCvcod   = request.getParameter("Cvcod");           //업체코드
                 String sCvnas   = request.getParameter("Cvnas");	        //업체명
                 String sSaupj = request.getParameter("Saupj");	            //사업장
                 String sItnbr   =  request.getParameter("Itnbr");	        //품번
                 String sItdsc     = request.getParameter("Itdsc");	        //품명
                 String sIttyp  = request.getParameter("Ittyp");	        //품목구분
                 iStartPage = Integer.parseInt(sPage);
                 iLength = 10;
                 sPageLength = "20";
                 response.getWriter().write(getJson(sPage,sPageLength,sGubun,sFdate,sTdate,sCvcod,sSaupj,sItnbr,sItdsc,sIttyp));
                 break;
             case "I":
                 sModifyData = request.getParameter("JsonData");
                 String sOrgData = request.getParameter("OrgData");
                 //System.out.println(sModifyData);
                 //System.out.println(sOrgData);
                 
                 response.getWriter().write(dbDAO.startUpdate(sModifyData,sOrgData));
                 break;
             case "D":
                 sModifyData = request.getParameter("JsonData");
                 response.getWriter().write(dbDAO.cancelDelete(sModifyData));
                 break;
        }
    }
    
    public String getJson(String sPage, String sPageLength, String sGubun, String sFdate, String sTdate, String sCvcod,
            String sSaupj, String sItnbr, String sItdsc, String sIttyp) throws IOException{
        int iTotalRecords = 0;	//전체건수
        int iRecordPerPage = Integer.parseInt(sPageLength);	//페이지당 리스트 수
        int iPageNo = 0;
        if(sPage.equals("")){
            iPageNo = 1;
        }else{
            iPageNo = Integer.parseInt(sPage);
        }
        
        JSONObject joListData = null;
        
        ord_chul_DAO_e dbDAO = new ord_chul_DAO_e();
        if(sGubun.equals("I")) {
            //출발 라디오 버튼
            joListData = dbDAO.startSelect(sFdate, sTdate, sCvcod, sSaupj, sItnbr, sItdsc, sIttyp); 
        }else {
            joListData = dbDAO.cancelSelect(sFdate,sTdate, sCvcod, sIttyp, sSaupj);
        }
        
        JSONObject joData = (JSONObject)(joListData);
        
        JSONArray  jaArr = (JSONArray)joData.get("DATA");
        iTotalRecords = jaArr.size();
        int iStartList = (iPageNo - 1) * iRecordPerPage;  //시작점
        int iEndList = iStartList + iRecordPerPage;		  //종료점
        if(iRecordPerPage == -1) {
            iEndList = iTotalRecords;
        }
        if(iTotalRecords < (iPageNo * iRecordPerPage)) {
            iEndList = iTotalRecords;    //자료종료
        }
        int iTotalPages = (int) Math.ceil((float)iTotalRecords/(float)iRecordPerPage);	//총페이지수
        
        String sListHTML = "";
        JSONObject joObject = new JSONObject();
        joObject.put("RecordCount", iTotalRecords);
        JSONArray jaListArray = new JSONArray();
        for (int i = iStartList; i < iEndList; i++) {
            JSONObject joItem = (JSONObject)jaArr.get(i);
            jaListArray.add(joItem);
        }
        joObject.put("DATA", jaListArray);
        
        joObject.put("PageLength", iRecordPerPage);
        joObject.put("PageNo", iPageNo);
        //System.out.println(joObject);
        return joObject.toString();
    }
}
