<%-- 
    Document : Header 
    작성일자   : 2021.03.12 
    작성자    : dykim
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import = "java.util.Calendar" %> 
<script>
navigator.geolocation.getCurrentPosition(function(pos) {
	$("#localAddr").empty(); // 다시 주소 초기화 시켜주기

    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;
//     console.log("현재 위치는 : " + latitude + ", "+ longitude);
    
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
          
// 		  console.log("현재 위치는 : " + addr1 + ", "+ addr2 + ", "+addr3);
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
            var icon = "../img/weather/" + weather + ".png"; // 사진결정
            
            $("#weatherIcon").attr('src', icon);
            $("#temp").append(temp + " ºC");
          });
      }
});
</script>
<header class="header">
	<h1 class="logo">
		<a href="/comm/jsp/comm_main.jsp"><img src="../img/common/etc_logo02.png" alt="STLSOFT"></a>
	</h1>
<!-- 	<div class="date"> -->
<!-- 		<span class="tit">Today</span> <span class="today-date">16</span>  -->
<!-- 		<span class="today-txt">January, 2021 (Friday)</span> -->
<!-- 	</div> -->
	 <div class="date">
		<% Calendar cal = Calendar.getInstance(); 
           String []week = {"January","February","March","April","May","June","July","August","September","October","November","December"};
           String []weeks = {"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"};
	    %>
			<span class="tit">Today</span>
            <span id="txt_today_date" class="today-date"><%= cal.get(Calendar.DATE) %></span>
            <span class="today-txt"><%= week[cal.get(Calendar.MONTH)] %>, <%= cal.get(Calendar.YEAR) %> (<%= weeks[cal.get(Calendar.DAY_OF_WEEK)-1] %>)</span>
     </div>
	<div id="weather" class="weather">
	    <span id="localAddr" class="localAddr"></span>
		<img alt="weather" id="weatherIcon" class="weatherIcon" src="../img/weather/01d.png">
		<span id="temp" class="temp"></span>
	</div>

	<button class="btn-logout" id="logOut">로그아웃</button>
	<!--login-->
	<!-- <button class="btn-login">로그인</button> -->
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