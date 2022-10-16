<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ page import="java.io.*, java.text.*, java.util.*" %>
<%@ page import="com.ubireport.common.util.StrUtil" %>
<%
	// 보안을 위해 설치 후 임시로 false로 변경해서 결과 확인 후 소스 배포 시 무조건 true로 변경해야함
	boolean refererCheck = false;
	String referer = request.getHeader("referer");	// REFERER 가져오기
	if( refererCheck && 
		(com.ubireport.common.util.StrUtil.nvl(referer, "").equals("") || 
				com.ubireport.common.util.StrUtil.nvl(referer, "").indexOf(request.getServerName()) == -1) ) { 	// REFERER 체크(브라우저에서 직접 호출 방지)
		out.clear();
		out.print("비정상적인 접근입니다.");
		return;
	}
	
	//웹어플리케이션명
	String appName = StrUtil.nvl(request.getContextPath(), "");
	if( appName.indexOf("/") == 0 ) {
		appName = appName.substring(1, appName.length());
	}	

	//웹어플리케이션 Root URL, ex)http://localhost:8080/myapp
	String appUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + ((appName.length() == 0)?"":"/") + appName;

	//웹어플리케이션 Root Path, ex)/webapp/myapp
	String appPath = request.getRealPath("/").replaceAll("\\\\", "/");
	if( appPath.lastIndexOf("/") == (appPath.length() - 1) ) {
		appPath = appPath.substring(0, appPath.lastIndexOf("/"));
	}

	String TODAY = (new SimpleDateFormat("yyyyMMdd")).format(System.currentTimeMillis());
	String pdfUrl = appUrl + "/ubi4/storage/" + TODAY;
	String pdfPath = appPath + "/ubi4/storage/" + TODAY;

	out.clearBuffer();
%>
<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>PDF List</title>
</head>
<body>
<%
	try {
		File dir = new File(pdfPath);
		File[] list = dir.listFiles();
	
		if (list != null) {
			out.print("<table>");
			for (int i = list.length-1; i>=0; i--) {

				File file = list[i];
				String fileName = file.getName();
				String fileDate = (new SimpleDateFormat("yyyy/MM/dd HH:mm:ss")).format(new Date(file.lastModified()));

				out.print("<tr height='30px'>");
				out.print("<td width='300px'>");
				out.print("<a href=\"" + pdfUrl + "/" + fileName + "\" target=\"_blank\">" + fileName + "</a>");
				out.print("</td>");
				out.print("<td width='200px'>" + fileDate + "</td>");
				out.print("</tr>");
			}
			out.print("</table>");
		}
		else {
			out.println("File not founded.");
		}
	} catch (Exception e) {
		e.printStackTrace();
	}
%>
</body>
</html>
