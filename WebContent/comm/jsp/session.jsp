<%-- 
    Document   : session
    Created on : 2021. 2. 24, 오전 11:48:32
    Author     : Jordan.Seo
--%>

<%@page import="comm.comm_userData"%>
<%@page import="java.io.PrintWriter"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%

    String currID = "";
    String currCvcod = "";
    String currCvnas = "";
    String currSaupj = "";
    String currGubun = "";
    String currAuth = "";
    if(session != null && session.getAttribute("currentSessionUser") != null && !session.getAttribute("currentSessionUser").equals("")){
       //session에 userId라는 값이 존재할 때
       //UserDTO currentUser  = (UserDTO) session.getAttribute("currentSessionUser") ;
       //System.out.println(currentUser.getUserplace());
       //currID        = (String)currentUser.getUserID(); //로그인 아이디
       //currCvcod     = (String)currentUser.getUserCvcod(); //거래처코드
       //currCvnas = (String)currentUser.getUserCvnas(); //거래처코드
       //currSaupj = (String)currentUser.getUserSaupj();
       //currGubun = (String)currentUser.getUserGubun();
       //currAuth      = (String)currentUser.getUserAuth(); //권한
    }else{
        //System.out.println("No userid"+currID);
        //userId를 사용하지 못할 때
        PrintWriter out2 = response.getWriter();
        out2.println("<script>  location.href='/comm/jsp/comm_login.jsp'; </script>");           
    }        
%>
<%-- <script>
      var currId   = "<%=currId%>";
      var currPlace = "<%=currPlace%>";
      var currPlacename = "<%=currPlacename%>";
      var currAuth = "<%=currAuth%>";
</script> --%>