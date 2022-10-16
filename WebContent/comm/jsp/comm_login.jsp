<%-- 
    Document   : login
    Created on : 2021. 2. 9, 오전 9:27:16
    Author     : Jordan.Seo
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>STLSOFT</title>
    <link rel="stylesheet" type="text/css" href="../css/reset.css" />
    <link rel="stylesheet" type="text/css" href="../css/login.css" />
    
    <script type="text/javascript" src="../js/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="../js/login.js"></script>
</head>
<body>
    <div id="wrap">
        <div class="login-wrap">
            <h1 class="logo"><img src="../../img/common/etc_logo02.png" alt="STLSOFT"></h1>
            <div class="login-box">
                <p class="version">PRIS SCM v1.0</p>
                <p class="welcome-en">Welcome to <span>STLSoft</span></p>
                <p class="welcome-ko">(주)에스티엘소프트에 오신것을 환영합니다.</p>
                <div class="etc-logos">
                    <span><img src="../../img/common/etc_logo01.png" alt="PRIS"></span>
                    <span><img src="../../img/common/etc_logo02.png" alt="STL SOFT"></span>
                </div>
                <div class="login-area">
                    <p class="title">Login <span>아이디와 비밀번호를 입력하세요.</span></p>
                    <legend>로그인</legend>
                    <div>
                        <label class="hidden" for="id">이메일 E-mail</label>
                        <input type="text" id="id" class="login-input id" placeholder="ID">
                    </div>
                    <div>
                        <label class="hidden" for="pass">비밀번호 Password</label>
                        <input type="password" id="pass" class="login-input pass" placeholder="Password">
                    </div>
                    <div class="error_area">
                    	<p id="sub_input" class="sub_input hidden">※ 아이디 또는 비밀번호를 입력하여 주십시오.</p>
                    	<p id="con_input" class="con_input hidden">※ 아이디 또는 비밀번호를 확인하여 주십시오.</p>
                    </div>
                    <div class="btn-line">
                        <input type="submit" class="btn-login" id="loginBtn" value="로그인">
                    </div>
                    <div class="save-id checkbox">
                        <input type="checkbox" id="checkboxId">
                        <label for="checkboxId">아이디 저장</label>
                        <i></i>
                    </div>
                </div>
            </div>
            <p class="license">Copyright © STLSoft . All right reserved.</p>
        </div>
    </div>
</body>
</html>