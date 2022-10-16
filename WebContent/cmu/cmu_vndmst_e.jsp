<%--
	Document : 사용자 정보
	작성자 : 염지광
	작성일자 : 2021-09-13
 --%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../comm/jsp/session.jsp"/>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>사용자 정보</title>
    <!-- 공통 사용부분 -->
    <link rel="stylesheet" type="text/css" href="../comm/css/reset.css" />
    <link rel="stylesheet" type="text/css" href="../comm/css/common.css" />
    <link rel="stylesheet" type="text/css" href="../comm/css/swiper.min.css" />    
    <link rel="stylesheet" type="text/css" href="../comm/css/jquery.mCustomScrollbar.css">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css"/>
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
    <!-- 파일 업로드 -->
	<script type="text/javascript" src="../comm/popup/file_pop.js"></script>
	<link rel="stylesheet" type="text/css" href="../comm/popup/file_pop.css">
    <link rel="stylesheet" type="text/css" href="cmu_vndmst_e.css">
    <script type="text/javascript" src="./cmu_vndmst_e.js"></script>
    <script type="text/javascript" src="../comm/popup/comm_vndmst_f.js"></script>
    <script type="text/javascript" src="../comm/popup/comm_favorite_f.js"></script>
    <script type="text/javascript" src="../comm/jsp/comm_favorite.js"></script>   
    <script type="text/javascript" src="../comm/js/comm_menuList.js"></script>
