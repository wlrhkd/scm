<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="modal-header">
	<h2 class="title">품번조회</h2>
	<button class="btn-modal-close cbtn" id="itemclose">창닫기</button>
</div>
<div class="modal-content">
	<div class="search-wrap">
		<div class="form-block">
			<label class="label dot" for="searchitem">조회구분</label> 
			<input type="text" class="bg-gray h38" name="search_itemas_p" id="txt_search_itemas_p" placeholder="검색어 입력">
			<button class="btn h38 gray-blue g_search_icon" id="btn_search_itemas_p">조회</button>
		</div>
		<div class="form-block pl70">
			<div class="radio ml20">
				<input type="radio" name="gubun_itemas" id="rbt_gubun_itemas_p1" value="1" checked>
				<label for="gubun_itemas1">품목코드</label> 
				<i></i>
			</div>
			<div class="radio">
				<input type="radio" name="gubun_itemas" value="2" id="rbt_gubun_itemas_p2">
				<label for="gubun_itemas2">품명</label>
				<i></i>
			</div>
		</div>
	</div>

	<div class="table-box-wrap">
		<div class="table-scroll basic-scroll">
			<table class="table-type01 mw570" id="itemList">
				<caption>품번코드 조회 테이블로 코드, 품명 항목별 순서대로 안내하는 표입니다</caption>
				<thead>
					<tr>
						<th scope="col" class="wt-8per">순번</th>
						<th scope="col" class="wt-20per">품번</th>
						<th scope="col" class="wt-40per">품명</th>
					</tr>
				</thead>
				<tbody id="tbl_tbody_itemas_p">
				</tbody>
			</table>
		</div>
	</div>
	<div class="paginate" id="oPaginate_itemas_p">
	
	</div>

	<div class="btn-line center">
		<button class="btn h42 blue-noline">확인</button>
		<button class="btn h42 white-gray cbtn">취소</button>
	</div>
</div>