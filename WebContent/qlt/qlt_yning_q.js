//----------------------------------------------------------------
// Document : 검사 진행 현황
// 작성자 : 염지광
// 작성일자 : 2021-10-01
//----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
let gvAuth;
//let gvHeightChk = true; //처음 조회시와 조회된 후 페이지만 넘길시에 디자인이 틀려져서 사용

//페이지 오픈시 실행
function setCondition() {
	pgLoadDataRs();
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
	cfBtnHide("insert","save","modify","help","add","delete","cancel");
    // 날짜
    cfMaxLength("txt_fromDate", "L"); //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리
    cfMaxLength("txt_toDate", "L");   //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리

//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
    cfGetHeadCombo("qlt_yning_q", "saupj", "sel_saupj"); //사업장
    setInitValue();

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
    cfSetValue("txt_fromDate", cfStringFormat(vToday.substr(0,6) + "01", "D1"));
    cfSetValue("txt_toDate", cfStringFormat(vToday, "D1"));
//    $("#txt_toDate").val(cfStringFormat(vToday,"D"));
    
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
    let vListHTML = "";
    switch (name) {
        case "txt_cvcod":
            response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {
                cfSetValue("txt_cvcod","");
                cfSetValue("txt_cvnas","");
                cfGetMessage("qlt_yning_q", "message" ,"50");
                return false;
            }
            
            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CVNAS;
            }
            //$("#txt_cvnas").val(vListHTML);
            cfSetValue("txt_cvnas",vListHTML);
            break;
        
		case "txt_itnbr":
            response = JSON.parse(response);
            vListHTML = "";
            
            if(response.DATA.length == 0) {
                cfSetValue("txt_itnbr","");
                cfSetValue("txt_itdsc","");
                cfGetMessage("qlt_yning_q", "message" ,"50");
                return false;
            }
            
            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.ITDSC;
            }
            //$("#txt_cvnas").val(vListHTML);
            cfSetValue("txt_itdsc",vListHTML);
            break;
    }
}
//비동기방식 
function pgLoadData(page) {
    const nPageLength = 20; //페이지당 데이터를 보여줄 행의 갯수

    const nFdate = cfGetValue("txt_fromDate").replace(/-/gi, "");
    const nTdate = cfGetValue("txt_toDate").replace(/-/gi, "");
    const vCvcod = cfGetValue("txt_cvcod");
    const vItnbr = cfGetValue("txt_itnbr");
    const vItdsc = cfGetValue("txt_itdsc");
    const vIspec = cfGetValue("txt_itnbr");
    const vSaupj = cfGetValue("sel_saupj");

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
    	Itnbr: vItnbr,
		Itdsc: vItdsc,
		Ispec: vIspec,  
		Saupj: vSaupj
    }
    
    let oResponse = cfAjaxSync("POST", "qlt_yning_q", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));
    const vTable = cfAjaxSync("GET","qlt/qlt_yning_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
				"NO": aItem["NO"],
                "JPNO_HEAD": aItem["JPNO_HEAD"],  //납품번호  
                "JPNO_SEQ": aItem["JPNO_SEQ"],    //순번
                "ITNBR": aItem["ITNBR"],    	  //품번
                "NAQTY": aItem["NAQTY"],    	  //납품수량
                "IOREQTY": aItem["IOREQTY"],      //입하수량
                "SUDAT": aItem["SUDAT"],    	  //입하일자
                "CRT_USER": aItem["CRT_USER"],    //입하사원
                "IOFAQTY": aItem["IOFAQTY"],      //불량수량
                "IOQTY": aItem["IOQTY"],    	  //입고수량
                "INSDAT": aItem["INSDAT"],    	  //검사일자
                "IO_DATE": aItem["IO_DATE"],      //입고일자
                "INSEMP": aItem["INSEMP"],    	  //검사사원
                "IOPRC": aItem["IOPRC"],    	  //입고단가
                "IOAMT": aItem["IOAMT"],    	  //입고금액
                "IPSAUPJ": aItem["IPSAUPJ"],      //납품사업장
                "IOJPNO": aItem["IOJPNO"]    	  //입고번호
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
		let vBody = $("#tbl_wrap")[0].tBodies[0];
		// format
            for (let i = 0; i < vBody.rows.length; i++) {
                vBody.rows[i].cells[1].innerText = cfStringFormat(vBody.rows[i].cells[1].innerText,"J");     //납품번호
                vBody.rows[i].cells[4].innerText = cfStringFormat(vBody.rows[i].cells[4].innerText,"N");     //납품수량
				vBody.rows[i].cells[5].innerText = cfStringFormat(vBody.rows[i].cells[5].innerText,"N");     //입하수량
				vBody.rows[i].cells[6].innerText = cfStringFormat(vBody.rows[i].cells[6].innerText,"D2");    //입하일자
				vBody.rows[i].cells[9].innerText = cfStringFormat(vBody.rows[i].cells[9].innerText,"D2");    //입고수량
				vBody.rows[i].cells[10].innerText = cfStringFormat(vBody.rows[i].cells[10].innerText,"D2");  //검사일자
				vBody.rows[i].cells[11].innerText = cfStringFormat(vBody.rows[i].cells[11].innerText,"D2");  //입고일자
				vBody.rows[i].cells[13].innerText = cfStringFormat(vBody.rows[i].cells[13].innerText,"N");   //입고단가
				vBody.rows[i].cells[14].innerText = cfStringFormat(vBody.rows[i].cells[14].innerText,"N");   //입고금액
            }
        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("qlt_yning_q", "message", "110");
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
    const vItnbr = cfGetValue("txt_itnbr");
    const vItdsc = cfGetValue("txt_itdsc");
    const vIspec = cfGetValue("txt_itnbr");
    const vSaupj = cfGetValue("sel_saupj");

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
    	Itnbr: vItnbr,
		Itdsc: vItdsc,
		Ispec: vIspec,  
		Saupj: vSaupj
    }
    
    let oResponse = cfAjaxSync("POST", "qlt_yning_q", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));
    const vTable = cfAjaxSync("GET","qlt/qlt_yning_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
				"NO": aItem["NO"],
                "JPNO_HEAD": aItem["JPNO_HEAD"],  //납품번호  
                "JPNO_SEQ": aItem["JPNO_SEQ"],    //순번
                "ITNBR": aItem["ITNBR"],    	  //품번
                "NAQTY": aItem["NAQTY"],    	  //납품수량
                "IOREQTY": aItem["IOREQTY"],      //입하수량
                "SUDAT": aItem["SUDAT"],    	  //입하일자
                "CRT_USER": aItem["CRT_USER"],    //입하사원
                "IOFAQTY": aItem["IOFAQTY"],      //불량수량
                "IOQTY": aItem["IOQTY"],    	  //입고수량
                "INSDAT": aItem["INSDAT"],    	  //검사일자
                "IO_DATE": aItem["IO_DATE"],      //입고일자
                "INSEMP": aItem["INSEMP"],    	  //검사사원
                "IOPRC": aItem["IOPRC"],    	  //입고단가
                "IOAMT": aItem["IOAMT"],    	  //입고금액
                "IPSAUPJ": aItem["IPSAUPJ"],      //납품사업장
                "IOJPNO": aItem["IOJPNO"]    	  //입고번호
            });
        }
        $("#tbl_wrap_excel").show();
        
        $("#tbl_body_excel").html(vRow); //테이블 몸체
        
		let vBody = $("#tbl_wrap_excel")[0].tBodies[0];
		// format
            for (let i = 0; i < vBody.rows.length; i++) {
                vBody.rows[i].cells[1].innerText = cfStringFormat(vBody.rows[i].cells[1].innerText,"J");     //납품번호
                vBody.rows[i].cells[4].innerText = cfStringFormat(vBody.rows[i].cells[4].innerText,"N");     //납품수량
				vBody.rows[i].cells[5].innerText = cfStringFormat(vBody.rows[i].cells[5].innerText,"N");     //입하수량
				vBody.rows[i].cells[6].innerText = cfStringFormat(vBody.rows[i].cells[6].innerText,"D2");    //입하일자
				vBody.rows[i].cells[9].innerText = cfStringFormat(vBody.rows[i].cells[9].innerText,"D2");    //입고수량
				vBody.rows[i].cells[10].innerText = cfStringFormat(vBody.rows[i].cells[10].innerText,"D2");  //검사일자
				vBody.rows[i].cells[11].innerText = cfStringFormat(vBody.rows[i].cells[11].innerText,"D2");  //입고일자
				vBody.rows[i].cells[13].innerText = cfStringFormat(vBody.rows[i].cells[13].innerText,"N");   //입고단가
				vBody.rows[i].cells[14].innerText = cfStringFormat(vBody.rows[i].cells[14].innerText,"N");   //입고금액
            }
        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("qlt_yning_q", "message", "110");
        cfClearData("tbl_wrap_excel", "oPaginate");
		pgLoadDataRs();
    }        
}

