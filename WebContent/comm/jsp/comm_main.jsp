<%-- 
    Document   : main
    Created on : 2021. 2. 9, 오전 9:10:06
    Author     : Jordan.Seo
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.io.PrintWriter"%>
<%@page import = "java.util.Calendar" %>

<!DOCTYPE html>
<html>
<head>
    <!--        Session처리 -->
    <jsp:include page="./session.jsp"/>
    <!--        Session처리-->       
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>STLSOFT</title>
    <link rel="stylesheet" type="text/css" href="../css/reset.css" />
    <link rel="stylesheet" type="text/css" href="../css/common.css" />
    <link rel="stylesheet" type="text/css" href="../css/swiper.min.css" />    
    <link rel="stylesheet" type="text/css" href="../css/jquery.mCustomScrollbar.css">
    <link rel="stylesheet" type="text/css" href="../css/main.css" />
    <link rel="stylesheet" type="text/css" href="../css/style.css" />
    <link rel="stylesheet" type="text/css" href="../css/zTreeStyle.css" />

    <script type="text/javascript" src="../js/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="../js/swiper.min.js"></script>
    <script type="text/javascript" src="../js/jquery.mCustomScrollbar.concat.min.js"></script>
    <script type="text/javascript" src="../js/jquery.ztree.core.js"></script>
    <script type="text/javascript" src="../js/main.js"></script>
    <script type="text/javascript" src="../js/common.js"></script>
    <script type="text/javascript" src="../js/comm_menuList.js"></script>
    <script type="text/javascript" src="../js/comm_main.js"></script>   
    <script type="text/javascript" src="../js/defineArea.js"></script>
    <script type="text/javascript" src="../js/localStorage.js"></script>     
    <script type="text/javascript" src="../js/comm_favorite_main.js"></script>
    <link rel="stylesheet" type="text/css" href="./comm_favorite.css">
    <!--  SweetAlert -->
	<link rel="stylesheet" type="text/css" href="../css/sweetalert2.min.css" />
	<script type="text/javascript" src="../js/sweetalert2.min.js"></script>
    <script>
      navigator.geolocation.getCurrentPosition(function(pos) {
      $("#localAddr").empty(); // 다시 주소 초기화 시켜주기
   
       var latitude = pos.coords.latitude;   // 경도
       var longitude = pos.coords.longitude; // 위도
//        console.log("현재 위치는 : " + latitude + ", "+ longitude);
       
       $.ajax({
          url : 'https://dapi.kakao.com/v2/local/geo/coord2address.json?x=' + longitude +'&y=' + latitude,
           type : 'GET',
           headers : {
              'Authorization' : 'KakaoAK f9c7a7d4fd61de474193c443c03cf20b'
           },
           success : function(data) {
             var addr1 = data.documents[0].address.region_1depth_name;
             var addr2 = data.documents[0].address.region_2depth_name;
             var addr3 = data.documents[0].address.region_3depth_name;
             
           console.log("현재 위치는 : " + addr1 + ", "+ addr2 + ", "+addr3);
             $("#localAddr").append(addr1 + " " + addr2 + " " + addr3);
             
             
           },
           error: function(e) {
             console.log(e);
           }
         });
       
       getWeather(latitude, longitude); // 위도. 경도 값 넣어서 날씨 가져오기 실행
       
       /*--날씨 얻어오기--*/
       
       function getWeather(lat, lon){
           fetch(
             "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=650a13f71ff57b434cb29ee528b425bf&units=metric"
           )
             .then(function(response){
             return response.json();
           })
             .then(function(json){
                console.log(json);
               var temp = json.main.temp;
               temp = Math.floor(temp);
               var weather = json.weather[0].icon;
               var icon = "../../img/weather/" + weather + ".png"; // 사진결정
               
               $("#weatherIcon").attr('src', icon);
               $("#temp").append(temp + " ºC");
             });
         }
      });
</script>
</head>
<body>
    <div id="wrap">
<!--        사이트메뉴-->
        <jsp:include page="./comm_menuList.jsp"/>
        <main class="content-wrap">
            <header class="header">
                <h1 class="logo"><a href="#!"><img src="../../img/common/etc_logo02.png" alt="STLSOFT"></a></h1>
                 <div class="date">
                   <% Calendar cal = Calendar.getInstance(); 
     
                   	  String []week = {"January","February","March","April","May","June","July","August","September","October","November","December"};
                   	  String []weeks = {"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"};

// 						System.out.println("1 = " + week[cal.get(Calendar.MONTH)]);
// 						System.out.println("2 = " + cal.get(Calendar.YEAR));
// 						System.out.println("3 = " + weeks[cal.get(Calendar.DAY_OF_WEEK)-1]);
	                %>
                    <span class="tit">Today</span>
                    <span id="txt_today_date" class="today-date"><%= cal.get(Calendar.DATE) %></span>
                    <span class="today-txt"><%= week[cal.get(Calendar.MONTH)] %>, <%= cal.get(Calendar.YEAR) %> (<%= weeks[cal.get(Calendar.DAY_OF_WEEK)-1] %>)</span>
                </div>
                <div id="weather" class="weather">
                <span id="localAddr" class="localAddr"></span>
               <img alt="weather" id="weatherIcon" class="weatherIcon" src="../../img/weather/01d.png">
               <span id="temp" class="temp"></span>
            </div>
                <button class="btn-logout" id="logOut">로그아웃</button>
