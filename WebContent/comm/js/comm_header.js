$(document).on("click", "#logOut", function(event) {
        cfAjaxSync("GET", "comm_logOut", '',"logOut" );
        cfClearAllStorage(); 
        location.href = "/comm/jsp/comm_login.jsp";
/*        $.ajax({
            type : "GET",
            url  : "../LogOut", //자바 서블릿의 URL명       
            data:{},//자바로 전송할 값                 
            success : function(msg) {
                $(location).attr('href','../html/login.jsp');
            },
            error : function(request,status,error) {
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            }
        });             */
});