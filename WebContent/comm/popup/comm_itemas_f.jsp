<%-- 
    Document : 품번 팝업창 
    작성일자   : 2021.10.14 
    작성자    : 염지광
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <div class="modal-header">
        <h2 class="title">품목코드 조회</h2>
        <button class="btn-modal-close cbtn" id="a">창닫기</button>
    </div>
    <div class="modal-content">
        <div class="search-wrap">
            <div class="form-block">
                  <label class="label dot wt50" for="saupj">사업장</label>
                  <select id="sel_saupj_m" class="wtp64">
                  
                  </select>
                <button class="btn h38 gray-blue g_search_icon" id="btn_search_itemas_p">조회</button>
            </div>
            <div class="form-block">
                <label class="label dot" for="ittyp">품목구분</label>
                <select id="sel_ittyp_m" class="wt180">
                
                </select>   
                <label class="label dot" for="modal3-form02-01">품번</label>
                <input type="text" class="wt180" name="modal3-form02-01" id="modal3-form02-01">
            </div>
            <div class="form-block">
                <label class="label dot" for="modal3-form01-03">품목분류</label>
                <input type="text" class="wt180" name="modal3-form01-03" id="modal3-form01-03">
                <label class="label dot" for="modal3-form02-02">품명</label>
                <input type="text" class="wt180" name="modal3-form02-02" id="modal3-form02-02">
            </div>
            <div class="form-block">
                <label class="label dot" for="modal3-form03-01">사용구분</label>
                <div class="radio">
                    <input type="radio" name="modal3-form03-01" id="rbt_gubun" value="0" checked>
                    <label for="modal3-form03-01">사용</label>
                    <i></i>
                </div>
                <div class="radio ml20">
                    <input type="radio" name="modal3-form03-01" id="rbt_gubun" value="1">
                    <label for="modal3-form03-02">사용중지</label>
                    <i></i>
                </div>
                <div class="radio ml20">
                    <input type="radio" name="modal3-form03-01" id="rbt_gubun" value="2">
                    <label for="modal3-form03-03">단종</label>
                    <i></i>
                </div>
            </div>
        </div>

        <div class="table-box-wrap">
            <div class="table-scroll basic-scroll">
                <table class="table-type01 mw930" id="tbl_wrap_itemas_p">
                    <caption>품목코드조회 테이블로 품번, 품명, 구분, 카테고리, 품목분류명, 관리단위, 생산BOM, 표준공정 항목별 순서대로 안내하는 표입니다</caption>
                    <thead id="tbl_thead_itemas_p">
                    	<tr>
							<th scope="col" class="wtp55">픔번</th>
							<th scope="col" class="wtp67">품명</th>
							<th scope="col" class="wtp27">사용구분</th>
							<th scope="col" class="wtp27">재고관리</th>
							<th scope="col" class="wtp50">품목분류명</th>
							<th scope="col" class="wtp27">관리단위</th>
<!-- 							<th scope="col" class="wtp27">생산단위BOM</th> -->
							<th scope="col" class="wtp27">표준공정</th>
						</tr>
                    </thead>
                    <tbody id="tbl_tbody_itemas_p">
                    
                    </tbody>
                </table>
            </div>
        </div>
         <!-- 페이지 네비게이션 시작 -->
         <div class="paginate"  id="favoPaginate"></div>
         <!-- 페이지 네비게이션 끝 -->
<!--          <div class="paginate" id="oPaginate_itemas_p"></div> -->
        
        <div class="btn-line center">
            <button class="btn h42 blue-noline">확인</button>
            <button class="btn h42 white-gray cbtn">취소</button>
        </div>
    </div>