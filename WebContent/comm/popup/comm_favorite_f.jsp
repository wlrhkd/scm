<%-- 
    Document : 즐겨찾기 팝업창 
    작성일자   : 2021.10.20 
    작성자    : 염지광
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<link rel="stylesheet" type="text/css" href="../popup/comm_favorite_f.css" />
<script type="text/javascript" src="../popup/comm_favorite_f.js"></script> 
<!--  SweetAlert -->
<link rel="stylesheet" type="text/css" href="../css/sweetalert2.min.css" />
<script type="text/javascript" src="../js/sweetalert2.min.js"></script>
 
<div class="modal-header">
	<h2 class="title">즐겨찾기</h2>
	<button class="btn-modal-close cbtn click_close">창닫기</button>
</div>
<div class="modal-content">
	<div class="search-wrap">
		<div class="form-block">
			<label class="label dot" for="search_vndmst">메뉴명</label> 
			<input type="text" class="h38" name="search_vndmst_p" id="txt_search_favorite_p" placeholder="검색어 입력">
			<button class="btn h38 gray-blue g_search_icon" id="btn_search_favorite_p">조회</button>
		</div>
	</div>

	<div class="table-box-wrap">
		<div class="table-scroll basic-scroll">
			<table class="table-type01 mw570" id="tbl_wrap_favv_p">
				<caption>즐겨찾기 메뉴 조회 테이블입니다.</caption>
				<thead>
					<tr>
						<th style="width:10%"><input type="checkbox" id="totalchk"></th>
						<th scope="col" class="wtp14">코드</th>
						<th scope="col" class="wtp22">중분류명</th>
						<th scope="col" class="wtp30">메뉴명</th>
						<th scope="col" class="wtp30">윈도우명</th>
					</tr>
				</thead>
				<tbody id="tbl_tbody_favorite_p">
				</tbody>
			</table>
		</div>
	</div>	
	<div class="paginate" id="oPaginate_favorite_p"></div>

	<div class="btn-line center">
		<button class="btn h42 blue-noline cbtn okay" id="favo">확인</button>
		<button class="btn h42 white-gray cbtn">취소</button>
	</div>
</div>
