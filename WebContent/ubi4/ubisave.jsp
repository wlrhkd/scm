<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ page import="java.io.File, java.text.SimpleDateFormat" %>
<%@ page import="com.ubireport.eform.UbiEformData, com.ubireport.common.util.StrUtil" %>
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

	boolean useLog = false;
	String NL = System.getProperty("line.separator");
	String TODAY = (new SimpleDateFormat("yyyyMMdd")).format(System.currentTimeMillis());

	//웹어플리케이션명
	String appName = StrUtil.nvl(request.getContextPath(), "");
	if( appName.indexOf("/") == 0 ) {
		appName = appName.substring(1, appName.length());
	}	

	//웹어플리케이션 Root URL, ex)http://localhost:8080/myapp
	String appUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + ((appName.length() == 0)?"":"/") + appName;

	String serverUrl = appUrl + "/UbiServer";
	String appPath = request.getRealPath("/");
	appPath = appPath.replaceAll("\\\\", "/");

	if( appPath.lastIndexOf("/") == (appPath.length() - 1) ) {
		appPath = appPath.substring(0, appPath.lastIndexOf("/"));
	}
		
	String savePath = appPath + "/ubi4/storage/" + TODAY;
	String saveFileName = "ubieform_" + System.currentTimeMillis() + ".pdf";
	String saveFullPath = savePath + "/" + saveFileName;

	/* 설정 정보 */
	StringBuffer log = new StringBuffer();
	log.append("---------------------------------------------").append(NL);
	log.append("[ Setting Info]").append(NL);
	log.append("---------------------------------------------").append(NL);
	log.append("* App URL : " + appUrl).append(NL);
	log.append("* UbiServer URL : " + serverUrl).append(NL);
	log.append("* App Path : " + appPath).append(NL);
	log.append("* Save Path : " + savePath).append(NL);
	log.append("* Save File Name : " + saveFileName).append(NL);
	log.append("* Save Full Path : " + saveFullPath).append(NL);

	if( useLog )
		System.out.println(log.toString());
	log.delete(0, log.length());
	
	UbiEformData ubiEformData = null;
	try {

		ubiEformData = new UbiEformData(request, response);
		
		File fSavePath = new File(savePath);
		if( !fSavePath.exists() )
			fSavePath.mkdir();

		int i = 0;
		/* 아규먼트 정보 : ubiencrypt=true인 경우 아규먼트 정보처리가 안됨. 수정 필요*/
		log.append("---------------------------------------------").append(NL);
		log.append("[ Argument Info]").append(NL);
		log.append("---------------------------------------------").append(NL);
		String[] argNames = ubiEformData.getArgumentNames();
		if (argNames != null) {
			for (i = 0; i < argNames.length; i++) {
				log.append(argNames[i] + " = " + ubiEformData.getArgument(argNames[i])).append(NL);
			}
		}
		log.append(NL);
		
		/* 사용자 입력 정보 */
		log.append("---------------------------------------------").append(NL);
		log.append("[ Input Info ]").append(NL);
		log.append("---------------------------------------------").append(NL);
		String[] columnNames = ubiEformData.getParameterNames();
		if (columnNames != null) {
			for (i = 0; i < columnNames.length; i++) {
				log.append(columnNames[i] + " = " + ubiEformData.getParameter(columnNames[i])).append(NL);
			}
		}

		if( useLog )
			System.out.println(log.toString());
		log.delete(0, log.length());

		// 파일 생성
		boolean saveResult = ubiEformData.saveFile(UbiEformData.PDF, saveFullPath);

		/* 파일 저장 결과 정보 */
		log.append("---------------------------------------------").append(NL);
		log.append("[ File Save Result : " + (saveResult?"Success!":"Fail!") + " ]").append(NL);
		log.append("---------------------------------------------").append(NL);

		System.out.println(log.toString());
		log.delete(0, log.length());
		
		out.clearBuffer();
		
		if( saveResult ) {
			ubiEformData.sendSuccess(out, "FILENAME#" + saveFullPath);
		}
		else {
			ubiEformData.sendError(out, "파일 저장 오류");
		}
	}
	catch (Exception e) {
		e.printStackTrace();
		try {
			if (ubiEformData != null) {
				ubiEformData.sendError(out, e.getMessage());
			}
		} catch (Exception ex) {}
	}
%>
