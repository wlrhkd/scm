<%-- 
    Document   : 프로그램 등록
    Created on : 2021. 10. 12
    Author     : 김준형
--%>
<%@page import="java.io.PrintWriter"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../comm/jsp/session.jsp"/>   
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>프로그램 등록</title>
    <!-- 공통 사용부분 -->
    <link rel="stylesheet" type="text/css" href="../comm/css/reset.css" />
    <link rel="stylesheet" type="text/css" href="../comm/css/common.css" />
    <link rel="stylesheet" type="text/css" href="../comm/css/swiper.min.css" />    
    <link rel="stylesheet" type="text/css" href="../comm/css/jquery.mCustomScrollbar.css">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css"/>
    <link rel="stylesheet" type="text/css" href="../comm/css/sub.css" />
    <link rel="stylesheet" type="text/css" href="../comm/css/style.css" />
    <link rel="stylesheet" type="text/css" href="../comm/css/zTreeStyle.css" />
    <link rel="stylesheet" type="text/css" href="../comm/popup/comm_vndmst_f.css">
	 <!--  SweetAlert -->
    <link rel="stylesheet" type="text/css" href="../comm/css/sweetalert2.min.css" />
    <script type="text/javascript" src="../comm/js/sweetalert2.min.js"></script>

    <script type="text/javascript" src="../comm/js/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="../comm/js/swiper.min.js"></script>
    <script type="text/javascript" src="../comm/js/jquery.mCustomScrollbar.concat.min.js"></script>
    <script type="text/javascript" src="../comm/js/jquery.ztree.core.js"></script>
    <script type="text/javascript" src="../comm/js/main.js"></script>
    <script type="text/javascript" src="../comm/js/common.js"></script>
    <script src="http://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/i18n/datepicker-ko.js"></script>
    <script type="text/javascript" src="../comm/js/defineArea.js"></script>
    <script type="text/javascript" src="../comm/js/localStorage.js"></script>
    <script type="text/javascript" src="../comm/js/comm_main.js"></script>
    <!-- 공통 사용부분 끝 -->
    <link rel="stylesheet" type="text/css" href="sys_menupage_e.css">
    <script type="text/javascript" src="./sys_menupage_e.js"></script>
    <script type="text/javascript" src="../comm/popup/comm_vndmst_f.js"></script>        
    <script type="text/javascript" src="../comm/popup/comm_favorite_f.js"></script>
    <script type="text/javascript" src="../comm/jsp/comm_favorite.js"></script>
    <script type="text/javascript" src="../comm/js/comm_menuList.js"></script>
    <!--  SweetAlert -->
    <link rel="stylesheet" type="text/css" href="../comm/css/sweetalert2.min.css" />
    <script type="text/javascript" src="../comm/js/sweetalert2.min.js"></script>
