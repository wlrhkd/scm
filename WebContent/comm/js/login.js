$(document).ready(function(){

    $("#id").keydown(function(event){      
        var code = event.which? event.which : event.keyCode;
        if(code === 13) $("#pass").focus();
		$("#sub_input").addClass("hidden");
		$("#con_input").addClass("hidden");
    });
    $("#pass").keydown(function(event){      
        var code = event.which? event.which : event.keyCode;
        if(code === 13){
			$("#loginBtn").click();
		}
		$("#sub_input").addClass("hidden");
		$("#con_input").addClass("hidden");a
    });
    console.log($(location));
   //로그인 처리
    $( "#loginBtn" ).on("click",function(){
        var userId   = $("#id").val(); 
        var inUserid   = $("#id").val(); 
        var userPass = $("#pass").val();
        if(userId == "" || userPass == ""){
			$("#sub_input").removeClass("hidden");
            $("#sub_input").focus();
            return false;
        }
        $.ajax({
            type : "POST",
            url  : "../../comm_login", //자바 서블릿의 URL명
            data:{id:userId,pass:userPass},//자바로 전송할 값      
            success : function(msg) {
                console.log(msg);
                var response = jQuery.parseJSON(msg);
                if( response.result == 1){
                    //로그인 성공처리
                    //alert("성공");
					
                    sessionStorage.setItem('userId', response.userId);
                    sessionStorage.setItem('userCvcod', response.userCvcod);
                    sessionStorage.setItem('userCvnas', response.userCvnas);
                    sessionStorage.setItem('userAuth', response.userAuth);
                    sessionStorage.setItem('userSaupj', response.userSaupj);
                    sessionStorage.setItem('userGubun', response.userGubun);
                    $(location).attr('href','../jsp/comm_main.jsp');
                }else if(response.result == 0){
                    //비밀번호 오류 처리
                    $("#con_input").removeClass("hidden");
            		$("#con_input").focus();
                }else {                    
                    //미존재 아이디
                    alert("DB 접속 오류");
                }                
            },
            error : function(request,status,error) {
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            }
        });
    });   
});