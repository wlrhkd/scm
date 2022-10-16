<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ page import="com.ubireport.common.util.StrUtil" %>
<%
	// 보안을 위해 설치 후 임시로 false로 변경해서 결과 확인 후 소스 배포 시 무조건 true로 변경해야함
	boolean refererCheck = false;
	String referer = StrUtil.nvl(request.getHeader("referer"), "");	// REFERER 가져오기
	if( refererCheck && (referer.equals("") || referer.indexOf(request.getServerName()) == -1) ) { 	// REFERER 체크(브라우저에서 직접 호출 방지)
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

	//UI에서 호출될 때 필요한 정보
// 	String fileName = request.getParameter("fileName");
// 	String ret = request.getParameter("arg");
	
/********************************************************/
// 	String file = StrUtil.nvl(request.getParameter("file"), "file");
//  String arg = StrUtil.encrypt64(StrUtil.nvl(request.getParameter("arg"), "ARG_JPNO#arg#"),"UTF-8");
// 	String arg = StrUtil.encrypt64(StrUtil.nvl(request.getParameter("arg"), "ARG_JPNO#arg#"),"UTF-8");
// 	String resid = StrUtil.nvl(request.getParameter("resid"), "UBIHTML");
/********************************************************/
	
	String fileName = request.getParameter("file");
	String ret = request.getParameter("arg");
	
	System.out.println("[ret] " + ret);
	System.out.println("[fileName] " + fileName);

	String file = StrUtil.nvl(request.getParameter("file"), fileName);
	String arg = StrUtil.encrypt64(StrUtil.nvl(request.getParameter("arg"), ret),"UTF-8");
	String resid = StrUtil.nvl(request.getParameter("resid"), "UBIHTML");	

/*
	System.out.println("[appUrl] " + appUrl);
	System.out.println("[file] " + file);
	System.out.println("[arg] " + arg);
	System.out.println("[resid] " + resid);
*/
	out.clearBuffer();
%>
<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.5,user-scalable=yes">
<title>UbiReport Viewer</title>
<link rel="stylesheet" type="text/css" href="./css/ubieform.css" />
<!--[if IE]><script src='./js/ubiexcanvas.js'></script><![endif]-->
<script src='../ubi4/js/ubicommon.js'></script>
<script src='../ubi4/js/ubihtml.js'></script>
<script src='../ubi4/js/msg.js'></script>
<script src='../ubi4/js/ubinonax.js'></script>
<script src='../ubi4/js/ubieform.js'></script>

<script language='javascript'>
<!--
var ubiHtmlViewer = null;
var ubiParams = {
	 "key": "<%= session.getId() %>" 
	,"ubiserverurl": "<%= appUrl %>/UbiServer"
//	,"saveurl": "<%= appUrl %>/ubi4/ubisave.jsp"
	,"resource": "<%= appUrl %>/ubi4/js"
	,"scale": "100"
	,"jrffile": "<%= file %>"
	,"arg": "<%= arg %>"
	,"resid": "<%= resid %>"
	,"isencrypt64" : "true"
};
var ubiEvents ={
	 "reportevent.previewend": ubiReportPreviwEnd
	,"reportevent.printend": ubiReportPrintEnd
	,"reportevent.exportend": ubiReportExportEnd
//	,"reportevent.printClicked": ubiReportPrintClicked
//	,"reportevent.exportClicked": ubiReportExportClicked
//	,"eformevent.previewend": ubiEformPreviewEnd
//	,"eformevent.saveend": ubiEformSaveEnd
};


function ubiStart() {
	ubiHtmlViewer = UbiLoad(ubiParams, ubiEvents);
	try { /*ubiHtmlViewer.setUserSaveList('Image,Pdf,Docx,Xls,Pptx,Hml,Cell');*/ }catch(e){}
	try { /*ubiHtmlViewer.setUserPrintList('Html')*/; }catch(e){}
	try { /*ubiHtmlViewer.setVisibleToolbar('INFO', false);*/ }catch(e){}
	try { /*ubiHtmlViewer.setVisibleToolbar("SAVE", false);*/ }catch(e){}
}

function ubiReportPreviwEnd() {
	//console.log('ubiPreviwEnd......');
}

function ubiReportPrintEnd() {
	//console.log('ubiReportPrintEnd......');
}

function ubiReportExportEnd() {
	//console.log('ubiExportEnd......');
}

function ubiReportPrintClicked() {
	//console.log('ubiReportPrintClicked......');
}

function ubiReportExportClicked() {
	//console.log('ubiReportExportClicked......');
}

function ubiEformSaveEnd() {
	//console.log('ubiEformSaveEnd......');
}

function ubiEformPreviewEnd() {
	//console.log('ubiEformPreviewEnd......');
};

function ubiEformSaveEnd(file) {
	//console.log('ubiEformSaveEnd......' + file);
};

//-->
</script>
</head>
<body onload='ubiStart()'>
</body>
</html>
