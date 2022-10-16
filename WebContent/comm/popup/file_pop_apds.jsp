<%-- 
    Document : 파일 업로드 팝업창 
    작성일자   : 2021.11.30 
    작성자    : 염지광
--%>

<%@page import="com.oreilly.servlet.MultipartRequest"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <div class="modal-header">

        <h2 class="title">파일 업로드</h2>
        <button class="btn-modal-close cbtn">창닫기</button>
    </div>
    <div class="modal-content">
        <div class="search-wrap">
			<form enctype="multipart/form-data">
    			<input id="file-file" type="file" class="finput">
			</form>
        </div>
		        
        <div class="btn-line center">
            <button class="btn h42 blue-noline fokay">확인</button>
            <button class="btn h42 white-gray cbtn" id="f_close">취소</button>
        </div>
    </div> <!-- modal-content 닫기 -->