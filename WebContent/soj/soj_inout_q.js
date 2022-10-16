//----------------------------------------------------------------
// Document : 사급 요청 현황
// 작성자 : 이지현
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
    cfBtnHide("insert","modify","save","delete","cancel","add","help");
    // 날짜
    cfMaxLength("txt_fromDate", "L"); //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리
    cfMaxLength("txt_toDate", "L");   //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리

//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
    cfGetHeadCombo("soj_inout_q", "saupj", "sel_saupj"); //사업장      
  
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
    
    const vCvcod = cfGetLoginCvcod();
    const vCvnas = cfGetLoginCvnas();
    cfSetValue("txt_cvcod", vCvcod);
    cfSetValue("txt_cvnas", vCvnas);
   
    //$("#txt_cvcod").val(vCvcod);
    //$("#txt_cvnas").val(vCvnas);
}
//----------------------------------------------------------------
// 2.버튼 그룹 이벤트
//----------------------------------------------------------------
//조회 버튼 
function onSearch() {
    pgLoadData(1);
}

function onPrint() {
	htmlViewer = new UbiViewer( {
		key : pKey,
	    ubiserverurl : pServerUrl,	  
	  	jrffile : 'scm/report/soj_inout_q_1r.jrf'   // 리포트 파일명
	})
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
        Swal.fire({
			title: response,
			icon: 'warning',
			confirmButtonColor: '#007aff',
			confirmButtonText: '확인'
		});
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
    let vListHTML = "";
    if (!status) {
        Swal.fire({
			title: response,
			icon: 'warning',
			confirmButtonColor: '#007aff',
			confirmButtonText: '확인'
		});
        return false;
    }
    switch (name) {
        case "txt_cvcod":
            response = JSON.parse(response);
            vListHTML = "";
            
            if (response.DATA.length == 0) {
                cfSetValue("txt_cvcod","");
                cfSetValue("txt_cvnas","");
                cfGetMessage("scm/soj_inout_q", "message" ,"110");
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

            if (response.DATA.length == 0) {

                cfSetValue("txt_itnbr","");
                cfSetValue("txt_itdsc","");
                cfGetMessage("scm/soj_inout_q", "message" ,"110");

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
    const vItnbr = cfGetValue("txt_itnbr");
    const vItdsc = cfGetValue("txt_itdsc");
    const vSaupj = cfGetValue("sel_saupj");
    
    //값 체크
    if (vCvcod == "" || vCvcod == null) {
        cfGetMessage("scm/soj_inout_q", "message", "250");
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
        Saupj: vSaupj
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/soj_inout_q", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/soj/soj_inout_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
                "IO_DATE": aItem["IO_DATE"],//수불일자
                "IONAM": aItem["IONAM"],	//수불구분
                "ITNBR": aItem["ITNBR"],    //품번
                "ITDSC": aItem["ITDSC"],    //품명
                "ISPEC": aItem["ISPEC"],    //규격  
//                "IPGO": aItem["IPGO"],    //입고수량                      
//                "CHUL": aItem["CHUL"],    //                 
				"UNMSR": aItem["UNMSR"],  //단위                    
                "IOJPNO": aItem["IOJPNO"],	//수불전표  
                "BIGO": aItem["BIGO"],  	//비고
                "CVNAS2": aItem["CVNAS2"]   //거래처
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];

		// format        
        for (let i = 0; i < vBody.rows.length; i++) {
			vBody.rows[i].cells[0].innerText = cfStringFormat(vBody.rows[i].cells[0].innerText,"D2");
            vBody.rows[i].cells[5].innerText = cfStringFormat(vBody.rows[i].cells[5].innerText,"N");
            vBody.rows[i].cells[6].innerText = cfStringFormat(vBody.rows[i].cells[6].innerText,"N");
            vBody.rows[i].cells[8].innerText = cfStringFormat(vBody.rows[i].cells[8].innerText,"J");
        }
        
        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/soj_inout_q", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
		pgLoadDataRs();
    }        
}
//테이블 헤더 출력
function pgLoadDataRs() {

    const sData = {
        ActGubun: "Rs"
    }
    oResponse = cfAjaxSync("POST", "scm/soj_inout_q", sData, "startSelectS");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","scm/soj/soj_inout_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
        cfGetMessage("scm/soj_inout_q", "message", "110");
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
        case "txt_cvcod":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vCvcod = vEventValue;
                if (vCvcod != "") {
                    const oData = {
                        SearchGubun:"inputCvcod",
                        Cvcod:vCvcod
                    };
                    cfAjaxAsync("GET","scm/soj_inout_q",oData,"txt_cvcod");                    
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
		                    const iData = {
		                        SearchGubun:"inputItnbr",
		                        Itnbr: vItnbr
                    };
                    cfAjaxAsync("GET","scm/soj_inout_q",iData,"txt_itnbr");         
                } else {
					cfSetValue("txt_itdsc","");
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


//업체리스트 모달 선택값 설정 후 종료
$(document).on('dblclick', '#tbl_tbody_vndmst_p tr ', function () { 
    const aTableData = $(this).children("td").map(function() {
        return $(this).text();
    })      
    $("#txt_cvcod").val(aTableData[1]);
    $("#txt_cvnas").val(aTableData[2]);
    $('.btn-modal-close').click();
});
$(document).on('click', 'input:radio[name=gubun]', function (e) {
/*    $("#tbl_wrap > thead").empty(); //테이블 Clear           
    $("#tbl_wrap > tbody").empty(); //테이블 Clear                    
    $("#oPaginate").html("");  // 페이징 Clear;*/
    cfClearData("tbl_wrap", "oPaginate");
    //gvHeightChk = true;
});

// 5.사용자 정의 함수

//테이블의 행에서 클릭시 팝업 호출 
$(document).on('click','.row_popup',function() {
	var str = ""
	var tdArr = new Array();	// 배열 선언
	var D1 = $(this);
	
	var tr = D1.parent().parent();
	var td = tr.children();
	
	//console.log("클릭한 Row의 모든 데이터 : "+tr.text());
	
	var baljpno = td.eq(0).text().replace("-", "");
	var balseq = td.eq(1).text();
	
	console.log("baljpno : "+baljpno);	
	console.log("balseq : "+balseq);	
	
	
	// 가져온 값을 팝업에 세팅하기
	$(".oBaljuListModal.form-block #baljpno").val(baljpno);
	$(".oBaljuListModal.form-block #balseq").val(balseq);
	
	// 팝업 호출
    modalObj.modalOpenFunc('oBaljuListModal');


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

var txt_fromDate = document.getElementById('txt_fromDate');
var txt_toDate = document.getElementById('txt_toDate');

$(document).on('keyup', "#txt_fromDate", function(){
  console.log(this.value);
  this.value = autoHypenYymm( this.value ) ;  
});
$(document).on('keyup', "#txt_toDate", function(){
  console.log(this.value);
  this.value = autoHypenYymm( this.value ) ;  
});
// 시스템관리자 / 사용자 구분
function cfGetAuth() {
	let aData = {
		ActGubun : "getAuth",
		ID : cfGetLoginId()
	};
	
	cfAjaxSync("POST", "scm/soj_inout_q", aData, "getAuth");
}