//----------------------------------------------------------------
// Document : 출발 처리
// 작성자 : 김대영
// 작성일자 : 2021-03-02
//----------------------------------------------------------------

//글로벌 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
//페이지 오픈시 실행
$(document).ready(function () {
//----------------------------------------------------------------------------------------------------------------------------
// 초기값 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("insert","print","modify");		
    // 날짜
    $("#txt_fromDate").attr('maxlength', 10);   //최대길이 설정
    $("#txt_toDate").attr('maxlength', 10);     //최대길이 설정
    
    //날짜 포멧,이미지 설정 및 초기값 설정시 default값  
    
    //시작일.
    $('#txt_fromDate').datepicker({
        showOn: "button",                     // 달력을 표시할 타이밍 (both: focus or button)
        buttonImage: "../img/contents/icon_calendar.png", // 버튼 이미지
        buttonImageOnly : true,             // 버튼 이미지만 표시할지 여부
        buttonText: "날짜선택",             // 버튼의 대체 텍스트
        dateFormat: "yy-mm-dd",             // 날짜의 형식
        changeMonth: true,                  // 월을 이동하기 위한 선택상자 표시여부
        //minDate: 0,                       // 선택할수있는 최소날짜, ( 0 : 오늘 이전 날짜 선택 불가)
        onClose: function( selectedDate ) {    
            // 시작일(fromDate) datepicker가 닫힐때
            // 종료일(toDate)의 선택할수있는 최소 날짜(minDate)를 선택한 시작일로 지정
            $("#txt_toDate").datepicker( "option", "minDate", selectedDate );
        }                
    });
    $('#txt_toDate').datepicker ({
        showOn: "button",
        buttonImage: "../img/contents/icon_calendar.png",
        buttonImageOnly: true,
        buttonText: "날짜선택",
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        //minDate: 0, // 오늘 이전 날짜 선택 불가
        onClose: function (selectedDate) {
            // 종료일(toDate) datepicker가 닫힐때
            // 시작일(fromDate)의 선택할수있는 최대 날짜(maxDate)를 선택한 종료일로 지정 
            $("#txt_fromDate").datepicker("option", "maxDate", selectedDate);
        }
    });
    $("#txt_fromDate").datepicker('setDate','-7D'); //7일전 설정 //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
    $("#txt_toDate").datepicker('setDate', 'today');

//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
    cfGetHeadCombo("ord_chul_e", "saupj", "sel_saupj"); //사업장
    cfGetHeadCombo("ord_chul_e", "ittyp", "sel_ittyp"); //품목구분
    gvPojang = "<option></option>" + cfGetTableCombo("ord_chul_e", "pojang");   //포장용기
//----------------------------------------------------------------
// 버튼이벤트
//----------------------------------------------------------------
    //조회 버튼 
    $("#btn_search").on("click",function (){ 
        pgLoadData(1); 
    });
    //저장 버튼
    $("#btn_save").on("click",function(e){		
        if(jfUpdateChk(e.target.id)){		
            let vRowData = new Array();
            let bUpdateStat = true;
            //head를 초과한 객체들을 반복선택
             $('#tbl_wrap tr:gt(0)').each(function(row, tr){
                //tr의 자식요소인 td들의 배열 
                const aTableData = $(this).children("td").map(function() {
                    //console.log($(this).children("td").map());
                    return $(this).text();
                });
                console.log($(this));
                console.log(aTableData);
                //tr td dropdown에서 값 가져오기
                let vSelectboxes = $(this).find("select").val();
                let vIpdpt = ''+aTableData[19]; //공장코드 IPDPT
                console.log(vIpdpt);
                //Uncaught TypeError: Cannot read property 'substring' of undefined
                //Uncaught TypeError: Cannot read property 'substr' of undefined
                //위 에러 발생하면 변수 앞메 '' 연결하여 받은 변수로 substr 사용 정확하게 문자 변환이 안되어 발생함.
                vIpdpt = vIpdpt.substring(0,2);
                            
                if(vIpdpt == "ZZ" ) {
                    if(vIpdpt == "") {
                        $("#oCheckMessage").html("공장코드를 선택하세요.");
                        $("#checkType").attr("class", "modal-content panel-success");
                        modalObj.modalOpenFunc('oCheckModal');
                        bUpdateStat = false;                        
                        return false;
                    }
                }
                if(aTableData[10] == "" || aTableData[10] == 0) {
                    $("#oCheckMessage").html("출발 처리할 납품수량을 입력하지 않으셨습니다.");
                    $("#checkType").attr("class", "modal-content panel-success");
                    modalObj.modalOpenFunc('oCheckModal');
                    bUpdateStat = false;                    
                    return false;
                } 
                if(aTableData[10] > 0) {
                    if(vSelectboxes == "" ) {
                        $("#oCheckMessage").html("포장용기를 선택하여 주십시오.");
                        $("#checkType").attr("class", "modal-content panel-success");
                        modalObj.modalOpenFunc('oCheckModal');
                        bUpdateStat = false;
                        return false;
                    }
                }           
                //Table 자료 저장
                vRowData.push({
                    "GINGUB" : aTableData[0]//구분
                    , "BALJPNO": aTableData[1]//발주번호  
                    , "ITNBR"  : aTableData[2]//품번
                    , "ITDSC" :  aTableData[3]//품명
                    , "ISPEC" :  aTableData[4]//규격  
                    , "JIJIL" :  aTableData[5]//재질                      
                    , "JANRU" :  aTableData[6]//발주량                     
                    , "GUDAT" :  aTableData[7]//납기요구일
                    , "NAPDATE": aTableData[8]//납기일
                    , "WBALQTY": aTableData[9]//발주잔량
                    , "NAQTY" :  aTableData[10]//납품수량   
                    , "POJANG":  vSelectboxes //포장용기                                            
                    , "POQTY" :  aTableData[12]//포장용기량
                    , "UNMSR" :  aTableData[13]//단위
                    , "FACTORY":  aTableData[14]//공장
                    , "ESTNO" :  aTableData[15]//    
                    , "ORDER_NO" :  aTableData[16]//    
                    , "BIGO"  :  aTableData[17]//비고
                    , "LOTNO" :  aTableData[18]//포장용기량
                    , "IPDPT" : aTableData[19]//창고코드
                    , "CVCOD" : aTableData[20]//업체코드
                    , "BALSEQ" : aTableData[21]//
                    , "PSPEC" : aTableData[22]//
                    , "PFILE" : aTableData[23]//
                    , "BALRATE" : aTableData[24]//
                    , "IPSAUPJ" : aTableData[25]//
                });
            });

            if(bUpdateStat) {
                $.ajax({
                    type : "POST",
                    url : "../ord_chul_e",
                    data:{ActGubun:"I",JsonData:JSON.stringify(vRowData),OrgData:JSON.stringify(gvOrgData)},
                    success : function(json) {
                        data = JSON.parse(json);
                        if(data.Result != true){
                            $("#oCheckMessage").html(data.Message);
                            $("#checkType").attr("class", "modal-content panel-success");
                            modalObj.modalOpenFunc('oCheckModal');
                        } else {
                            //alert창이 아닌 팝업형식으로 알림창을 띄울시 몇 건 처리 했는지 알림창이 조회로 인해 넘어감
                            alert(data.InsertCnt+"건 처리 완료했습니다");
                            pgLoadData(1);	//재조회
                        }
                    },
                    error : function(request,status,error) {
                        console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
                        $("#oCheckMessage").html("[DB Error: " + error + "] 시스템 로그를 확인 또는 전산실 연락바랍니다.");
                        $("#checkType").attr("class", "modal-content panel-success");
                        modalObj.modalOpenFunc('oCheckModal'); 
                    }
                });
            }
        }
    });
    //삭제 버튼
    $("#btn_delete").on("click",function(e){
        if (jfUpdateChk(e.target.id)){
            if (confirm("선택하신 자료를 삭제하시겠습니까?") != true) {
                return false;
            }
            const vRowData = new Array();
            const vChkBox = $("input[name=ListChk]:checked");
            
            vChkBox.each(function(i){
                // vChkbox.parent() : vChkBox의 부모는 <td> 태그이다.
                // vChkbox.parent().parent() : <td>의 부모이므로 <tr>이다.
                const vTr = vChkBox.parent().parent().eq(i);
                const vTd = vTr.children();
                // vTd.eq(0)은 체크박스이다.
                const vPk = vTd.eq(16).text(); 
                vRowData.push({
                    "KEY" : vPk.replace(/^\s+|\s+$/gm,'')
                });
            });
            if(vRowData.size == 0) {
                $("#oCheckMessage").html("삭제할 납입전표를 선택하세요.");
                $("#checkType").attr("class", "modal-content panel-success");
                modalObj.modalOpenFunc('oCheckModal');   
                return false;
            }
            $.ajax({
                type : "POST",
                url : "../ord_chul_e",
                data:{ActGubun:"D",JsonData:JSON.stringify(vRowData)},
                success : function(json) {
                    data = JSON.parse(json);
                    if (data.Result != true){
                        $("#oCheckMessage").html(data.Message);
                        $("#checkType").attr("class", "modal-content panel-success");
                        modalObj.modalOpenFunc('oCheckModal');   
                    } else {
                        //alert창이 아닌 팝업형식으로 알림창을 띄울시 몇 건 처리 했는지 알림창이 조회로 인해 넘어감
                        alert(data.DeleteCnt+"건 삭제가 완료되었습니다.");
                        pgLoadData(1);
                    }
                },
                error : function(request,status,error){
                    console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
                    $("#oCheckMessage").html("[DB Error: " + error + "] 시스템 로그를 확인 또는 전산실 연락바랍니다.");
                    $("#checkType").attr("class", "modal-content panel-success");
                    modalObj.modalOpenFunc('oCheckModal');      
                }
            });
        }
    });
    
    
    //페이지 클릭 시 데이터 
    $(document).on("click",".page-link",function(event){
        let pagenum =  $(this).attr("id");
        pgLoadData(pagenum);
    });

//---------------------------------------------------------------------------------------------------------------------------
//기능 : 데이터 조회 후 테이블 구성
//인자 : page, 선택된 현재 페이지
//반환 : JSONObject
//작성 : 김대영
//---------------------------------------------------------------------------------------------------------------------------
    function pgLoadData(page) {       
        const nPageLength = 20; //페이지당 데이터를 보여줄 행의 갯수
        let vGubun     = $(":input:radio[name=gubun]:checked").val();    //라디오 체크된 버튼의 value값
        let nFdate     = $("#txt_fromDate").val().replace(/-/gi,"");  //<-- replaceAll기능
        let nTdate     = $("#txt_toDate").val().replace(/-/gi,"");       
        let vCvcod   = $("#txt_cvcod").val();
        let vCvnas   = $("#txt_cvnas").val();
        let vSaupj = $("#sel_saupj option:selected").val();
        let vItnbr   = $("#txt_itnbr").val();
        let vItdsc     = $("#txt_itdsc").val();       
        let vIttyp  = $("#sel_ittyp option:selected").val();              
        //값 체크
        if(vCvcod == ""){
            //$("#oCheckMessage").html("거래처 코드를 입력하여 주십시오.");
            //$("#checkType").attr("class", "modal-content panel-success");
            //modalObj.modalOpenFunc('oCheckModal');
            cfGetMessage("ord_chul_e", "message" ,"203");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "../ord_chul_e",
            data: { ActGubun: "R", Page: page, PageLength: nPageLength, Gubun: vGubun, Fdate: nFdate, Tdate: nTdate, Cvcod: vCvcod, Cvnas: vCvnas, Saupj: vSaupj, Itnbr: vItnbr, Itdsc: vItdsc, Ittyp: vIttyp },
            datatype: 'JSON',
            success: function (response) {
                let vListHTML = "";
                //console.log(response);
                aData = JSON.parse(response);
                aData = JSON.parse(JSON.stringify(aData).replace(/\:null/gi, "\:\"\"")); //null을 공백으로
                const nTotalRecords = aData.RecordCount; //총건수                
                const nRecordPerPage = aData.PageLength; //페이지당 표시 갯수
                let nPageno = aData.PageNo; //선텍 페이지 번호
                //console.log(nPageno);                                
                let aRs = aData.DATA;

                if (aData.RecordCount > 0) {
                    vListHTML += "<tr>";
                    if (vGubun == "I") {
                        vListHTML += "<th width='70px'>구분</th>";
                        vListHTML += "<th width='150px'>발주번호</th>";
                        vListHTML += "<th width='120px'>품번</th>";
                        vListHTML += "<th width='200px'>품명</th>";
                        vListHTML += "<th width='180px'>규격</th>";
                        vListHTML += "<th width='100px'>재질</th>";
                        vListHTML += "<th width='80px'>발주량</th>";
                        vListHTML += "<th width='100px'>납기요구일</th>";
                        vListHTML += "<th width='100px'>납기일</th>";
                        vListHTML += "<th width='80px'>발주잔량</th> ";
                        vListHTML += "<th width='80px'>납품수량</th>";
                        vListHTML += "<th width='150px'>포장용기</th> ";
                        vListHTML += "<th width='100px'>용기적입수</th>";
                        vListHTML += "<th width='50px'>단위</th>";
                        vListHTML += "<th width='50px'>공장</th>";
                        vListHTML += "<th width='120px'>오더번호</th>";
                        vListHTML += "<th width='120px'>고객발주번호</th>";
                        vListHTML += "<th width='200px'>비고</th>";
                        vListHTML += "<th width='120px'>LOT NO</th>";
                        vListHTML += "<th width='0px' class='table-contents hidden'>IPDPT</th>";
                        vListHTML += "<th width='0px' class='table-contents hidden'>CVCOD</th>"
                        vListHTML += "<th width='0px' class='table-contents hidden'>BALSEQ</th>"
                        vListHTML += "<th width='0px' class='table-contents hidden'>PSPEC</th>"
                        vListHTML += "<th width='0px' class='table-contents hidden'>PFILE</th>"
                        vListHTML += "<th width='0px' class='table-contents hidden'>BALRATE</th>"
                        vListHTML += "<th width='0px' class='table-contents hidden'>IPSAUPJ</th>"
                    } else {
                        vListHTML += "<th scope='col'><input type='checkbox' name='checkAll' id='checkAll'></th>";
                        vListHTML += "<th scope='col'>납품처</th>";
                        vListHTML += "<th scope='col'>납품번호</th>";
                        vListHTML += "<th scope='col'>품번</th>";
                        vListHTML += "<th scope='col'>품명</th>";
                        vListHTML += "<th scope='col'>규격</th>";
                        vListHTML += "<th scope='col'>재질</th>";
                        vListHTML += "<th scope='col'>수량</th>";
                        vListHTML += "<th scope='col'>공장</th>";
                        vListHTML += "<th scope='col'>입고상태</th>";
                        vListHTML += "<th scope='col'>발주번호</th>";
                        vListHTML += "<th scope='col'>순번</th> ";
                        vListHTML += "<th scope='col'>고객발주번호</th> ";
                        vListHTML += "<th scope='col'>포장용기</th> ";
                        vListHTML += "<th scope='col'>용기적입수</th> ";
                        vListHTML += "<th scope='col'>비고</th> ";
                        vListHTML += "<th width='0px' style='display : none;'>JPNO</th>"
                    }
                    vListHTML += "</tr>";
                    $("#tbl_head").html(vListHTML); //테이블 헤드
                    vListHTML = "";
                    for (i = 0; i < aRs.length; i++) {
                        let aItem = aRs[i];
                        vListHTML += "<tr id='" + i + "'>";
                        if (vGubun == "I") {
                            console.log(aItem[1]);
                            vListHTML += "<td class='table-contents center'>" + aItem["GINGUB"] + "</td>"; //구분
                            vListHTML += "<td class='table-contents center'>" + aItem["BALJPNO"] + "</td>"; //발주번호
                            vListHTML += "<td class='table-contents left'>" + aItem["ITNBR"] + "</td>"; //품번
                            vListHTML += "<td class='table-contents left'>" + aItem["ITDSC"] + "</td>"; //품명
                            vListHTML += "<td class='table-contents left'>" + aItem["ISPEC"] + "</td>"; //규격
                            vListHTML += "<td class='table-contents left'>" + aItem["JIJIL"] + "</td>"; //재질
                            vListHTML += "<td class='table-contents right'>" + aItem["JANRU"] + "</td>"; //발주량
                            vListHTML += "<td class='table-contents center'>" + aItem["GUDAT"] + "</td>"; //납기요구일
                            vListHTML += "<td class='table-contents center'>" + aItem["NAPDATE"] + "</td>"; //납기일
                            vListHTML += "<td class='table-contents right'>" + aItem["WBALQTY"] + "</td>"; //발주잔량
                            vListHTML += "<td class='table-contents right'><div class='row_data' id='commands' edit_type='click' col_name='RT11' >" + aItem["NAQTY"] + "</div></td>"; //납품수량
                            vListHTML += "<td class='dropdown'>";
                            vListHTML += "  <select id='row_select' >";
                            vListHTML +=        gvPojang; //포장용기
                            vListHTML += "  </select>";
                            vListHTML += "</td>";
                            vListHTML += "<td class='table-contents left'>" + aItem["POQTY"] + "</td>"; //용기적입수
                            vListHTML += "<td class='table-contents center'>" + aItem["UNMSR"] + "</td>"; //단위
                            vListHTML += "<td class='table-contents center'>" + aItem["FACTORY"] + "</td>"; //공장
                            vListHTML += "<td class='table-contents center'>" + aItem["ESTNO"] + "</td>"; //오더번호
                            vListHTML += "<td class='table-contents center'>" + aItem["ORDER_NO"] + "</td>"; //고객발주번호
                            vListHTML += "<td class='table-contents left'>" + aItem["BIGO"] + "</td>"; //비고
                            vListHTML += "<td class='table-contents left'>" + aItem["LOTNO"] + "</td>"; //LOTNO
                            vListHTML += "<td class='table-contents hidden'>" + aItem["IPDPT"] + "</td>";
                            vListHTML += "<td class='table-contents hidden'>" + aItem["CVCOD"] + "</td>";
                            vListHTML += "<td class='table-contents hidden'>" + aItem["BALSEQ"] + "</td>";
                            vListHTML += "<td class='table-contents hidden'>" + aItem["PSPEC"] + "</td>";
                            vListHTML += "<td class='table-contents hidden'>" + aItem["PFILE"] + "</td>";
                            vListHTML += "<td class='table-contents hidden'>" + aItem["BALRATE"] + "</td>";
                            vListHTML += "<td class='table-contents hidden'>" + aItem["IPSAUPJ"] + "</td>";
                        } else {
                            vListHTML += "<td class='table-contents center'><input type='checkbox' name='ListChk' id='oListChk'></td>";
                            vListHTML += "<td class='table-contents left'>" + aItem["DEPOT_NO"] + "</td>";
                            vListHTML += "<td class='table-contents center''>" + aItem["JPNO_HEAD"] + "</td>";
                            vListHTML += "<td class='table-contents left'>" + aItem["ITNBR"] + "</td>";
                            vListHTML += "<td class='table-contents left'>" + aItem["ITDSC"] + "</td>";
                            vListHTML += "<td class='table-contents left''>" + aItem["ISPEC"] + "</td>";
                            vListHTML += "<td class='table-contents center'>" + aItem["JIJIL"] + "</td>";
                            vListHTML += "<td class='table-contents right''>" + aItem["NAQTY"] + "</td>";
                            vListHTML += "<td class='table-contents left''>" + aItem["FACTORY"] + "</td>";
                            vListHTML += "<td class='table-contents center'>" + aItem["IO_TXT"] + "</td>";
                            vListHTML += "<td class='table-contents center'>" + aItem["BALJPNO"] + "</td>";
                            vListHTML += "<td class='table-contents center'>" + aItem["BALSEQ"] + "</td>";
                            vListHTML += "<td class='table-contents center'>" + aItem["ORDER_NO"] + "</td>";
                            vListHTML += "<td class='table-contents left'>" + aItem["POJANG"] + "</td>";
                            vListHTML += "<td class='table-contents right'>" + aItem["POQTY"] + "</td>";
                            vListHTML += "<td class='table-contents left'>" + aItem["BIGO"] + "</td>";
                            vListHTML += "<td class='table-contents hidden'>" + aItem["JPNO"] + "</td>";
                        }

                        vListHTML += "</tr>";
                        //Table 원본 자료 저장
                        gvOrgData.push ({
                            "GINGUB": aItem["GINGUB"]//구분
                            , "BALJPNO": aItem["BALJPNO"]//발주번호  
                            , "ITNBR": aItem["ITNBR"]//품번
                            , "ITDSC": aItem["ITDSC"]//품명
                            , "ISPEC": aItem["ISPEC"]//규격  
                            , "JIJIL": aItem["JIJIL"]//재질                      
                            , "JANRU": aItem["JANRU"]//발주량                     
                            , "GUDAT": aItem["GUDAT"]//납기요구일
                            , "NAPDATE": aItem["NAPDATE"]//납기일
                            , "WBALQTY": aItem["WBALQTY"]//발주잔량  
                            , "NAQTY": aItem["NAQTY"]//납품수량 
                            , "POJANG": "" //포장용기    
                            , "POQTY": aItem["POQTY"]//용기적입수
                            , "UNMSR": aItem["UNMSR"]//단위
                            , "FACTORY": aItem["FACTORY"]//공장
                            , "ESTNO": aItem["ESTNO"]// 오더번호
                            , "ORDER_NO": aItem["ORDER_NO"]//고객발주번호
                            , "BIGO": aItem["BIGO"]//비고
                            , "LOTNO": aItem["LOTNO"]//LOTNO
                            , "CVCOD": aItem["CVCOD"]//업체코드
                            , "BALSEQ": aItem["BALSEQ"]//발주순번    
                            , "PSPEC": aItem["PSPEC"]//
                            , "PFILE": aItem["PFILE"]
                            , "BALRATE": aItem["BALRATE"]//발주단위    
                            , "IPSAUPJ": aItem["IPSAUPJ"]//사업장코드
                            , "IPDPT": aItem["IPDPT"]//창고코드                    
                        });
                    }
                    $("#tbl_wrap").show();
                    $("#tbl_body").html(vListHTML); //테이블 몸체  
                    //페이징
                    if (nTotalRecords > nRecordPerPage) {
                        const nTotalpage = Math.ceil(nTotalRecords * 1.0 / nRecordPerPage);   //총페이지          
                        const nBlock = 10;
                        //const blockNum = Math.ceil(nTotalpage * 1.0 / nBlock); //페이지번호 10개까지 표시 총블록
                        const nNowBlock = parseInt((Number(nPageno) - 1) / nBlock) + 1;
                        let nSpage = (nNowBlock - 1) * nBlock + 1; //시작페이지
                        if (nSpage <= 1) {
                            nSpage = 1;
                        }
                        let nEpage = nSpage + nBlock - 1;
                        if (nTotalpage < nEpage) {
                            nEpage = nTotalpage;
                        };

                        vListHTML = "";
                        //앞페이지 이동(블럭)
                        if (nSpage == 1) {
                            vListHTML = "<a href='#' class='prev disabled' title='이전 페이지'><span class='icon-chevron-left'></span></a>";
                        }
                        else {
                            const nPrevpage = Number(nPageno) - 1;
                            vListHTML = "<a href='#' class='page-link prev' title='이전 페이지' id='" + nPrevpage + "'><span class='icon-chevron-left'></span></a>";
                        }
                        vListHTML = vListHTML + "<span>";
                        for (i = nSpage; i <= nEpage; i++) {
                            if (nPageno == i) {
                                vListHTML = vListHTML + "<a href='#' class='page-link active' title='" + i + " 페이지'  id='" + i + "'>" + i + "</a>";
                            }
                            else{
                                vListHTML = vListHTML + "<a href='#' class='page-link' title=" + i + " 페이지'  id='" + i + "'>" + i + "</a>";
                            }
                        }
                        vListHTML = vListHTML + "</span>";
                        //뒤페이지 이동(블럭)
                        console.log(nEpage, nTotalpage);
                        if (nEpage >= nTotalpage) {
                            vListHTML = vListHTML + "<a href='#' class='next disabled' title='다음페이지'><span class='icon-chevron-right'></span></a>";
                        }
                        else {
                            const nNextpage = Number(nPageno) + 1;
                            vListHTML = vListHTML + "<a href='#' class='page-link next' title='다음페이지' id='" + nNextpage + "'><span class='icon-chevron-right'></span></a>";
                        }
                        //테이블의 길이때문에 페이지 네비게이션이 안보일경우 사용
                        cfAutoHeight(10);
                    }
                    else {
                        vListHTML = "";
                    }
                    //console.log(vListHTML);
                    $("#paginate").html(vListHTML);
                }
                else {
                    $("#tablelist").hide();
                    //$("#oCheckMessage").html("해당 조회조건에 대한 자료가 없습니다.");
                    //$("#checkType").attr("class", "modal-content panel-success");
                    //modalObj.modalOpenFunc("oCheckModal");
                    cfGetMessage("ord_chul_e", "message" ,"300");
                    $("#tbl_wrap > tbody").empty(); //테이블 Clear                    
                    $("#paginate").html("");  // 페이징 Clear;
                }
            },
            error: function (request, status, error) {
                console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                $("#oCheckMessage").html("[DB Error: " + error + "] 시스템 로그를 확인 또는 전산실 연락바랍니다.");
                $("#checkType").attr("class", "modal-content panel-success");
                modalObj.modalOpenFunc('oCheckModal');   
            }
        });
    };  
});

