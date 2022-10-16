<%--
	Document : 자료실등록
	작성자 : 염지광
	작성일자 : 2021-09-23
 --%>
<%@page import="java.util.Enumeration"%>
<%@page import="com.oreilly.servlet.multipart.DefaultFileRenamePolicy"%>
<%@page import="com.oreilly.servlet.MultipartRequest"%>
<%@page import="javax.servlet.*" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="../comm/jsp/session.jsp" />
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>자료실등록</title>
	<!-- 공통 사용부분 -->
	<link rel="stylesheet" type="text/css" href="../comm/css/reset.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/common.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/swiper.min.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/jquery.mCustomScrollbar.css">
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/sub.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/style.css" />
	<link rel="stylesheet" type="text/css" href="../comm/css/zTreeStyle.css" />
	
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
	<link rel="stylesheet" type="text/css" href="sys_apds_e.css">
	<script type="text/javascript" src="../comm/js/comm_menuList.js"></script>
	<script type="text/javascript" src="./sys_apds_e.js"></script>
	<script type="text/javascript" src="../comm/popup/comm_favorite_f.js"></script>
	<script type="text/javascript" src="../comm/jsp/comm_favorite.js"></script>
	<!-- 파일 업로드 -->
	<script type="text/javascript" src="../comm/popup/file_pop.js"></script>
	<link rel="stylesheet" type="text/css" href="../comm/popup/file_pop.css">
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
								<span>자료실등록 </span>
							</h2>
						</div>
						<!-- 타이틀 및 버튼 영역 끝 -->
						<div class="sheet-box">
						<!-- 조회조건 영역 시작 -->
							<div class="row">
								<label class="label" for="userid">관리자</label>
								 <input type="text" class="wt80" name="userid" id="txt_userid" placeholder="" readonly>	
								 <input type="text" name="username" id="txt_username" class="wt130" readonly>
								 
<!-- 								 <label class="label key write_date" for="">작성일</label> -->
<!--                                  <select name="" id="" class="wt150"> -->
<!--                                  	<option>최근 1개월</option> -->
<!--                                  	<option>최근 2개월</option> -->
<!--                                  	<option>최근 3개월</option> -->
<!--                                  	<option>최근 4개월</option> -->
<!--                                  	<option>최근 5개월</option> -->
<!--                                  	<option>최근 6개월</option> -->
<!--                                  	<option>최근 7개월</option> -->
<!--                                  </select>             -->
								<label class="label write_date" for="cvcod">거래처</label>
								<input type="text" class="wt80" name="cvcod" id="txt_cvcod" placeholder=""> 
								<input type="text" name="cvnas" id="txt_cvnas" class="wt130">
							</div>
							<!-- 조회조건 영역 끝 -->
							<!-- 테이블 영역 시작-->
<!-- 							<div class="left_wrap"> -->
							<div class="form-block table-box-wrap type02 table-row">
								<div class="table-scroll basic-scroll">
									<div class="container-fluid">
										<table class="table-type02 color02 table-type02-n"
											id="tbl_wrap">
											<caption>자료실등록 메뉴 테이블입니다.</caption>
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
							<div class="paginate paging" id="oPaginate"></div>
<!-- 							</div> -->
							<!-- 테이블 영역 끝-->
							<!-- 테이블 영역 시작(2) -->
<!-- 					<div class="right_wrap"> -->
							<div class="table-box-wrap type02 table2">
								<div class="table-scroll basic-scroll">
									<div class="container-fluid">
										<table class="table-type02 color02 table-type02-n"
											id="tbl_wrap2">
											<caption>자료실등록 메뉴 테이블입니다.</caption>
											<thead id="tbl_head2">

											</thead>
											<tbody id="tbl_body2">

											</tbody>
											<!-- <tfoot>
	                                        </tfoot> -->
										</table>
									</div>
								</div>
							</div>
							<!-- 테이블 영역 끝(2) -->
							<div class="btn-group table2_btn">
								<jsp:include page="../comm/jsp/comm_btnGroup.jsp" />
							</div>
							<!-- 페이지 네비게이션 시작 -->
							<!-- 페이지 네비게이션 끝 -->
							<!-- 상세 정보 영역 시작-->
							<div class="wrap_bot">
								<div class="wrap_m14">	
									<div class="mbp2">
										<label class="label key wtp18">번호</label>
										<input type="text" name="pno" id="txt_pno" class="wtp67" readonly>
									</div>
									<div class="mbp2">
										<label class="label key wtp18">제목</label>
										<input type="text" name="subject" id="txt_subject" class="wtp67">
									</div>
									<div class="mbp2">
										<label class="label key wtp18">작성자</label>
										<input type="text" class="wtp23" name="cre_id" id="txt_cre_id"
										placeholder="" readonly><input type="text" name="cname"
										id="txt_cname" class="wtp43" readonly> 
									</div>
									<div class="mbp2">
										<label class="label key wtp18">작성일자</label>
										<input type="text" class="wtp67" name="cre_dt" id="txt_cre_dt" readonly>
									</div>
									<div class="mbp2">
										<label class="label key wtp18" for="cvcod">수신처</label>
										<input type="text" class="wtp23" name="chg_id" id="txt_chg_id"
										placeholder="" readonly><input type="text" name="vname"
										id="txt_vname" class="wtp43" readonly>
									</div>
									<div class="mbp2">
										<label class="label key wtp18">첨부파일</label>
										<input type="text" class="wtp67" name="" id="txt_file" onclick="downloadFile()" readonly>
										<button class="btn blue-noline fchose" id="fchose">파일선택</button>
										<button class="btn blue-noline fdelete" onclick="fileDelete()">파일삭제</button>
									</div>
								</div>
								<div class="memo_area">
									<textarea name="content" id="txt_content" class="memo_box" rows="" cols="" placeholder="내용을 입력해 주시기 바랍니다."></textarea>
								</div>
							</div>
<!-- 					</div> -->
	
							<!-- 상세 정보 영역 끝 -->
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
		<div id="oFavoriteModal" class="modal-layer w620">
        	<jsp:include page="../comm/popup/comm_favorite_f.jsp"/>
        </div>
        <!-- 파일 업로드 -->
		<div id="oFileModal" class="modal-layerf w620">
        	<jsp:include page="../comm/popup/file_pop_apds.jsp"/>
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