//테이블 헤더 출력
function pgLoadDataRs() {

    const sData = {
        ActGubun: "Rs"
    }
    oResponse = cfAjaxSync("POST", "qlt_yning_q", sData, "startSelectS");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","qlt/qlt_yning_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
        cfGetMessage("qlt_yning_q", "message", "300");
        cfClearData("tbl_wrap", "oPaginate");
    }
}
// 이벤트 처리
//----------------------------------------------------------------
$(document).keydown(function (e) { 
    const vEventId = e.target.id;
    const vEventValue = e.target.value;
    const vEventCode = e.which? e.which : e.keyCode;
	
    switch(vEventId) {
         case "txt_cvcod":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vCvcod = vEventValue;
                if (vCvcod != "") {
                    const oData = {
                        SearchGubun:"inputCvcod",
                        Cvcod:vCvcod
                    };
                cfAjaxAsync("GET","qlt_yning_q",oData,"txt_cvcod");
                } else {
					cfSetValue("txt_cvnas","");
				}
            }
            break;
        
		case "txt_itnbr":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vItnbr = vEventValue;
                if (vItnbr != "") {
                    const oDataA = {
                        SearchGubun:"inputItnbr",
                        Itnbr: vItnbr
                    };
                    cfAjaxAsync("GET","qlt_yning_q",oDataA,"txt_itnbr");
                }
            }
            break;
    }
});

//엑셀 변환
function onExcel() {	
	const vToday = cfGetToday();
	fnExcelReport('tbl_wrap_excel', '출발처리-'+ cfStringFormat(vToday, "D1"));
}

// 출발일 입력 시 '-' 자동입력
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

let txt_fromDate = document.getElementById('txt_fromDate');
let txt_toDate = document.getElementById('txt_toDate');

$(document).on('keyup', "#txt_fromDate", function(){
//  console.log(this.value);
  this.value = autoHypenYymm( this.value ) ;  
});
$(document).on('keyup', "#txt_toDate", function(){
//  console.log(this.value);
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

//품번 모달 선택값 설정 후 종료
$(document).on('dblclick', '#tbl_tbody_itemas_p tr ', function () { 
    const aTableData = $(this).children("td").map(function() {
        return $(this).text();
    })      
    $("#txt_itnbr").val(aTableData[0]);
    $("#txt_itdsc").val(aTableData[1]);
    $('.btn-modal-close').click();
});
// 시스템관리자 / 사용자 구분
function cfGetAuth() {
	let aData = {
		ActGubun : "getAuth",
		ID : cfGetLoginId()
	};
	
	cfAjaxSync("POST", "qlt_yning_q", aData, "getAuth");
}