// 이벤트 처리
$(document).keydown(function (e) { 
    let vEventId = e.target.id;
    let vEventValue = e.target.value;
    let vEventCode = e.which? e.which : e.keyCode;
    switch(vEventId) {
        case "txt_fromDate":
            if (vEventCode == 13) {
                const vFormatNum = cfStringFormat(vEventValue,"D");
                $("#txt_fromDate").val(vFormatNum);
            }
            break;
        case "txt_toDate":
            if (vEventCode == 13) {
                const vFormatNum = cfStringFormat(vEventValue,"D");
                $("#txt_toDate").val(vFormatNum);
            }
            break;
        case "txt_cvcod":
            // 13 = Enter 키
            if (vEventCode == 13) {
                let vCvcod = vEventValue;
                if (vCvcod != "") {
                    $.ajax({
                        type: "GET",
                        url: "../ord_chul_e",
                        data: {SearchGubun:"inputCvcod",Cvcod:vCvcod},
                        dataType: "JSON",
                        success: function (response) {
                            let vListHTML = "";
                            for(let i=0; i<response.DATA.length;i++)
                            {
                                let vItem = response.DATA[i];
                                vListHTML = vItem.CVNAS;
                            }
                            $("#txt_cvnas").val(vListHTML);
                        },
                        error : function(request,status,error){
                            $("#txt_cvcod").val();
                            $("#txt_cvnas").val();
                            //$("#oCheckMessage").html("올바른 거래처 코드를 입력하여 주십시오.");
                            //$("#checkType").attr("class", "modal-content panel-success");
                            //modalObj.modalOpenFunc('oCheckModal');
                            cfGetMessage("ord_chul_e", "message" ,"50");
                        }
                    });
                }
            }
            break;
    }
});

