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

	//웹어플리케이션 Root Path, ex)/webapp/myapp
	String appPath = request.getRealPath("/").replaceAll("\\\\", "/");
	if( appPath.lastIndexOf("/") == (appPath.length() - 1) ) {
		appPath = appPath.substring(0, appPath.lastIndexOf("/"));
	}

	//UI에서 호출될 때 필요한 정보
	String file = StrUtil.encrypt64(StrUtil.nvl(request.getParameter("file"), "ubi_sample.jrf"));
	String arg = StrUtil.encrypt64(StrUtil.nvl(request.getParameter("arg"), "user#홍길동#company#유비디시전#"),"EUC-KR");

	//환경에 맞게 설정해야함
	String rootUrl = StrUtil.encrypt64(appUrl);
	String serverUrl = StrUtil.encrypt64(appUrl + "/UbiServer");
	String fileUrl = StrUtil.encrypt64(appUrl + "/ubi4/resource");
	String jrfDir = StrUtil.encrypt64(appUrl + "/ubi4/work/");
	String datasource = StrUtil.encrypt64("Tutorial");
	//String datasource = StrUtil.encrypt64("데이터셋명#\"값^t^n\"", "EUC-KR");
/*
	System.out.println("[appUrl] " + appUrl);
	System.out.println("[appPath] " + appPath);
	System.out.println("[file] " + file);
	System.out.println("[arg] " + arg);
*/
	out.clearBuffer();
%>
<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>UbiReport4 AXViewer</title>
<script src='./js/ubinonax.js'></script>
<script src='./js/msg.js'></script>
<script language='javascript'>
<!--
	//console.log('UbiJS_IsIE===' + UbiJS_IsIE);
	/* URL 정보 */
	var appUrl = '<%= appUrl %>';

	/* Viewer Param */
	var pRootUrl = '<%= rootUrl %>';
	var pFileUrl = '<%= fileUrl %>';
	var pServerUrl = '<%= serverUrl %>';
	var pScale = '-9999';	//60~300,-9998(폭맞춤),-9999(쪽맞춤)
	var pToolbar = 'true';
	var pProgress = 'true';
	var pExecType = 'TYPE4';
	var pIsEncrypt = 'true';

	/* Modify for your environment */
	var pDataSource = '<%= datasource %>';
	var pJrfDir = '<%= jrfDir %>';	// 파일경로
	var pFile = '<%= file %>';		// 파일명
	var pArg = '<%= arg %>';		// 아규먼트

	var pCodebase = appUrl + '/ubi4/ubiviewer/UbiViewerX4.cab#version=4,0,2106,401';

	/* Viewer Size Adjustment */
	var wGap = 8;
	var hGap = 8;

	/* IE 전용 함수 */
	function getArg() {
		return pArg;
	}

	/* IE 전용 함수 */
	function finishLoad() {
		console.log('finishLoad===');
	}

	/* IE 전용 함수 */
	function Ubi_Resize() {
		if( UbiJS_IsIE ) {
			var w = ((self.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth)) - wGap;
			var h = ((self.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight)) - hGap;
			document.getElementById("UbiViewerX").width = w + 'px';
			document.getElementById("UbiViewerX").height = h + 'px';
		}
	}

	/* IE 전용 함수 */
	function Ubi_AXViewerInit() {
		var w = ((self.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth)) - wGap;
		var h = ((self.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight)) - hGap;
		document.write("<object id='UbiViewerX' classid='CLSID:9BE79626-84B2-489D-BBFC-8492339AF9C2' codebase='" + pCodebase + "' width='" + w + "px' height='" + h + "px'>");
		document.write("	<param name='servletRootURL'	value='" + pRootUrl + "'>");
		document.write("	<param name='fileURL'			value='" + pFileUrl + "'>");
		document.write("	<param name='UbiServerURL'		value='" + pServerUrl + "'>");
		document.write("	<param name='dataSource'		value='" + pDataSource + "'>");
		document.write("	<param name='jrfFileDir'		value='" + pJrfDir + "'>");
		document.write("	<param name='jrfFileName'		value='" + pFile + "'>");
		document.write("	<param name='scale'				value='" + pScale + "'>");
		document.write("	<param name='toolbar'			value='" + pToolbar + "'>");
		document.write("	<param name='progress'			value='" + pProgress + "'>");
		document.write("	<param name='execType'			value='" + pExecType + "'>");
		document.write("	<param name='isEncrypt64'		value='" + pIsEncrypt + "'>");
		document.write("	<param name='resource'			value='fixed'>");
		document.write("	<param name='isLocalFile'		value='true'>");
		document.write("</object>");
	}

	/* 웹소켓 뷰어 */
	var wsViewer = null;
	var wsViewerWidth = 900;
	var wsViewerHeight = screen.height - 200;
	var wsViewerLeft = (screen.width - wsViewerWidth)/2;
	var wsViewerTop = (screen.height - wsViewerHeight)/2;

	/* Non-IE 전용 함수 */
	function Ubi_WSViewerInit() {

		InitWebSocket(ShowReport);
	}

	/* Non-IE 전용 함수 */
	function ShowReport(ws) {
		
		wsViewer = new UbiWSViewer(ws);

		wsViewer.ubiserverurl = pServerUrl;
		wsViewer.servletrooturl = pRootUrl;
		wsViewer.fileurl = pFileUrl;
		wsViewer.isencrypt64 = pIsEncrypt;
		wsViewer.resource = 'fixed';
		wsViewer.scale = pScale;
		wsViewer.toolbar = pToolbar;
		wsViewer.progress = pProgress;
		wsViewer.datasource = pDataSource;
		wsViewer.jrffiledir = pJrfDir;
		wsViewer.jrffilename = pFile;
		wsViewer.arg = pArg;
		wsViewer.islocalfile = 'true';
		wsViewer.setResize(wsViewerLeft, wsViewerTop, wsViewerWidth, wsViewerHeight);	// setResize('max');, setResize('hide');
		wsViewer.retrieve();
	}

	/* Non-IE 전용 함수 */
	function RetrieveEnd() {
		console.log('RetrieveEnd===');
	}

	/* Non-IE 전용 함수 */
	function PrintEnd(status) {
		console.log('PrintEnd===' + status);
	}
	
	/* Non-IE 전용 함수 */
	function ExportEnd(filePath) {
		console.log('ExportEnd===' + filePath);
	}
	
	/* Non-IE 전용 함수 */
	function Ubi_Version() {
		//wsViewer.aboutBox();
	}
	
//-->
</script>
<script language="javascript" for="UbiViewerX" event="PrintEnd()">
<!--
	console.log('PrintEnd Status : ' + UbiViewerX.getPrintStatus());
//-->
</script>
<script language="javascript" for="UbiViewerX" event="ExportEnd()">
<!--
	console.log('ExportEnd filePath : ' + UbiViewerX.getVariable("exportFilePath"));
//-->
</script>
</head>
<body style='margin:3px' onresize="Ubi_Resize()">
<script type="text/javascript">
<!--
	if( UbiJS_IsIE )
		Ubi_AXViewerInit();
	else
		Ubi_WSViewerInit();
//-->
</script>
</body>
</html>
