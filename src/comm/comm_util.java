package comm;

import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Types;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

@WebServlet("/comm_util")
public class comm_util extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    /**
     * @see HttpServlet#HttpServlet()
     */
    public comm_util() {
        super();
        // TODO Auto-generated constructor stub
    }
    private CallableStatement sCstmt = null;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        String sGubunCode = request.getParameter("SearchGubun");
        String sData = null;
        switch(sGubunCode) {
            case "date":
                sData = getSysDate();
                response.getWriter().write(sData);
                break;
            case "time":
                sData = getSysTime();
                response.getWriter().write(sData);
                break;
            case "junpyo":
                String sDate = request.getParameter("Date");
                String sGubun = request.getParameter("JunpyoGubun");
                sData = getJunpyo(sDate, sGubun);
                response.getWriter().write(sData);
                break;
        }
        //System.out.println(sData);

        //response.getWriter().append("Served at: ").append(request.getContextPath());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
//------------------------------------------------------------------------------
// 기능 : 페이지당 보여줄 데이터 갯수 설정 및 설정된 데이터 조회
// 인자 : joListData -> SELECT가 실행되고 난 후의 JSONObject로 parsing된 데이터
//       sPage -> 조회할 현재 페이지
// 반환 : String : 페이지에 해당하는 데이터, 길이, 페이지넘버  
// 작성 : 2021.05.18 by dykim
//------------------------------------------------------------------------------
    public String pageParse(JSONObject joListData, int sPage, int sPageLength) {
        int iTotalRecords = 0; //전체건수
        int iRecordPerPage = sPageLength; //페이지당 리스트 수
        int iPageNo = sPage;
        
        JSONArray  jaArr = (JSONArray)joListData.get("DATA");
        iTotalRecords = jaArr.size();
        int iStartList = (iPageNo - 1) * iRecordPerPage;  //시작점
        int iEndList = iStartList + iRecordPerPage;       //종료점
        if(iRecordPerPage == -1) {
            iEndList = iTotalRecords;
        }
        if(iTotalRecords < (iPageNo * iRecordPerPage)) {
            iEndList = iTotalRecords;    //자료종료
        }
        //int iTotalPages = (int) Math.ceil((float)iTotalRecords/(float)iRecordPerPage);  //총페이지수
        
        JSONObject joObject = new JSONObject();
        joObject.put("RecordCount", iTotalRecords);
        JSONArray jaListArray = new JSONArray();
        System.out.println(jaArr.size());
        for (int i = iStartList; i < iEndList; i++) {
            JSONObject joItem = (JSONObject)jaArr.get(i);
            jaListArray.add(joItem);
        }
        joObject.put("DATA", jaListArray);
        
        joObject.put("PageLength", iRecordPerPage);
        joObject.put("PageNo", iPageNo);
        
        return joObject.toString();
    }
//------------------------------------------------------------------------------
// 기능 : 오늘 날짜 가져오기
// 인자 : 없음
// 반환 : String : 오늘 날짜  
// 작성 : 2021.05.20 by dykim
//------------------------------------------------------------------------------
    public String getSysDate() {
        String SQL = "SELECT TO_CHAR(SYSDATE, 'yyyyMMdd') AS TODAY FROM DUAL";
        String sSysDate = null;
        comm_transaction controler = new comm_transaction();
        try {
            sSysDate = controler.selectString(SQL);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //System.out.println(sSysDate);
        return sSysDate;
    }
//------------------------------------------------------------------------------
// 기능 : 현재 시간
// 인자 : 없음
// 반환 : String : 현재시간  
// 작성 : 2021.05.21 by dykim
//------------------------------------------------------------------------------    
    public String getSysTime() {
        String SQL = "SELECT TO_CHAR(SYSDATE, 'hh24miss') AS TODAY FROM DUAL";
        String sSysTime = null;
        comm_transaction controler = new comm_transaction();
        try {
            sSysTime = controler.selectString(SQL);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return sSysTime;
    }
//------------------------------------------------------------------------------
// 기능 : 전표번호 채번
// 인자 : sToDate -> 날짜 8자리
//       sGubun -> 전표채번 구분값
// 반환 : String : 채번된 전표
// 작성 : 2021.05.21 by dykim
//------------------------------------------------------------------------------    
    public String getJunpyo(String sToDate, String sGubun) {
        String sJunPyo = "";
        String SQL = "{Call SP_GET_JUNPYO(?, ?, ?)}";
        try {
            comm_dbConnect dbAccess = new comm_dbConnect();
            sCstmt = dbAccess.getconnection().prepareCall(SQL);
            sCstmt.setString(1, sToDate);
            sCstmt.setString(2, sGubun);
            sCstmt.registerOutParameter(3, Types.VARCHAR);
            sCstmt.execute();
            //System.out.println(sCstmt.getInt(3));
            sJunPyo = String.format("%04d", sCstmt.getInt(3));
            dbAccess.disconnection();
            //System.out.println("=======>" + sJunPyo);
            System.out.println(sJunPyo);
            return sJunPyo;         
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("getJunPyo Error: " + e.getMessage());
            return "-1";
        }
    }
//------------------------------------------------------------------------------
//기능 : 환경설정 DATANAME 반환
//인자 : 시스템구분, 순번, LINENO
//반환 : String : DATANAME  
//작성 : 2021.10.01 by 김준형
//------------------------------------------------------------------------------    
 public String getDataname(String sysgu, String serial, String lineno) {
     String SQL = " SELECT DATANAME FROM SYSCNFG "
     			+ "	WHERE SYSGU= ? AND SERIAL= ? AND LINENO= ? ";
     comm_transaction controler = new comm_transaction();
     String dataName = new String();
     
     ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
     parameters.add(new comm_dataPack(1, sysgu));
     parameters.add(new comm_dataPack(2, serial));
     parameters.add(new comm_dataPack(3, lineno));
     
     try {
    	 dataName = controler.selectStringData(SQL, parameters);
     } catch (Exception e) {
         e.printStackTrace();
     }
     return dataName;
 }
}