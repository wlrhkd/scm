package file;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import comm.comm_dataPack;
import comm.comm_transaction;

@WebServlet("/fileURL_delete")
public class fileURL_delete extends HttpServlet {
	 private static final long serialVersionUID = 1L;

	 public fileURL_delete() {
	        super();
	 }
	
	 public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
			request.setCharacterEncoding("UTF-8");
			response.setContentType("text/html;charset=UTF-8");

			String sActGubun = request.getParameter("ActGubun");

			switch (sActGubun) {
			case "deleteFileUrlApds": // 자료실등록, 자료실 파일 경로 삭제
				String sUploadUrl = request.getParameter("uploadUrl");
				System.out.println("@@자료실/자료실등록삭제@@: " + sUploadUrl);
				try {
					String path = "C:\\Users\\PC\\eclipse-workspace\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\scm\\Upload\\apds\\"
							+ sUploadUrl; // C 드라이브 -> test폴더 -> test.txt
					File file = new File(path); // file 생성

					if (file.delete()) { // f.delete 파일 삭제에 성공하면 true, 실패하면 false
						System.out.println("파일을 삭제하였습니다");
					} else {
						System.out.println("파일 삭제에 실패하였습니다");
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				break;
			
			case "deleteFileUrlNotice": // 공지사항 파일 경로 삭제
				String nUploadUrl = request.getParameter("uploadUrl");
				System.out.println("@@공지사항삭제@@: " + nUploadUrl);
				try {
					String path = "C:\\Users\\PC\\eclipse-workspace\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\scm\\Upload\\notice\\"
							+ nUploadUrl; // C 드라이브 -> test폴더 -> test.txt
					File file = new File(path); // file 생성
					
					if (file.delete()) { // f.delete 파일 삭제에 성공하면 true, 실패하면 false
						System.out.println("파일을 삭제하였습니다");
					} else {
						System.out.println("파일 삭제에 실패하였습니다");
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				break;

			case "deleteFileUrlVndmst": // 사용자 정보 파일 경로 삭제
				String vUploadUrl = request.getParameter("uploadUrl");
				System.out.println("@@공지사항삭제@@: " + vUploadUrl);
				try {
					String path = "C:\\Users\\PC\\eclipse-workspace\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\scm\\Upload\\vndmst\\"
							+ vUploadUrl; // C 드라이브 -> test폴더 -> test.txt
					File file = new File(path); // file 생성
					
					if (file.delete()) { // f.delete 파일 삭제에 성공하면 true, 실패하면 false
						System.out.println("파일을 삭제하였습니다");
					} else {
						System.out.println("파일 삭제에 실패하였습니다");
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				break;
				
			case "deleteFileApds":  // 자료실/자료실등록 파일삭제
               	String sFile = request.getParameter("File");
               	response.getWriter().write(getJson(sFile));
               	break;
               	
			case "deleteFileNotice": // 공지사항 파일삭제
				String nFile = request.getParameter("File");
				response.getWriter().write(getJsonDel(nFile));
				break;
				
      }
   }

	// 파일삭제(자료실/자료실등록)
	private String getJson(String sFile) {
		
		return deleteFileApds(sFile);
	}

	private String deleteFileApds(String sFile) {
		String sResult = null;

		String SQL = " UPDATE SCM_PDS SET CHG_FILE = ' '  WHERE PNO = ? ";

		JSONObject joStartData = new JSONObject();

		ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
		parameters.add(new comm_dataPack(1, sFile));

		String sErrMessage = null;
		try {
			comm_transaction controler = new comm_transaction();
			controler.updateData(SQL, parameters);
    		 System.out.println("joStartData : " + joStartData);
		} catch (Exception e) {
			sErrMessage = e.getMessage();
			System.out.println("[startSelect ERROR!!!]" + sErrMessage);
			e.printStackTrace();
		}
		JSONObject joSendJson = new JSONObject();
		joSendJson.put("Message", sErrMessage);

		return joSendJson.toString();
	}

	// 파일삭제(공지사항)
	private String getJsonDel(String nFile) throws IOException {

		return deleteFileNotice(nFile);
	}

	private String deleteFileNotice(String nFile) {
		String sResult = null;

		String SQL = " UPDATE SCM_NOTICE SET DECODE(CHG_FILE, NULL ,'무' , '유') WHERE PNO = ? ";

		JSONObject joStartData = new JSONObject();

		ArrayList<comm_dataPack> parameters = new ArrayList<comm_dataPack>();
		parameters.add(new comm_dataPack(1, nFile));

		String sErrMessage = null;
		try {
			comm_transaction controler = new comm_transaction();
			controler.updateData(SQL, parameters);
    		 System.out.println("joStartData : " + joStartData);
		} catch (Exception e) {
			sErrMessage = e.getMessage();
			System.out.println("[startSelect ERROR!!!]" + sErrMessage);
			e.printStackTrace();
		}
		JSONObject joSendJson = new JSONObject();
		joSendJson.put("Message", sErrMessage);

		return joSendJson.toString();
	}
}
			

