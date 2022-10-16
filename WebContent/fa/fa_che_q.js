//----------------------------------------------------------------
// Document : 채권/채무 현황
// 작성자 : 김준형
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
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("insert","modify","save","delete","add","help","cancel");
    // 날짜
    cfMaxLength("txt_Yymm", "M");   //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리

//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
    cfGetHeadCombo("fa_che_q", "saupj", "sel_saupj");
  
    setInitValue();
	pgLoadData(1);
	pgLoadDataRs();
	
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

	cfSetValue("txt_Yymm", cfStringFormat(vToday, "D1").substr(0, 7));

    const vCvcod = cfGetLoginCvcod();
    const vCvnas = cfGetLoginCvnas();

    cfSetValue("txt_cvcod", vCvcod);
    cfSetValue("txt_cvnas", vCvnas);

	// test
//	cfSetValue("txt_Yymm", "2014-04");
//	cfSetValue("txt_cvcod", "201021");
//    cfSetValue("txt_cvnas", "현대자동차(주)울산공장");
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
	let vListHTML;
    let oData;
    if (!status) {
        alert(response);
        return false;
    }
    switch (name) {
        case "startSelect":
            break;        
		case "startSelectE":
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
                cfGetMessage("scm/fa_che_q", "message" ,"50");
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
    
    const sYymm = cfGetValue("txt_Yymm").replace(/-/gi, "");
    const vCvcod = cfGetValue("txt_cvcod");    
    const vSaupj = cfGetValue("sel_saupj");
    
    //값 체크
    if (vCvcod == "") {
        vCvcod = "%";
    }
    const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Yymm: sYymm,
        Cvcod: vCvcod,
        Saupj: vSaupj
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/fa_che_q", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/fa/fa_che_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
                "COL": aItem["COL"],    	// 채권/채무
                "IA": aItem["IA"],    		// 이월
                "DDRA": aItem["DDRA"],   	// 차변 
                "DCRA": aItem["DCRA"],  	// 대변                      
				"RA": aItem["RA"],			// 잔액       
				"GRP": aItem["GRP"],		// GRP       
				"RW": aItem["RW"]			// RW       
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];
		
		//format
        for (let i = 0; i < vBody.rows.length; i++) {
			// 이월
            vBody.rows[i].cells[1].innerText = cfStringFormat(vBody.rows[i].cells[1].innerText, "N");
			// 차변
            vBody.rows[i].cells[2].innerText = cfStringFormat(vBody.rows[i].cells[2].innerText, "N");
			// 대변
            vBody.rows[i].cells[3].innerText = cfStringFormat(vBody.rows[i].cells[3].innerText, "N");
			// 잔액
            vBody.rows[i].cells[4].innerText = cfStringFormat(vBody.rows[i].cells[4].innerText, "N");
        }

        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/fa_che_q", "message", "300");
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
                    cfAjaxAsync("GET","scm/fa_che_q",oData,"txt_cvcod");                    
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

/*
//업체리스트 모달 선택값 설정 후 종료
$(document).on('dblclick', '#tbl_tbody_vndmst_p tr ', function () { 
    const aTableData = $(this).children("td").map(function() {
        return $(this).text();
    })      
    $("#txt_cvcod").val(aTableData[1]);
    $("#txt_cvnas").val(aTableData[2]);
    $('.btn-modal-close').click();
});
*/
$(document).on('click', 'input:radio[name=gubun]', function (e) {
/*    $("#tbl_wrap > thead").empty(); //테이블 Clear           
    $("#tbl_wrap > tbody").empty(); //테이블 Clear                    
    $("#oPaginate").html("");  // 페이징 Clear;*/
    cfClearData("tbl_wrap", "oPaginate");
    //gvHeightChk = true;
});

// 5.사용자 정의 함수
// 우측 테이블 형태 출력
function pgLoadDataRs() {

    const sData = {
        ActGubun: "RE"
    }
    oResponse = cfAjaxSync("POST", "scm/fa_che_q", sData, "startSelectE");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","scm/fa/fa_che_q.txt",null,"table"); //테이블 정보 읽어오기
    
//    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;
    if (oResult.length > 0) {
		// header
        vListHTML = sTable.split("|")[2];
        vListHTML += "</tr>";
        $("#tbl_headS").html(vListHTML); // 하단 테이블 헤드
        vListHTML = "";
		// body
        let vTr = sTable.split("|");
        let oEdit;
        let vRow;

        for (i = 0; i < oResult.length; i++) {
            let aItem = oResult[i];
            
            vListHTML = vTr[3];
            vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
            vRow += vListHTML;
            vListHTML += "</tr>";
        }

        $("#tbl_wrapS").show();
        
        $("#tbl_bodyS").html(vRow); // 테이블 몸체
        
    } else {
        cfGetMessage("scm/fa_che_q", "message", "300");
        cfClearData("tbl_wrapS", "oPaginate");
    }
}
// 지불년월 입력 시 '-' 자동입력
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

$(document).on('keyup', "#txt_Yymm", function(){
//  console.log(this.value);
  this.value = autoHypenYymm( this.value ) ;  
});

//우측 조회
$(document).on('click','.listSel', function() {
	const sYymm = cfGetValue("txt_Yymm").replace(/-/gi, "");
    const vCvcod = cfGetValue("txt_cvcod");    
    const vSaupj = cfGetValue("sel_saupj");
	let tr = $(this);
	let td = tr.children();
	const vRw = td.eq(6).text();
//	alert("vRw = " + vRw);
    //값 체크
    if (vCvcod == "") {
        vCvcod = "%";
    }

	oData = {
		ActGubun: "RS",
		Yymm: sYymm,
	    Cvcod: vCvcod,
		Saupj: vSaupj,
		Rw: vRw
	};
	
    let oResponse = cfAjaxSync("POST", "scm/fa_che_q", oData, "startSelectS");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/fa/fa_che_q.txt",null,"table"); //테이블 정보 읽어오기
    let oResult = oResponse.DATA;

    if (oResponse.RecordCount > 0) {
		// header 만들기 
        vListHTML = vTable.split("|")[2];
        vListHTML += "</tr>";
        $("#tbl_headS").html(vListHTML); //테이블 헤드
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
                "COL": aItem["COL"],    	// 채권/채무
                "IA": aItem["IA"],    		// 이월
                "DDRA": aItem["DDRA"],   	// 차변 
                "DCRA": aItem["DCRA"],  	// 대변                      
				"RA": aItem["RA"]			// 잔액       
            });
        }
        $("#tbl_wrapS").show();
        
        $("#tbl_bodyS").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrapS")[0].tBodies[0];
		
		//format
        for (let i = 0; i < vBody.rows.length; i++) {
			// 차변
            vBody.rows[i].cells[2].innerText = cfStringFormat(vBody.rows[i].cells[2].innerText, "N");
			// 대변
            vBody.rows[i].cells[3].innerText = cfStringFormat(vBody.rows[i].cells[3].innerText, "N");
        }
    } else {
        cfGetMessage("scm/fa_che_q", "message", "300");
        cfClearData("tbl_wrapS", "oPaginate");
		pgLoadDataRs();
    }
});
// 시스템관리자 / 사용자 구분
function cfGetAuth() {
	let aData = {
		ActGubun : "getAuth",
		ID : cfGetLoginId()
	};
	
	cfAjaxSync("POST", "scm/fa_che_q", aData, "getAuth");
}