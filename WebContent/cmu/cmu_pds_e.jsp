<%--
	Document : 자료실
	작성자 : jhlee
	작성일자 : 2021-09-29
 --%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="../comm/jsp/session.jsp" />
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>자료실</title>
	<!-- 공통 사용부분 -->
	<link rel="stylesheet" type="text/css" href="../comm/css/reset.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/common.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/swiper.min.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/jquery.mCustomScrollbar.css">
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/sub.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/style.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/zTreeStyle.css" />
	<link rel="stylesheet" type="text/css" href="../comm/popup/comm_vndmst_f.css">
	<link rel="stylesheet" type="text/css" href="../comm/popup/comm_login_f.css">
	
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
	<!-- 파일 업로드 -->
    <script type="text/javascript" src="../comm/popup/file_pop.js"></script>
    <link rel="stylesheet" type="text/css" href="../comm/popup/file_pop.css">
	<!--  SweetAlert -->
    <link rel="stylesheet" type="text/css" href="../comm/css/sweetalert2.min.css" />
    <script type="text/javascript" src="../comm/js/sweetalert2.min.js"></script>
	
	<!-- 공통 사용부분 끝 -->
	<link rel="stylesheet" type="text/css" href="cmu_pds_e.css">
	<script type="text/javascript" src="./cmu_pds_e.js"></script>
	<script type="text/javascript" src="../comm/popup/comm_vndmst_f.js"></script>
	<script type="text/javascript" src="../comm/popup/comm_login_f.js"></script>
	<script type="text/javascript" src="../comm/popup/comm_itemas_f.js"></script>
	<link rel="stylesheet" type="text/css" href="../comm/popup/comm_itemas_f.css">
    <script type="text/javascript" src="../comm/popup/comm_favorite_f.js"></script>
    <script type="text/javascript" src="../comm/jsp/comm_favorite.js"></script>
	<script type="text/javascript" src="../comm/js/comm_menuList.js"></script>
