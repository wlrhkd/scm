//----------------------------------------------------------------
// Document : 불량 현황 내역
// 작성자 : 염지광
// 작성일자 : 2021-10-01
//----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
let gvAuth;
//페이지 오픈시 실행
function setCondition() {
	pgLoadDataRs();
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("insert","save","modify","help","add","delete","cancel");
    // 날짜
    cfMaxLength("txt_fromDate", "M"); //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리
    cfMaxLength("txt_toDate", "M");   //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리
	setInitValue();
//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
    cfGetHeadCombo("qlt_prebul_q", "saupj", "sel_saupj"); //사업장
    setInitValue();
//	pgLoadData(1);
	// 관리자/사용자
	cfGetAuth();
	if(gvAuth == "0"){
		$("#txt_cvcod").addClass("bg-gray");
		$("#txt_cvcod").prop('readonly', true);
		$("#btn_vndmstModal").prop('disabled', true);
	}
}
//----------------------------------------------------------------
// 초기값 설정
//----------------------------------------------------------------
function setInitValue() {
    const vToday = cfGetToday();
	cfSetValue("txt_fromDate", cfStringFormat(vToday, "D1").substr(0, 7));
	cfSetValue("txt_toDate", cfStringFormat(vToday, "D1").substr(0, 7));
	// 업체
    const vCvcod = cfGetLoginCvcod();
    const vCvnas = cfGetLoginCvnas();
	cfSetValue("txt_cvcod", vCvcod);
    cfSetValue("txt_cvnas", vCvnas);

}
//----------------------------------------------------------------
// 2.버튼 그룹 이벤트
//----------------------------------------------------------------
//조회 버튼 
function onSearch() {
    pgLoadData(1);
    pgLoadDataAll(1);
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
	let vListHTML;
    let oData;
    if (!status) {
        alert(response);
        return false;
    }
    switch (name) {
        case "startSelect":
            break;
		case "getAuth":
			response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {
                return false;
            }

            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.AUTH;
            }
            gvAuth = vListHTML;

            break;  
    }
}
//비동기 방식
function pgCallBackAsync(response, name, status) {
    let oData;
    if (!status) {
        alert(response);
        return false;
    }
    switch (name) {
        case "txt_cvcod":
            response = JSON.parse(response);
            let vListHTML = "";
            
            if (response.DATA.length == 0) {
                cfSetValue("txt_cvcod","");
                cfSetValue("txt_cvnas","");
                cfGetMessage("qlt_prebul_q", "message" ,"50");
                return false;
            }
            
            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CVNAS;
            }
            //$("#txt_cvnas").val(vListHTML);
            cfSetValue("txt_cvnas",vListHTML);
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

    const nFdate = cfGetValue("txt_fromDate").replace(/-/gi, "");
    const nTdate = cfGetValue("txt_toDate").replace(/-/gi, "");
    const vCvcod = cfGetValue("txt_cvcod");

	//값 체크
    if (vCvcod == "" || vCvcod == null) {
        cfGetMessage("qlt_prebul_q", "message", "250");
        return false;
    }

    const oData = {
        ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Fdate: nFdate,
        Tdate: nTdate,
        Cvcod: vCvcod,
    }
    
    let oResponse = cfAjaxSync("POST", "qlt_prebul_q", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));
    const vTable = cfAjaxSync("GET","qlt/qlt_prebul_q.txt",null,"table"); //테이블 정보 읽어오기
    
    const nTotalRecords = oResponse.RecordCount;    //데이터 총 갯수
    const nRecordPerPage = oResponse.PageLength;    //페이지의 갯수
    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;
    if (oResponse.RecordCount > 0) {
      	// header 만들기 
        vListHTML = vTable.split("|")[0];  
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
                "ITNBR": aItem["ITNBR"],			
                "ITDSC": aItem["ITDSC"], 	
                "ISPEC": aItem["ISPEC"],      
                "JIJIL": aItem["JIJIL"],     
                "CRT_DATE": aItem["CRT_DATE"],       
                "GUCOD": aItem["GUCOD"],         
				"GUQTY": aItem["GUQTY"]	    
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];
		// format
            for (let i = 0; i < vBody.rows.length; i++) {
                vBody.rows[i].cells[4].innerText = cfStringFormat(vBody.rows[i].cells[4].innerText,"D2");
				vBody.rows[i].cells[6].innerText = cfStringFormat(vBody.rows[i].cells[6].innerText,"N");
            }

        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("qlt_prebul_q", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
		pgLoadDataRs();
    }
        
}