//테이블의 행에서 입력가능한 Column에 클릭시 테두리 생성
$(document).on('click','.row_data',function(e) {
    e.preventDefault();
    vTmpVal = $(this).text();
    $(this).closest('div').attr('contenteditable', 'true');
   //add bg css
    $(this).addClass('bg-warning').css('padding','5px'); //색상표시
    $(this).focus();
});


//테이블의 행에서 입력가능한 Column에서 입력후 포커스가 벗어날시
$(document).on('blur', '.row_data', function(e){
    $(this).attr('contenteditable', false);
    $(this).css('background', '');
    const vText = $(this).text();               
    const vTrid = $(this).parent().parent().attr("id"); //row id가져오기
    const nBal = gvOrgData[vTrid]["WBALQTY"];
    if(Number(vText) < 0 ){
        $("#oCheckMessage").html("납입 수량은 0보다 작을 수 없습니다.");
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');  
        $(this).text(gvTmpVal); //원값으로 복귀
        return false;
    }
    if(Number(vText) > Number(nBal)){
        $("#oCheckMessage").html("잔량보다 큽니다. 다시 입력하세요.");
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');
        $(this).text(gvTmpVal); //원값으로 복귀
        $(this).focus();
        return false;    
    }
});

//업체리스트 모달 선택값 설정 후 종료
$(document).on('dblclick', '#tbl_tbody_vndmst_p tr ', function () { 
    const aTableData = $(this).children("td").map(function() {
        return $(this).text();
    })      
    $("#txt_cvcod").val(aTableData[1]);
    $("#txt_cvnas").val(aTableData[2]);
    $('.btn-modal-close').click();
});

//사용자 정의 함수
function jfUpdateChk(id)
{
    const vGubun = $(":input:radio[name=gubun]:checked").val();
    if (id == "btn_save") {
        if (vGubun == "D") {
            $("#oCheckMessage").html("취소모드에서는 저장이 불가능합니다.");
            $("#checkType").attr("class", "modal-content panel-success");
            modalObj.modalOpenFunc('oCheckModal');
            return false;
        }
    }
    else {
        if (vGubun == "I"){
            $("#oCheckMessage").html("저장모드에서는 삭제가 불가능합니다.");
            $("#checkType").attr("class", "modal-content panel-success");
            modalObj.modalOpenFunc('oCheckModal');
            return false;	
        }
    }
    return true;
}