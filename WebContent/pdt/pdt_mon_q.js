////----------------------------------------------------------------
//// Document : 월간 생산 계획
//// 작성자 : 염지광
//// 작성일자 : 2021-09-06
////----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
//let gvHeightChk = true; //처음 조회시와 조회된 후 페이지만 넘길시에 디자인이 틀려져서 사용

//페이지 오픈시 실행
function setCondition() {
	pgLoadDataRs();
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("insert","modify","save","delete","add","help","cancel");
    // 날짜
    //cfMaxLength("txt_fromDate", "L"); //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리
    cfMaxLength("txt_Yymm", "M");   //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리

//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
//    cfGetHeadCombo("pln_mon_q", "saupj", "sel_saupj"); //사업장 "sel_saupj" : id값
  
    setInitValue();
}
//----------------------------------------------------------------
// 초기값 설정
//----------------------------------------------------------------
function setInitValue() {
    const vToday = cfGetToday();
	cfSetValue("txt_Yymm", cfStringFormat(vToday, "D1").substr(0, 7)); // vToday

}
//----------------------------------------------------------------
// 2.버튼 그룹 이벤트
//----------------------------------------------------------------
//조회 버튼 
function onSearch() {
    pgLoadData(1);
}

// 3. pageTransaction 이벤트
//---------------------------------------------------------------------------------------------------------------------------
//기능 : ajax 통신 후 콜백함수
//인자 : response -> 결과값
//      name -> 호출 시의 명칭
//      status -> 결과상태
//---------------------------------------------------------------------------------------------------------------------------
//동기방식
function pgCallBackSync(response, name, status) {
    let oData;
    if (!status) {
        alert(response);
        return false;
    }
    switch (name) {
        case "startSelect":
            break;        
    }
}
//비동기 방식
function pgCallBackAsync(response, name, status) {
   let vListHTML; 

    if (!status) {
        alert(response);
        return false;
    }
 switch (name) {
		case "txt_itnbr":
            response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {

                cfSetValue("txt_itnbr","");
                cfSetValue("txt_itdsc","");
                cfGetMessage("pdt_mon_q", "message" ,"110");

                return false;
            }

            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.ITDSC;
            }
            cfSetValue("txt_itdsc",vListHTML);
            break;
	}
    
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 데이터 조회 후 테이블 구성
//인자 : page, 선택된 현재 페이지
//반환 : JSONObject
//작성 : dykim
//---------------------------------------------------------------------------------------------------------------------------
function pgLoadData(page) {
    const nPageLength = 20; //페이지당 데이터를 보여줄 행의 갯수    
    
    const sYymm = cfGetValue("txt_Yymm").replace(/-/gi, "");
    const vItnbr = cfGetValue("txt_itnbr");
    const vItdsc = cfGetValue("txt_itdsc");
    
    const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,

        Yymm: sYymm,
        Itnbr: vItnbr, 
        Itdsc: vItdsc
    } 
    
    let oResponse = cfAjaxSync("POST", "pdt_mon_q", oData, "startSelect");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","pdt/pdt_mon_q.txt",null,"table"); //테이블 정보 읽어오기    
    
    const nTotalRecords = oResponse.RecordCount;    //데이터 총 갯수
    const nRecordPerPage = oResponse.PageLength;    //페이지의 갯수
    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;
    if (oResponse.RecordCount > 0) {
		// header 만들기 
        let vHeader = vTable.split("|")[0];
		//console.log("sYymm ="+sYymm.substr(0,4)+"-"+sYymm.substr(4,2));
		vHeader = vHeader.replace("합계",cfStringFormat(sYymm + "01", "D1").substr(0, 7));
		vHeader = vHeader.replace("M1", cfMonthCalc(sYymm, 1));
		vHeader = vHeader.replace("M2", cfMonthCalc(sYymm, 2));
		vListHTML = vHeader;

        vListHTML += "</tr>";
        $("#tbl_head").html(vListHTML); //테이블 헤드
        vListHTML = "";      

  		// body 만들기 
        let vTr = vTable.split("|");                    
        let vRow;
		let oEdit;

        for (i = 0; i < oResult.length; i++) {
            let aItem = oResult[i];
            vListHTML = vTr[1];
            vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
            vRow += vListHTML;                
            vListHTML += "</tr>";

            //Table 원본 자료 저장
            gvOrgData.push({
                "ITNBR": aItem["ITNBR"],    // 품번
                "ITDSC": aItem["ITDSC"],    // 품명
                "ISPEC": aItem["ISPEC"],    // 규격  
                "JIJIL": aItem["JIJIL"],    // 재질                      
				"SUM": aItem["SUM"],		// 합계       
				"QTY_01": aItem["QTY_01"],  // 1주                     
                "QTY_02": aItem["QTY_02"],	// 2주  
                "QTY_03": aItem["QTY_03"],  // 3주
                "QTY_04": aItem["QTY_04"],  // 4주
                "QTY_05": aItem["QTY_05"],  // 5주
                "QTY_06": aItem["QTY_06"],  // 6주
				"M1": aItem["M1"],  	// m+1 월 계획량   
                "M2": aItem["M2"],		// m+2 월 계획량
                "CARCODE": aItem["CARCODE"],	
                "SAUPJ": aItem["SAUPJ"],	
                "M3": aItem["M3"],	
                "M4": aItem["M4"]
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];

		//format
            for (let i = 0; i < vBody.rows.length; i++) {
				// 합계
                vBody.rows[i].cells[4].innerText = cfNumberFormat(vBody.rows[i].cells[4].innerText);
				// 1주
                vBody.rows[i].cells[5].innerText = cfNumberFormat(vBody.rows[i].cells[5].innerText);
				// 2주
                vBody.rows[i].cells[6].innerText = cfNumberFormat(vBody.rows[i].cells[6].innerText);
				// 3주
                vBody.rows[i].cells[7].innerText = cfNumberFormat(vBody.rows[i].cells[7].innerText);
				// 4주
                vBody.rows[i].cells[8].innerText = cfNumberFormat(vBody.rows[i].cells[8].innerText);
				// 5주
                vBody.rows[i].cells[9].innerText = cfNumberFormat(vBody.rows[i].cells[9].innerText);
				// 6주
                vBody.rows[i].cells[10].innerText = cfNumberFormat(vBody.rows[i].cells[10].innerText);
				// M+1월
                vBody.rows[i].cells[11].innerText = cfNumberFormat(vBody.rows[i].cells[11].innerText);
				// M+2월
                vBody.rows[i].cells[12].innerText = cfNumberFormat(vBody.rows[i].cells[12].innerText);
				// M+3월            
                //vBody.rows[i].cells[15].innerText = cfNumberFormat(vBody.rows[i].cells[15].innerText);
				// M+4월            
                //vBody.rows[i].cells[16].innerText = cfNumberFormat(vBody.rows[i].cells[16].innerText);
		}
        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("pdt_mon_q", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
		pgLoadDataRs();
    }
}
//테이블 헤더 출력
function pgLoadDataRs() {

    const sData = {
        ActGubun: "Rs"
    }
    oResponse = cfAjaxSync("POST", "pdt_mon_q", sData, "startSelectS");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","pdt/pdt_mon_q.txt",null,"table"); //테이블 정보 읽어오기
    
    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;
    if (oResult.length > 0) {
		// header
        vListHTML = sTable.split("|")[0];
        vListHTML += "</tr>";
        $("#tbl_head").html(vListHTML); // 하단 테이블 헤드
        vListHTML = "";
		// body
        let vTr = sTable.split("|");
        let oEdit;
        let vRow;

        for (i = 0; i < oResult.length; i++) {
            let aItem = oResult[i];
            
            vListHTML = vTr[1];
            vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
            vRow += vListHTML;
            vListHTML += "</tr>";
        }

        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); // 테이블 몸체
        
    } else {
        cfGetMessage("pdt_mon_q", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
    }
}
//팝업 처리
function pgAfterPopup(id, data) {
    switch(id) {
        case "oVndmstModal":
            cfSetValue("txt_cvcod",data[1]);
            cfSetValue("txt_cvnas",data[2]);
            break;
    }
}

// 4.이벤트 처리
//----------------------------------------------------------------
// 이벤트 처리
//----------------------------------------------------------------
$(document).keydown(function (e) { 
    const vEventId = e.target.id;
    const vEventValue = e.target.value;
    const vEventCode = e.which? e.which : e.keyCode;
    switch(vEventId) {
        case "txt_itnbr":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vItnbr = vEventValue;
                if (vItnbr != "") {
                    const oData = {
                        SearchGubun:"inputItnbr",
                        Itnbr: vItnbr
                    };
                    cfAjaxAsync("GET","pdt_mon_q",oData,"txt_itnbr");              
                }
            }
            break;
	  }
    
});

//페이지 클릭 시 데이터 
$(document).on("click", ".page-link", function (event) {
    const pagenum = $(this).attr("id");
    pgLoadData(pagenum);
});

//테이블의 행에서 입력가능한 Column에 클릭시 테두리 생성
$(document).on('click','.row_data',function(e) {
    e.preventDefault();
    //console.log(e.type);
    vTmpVal = $(this).text();
    $(this).closest('div').attr('contenteditable', 'true');
    //add bg css
    $(this).addClass('pd5');
    $(this).focus();
});

//테이블의 행에서 입력가능한 Column에서 입력후 포커스가 벗어날시
$(document).on('blur', '.row_data', function(e) {
    //console.log(e);
    $(this).attr('contenteditable', false);
    //$(this).css('background', '');
    $(this).removeClass('pd5');
    const vText = $(this).text();               
    //const vTrid = $(this).parent().parent().attr("id"); //row id가져오기
    //console.log($(this).parent().parent()[0].cells[9].innerText);
    //this는 입력한 박스 object이다.
    //this.parent()는 td이다.
    //this.parent()는 tr이다.
    const nBal = $(this).parent().parent()[0].cells[9].innerText;
    //$(this).closest('tr')[0].cells[9].innerText; 위의 선택자와 같음
    if(Number(vText) < 0 ){
        $("#oCheckMessage").html("납입 수량은 0보다 작을 수 없습니다.");
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');  
        $(this).text(0); //원값으로 복귀
        return false;
    }
    if(Number(vText) > Number(nBal)){
        $("#oCheckMessage").html("잔량보다 큽니다. 다시 입력하세요.");
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');
        $(this).text(0);
        return false;    
    }
});

$(document).on('click', 'input:radio[name=gubun]', function (e) {
/*    $("#tbl_wrap > thead").empty(); //테이블 Clear           
    $("#tbl_wrap > tbody").empty(); //테이블 Clear                    
    $("#oPaginate").html("");  // 페이징 Clear;*/
    cfClearData("tbl_wrap", "oPaginate");
    //gvHeightChk = true;
});
//품번 모달 선택값 설정 후 종료
$(document).on('dblclick', '#tbl_tbody_itemas_p tr ', function () { 
    const aTableData = $(this).children("td").map(function() {
        return $(this).text();
    })      
    $("#txt_itnbr").val(aTableData[0]);
    $("#txt_itdsc").val(aTableData[1]);
    $('.btn-modal-close').click();
});

 