</head>
<body>
 
    <div id="wrap">
	<!-- 사이트메뉴 시작 -->
	<jsp:include page="../comm/jsp/comm_menuList.jsp"/>
	<!-- 사이트메뉴 끝 -->
	
		<!--메인부분-->
        <main class="content-wrap">
			<!-- 헤더 시작 -->
            <jsp:include page="../comm/jsp/comm_header.jsp"/>
            <!-- 헤더 끝 -->
			<!-- Button Area -->
            <div class="contents">
                <div class="sheet-wrap">
                    <div class="inner">
                    	<!-- 타이틀 및 버튼 영역 시작 -->
                        <div class="sub-header">
                            <h2 class="title"><span> 프로그램 등록 </span></h2>
                            <div class="btn-group">
                                <jsp:include page="../comm/jsp/comm_btnGroup.jsp"/>                 
                            </div>
                        </div>
                        <div class="sheet-box">
                            <!-- 테이블 영역 시작-->  
                            <div class="table-box-wrap type02">
                                <div class="table-scroll basic-scroll">
                                    <div   class="container-fluid" >                                    
                                    <table class="table-type02 color02" id="tbl_wrap">
                                        <caption> 프로그램 등록표입니다.</caption>
                                        <thead id="tbl_head">
                                        	
                                        </thead>
                                        <tbody id="tbl_body">
                                        
                                        </tbody>
                                        <!-- <tfoot>
                                        </tfoot> -->
                                    </table>
                                    </div>
                                </div>
                            </div>
                            <!-- 테이블 영역 끝-->
                            <!-- 상세정보 영역 시작 -->
                            <div class="right_area">
								<p>프로그램</p>
								<ul class="right_radio_box">
									<li>
										<input class="btn_radio" id="rdo_io_gubun" name="btn_radio_m" type="radio" value="E" checked>
										<span>입력, 저장</span>
									</li>
									<li>
										<input class="btn_radio" id="rdo_io_gubun" name="btn_radio_m" type="radio" value="R">
										<span>조회, 출력</span>
									</li>
									<li>
										<input class="btn_radio" id="rdo_io_gubun" name="btn_radio_m" type="radio" value="Q">
										<span>조회</span>
									</li>
									<li>
										<input class="btn_radio" id="rdo_io_gubun" name="btn_radio_m" type="radio" value="T">
										<span>대분류 MENU</span>
									</li>
									<li>
										<input class="btn_radio" id="rdo_io_gubun" name="btn_radio_m" type="radio" value="A">
										<span>중분류 MENU</span>
									</li>
								</ul>
								<ul class="right_detail_box">
									<li>
										<label class="key">대분류</label>
										<input type="text" id="txt_main_id" >
										<button id="btn_vndmstModal" class="btn h34 gray non-txt g_search_icon" onclick="modalObj.modalOpenFunc('oVndmstModal')"></button>
									</li>
									<li>
										<label class="key">중분류</label>
										<input type="text" id="txt_sub1_id" >
										<button id="btn_vndmstModal" class="btn h34 gray non-txt g_search_icon" onclick="modalObj.modalOpenFunc('oVndmstModal')"></button>
									</li>
									<li>
										<label class="key">소분류</label>
										<input type="text" id="txt_sub2_id" >
										<button id="btn_vndmstModal" class="btn h34 gray non-txt g_search_icon" onclick="modalObj.modalOpenFunc('oVndmstModal')"></button>
									</li>
									<li>
										<label class="key">Page 명</label>
										<input type="text" id="txt_sub2_name" >
									</li>
									<li>
										<label class="key">Page ID</label>
										<input type="text" id="txt_window_name" >
									</li>
									<li>
										<label>Page Url</label>
										<input type="text" id="txt_page_url" >
									</li>
									<li>
										<label class="key">구분조정</label>
										<input class="btn_radio" id="rdo_io_gubun2" name="btn_radio_m2" type="radio" value="E" checked> <span>입력,저장</span>
										<input class="btn_radio" id="rdo_io_gubun2" name="btn_radio_m2" type="radio" value="R" > <span>조회,출력</span>
										<input class="btn_radio" id="rdo_io_gubun2" name="btn_radio_m2" type="radio" value="Q" > <span>조회</span>
										<input class="btn_radio" id="rdo_io_gubun2" name="btn_radio_m2" type="radio" value="A" > <span>중분류</span>
										<input class="btn_radio" id="rdo_io_gubun2" name="btn_radio_m2" type="radio" value="T" > <span>대분류</span>
									</li>
									<li>
										<label>프로그램 설명</label>
										<input type="text" id="txt_rmks" >
									</li>
									<li>
										<input type="text" class="hidden" id="txt_old_gubun" >
									</li>
								</ul>
                            </div>
                            <!-- 상세정보 영역 끝 -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- footer 시작 -->
			<jsp:include page="../comm/jsp/comm_footer.jsp"/>
            <!-- footer 끝 -->
			<!-- 즐겨찾기 시작 -->
			<jsp:include page="../comm/jsp/comm_favorite.jsp"/>		
            <!-- 즐겨찾기 끝 -->
        </main>
    </div>

    
    <!--모달처리--> 
    <div class="modal-layer-wrap">
        <!-- 업체 팝업 시작 -->
        <div id="oVndmstModal" class="modal-layer w620">
			<jsp:include page="../comm/popup/comm_vndmst_f.jsp"/>
        </div>        
        <!-- 업체 팝업 끝 -->	
		<!-- 거래처 팝업 시작 -->
        <div id="oItemasModal" class="modal-layer w620">
			<jsp:include page="../comm/popup/comm_itemas_f.jsp"/>
        </div>        
        <!-- 거래처 팝업 끝 -->
		<!-- 즐겨찾기 팝업 시작 -->
       	<div id="oFavoriteModal" class="modal-layer w620">
       		<jsp:include page="../comm/popup/comm_favorite_f.jsp"/>
       	</div>
        <!-- 즐겨찾기 팝업 끝-->
		<!-- 알림창 시작 -->
		<!-- 알림창의 메시지는 js에서 직접 작성 -->
        <div id="oCheckModal" class="modal-layer w310">            
            <div class="modal-message">
                <p class="message alert" id="oCheckMessage" ></p>
                <div class="btn-line center">                    
                    <button class="btn h32 blue-noline cbtn">확인</button>
                </div>
            </div>
        </div>
        <!-- 알림창 끝 --> 
    </div>
</body>
</html>