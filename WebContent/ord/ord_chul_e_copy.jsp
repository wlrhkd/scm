<%--
	Document : 출발 처리
	작성자 : dykim
	작성일자 : 2021-03-02
 --%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>출발처리</title>
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

    <script type="text/javascript" src="../comm/js/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="../comm/js/swiper.min.js"></script>
    <script type="text/javascript" src="../comm/js/jquery.mCustomScrollbar.concat.min.js"></script>
    <script type="text/javascript" src="../comm/js/jquery.ztree.core.js"></script>
    <script type="text/javascript" src="../comm/js/main.js"></script>
    <script type="text/javascript" src="../comm/js/common.js"></script>
    <script src="http://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/i18n/datepicker-ko.js"></script>
    <!-- 공통 사용부분 끝 -->
    <link rel="stylesheet" type="text/css" href="ord_chul_e.css">
    <script type="text/javascript" src="ord_chul_e.js"></script>
    <script type="text/javascript" src="../comm/popup/comm_vndmst_f.js"></script>
        
</head>
<body>
    <div id="wrap">
	<!-- 사이트메뉴 시작 -->
	<jsp:include page="../comm/jsp/comm_menuList.jsp"/>
	<!-- 사이트메뉴 끝 -->

		<!-- 메인부분 -->
        <main class="content-wrap">
			<!-- 헤더 시작 -->
            <jsp:include page="../comm/jsp/comm_header.jsp"/>
            <!-- 헤더 끝 -->
            <div class="contents">
                <div class="sheet-wrap">
                    <div class="inner">
                        <!-- 타이틀 및 버튼 영역 시작 -->
                        <div class="sub-header">
                            <h2 class="title"><span>출발처리 </span></h2>
                            <div class="btn-group">
                                <button class="btn white w_search_icon" id="btn_search">조회</button>
                                <button class="btn white w_save_icon"   id="btn_save">저장</button>
                                <button class="btn white w_insert_icon" style="display:none;">삽입</button>
                                <button class="btn white w_modify_icon" style="display:none;">수정</button>
                                <button class="btn white w_delete_icon" id="btn_delete">삭제</button>
                                <button class="btn white w_add_icon" style="display:none;">추가</button>
                                <button class="btn white w_cancel_icon">취소</button>
                                <button class="btn white w_print_icon" style="display:none;">인쇄</button>
                                <button class="btn white w_help_icon">도움</button>
                                <button class="btn white w_excel_icon" id="btn_excel" style="display:none;">Excel</button>                                   
                            </div>                                              
                        </div>
                        <!-- 타이틀 및 버튼 영역 끝 -->
                        <div class="sheet-box">
                            <!-- 조회조건 영역 시작 -->
                            <div class="form-block" id="wrapHead">
                                <div class="row">               
                                    <div class="radio ml20">
                                        <input type="radio" name="gubun" id="rbt_gubunI" value="I" checked>
                                        <label for="radio01">처리</label>
                                        <i></i>
                                    </div>
                                    
                                    <div class="radio">
                                        <input type="radio" name="gubun" value="D" id="rbt_gubunD">
                                        <label for="radio02">취소</label>
                                        <i></i>
                                    </div>        

                                    <label class="label key" for="fromDate">출발일</label>
                                    <div class="cal-input">
                                        <input type="text" class="bg-gray" name="fromDate" id="txt_fromDate" style="width:130px;">
                                    </div>
                                    <span class="period">~</span> 
                                    <div class="cal-input">
                                        <input type="text" class="bg-gray" name="toDate" id="txt_toDate" style="width:130px;" >
                                    </div>


                                    <label class="label" for="cvcod">업체</label>
                                    <input type="text" class="bg-gray" name="cvcod" id="txt_cvcod" placeholder="" style="width:80px;">
                                    <input type="text" name="cvnas" id="txt_cvnas" style="width:150px;">
                                    <button id="btn_vndmstModal" class="btn h34 gray non-txt g_search_icon" onclick="modalObj.modalOpenFunc('oVndmstModal')"></button>

                                    <label class="label" for="saupj">사업장</label>
                                    <select id="sel_saupj" style="width:150px;">
                                    </select>
                                </div>
                                <div class="row">          
                                    <label class="label" for="itnbr">품번</label>
                                    <input type="text" class="bg-gray" name="itnbr" id="txt_itnbr" placeholder="" style="width:80px;">
                                    <input type="text" name="Itdsc" id="txt_itdsc" style="width:150px;">
                                    <button id="btn_itemasModal" class="btn h34 gray non-txt g_search_icon" onclick="modalObj.modalOpenFunc('oItemasModal')"></button>
                                    
                                    <label class="label" for="ittyp">품목구분</label>
                                    <select id="sel_ittyp" style="width:150px;">

                                    </select>                                    
                                </div>
                            </div>
                            <!-- 조회조건 영역 끝 -->
                            <!-- 테이블 영역 시작-->  
                            <div class="table-box-wrap type02">
                                <div class="table-scroll basic-scroll">
                                    <div   class="container-fluid" >                                    
                                    <table class="table-type02" id="tbl_wrap">
                                        <caption>출발처리 구분,발주번호,품번,품명,규격 항목별 순서대로 안내하는 표입니다</caption>
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
                            <!-- 페이지 네비게이션 시작 -->
                            <div class="paginate"  id="paginate">

                            </div>
                            <!-- 페이지 네비게이션 끝 -->
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