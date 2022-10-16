<%@page import="java.io.File"%>
<%@page import="java.util.Enumeration"%>
<%@page import="com.oreilly.servlet.multipart.DefaultFileRenamePolicy"%>
<%@page import="com.oreilly.servlet.MultipartRequest"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC"-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
 
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
 
<%
    // request.getRealPath("상대경로") 를 통해 파일을 저장할 절대 경로를 구해온다.
    // 운영체제 및 프로젝트가 위치할 환경에 따라 경로가 다르기 때문에 아래처럼 구해오는게 좋음
    String uploadPath = request.getRealPath("/Upload/vndmst");
    System.out.println("절대경로 : " + uploadPath +"<br/>");
     
    int maxSize =1024 *1024 *10;          // 한번에 올릴 수 있는 파일 용량 : 10M로 제한
     
    String fileName1 ="";                // 중복처리된 이름
    String originalName1 ="";            // 중복 처리전 실제 원본 이름
    long fileSize =0;                    // 파일 사이즈
    String fileType ="";                 // 파일 타입
     
    MultipartRequest multi =null;
     
    try{
        // request,파일저장경로,용량,인코딩타입,중복파일명에 대한 기본 정책
        multi = new MultipartRequest(request,uploadPath,maxSize,"utf-8");
         
        // 전송한 전체 파일이름들을 가져옴
        Enumeration files = multi.getFileNames();
         
        while(files.hasMoreElements()){
            // f.orm 태그에서 <input type="file" name="여기에 지정한 이름" />을 가져온다.
            String fileCvcod = multi.getParameter("cvcod");
            String file1 = fileCvcod.toString();
            
            // 파일 타입 정보를 가져옴
            fileType = multi.getContentType(file1);
            
            // input file name에 해당하는 실재 파일을 가져옴
            File file = multi.getFile(file1);
            
            // 그 파일 객체의 크기를 알아냄
            fileSize = file.length();
            
            File isFile = new File(uploadPath + "/" + fileCvcod + ".jpg");
            if(isFile.exists()) {
            	isFile.delete();
            }
            file.renameTo(new File(uploadPath + "/" + fileCvcod + ".jpg"));
            
            return;
        }
    }catch(Exception e){
        e.printStackTrace();
    }
%>