</head>
<body>
	<div id="wrap">
		<!-- 사이트메뉴 시작 -->
		<jsp:include page="../comm/jsp/comm_menuList.jsp" />
		<!-- 사이트메뉴 끝 -->

		<!-- 메인부분 -->
		<main class="content-wrap">
			<!-- 헤더 시작 -->
			<jsp:include page="../comm/jsp/comm_header.jsp" />
			<!-- 헤더 끝 -->
			<div class="contents">
				<div class="sheet-wrap">
					<div class="inner">
						<!-- 타이틀 및 버튼 영역 시작 -->
						<div class="sub-header">
							<h2 class="title">
								<span>자료실 </span>
							</h2>
							<div class="btn-group">
								<jsp:include page="../comm/jsp/comm_btnGroup.jsp" />
							</div>
						</div>
						<!-- 타이틀 및 버튼 영역 끝 -->
						<!-- 조회조건 영역 시작 -->
						<div class="sheet-box">
							<div class="row">
								<label class="key label" for="sel_date">기간</label>
                                <select id="sel_date" class="wt150">
                                	<option value="0" id="">전체보기</option>
                                	<option value="1" id="" selected="selected">1개월</option>
                                	<option value="2" id="">2개월</option>
                                	<option value="3" id="">3개월</option>
                                	<option value="4" id="">4개월</option>
                                	<option value="5" id="">5개월</option>
                                	<option value="6" id="">6개월</option>
                                	<option value="7" id="">7개월</option>
                                	<option value="8" id="">8개월</option>
                                	<option value="9" id="">9개월</option>
                                	<option value="10" id="">10개월</option>
                                	<option value="11" id="">11개월</option>
                                	<option value="12" id="">12개월</option>
                                </select>
								<label class="key label" for="">거래처</label>
								<input type="text" class="wt80" name="cvcod" id="txt_cvcod">
								<input type="text" class="wt150" name="cvcod" id="txt_cvnas" readonly>
								<button id="btn_vndmstModal" class="btn h34 gray non-txt g_search_icon" onclick="modalObj.modalOpenFunc('oVndmstModal')"></button>
							</div>
							<!-- 조회조건 영역 끝 -->
							<!-- 테이블 영역 시작-->
							<div class="form-block table-box-wrap type02 table-row">
								<div class="table-scroll basic-scroll">
									<div class="container-fluid">
										<table class="table-type02 color02 table-type02-n"
											id="tbl_wrap">
											<caption>자료실 테이블입니다.</caption>
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
							<!-- 상세 정보 영역 시작-->
							<div class="form-block right-row" id="wrapHead">
								<div class="mb14">
									<label class="label key wtp10" for="pds_nb">번호</label> 
									<input type="text" class="center wtp19" name="pds_nb" id="txt_pno" readonly>
								</div>
								
								<div class="mb14">
									<label class="label key wtp10" for="pds_tit">제목</label> 
									<input type="text" class="center wtp40" name="pds_tit" id="txt_subject" placeholder="제목을 입력하십시오.">
								</div>
								
								<div class="mb14">
									<label class="label key wtp10" for="pds_tit">작성자</label> 
									<input type="text" class="center wtp15" name="pds_tit" id="txt_chg_id" readonly>
									<input type="text" class="center wtp30" name="pds_tit" id="txt_chg_name" readonly>
								</div>
								
								<div class="mb14">
									<label class="label key wtp10" for="pds_tit">작성일자</label> 
									<input type="text" class="center wtp" name="pds_tit" id="txt_cre_dt" readonly>
								</div>
								
								<div class="mb14">
									<label class="label key wtp10" for="gubun">수신처</label>
									<input type="text" class="center wtp15" name="pds_chg_ids" id="txt_chg_id_s">
									<input type="text" class="center wtp30" name="pds_chg_name_s" id="txt_chg_name_s" readonly>
									<button id="btn_loginModal" class="btn h34 gray non-txt g_search_icon" onclick="modalObj.modalOpenFunc('oLoginModal')"></button>
									<input type="text" class="hidden center wtp30" name="pds_tit" id="txt_userid">
								</div>
								<div class="mb14">
									<label class="label key">첨부파일</label>
									    <input type="text" class="key label pdl10 wtp15" name="" id="txt_file2" onclick="downloadFile2()">
										<button class="btn blue-noline fchose2" id="fchose2">파일선택</button>
										<button class="btn blue-noline fdelete" onclick="fileDelete2()">파일삭제</button>
								</div>
								<div class="mb14">
									<label class="label mlp1" for="gubun">내용</label> 
									<textarea id="txt_content"></textarea>
								</div>
							</div>
							<!-- 상세 정보 영역 끝 -->
							<!-- 페이지 네비게이션 시작 -->
							<div class="paginate" id="oPaginate">
							
							</div>
							<!-- 페이지 네비게이션 끝 -->
						</div>
					</div>
				</div>
			</div>
			<!-- footer 시작 -->
			<jsp:include page="../comm/jsp/comm_footer.jsp" />
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
			<jsp:include page="../comm/popup/comm_vndmst_f.jsp" />
		</div>
		<!-- 업체 팝업 끝 -->
		<!-- 수신처 팝업 시작 -->
		<div id="oLoginModal" class="modal-layer w620">
			<jsp:include page="../comm/popup/comm_login_f.jsp" />
		</div>
		<!-- 업체 팝업 끝 -->
		<!-- 거래처 팝업 시작 -->
		<div id="oItemasModal" class="modal-layer w620">
			<jsp:include page="../comm/popup/comm_itemas_f.jsp" />
		</div>
		<!-- 거래처 팝업 끝 -->
		<!-- 즐겨찾기 팝업 시작 -->
       	<div id="oFavoriteModal" class="modal-layer w620">
       		<jsp:include page="../comm/popup/comm_favorite_f.jsp"/>
       	</div>
        <!-- 즐겨찾기 팝업 끝-->
        <!-- 파일 업로드 -->
		<div id="oFileModal" class="modal-layerf w620">
        	<jsp:include page="../comm/popup/file_pop_pds.jsp"/>
        </div>
		<!-- 알림창 시작 -->
		<!-- 알림창의 메시지는 js에서 직접 작성 -->
		<div id="oCheckModal" class="modal-layer w310">
			<div class="modal-message">
				<p class="message alert" id="oCheckMessage"></p>
				<div class="btn-line center">
					<button class="btn h32 blue-noline cbtn">확인</button>
				</div>
			</div>
		</div>
		<!-- 알림창 끝 -->
	</div>
</body>
</html>