//---------------------------------------------------------------------------------------------------------------------------
//기능 : 데이터 조회 후 페이징 없이 모든 자료 테이블 구성 ( 엑셀 변환용 )
//인자 : page, 선택된 현재 페이지
//반환 : JSONObject
//작성 : jhkim
//---------------------------------------------------------------------------------------------------------------------------
function pgLoadDataAll(page) {
	const nPageLength = 1048576; //페이지당 데이터를 보여줄 행의 갯수

    const nFdate = cfGetValue("txt_fromDate").replace(/-/gi, "");
    const nTdate = cfGetValue("txt_toDate").replace(/-/gi, "");
    const vCvcod = cfGetValue("txt_cvcod");

	//값 체크
    if (vCvcod == "" || vCvcod == null) {
        cfGetMessage("qlt_prebul_q", "message", "250");
        return false;
    }

    const oData = {
        ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Fdate: nFdate,
        Tdate: nTdate,
        Cvcod: vCvcod,
    }
    
    let oResponse = cfAjaxSync("POST", "qlt_prebul_q", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));
    const vTable = cfAjaxSync("GET","qlt/qlt_prebul_q.txt",null,"table"); //테이블 정보 읽어오기
    
    const nTotalRecords = oResponse.RecordCount;    //데이터 총 갯수
    const nRecordPerPage = oResponse.PageLength;    //페이지의 갯수
    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;
    if (oResponse.RecordCount > 0) {
      	// header 만들기 
        vListHTML = vTable.split("|")[2];  
        vListHTML += "</tr>";
        $("#tbl_head_excel").html(vListHTML); //테이블 헤드
        vListHTML = "";

        // body 만들기 
        let vTr = vTable.split("|");                    
        let vRow;
		let oEdit;
        
        for (i = 0; i < oResult.length; i++) {
            let aItem = oResult[i];
            
            vListHTML = vTr[3];
            vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
            vRow += vListHTML;
            vListHTML += "</tr>";

            //Table 원본 자료 저장
            gvOrgData.push({
                "ITNBR": aItem["ITNBR"],			
                "ITDSC": aItem["ITDSC"], 	
                "ISPEC": aItem["ISPEC"],      
                "JIJIL": aItem["JIJIL"],     
                "CRT_DATE": aItem["CRT_DATE"],       
                "GUCOD": aItem["GUCOD"],         
				"GUQTY": aItem["GUQTY"]	    
            });
        }
        $("#tbl_wrap_excel").show();
        
        $("#tbl_body_excel").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap_excel")[0].tBodies[0];
		// format
            for (let i = 0; i < vBody.rows.length; i++) {
                vBody.rows[i].cells[4].innerText = cfStringFormat(vBody.rows[i].cells[4].innerText,"D2");
				vBody.rows[i].cells[6].innerText = cfStringFormat(vBody.rows[i].cells[6].innerText,"N");
            }

        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("qlt_prebul_q", "message", "110");
        cfClearData("tbl_wrap_excel", "oPaginate");
		pgLoadDataRs();
    }
}

//테이블 헤더 출력
function pgLoadDataRs() {

    const sData = {
        ActGubun: "Rs"
    }
    oResponse = cfAjaxSync("POST", "qlt_prebul_q", sData, "startSelectS");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","qlt/qlt_prebul_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
        cfGetMessage("qlt_prebul_q", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
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
        case "txt_fromDate":
            if (vEventCode == 13) {
                const vFormatNum = cfStringFormat(vEventValue,"D1");
                $("#txt_fromDate").val(vFormatNum);
            }
            break;
        case "txt_toDate":
            if (vEventCode == 13) {
                const vFormatNum = cfStringFormat(vEventValue,"D1");
                $("#txt_toDate").val(vFormatNum);
            }
            break;
        case "txt_cvcod":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vCvcod = vEventValue;
                if (vCvcod != "") {
                    const oData = {
                        SearchGubun:"inputCvcod",
                        Cvcod:vCvcod
                    };
                cfAjaxAsync("GET","qlt_prebul_q",oData,"txt_cvcod");
                } else {
					cfSetValue("txt_cvnas","");
				}
            }
            break;
    }
});

//엑셀 변환
function onExcel() {	
	const vToday = cfGetToday();
	fnExcelReport('tbl_wrap_excel', '불량현황내역-'+ cfStringFormat(vToday, "D1"));
}

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

// 선택된 데이터 가져오기
$(document).on('click','.listChk', function(){
	let rowData = new Array();
	let tdArr = new Array();
	let checkbox = $("input[name=listChk]:checked");
	checkbox.each(function(){
		let tr = checkbox.parent().parent();
		
		rowData.push(tr.text());

		let no = 'true'; // 체크 시

		if(no == 'true'){ 
			$(document).on('click','.listChk', function(){ // 체크 되어 있는 걸 한 번 더 체크 시 ( 체크 해제 시 )
				no = 'false';

				tdArr.push(no);
			});
		}
		tdArr.push(no);
	});
});

// 마감년월 입력 시 '-' 자동입력
let autoHypenYymm = function(str){
      str = str.replace(/[^0-9]/g, '');
      let tmp = '';
      if( str.length < 5){ // 년도
          return str;
      }else if(str.length < 7){ // 년도 + 월
          tmp += str.substr(0, 4);
          tmp += '-';
          tmp += str.substr(4, 2);
          return tmp;
      }else if(str.length < 9){ // 년도 + 월 + 일
          tmp += str.substr(0, 4);
          tmp += '-';
          tmp += str.substr(4, 2);
          tmp += '-';
          tmp += str.substr(6, 2);
          return tmp;
      }
      return str;
}

var txt_Yymm = document.getElementById('txt_Yymm');

$(document).on('keyup', "#txt_fromDate", function(){
  console.log(this.value);
  this.value = autoHypenYymm( this.value ) ;  
});
$(document).on('keyup', "#txt_toDate", function(){
  console.log(this.value);
  this.value = autoHypenYymm( this.value ) ;  
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
// 시스템관리자 / 사용자 구분
function cfGetAuth() {
	let aData = {
		ActGubun : "getAuth",
		ID : cfGetLoginId()
	};
	
	cfAjaxSync("POST", "qlt_prebul_q", aData, "getAuth");
}