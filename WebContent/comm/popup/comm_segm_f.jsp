<%-- 
    Document : 계산서 발행 팝업창 
    작성일자   : 2021.09.28 
    작성자    : jhlee
--%>
    
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" %>
    
<div class="modal-header">
	<h2 class="title">계산서 발행</h2>
	<button class="btn-modal-close cbtn">창닫기</button>
</div>
<div class="modal-content">
    <div class="btn-group">
     	<jsp:include page="../jsp/comm_btnGroup.jsp"/>                            
    </div>                    
	<div class="search-wrap">
		<div class="form-block">
			<label class="label dot" for="search_vndmst">세금계산서 발행일자</label> 
			<input type="text" class="bg-gray h38" id="saupj" readonly>
			
			<label class="label dot" for="search_vndmst">사업장</label> 
			<input type="text" class="bg-gray h38" id="saupj" readonly>
			
			<label class="label dot" for="search_vndmst">거래처</label> 
			<input type="text" class="bg-gray h38" id="cvnas" readonly>
			
			<label class="label dot" for="search_vndmst">공급가액</label> 
			<input type="text" class="bg-gray h38" id="maamt" readonly>
			
			<label class="label dot" for="search_vndmst">세액</label> 
			<input type="text" class="bg-gray h38" id="mavat" readonly>
		</div>
	</div>
	<div class="table-box-wrap">
		<div class="table-scroll basic-scroll">
			<table class="table-type01 mw570" id="tbl_wrap_vndmst_p">
				<caption>계산서 발행 서식 표 입니다.</caption>
				<thead>
				
				</thead>
				<tbody id="tbl_tbody_vndmst_p">
				
				</tbody>
			</table>
		</div>
	</div>
</div>
