<%-- 
    Document   : notice
    Created on : 2021. 2. 23, 오전 9:31:18
    Author     : Jordan.Seo
--%>
<%@page import="java.io.PrintWriter"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../comm/jsp/session.jsp"/>   
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>공지사항</title>
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
	<link rel="stylesheet" type="text/css" href="../comm/popup/comm_login_f.css">
	
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
    <!-- 파일 업로드 -->
	<script type="text/javascript" src="../comm/popup/file_pop.js"></script>		
	<link rel="stylesheet" type="text/css" href="../comm/popup/file_pop.css">
    <!--  SweetAlert -->
    <link rel="stylesheet" type="text/css" href="../comm/css/sweetalert2.min.css" />
    <script type="text/javascript" src="../comm/js/sweetalert2.min.js"></script>
    
    <!-- 공통 사용부분 끝 -->
    <link rel="stylesheet" type="text/css" href="cmu_plan_e.css">
    <script type="text/javascript" src="./cmu_plan_e.js"></script>
    <script type="text/javascript" src="../comm/popup/comm_vndmst_f.js"></script>
   	<script type="text/javascript" src="../comm/popup/comm_login_f.js"></script>
    <script type="text/javascript" src="../comm/popup/comm_itemas_f.js"></script>
    <link rel="stylesheet" type="text/css" href="../comm/popup/comm_itemas_f.css">  
    <script type="text/javascript" src="../comm/popup/comm_favorite_f.js"></script>
    <script type="text/javascript" src="../comm/jsp/comm_favorite.js"></script>   
    <script type="text/javascript" src="../comm/js/comm_menuList.js"></script>
</head>
<body>
    <div id="wrap">
	<!-- 사이트메뉴 시작 -->
	<jsp:include page="../comm/jsp/comm_menuList.jsp"/>
	<!-- 사이트메뉴 끝 -->
		<!--메인부분-->
        <main class="content-wrap">
			<!-- 헤더 시작 -->
            <jsp:include page="../comm/jsp/comm_header.jsp"/>
            <!-- 헤더 끝 -->
		<!--Button Area-->
            <div class="contents">
                <div class="sheet-wrap">
                    <div class="inner">
                    	<!-- 타이틀 및 버튼 영역 시작 -->
                        <div class="sub-header">
                            <h2 class="title"><span>공지사항 </span></h2>
                            <div class="btn-group">
                                <jsp:include page="../comm/jsp/comm_btnGroup.jsp"/>                                   
                            </div>                                    
                        </div>
                        <div class="sheet-box">
                            <div class="form-block">
                                <label class="label key" for="year">기간</label>
                                <select id="sel_date" class="wt150">
                                	<option value="0" id="">전체보기</option>
                                	<option value="1" id="" selected="selected">1개월</option>
                                	<option value="2" id="">2개월</option>
                                	<option value="3" id="">3개월</option>
                                	<option value="4" id="">4개월</option>
                                	<option value="5" id="">5개월</option>
                                	<option value="6" id="">6개월</option>
                                	<option value="7" id="">7개월</option>
                                	<option value="8" id="">8개월</option>
                                	<option value="9" id="">9개월</option>
                                	<option value="10" id="">10개월</option>
                                	<option value="11" id="">11개월</option>
                                	<option value="12" id="">12개월</option>
                                </select>
                                
                                <label class="label" for="title">제목</label>
                                <input type="text" name="subject" id="txt_subjt" style="width:300px;">
                            </div>
                            <div class="sheet-box-inner table-detail">
                                <div class="table-box-wrap type02">
                                    <div class="table-scroll basic-scroll">
                                        <table class="table-type02 color02"  id="tbl_wrap">
                                            <caption>공지사항 테이블 입니다.</caption>
	                                        <thead id="tbl_head">
	                                        
	                                        </thead>
	                                        <tbody id="tbl_body">
	                                        
	                                        </tbody>
	                                        <!-- <tfoot>
	                                        </tfoot> -->
                                        </table>
                                    </div>
                                </div>
                                <div class="detail-wrap">
                                    <div class="inner">
                                        <div class="detail-table-wrap  basic-scroll">
                                            <table class="detail-table">
                                                <caption>공지사항 상세페이지 NO, 작성자, 수신처, 제목, 내용, 첨부파일, 시간 항목별 순서대로 안내하는 표입니다</caption>
                                                <colgroup>
                                                    <col width="18%" />
                                                    <col width="32%" />
                                                    <col width="18%" />
                                                    <col width="32%" />                                                    
                                                </colgroup>
                                                <tbody>
                                                    <tr>
                                                        <th class="point">NO</th>
                                                        <td class="gray"><input type="text" name="txt_no" id="txt_no" size="20" value="" readonly style="border:none; border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px; width:100%; padding:0;"></td>    
                                                        <!-- 작성자 key 값 (hidden) -->
                                                        <td class="hidden"><input type="text" name="txt_cre_idk" id="txt_cre_idk" size="20" value="" readonly style="border:none; border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px; width:100%; padding:0;"></td>                                              
                                                        <th class="point">작성자</th>
                                                        <td class="gray"><input type="text" name="txt_cre_ids" id="txt_cre_ids" size="20" value="" readonly style="border:none; border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px; width:100%; padding:0;"></td>    
                                                    </tr>
                                                    <tr>
                                                        <th class="point">수신처</th>
                                                        <td id="bg_private">
                  											<input type="text" name="txt_chg_ids" id="txt_chg_ids" size="20" style="border:none;border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px;width:100%;">                                                            
                                                        </td>
                                                        <td class="form gray" colspan="2">
                  											<input type="text" name="txt_chg_name" id="txt_chg_name" size="20" readonly style="border:none;border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px;width:100%;">                                                            
	                                                        <button id="btn_loginModal" class="btn h34 gray non-txt g_search_icon" onclick="modalObj.modalOpenFunc('oLoginModal')"></button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th class="point" >제목</th>
                                                        <td colspan="3" >
                                                            <input type="text" name="notice_title" id="txt_subject" size="20" value="" style="border:none;border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px;width:100%;">
                                                        </td>
                                                    </tr>
                                                    <tr class="content-tr">
                                                        <th class="point">내용</th>
                                                        <td colspan="3" >                                                           
                                                            <textarea name="notice_content" id="txt_content" style="resize:none; border:none;border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px;width:100%; height:100%;" ></textarea>                                            
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>첨부파일</th>
                                                        <td colspan="2">
                                                            <input type="text" class="wtp67" name="" id="txt_file3" onclick="downloadFile3()">
                                                        </td>
                                                        <td>
                                                            <div class="file-input-div">
