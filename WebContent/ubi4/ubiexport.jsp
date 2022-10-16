<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ page import="java.io.*, java.net.URLEncoder" %>
<%@ page import="com.ubireport.common.util.StrUtil, com.ubireport.viewer.report.preview.UbiViewer" %>

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

	//저장 성공 여부
	boolean isSuccess = false;
	//성공 시 자동 파일 다운로드 여부
	boolean autoDownload = true;

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

	//UI에서 호출될 때 필요한 정보
	String jrf = StrUtil.nvl(request.getParameter("jrf"), "ubi_sample.jrf");
	String arg = StrUtil.nvl(request.getParameter("arg"), "user#홍길동#company#유비디시전#");

	//환경에 맞게 설정해야함
	String rootUrl = appUrl;
	String serverUrl = (appUrl + "/UbiServer");
	String fileUrl = (appUrl + "/ubi4/resource");
	String resource = "fixed";
	String jrfDir = (appPath + "/ubi4/work/");
	String dataSource = "Tutorial";

	String exportFileType = "PDF";
	String exportPath = appPath + "/ubi4/storage/";
	String exportFileName = jrf.substring(0, jrf.lastIndexOf(".")) + ".pdf";
	String exportFilePath = exportPath + exportFileName;

	System.out.println("[appUrl] " + appUrl);
	System.out.println("[appPath] " + appPath);
	System.out.println("[jrfDir] " + jrfDir);
	System.out.println("[jrf] " + jrf);
	System.out.println("[arg] " + arg);
	System.out.println("[type] " + exportFileType);
	System.out.println("[exportDir] " + exportFilePath);

	try {

		UbiViewer ubi = new UbiViewer(false, false);

		ubi.exectype = "TYPE6";
		ubi.fileURL = fileUrl;
		ubi.resource = resource;
		ubi.ubiServerURL = serverUrl;
		ubi.isLocalFile = true;
		ubi.dataSource = dataSource;
		ubi.jrfFileDir = jrfDir;
		ubi.jrfFileName = jrf;
		ubi.arg = arg;
		ubi.setExportParams(exportFileType, exportFilePath);

		//Windows OS가 아닌 경우 폰트 경로 설정을 해야함
		if( System.getProperty("os.name").indexOf("Win") == -1 ) {
			String fontPath = StrUtil.nvl(System.getProperty("sun.java2d.fontpath"), "");
			if( "".equals(fontPath) ) {
				fontPath = System.getProperty("java.home") + "/lib/fonts";
			} else {
				fontPath = System.getProperty("sun.java2d.fontpath");
			}
			ubi.setFontPath(fontPath);
		}
		isSuccess = ubi.loadReport();
	}
	catch(Exception e) {
		e.printStackTrace();
	}
	finally {	
		out.clearBuffer();
	}
%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>File Export</title>
</head>
<body>
<h1><%= isSuccess?"Export Success!":"Export Fail!" %></h1>
<%
	if( isSuccess && autoDownload ) {

		File exportFile = new File(exportFilePath);
		FileInputStream fis = null;
		BufferedOutputStream bos = null;
		
		request.setCharacterEncoding("UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept");
		response.setHeader("Access-Control-Allow-Credentials", "true");

		//저장 유형에 따라 ContentType 변경해야함
		response.setContentType("application/pdf");

		// 다운로드 시 파일명이 한글인 경우 브라우저별 한글 인코딩 처리
		String header = request.getHeader("User-Agent");
		if (header.contains("Edge")){
			exportFileName = URLEncoder.encode(exportFileName, "UTF-8").replaceAll("\\+", "%20");
		} else if (header.contains("MSIE") || header.contains("Trident")) { // IE 11버전부터 Trident로 변경되었기때문에 추가해준다.
			exportFileName = URLEncoder.encode(exportFileName, "UTF-8").replaceAll("\\+", "%20");
		} else if (header.contains("Chrome")) {
			exportFileName = new String(exportFileName.getBytes("UTF-8"), "ISO-8859-1");
		} else if (header.contains("Opera")) {
			exportFileName = new String(exportFileName.getBytes("UTF-8"), "ISO-8859-1");
		} else if (header.contains("Firefox")) {
			exportFileName = new String(exportFileName.getBytes("UTF-8"), "ISO-8859-1");
		}
		response.setHeader("Content-Disposition", "attachment; filename=\"" + exportFileName  + "\"");

		try {
			fis = new FileInputStream(exportFile);
			int size = fis.available();		//지정 파일에서 읽을 수 있는 바이트 수를 반환
			byte[] buf = new byte[size];	//버퍼설정
			int readCount = fis.read(buf);
			response.flushBuffer();
			out.clear();
			out=pageContext.pushBody();
			bos = new BufferedOutputStream(response.getOutputStream());
			bos.write(buf, 0, readCount);
			bos.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (fis != null)
					fis.close();
				if (bos != null)
					bos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

%>
</body>
</html>
