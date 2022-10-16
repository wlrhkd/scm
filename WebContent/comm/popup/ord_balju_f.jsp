<%-- 
    Document : 발주현황 내역 팝업창 
    작성일자   : 2021.10.15 
    작성자    : 염지광
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<div class="modal-header">
	<h2 class="title">발주번호조회</h2>
	<button class="btn-modal-close cbtn" id="click_modal_close">창닫기</button>

</div>
<div class="modal-content">
	<div class="search-wrap">
		<div class="oBaljuListModal form-block">
			<label class="label dot" for="search_vndmst">발주번호</label> 
			<input type="text" class="bg-gray h38 wt130 center" name="search_vndmst_p" id="baljpno">
			<input type="text" class="bg-gray h38 wt50 center" name="search_vndmst_p" id="balseq">
			<button class="btn h38 gray-blue g_search_icon" id="btn_search_balju_f">조회</button>
		</div>
	</div>

	<div class="table-box-wrap">
		<div class="table-scroll basic-scroll">
			<table class="table-type01 mw570" id="tbl_wrap_balju_p">
				<caption>발주번호 조회 테이블 입니다.</caption>
				<thead id="tbl_thead_balju_p">
					<tr>
						<th scope="col" class="wt-20per">전표번호</th>
						<th scope="col" class="wt-20per">납품수량</th>
						<th scope="col" class="wt-20per">납품일</th>
						<th scope="col" class="wt-20per">입고수량</th>
						<th scope="col" class="wt-20per">입고일</th>
						<th scope="col" class="wt-20per">입고여부</th>
					</tr>
				</thead>
				<tbody id="tbl_tbody_balju_p">
				</tbody>
			</table>
		</div>
	</div>
	<div class="paginate" id="oPaginate_balju_p"></div>

	<div class="btn-line center">
		<button class="btn h42 blue-noline">확인</button>
		<button class="btn h42 white-gray cbtn" id="click_cancel">취소</button>
	</div>
</div>
