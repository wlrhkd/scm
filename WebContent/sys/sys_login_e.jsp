<%--
	Document : 사용자등록
	작성자 : 김준형
	작성일자 : 2021-08-31
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
	<title>사용자등록</title>
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
	<link rel="stylesheet" type="text/css" href="sys_login_e.css">
	<script type="text/javascript" src="./sys_login_e.js"></script>
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
								<span>사용자등록 </span>
							</h2>
							<div class="btn-group">
								<jsp:include page="../comm/jsp/comm_btnGroup.jsp" />
							</div>
						</div>
						<!-- 타이틀 및 버튼 영역 끝 -->
						<div class="sheet-box">
						<!-- 조회조건 영역 시작 -->
							<div class="row">
								<label class="label" for="chg_id_f">사용자ID</label> <input
									type="text" class="wt80 ml28" name="chg_id_f"
									id="txt_chg_id_f" placeholder=""> <input type="text"
									name="chg_name_f" id="txt_chg_name_f" class="bg-gray wt130" readonly>
								<button id="btn_vndmstModal"
									class="btn h34 gray non-txt g_search_icon"
									onclick="modalObj.modalOpenFunc('oVndmstModal')"></button>
							</div>
							<!-- 조회조건 영역 끝 -->
							<!-- 테이블 영역 시작-->
							<div class="form-block table-box-wrap type02 table-row">
								<div class="table-scroll basic-scroll">
									<div class="container-fluid">
										<table class="table-type02 color02 table-type02-n"
											id="tbl_wrap">
											<caption>사용자등록 메뉴 테이블입니다.</caption>
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
									<label class="label key" for="chg_id">사용자</label> 
									<input type="text" class="center wtp14" name="chg_id" id="txt_chg_id"
										placeholder=""> <input type="text" name="chg_name"
										id="txt_chg_name" class="bg-gray wtp28" readonly>
<!-- 									<button id="btn_vndmstModal" -->
<!-- 										class="btn h34 gray non-txt g_search_icon" -->
<!-- 										onclick="modalObj.modalOpenFunc('oVndmstModal')"></button> -->
								</div>
								<div class="mb14">
									<label class="label key" for="cvcod">거래처</label> <input
										type="text" class="center wtp14" name="cvcod" id="txt_cvcod"
										placeholder=""> <input type="text" name="cvnas"
										id="txt_cvnas" class="bg-gray wtp28" readonly>
									<button id="btn_vndmstModal"
										class="btn h34 gray non-txt g_search_icon"
										onclick="modalObj.modalOpenFunc('oVndmstModal')"></button>
								</div>
								<div class="mb14">
									<label class="label key" for="chg_pw">비밀번호</label> <input
										type="password" name="Chg_pw" id="txt_chg_pw" class="wtp28">
									<label class="label mlp3" for="saupj">사업장</label> <select
										id="sel_saupj" class="wtp28">

									</select>
								</div>
								
								<div class="mb14">
									<label class="label" for="chg_fax">담당자팩스</label> <input
										type="text" name="Chg_fax" id="txt_chg_fax" class="wtp28">
									<label class="label mlp3" for="chg_hp">담당자핸드폰</label> <input
										type="text" name="Chg_hp" id="txt_chg_hp" class="wtp28">
								</div>
								<div class="mb14">
									<label class="label" for="chg_tel">담당자전화</label> <input
										type="text" name="Chg_tel" id="txt_chg_tel" class="wtp28">
									<label class="label mlp3" for="chg_mail">담당자메일</label> <input
										type="text" name="Chg_mail" id="txt_chg_mail" class="wtp28">
								</div>
								<div class="mb14">
									<label class="label" for="Auth">시스템관리자</label> 
									<div class="sys-radio-box wtp28">
										<label class="label mlp10 mrp5 wtp35">
											<input type="radio" class="sys-radio"
												name="Auth" id="chg_auth" value="1">YES
										</label>
										<label class="label mlp5 mrp5 wtp35">
											<input type="radio" class="sys-radio" 
												name="Auth" id="chg_auth" value="0">NO
										</label>
									</div>
									<label class="label mlp3" for="gubun">사용자구분</label> <select
										id="sel_gubun" class="wtp28">
										<option value="0">관리자</option>
										<option value="1">자재구매</option>
										<option value="2">외주</option>
										<option value="8">MRO구매</option>
										<option value="9">사내사용자</option>
									</select>
								</div>
								<div class="mb14">
									<label class="label" for="chg_birth">생성일자</label> <input
										type="text" name="Chg_birth" id="txt_chg_birth" class="bg-gray wtp28" maxlength="10" readonly>
									<label class="label mlp3" for="copy_id">MENU COPY ID</label> <input
										type="text" name="copy_id" id="txt_copy_id" class="wtp28">
									<input type="text" name="chg_id2" id="txt_chg_id2" class="hidden">
								</div>
							</div>
							<!-- 상세 정보 영역 끝 -->
							<!-- 페이지 네비게이션 시작 -->
							<div class="paginate" id="oPaginate"></div>
							<!-- 페이지 네비게이션 끝 -->
						</div>
					</div>
				</div>
			</div>
			<!-- footer 시작 -->
			<jsp:include page="../comm/jsp/comm_footer.jsp" />
			<!-- footer 끝 -->
			<!-- 즐겨찾기 시작 -->
			<jsp:include page="../comm/jsp/comm_favorite.jsp" />
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