<!--                 <button class="btn-login">로그인</button> -->
                <a href="#!" class="etc-menu">선택</a>
                <div class="sel-menu">
                    <p class="tit">SCM</p>
                    <ul>
                        <li><a href="#!">EIS</a></li>
                        <li><a href="#!">원가관리</a></li>
                        <li><a href="#!">회계관리</a></li>
                    </ul>
                    <a href="#!" class="btn-close">close</a>
                </div>
            </header>
            <div class="contents">
                <div class="main-notice">
                    <div class="inner y-scroll">
                        <section class="statue-zone">
                            <div class="cont-box c01">
                                <p class="greeting"><span>Hello,</span><br>㈜한현P&T</p>                        
                                <a href="comm_main.jsp" class="homepage">홈페이지</a>
                                <a href="www.stlsoft.co.kr/" class="modify"></a>
                                <div class="photo"></div>
                            </div>
                            <div class="cont-box c02">
                                <p class="tit">금일 출발건수</p>
                                <p id="chul" class="count">
                                
                                </p>
                                <a href="/scm/ord/ord_chul_e.jsp" class="link">link</a>
                            </div>
                            <div class="cont-box c03">
                                <p class="tit">금월 불량건수</p>
                                <p id="prebul" class="count">
                                
                                </p>
                                <a href="/scm/qlt/qlt_prebul_q.jsp" class="link">link</a>
                            </div>
                            <div class="cont-box c04">
                                <p class="tit">금월 준수율</p>
                                <p id="junsu" class="count">
                                
                                </p>
                                <a href="/scm/ord/ord_junsu_q.jsp" class="link">link</a>
                            </div>
                        </section>
                        <section class="notice-zone">
                            <h3 class="title">공지사항</h3>
                            <span id="notice_cnt" class="info-txt">
                            
                            </span>
                            <div class="notice-box swiper-container" >
                                <ul class="notice-list swiper-wrapper" id="notice">

                                </ul>
                                <!-- Add Arrows -->
                                <div class="swiper-button-next"></div>
                                <div class="swiper-button-prev"></div>
                                <!-- Add Pagination -->
                                <div class="swiper-pagination"></div>
                            </div>
                            <a href="/scm/cmu/cmu_plan_e.jsp" class="btn-more">더보기</a>
                        </section>
                        
                        <section class="data-zone pds-zone">
                            <h3 class="title">자료실</h3>
                            <span id="pds_cnt" class="info-txt">
                            
                            </span>
                            <div class="data-box swiper-container" >
                                <ul class="data-list swiper-wrapper" id="pds">

                                </ul>
                                <!-- Add Arrows -->
                                <div class="swiper-button-next"></div>
                                <div class="swiper-button-prev"></div>
                            </div>
                        </section>
                    </div>
                </div>
                <div class="main-favorite">
                    <div class="inner">
                        <div class="search">
                            <fieldset>
                                <legend>검색</legend>
                                <input type="text" name="top_search" id="top_search" class="inputsch" title="검색어 입력" placeholder="Search">
                                <button class="btnSearch" id="mainfavBtn">검색</button>
                            </fieldset>
                        </div>
                        <div class="favorite-line">
                            <h3 class="tit">즐겨찾기 메뉴</h3>
                            <button class="btn-favorite-modify">수정</button>
                            	<div class="table-box-wrap fav">
									<div class="table-scroll table-scroll_fav basic-scroll">
										<table class="table-type01 wt_head_main">
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
									<button id="btn_favoriteModal" class="favorite-plus" onclick="modalObj.modalOpenFunc('oFavoriteModal')"></button>
                            	<div class="table-box-wrap fav">
									<div class="table-scroll basic-scroll">
										<table class="table-type01 wt_head_main">
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
									<button id="btn_favoriteModal" class="favorite-plus" onclick="modalObj.modalOpenFunc('oFavoriteModal')"></button>
                               <div class="table-box-wrap fav">
                           <div class="table-scroll basic-scroll">
                              <table class="table-type01 wt_head_main">
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
                           <button id="btn_favoriteModal" class="favorite-plus" onclick="modalObj.modalOpenFunc('oFavoriteModal')"></button>
                        </div>
                    </div>
<!--                footer 시작 -->
<!--                footer 끝 -->
               </div>
            </div>
            <footer class="footer">
               <span class="left-logo"><img src="../../img/common/etc_logo01-2.png" alt="PRIS SCM" /></span>
               <span class="license">Copyright © STLSoft . All right reserved.</span>
               <span class="right-logo"><img src="../../img/common/etc_logo02.png" alt="STL SOFT" /></span>
           </footer>
        </main>
    </div>
        <div class="modal-layer-wrap">
          <div id="oFavoriteModal" class="modal-layer w620">
            <jsp:include page="../popup/comm_favorite_f.jsp"/>
         </div>    
        </div>
</body>
</html>