<!--                                                                 <button href="#!" class="file-find-btn" id="fileselect">파일선택</button> -->
<!-- <!--                                                                <input type="file" class="file-input-hidden size-m" name="file" id="file" -->
<!--                                                                     onchange="javascript: document.getElementById('fileName').value = this.value.split('\\')[this.value.split('\\').length - 1]" title="파일명">-->
<!--                                                                 <form id="fileform" action="" method="post" enctype="multipart/form-data"> -->
<!--                                                                 	<input type="file" class="file-input-hidden size-m" name="file" id="file" title="파일명"> -->
<!--                                                                 </form> -->
															<button class="btn blue-noline fchose" id="fchose3">파일선택</button>
															<button class="btn blue-noline fdelete" onclick="fileDelete3()">파일삭제</button>
                                                            </div>
<!--                                                             <button href="#!" class="file-del-btn" -->
<!--                                                                 onclick="javascript: document.getElementById('fileName').value = ''">파일삭제</button> -->
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>시간</th>
                                                        <td colspan="3" class="gray" id="datetime">
                                                        	<input type="text" name="notice_dt" id="txt_cre_dt" size="20" readonly style="border:none;border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px;width:100%;">
                                                        	</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>                                        
                                    </div>                                    
                                </div>
	                            <!-- 페이지 네비게이션 시작 -->
	                            <div class="paginate"  id="oPaginate">
	
	                            </div>
	                            <!-- 페이지 네비게이션 끝 -->
                            </div>
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
        <!-- 업체 팝업 시작 -->
        <div id="oVndmstModal" class="modal-layer w620">
			<jsp:include page="../comm/popup/comm_vndmst_f.jsp"/>
        </div>        
        <!-- 업체 팝업 끝 -->
        <!-- 수신처 팝업 시작 -->
		<div id="oLoginModal" class="modal-layer w620">
			<jsp:include page="../comm/popup/comm_login_f.jsp" />
		</div>
		<!-- 업체 팝업 끝 -->
		<!-- 거래처 팝업 시작 -->
        <div id="oItemasModal" class="modal-layer w620">
			<jsp:include page="../comm/popup/comm_itemas_f.jsp"/>
        </div>        
        <!-- 거래처 팝업 끝 -->
		<!-- 즐겨찾기 팝업 시작 -->
       	<div id="oFavoriteModal" class="modal-layer w620">
       		<jsp:include page="../comm/popup/comm_favorite_f.jsp"/>
       	</div>
        <!-- 즐겨찾기 팝업 끝-->
        <!-- 파일 업로드 -->
		<div id="oFileModal" class="modal-layerf w620">
        	<jsp:include page="../comm/popup/file_pop_notice.jsp"/>
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