<%-- 
    Document : 즐겨찾기 
    작성일자   : 2021.03.12 
    작성자    : dykim
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<link rel="stylesheet" type="text/css" href="../comm/jsp/comm_favorite.css">
<!--  SweetAlert -->
<link rel="stylesheet" type="text/css" href="../comm/css/sweetalert2.min.css" />
<script type="text/javascript" src="../comm/js/sweetalert2.min.js"></script>
<!--  SweetAlert -->
 <link rel="stylesheet" type="text/css" href="../css/sweetalert2.min.css" />
 <script type="text/javascript" src="../js/sweetalert2.min.js"></script>

<div class="favorite-layer">
	<div class="inner">
		<div class="search">
			<fieldset>
				<legend>검색</legend>
				<input type="text" name="top_search" id="txt_top_search"
					class="inputsch" title="검색어 입력" placeholder="Search" tabindex="-1">
				<button class="btnSearch" id="btn_search_fav" tabindex="-1">검색</button>
			</fieldset>
		</div>
		<div class="favorite-line">
			<h3 class="tit">즐겨찾기 메뉴</h3>
<!-- 			<button class="btn-favorite-modify">수정</button> -->
		<!-- 테이블 시작 -->
		<div class="table-box-wrap fav">
		<div class="table-scroll_fav table-scroll basic-scroll">
			<div class="container-fluid">
			<table class="table-type01 wt_head" id="">
				<caption>즐겨찾기 메뉴 조회 테이블입니다.</caption>
				<thead>
					<tr>
						<th scope="col" class="hidden">메뉴이름</th>
						<th scope="col" class="hidden">페이지 주소</th>
					</tr>
				</thead>
				<tbody id="tbl_tbody_favorite_p2">
				</tbody>
			</table>
			</div>
		</div>
		</div>
			<button id="btn_favoriteModal" class="favorite-plus" onclick="modalObj.modalOpenFunc('oFavoriteModal')" tabindex="-1"></button>
		</div>
	</div>
	<a href="#!" class="favorite-btn" id="open" tabindex="-1"><span>열기</span></a>
</div>