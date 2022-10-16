<%-- 
    Document : 거래처 팝업창 
    작성일자   : 2021.03.15 
    작성자    : dykim
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<div class="modal-header">
	<h2 class="title">업체조회</h2>
	<button class="btn-modal-close cbtn">창닫기</button>

</div>
<div class="modal-content">
	<div class="search-wrap">
		<div class="form-block">
			<label class="label dot" for="search_login">조회구분</label> 
			<input type="text" class="bg-gray h38" name="search_login_p" id="txt_search_login_p" placeholder="검색어 입력">
			<button class="btn h38 gray-blue g_search_icon" id="btn_search_login_p">조회</button>
		</div>
		<div class="form-block pl70">
			<div class="radio ml20">
				<input type="radio" name="gubun_login" id="rbt_gubun_login_p1" value="1" checked>
				<label for="gubun_vndmst1">업체코드</label> <i></i>
			</div>
			<div class="radio">
				<input type="radio" name="gubun_login" id="rbt_gubun_login_p2" value="2">
                <label for="gubun_vndmst2">업체명</label> <i></i>
			</div>
		</div>
	</div>

	<div class="table-box-wrap">
		<div class="table-scroll basic-scroll">
			<table class="table-type01 mw570" id="tbl_wrap_login_p">
				<caption>업체리스트 조회 테이블로 코드, 업체명 항목별 순서대로 안내하는 표입니다</caption>
				<thead>
					<tr>
						<th scope="col" class="wt-8per">순번</th>
						<th scope="col" class="wt-20per">업체코드</th>
						<th scope="col" class="wt-40per">업체명</th>
					</tr>
				</thead>
				<tbody id="tbl_tbody_login_p">
				</tbody>
			</table>
		</div>
	</div>
	<div class="paginate" id="oPaginate_login_p"></div>

	<div class="btn-line center">
		<button class="btn h42 blue-noline">확인</button>
		<button class="btn h42 white-gray cbtn">취소</button>
	</div>
</div>