</head>
<body>
    <div id="wrap">
	<!-- 사이트메뉴 시작 -->
	<jsp:include page="../comm/jsp/comm_menuList.jsp"/>
	<!-- 사이트메뉴 끝 -->

		<!-- 메인부분 -->
        <main class="content-wrap">
			<!-- 헤더 시작 -->
            <jsp:include page="../comm/jsp/comm_header.jsp"/>
            <!-- 헤더 끝 -->
            <div class="contents">
                <div class="sheet-wrap">
                    <div class="inner">
                        <!-- 타이틀 및 버튼 영역 시작 -->
                        <div class="sub-header">
                            <h2 class="title"><span> 사용자 정보 </span></h2>
								<div class="btn-group">
                                <jsp:include page="../comm/jsp/comm_btnGroup.jsp"/>   
                            </div>           
                        </div>
                        <!-- 타이틀 및 버튼 영역 끝 -->
                        <div class="sheet-box">
                            <!-- 조회조건 영역 시작 -->
                            <div class="form-block form-block_mar" id="wrapHead">
	                            <label class="label key" for="cvcod">업체</label>
                                <input type="text" class="wtp6 ml28 center" name="cvcod" id="txt_cvcod" placeholder="" readonly>
                                <input type="text" name="cvnas" id="txt_cvnas" class="wtp12" readonly>
                            </div>
                            <!-- 조회조건 영역 끝 -->
                            <!-- 상세 정보 영역 시작-->
                            <div class="wrap">
                            	<div class="wrap_left">
                            		<div class="mb14">
                            			<label class="label label_len" for="cvcod">거래처 코드</label>
                            			<input type="text" name="cvcod" id="txt_cvcod2" class="cmu_wt" readonly>
                            		</div>
                            		<div class="mb14">
                            			<label class="label label_len" for="cvnas">거래처 명</label>	
                            			<input type="text" name="cvnas" id="txt_cvnas3" class="cmu_wt" readonly>
                            		</div>
                            		<div class="mb14">
                            			<label class="label label_len" for="cvnas2">거래처 약명</label>
                            			<input type="text" name="cvnas2" id="txt_cvnas2" class="cmu_wt" readonly>
                            		</div>
                            		<div class="mb14">
                            			<label class="label label_len" for="ownam">대표자 명</label>
                            			<input type="text" name="ownam" id="txt_ownam" class="cmu_wt" readonly>
                            		</div>
                            		<div class="mb14">
                            			<label class="label label_len" for="sano">사업자 번호</label>
                            			<input type="text" name="sano" id="txt_sano" class="cmu_wt" readonly>
                            		</div>
                            		<div class="mb14">
										<label class="label label_len">직인</label>
											  <input type="text" class="wtp38" name="" id="txt_jikyin" onclick="downloadFile4();" readonly>
										<button class="btn blue-noline fvndmst" id="fchose4">직인등록</button>
                            		</div>
                            	</div>
                            	<div class="wrap_right">
                            		<div class="mb14">
                            			<label class="label label_len" for="uptae">업태</label>
                            			<input type="text" name="uptae" id="txt_uptae" class="cmu_wt" readonly>
                            		</div>
                            		<div class="mb14">
                            			<label class="label label_len" for="upjong">업종</label>
           	                 			<input type="text" name="upjong" id="txt_upjong" class="cmu_wt" readonly>
                            		</div>
                            		<div class="mb14">
                            			<label class="label label_len" for="codenum">우편번호</label>
                            			<input type="text" name="codenum" id="txt_codenum" class="cmu_wt" readonly>
                            		</div>
                            		<div class="mb14">
                            			<label class="label label_len" for="telnum">대표 전화</label>
                     	       			<input type="text" name="telnum" id="txt_telnum" class="cmu_wt" readonly>
                            		</div>
                            		<div class="mb14">
                            			<label class="label label_len" for="faxnum">FAX 번호</label>
                            			<input type="text" name="faxnum" id="txt_faxnum" class="cmu_wt" readonly>
                            		</div>
                            		<div class="mb14">
                            			<label class="label label_len" for="juso">주소</label>
                            			<input type="text" name="juso" id="txt_juso" class="cmu_wt" readonly>
                            		</div>
                            	</div>
                     		<div class="box">
                     		<label class="label">※현재 비밀번호를 입력한 후 새로 사용할 비밀번호를 입력하세요.</label>
                   	         <br>
                            <br>
                            <br>
                            <div class="password_wrap">
	                            <div class="mb14">
	                            	<label class="label label_len">현재 비밀번호</label>
	                            	<input type="password" name="" id="pass_p_password" class="wtp53">
	                            </div>
	                            <div class="mb14">
	                            	<label class="label label_len" for="">신규 비밀번호</label>
	                            	<input type="password" name="" id="pass_n_password" class="wtp53">
	                            </div>
	                            <div class="mb14">
	                            	<label class="label label_len" for="">확인 비밀번호</label>
	                            	<input type="password" name="" id="pass_c_password" class="wtp53">
	                            </div>
                        	</div>
                        	</div>
							</div>                            
                            <!-- 상세 정보 영역 끝 -->
                     		
                        </div>
                    </div>
                </div>
            </div>
            <!-- footer 시작 -->
			<jsp:include page="../comm/jsp/comm_footer.jsp"/>
            <!-- footer 끝 -->
			<!-- 즐겨찾기 시작 -->
			<jsp:include page="../comm/jsp/comm_favorite.jsp"/>		
            <!-- 즐겨찾기 끝 -->
        </main>
    </div>

    <!--모달처리-->   
    <div class="modal-layer-wrap">
        <!-- 즐겨찾기 팝업 -->
		<div id="oFavoriteModal" class="modal-layer w620">
        	<jsp:include page="../comm/popup/comm_favorite_f.jsp"/>
        </div>
        <!-- 파일 업로드 -->
		<div id="oFileModal" class="modal-layerf w620">
        	<jsp:include page="../comm/popup/file_pop_vndmst.jsp"/>
        </div>
		<!-- 알림창 시작 -->
		<!-- 알림창의 메시지는 js에서 직접 작성 -->
        <div id="oCheckModal" class="modal-layer w310">            
            <div class="modal-message">
                <p class="message alert" id="oCheckMessage" ></p>
                <div class="btn-line center">                    
                    <button class="btn h32 blue-noline cbtn">확인</button>
                </div>
            </div>
        </div>
        <!-- 알림창 끝 --> 
    </div>
</body>
</html>