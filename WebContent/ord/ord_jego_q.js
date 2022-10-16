//----------------------------------------------------------------
// Document : 현 재고현황
// 작성자 : 김준형
// 작성일자 : 2021-08-23
//----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
//let gvHeightChk = true; //처음 조회시와 조회된 후 페이지만 넘길시에 디자인이 틀려져서 사용

//페이지 오픈시 실행
function setCondition() { 
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("insert","modify","save","delete","cancel","add","help");

//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
    cfGetHeadCombo("ord_jego_q", "saupj", "sel_saupj"); //사업장         
    cfGetHeadCombo_D("ord_jego_q", "depot_no", "sel_depot_no"); //창고  
    cfGetHeadCombo("ord_jego_q", "ittyp", "sel_ittyp"); //품목구분      
  
	pgLoadDataS();
}
//----------------------------------------------------------------
// 초기값 설정
//----------------------------------------------------------------

//----------------------------------------------------------------
// 2.버튼 그룹 이벤트
//----------------------------------------------------------------
//조회 버튼 
function onSearch() {
    pgLoadData(1);
    pgLoadDataAll(1);
}

//엑셀 변환
function onExcel() {	
	const vToday = cfGetToday();
	fnExcelReport('tbl_wrap_excel', '현재고현황-'+ cfStringFormat(vToday, "D1"));
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
    }
}
//비동기 방식
function pgCallBackAsync(response, name, status) {
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
		case "txt_itnbr":
            response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {

                cfSetValue("txt_itnbr","");
                cfSetValue("txt_itdsc","");
                cfGetMessage("scm/ord_jego_q", "message" ,"110");

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
    let nPageLength = 20; //페이지당 데이터를 보여줄 행의 갯수    
    
    const vSaupj = cfGetValue("sel_saupj");
    const vDepot_no = cfGetValue("sel_depot_no");
    const vIttyp = cfGetValue("sel_ittyp");
    const vItnbr = cfGetValue("txt_itnbr");
    const vItdsc = cfGetValue("txt_itdsc");
	//console.log(Saupj, Depot_no, Ittyp, Itnbr, Itdsc);
    
    //값 체크
    const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Saupj: vSaupj, 
        Depot_no: vDepot_no, 
        Ittyp: vIttyp, 
        Itnbr: vItnbr,
        Itdsc: vItdsc
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/ord_jego_q", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/ord/ord_jego_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
				"NO": aItem["ROWNUM"],      			// SQL에서 ROW_NUMBER로 처리
                "ITNBR": aItem["ITNBR"],    				//품번
                "ITDSC": aItem["ITDSC"],    				//품명
                "ISPEC": aItem["ISPEC"],    				//규격  
                "PSPEC": aItem["PSPEC"],  					//사양
                "ITGU": aItem["ITGU"],		                //구매형태
                "DEPOT_NO": aItem["DEPOT_NO"],				//창고
                "JEGO_QTY": aItem["JEGO_QTY"],    			//현재고                      
                "BALJU_QTY": aItem["BALJU_QTY"],    		//발주량                      
                "GUMDE": aItem["GUMDE"],    				//검사대기량                      
                "DAEGI": aItem["DAEGI"],    				//입고대기량                      
                "LAST_IN_DATE": aItem["LAST_IN_DATE"],      //최종입고일                      
                "LAST_OUT_DATE": aItem["LAST_OUT_DATE"],    //최종출고일                      
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];

		// format        
        for (let i = 0; i < vBody.rows.length; i++) {
			// 현재고
			vBody.rows[i].cells[7].innerText = cfNumberFormat(vBody.rows[i].cells[7].innerText);
			// 발주량
            vBody.rows[i].cells[8].innerText = cfNumberFormat(vBody.rows[i].cells[8].innerText);
			// 검사대기량           
            vBody.rows[i].cells[9].innerText = cfNumberFormat(vBody.rows[i].cells[9].innerText);
			// 입고대기량           
			vBody.rows[i].cells[10].innerText = cfNumberFormat(vBody.rows[i].cells[10].innerText);            
			// 최종입고일           
			vBody.rows[i].cells[11].innerText = cfStringFormat(vBody.rows[i].cells[11].innerText,"D2");            
			// 최종출고일           
			vBody.rows[i].cells[12].innerText = cfStringFormat(vBody.rows[i].cells[12].innerText,"D2");            
        }
        
        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/ord_jego_q", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
		pgLoadDataS();
    }        
}

//---------------------------------------------------------------------------------------------------------------------------
//기능 : 데이터 조회 후 테이블 구성( 엑셀 변환용 )
//인자 : page, 선택된 현재 페이지
//반환 : JSONObject
//작성 : jhkim
//---------------------------------------------------------------------------------------------------------------------------
function pgLoadDataAll(page) {
    let nPageLength = "1048576"; //페이지당 데이터를 보여줄 행의 갯수    
    
    const vSaupj = cfGetValue("sel_saupj");
    const vDepot_no = cfGetValue("sel_depot_no");
    const vIttyp = cfGetValue("sel_ittyp");
    const vItnbr = cfGetValue("txt_itnbr");
    const vItdsc = cfGetValue("txt_itdsc");
    
    //값 체크
    const aData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Saupj: vSaupj, 
        Depot_no: vDepot_no, 
        Ittyp: vIttyp, 
        Itnbr: vItnbr,
        Itdsc: vItdsc
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/ord_jego_q", aData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/ord/ord_jego_q.txt",null,"table"); //테이블 정보 읽어오기
    
    const nTotalRecords = oResponse.RecordCount;    //데이터 총 갯수
    const nRecordPerPage = oResponse.PageLength;    //페이지의 갯수
    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;
    if (oResponse.RecordCount > 0) {
		// header 만들기 
        vListHTML = vTable.split("|")[4];            
        vListHTML += "</tr>";
        $("#tbl_head_excel").html(vListHTML); //테이블 헤드
        vListHTML = "";      

  		// body 만들기 
        let vTr = vTable.split("|");                    
        let vRow;
		let oEdit;
        
        for (i = 0; i < oResult.length; i++) {
            let aItem = oResult[i];
            
            vListHTML = vTr[5];
            vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
            vRow += vListHTML;                
            vListHTML += "</tr>";

            //Table 원본 자료 저장
            gvOrgData.push({
				"NO": aItem["ROWNUM"],      			// SQL에서 ROW_NUMBER로 처리
                "ITNBR": aItem["ITNBR"],    				//품번
                "ITDSC": aItem["ITDSC"],    				//품명
                "ISPEC": aItem["ISPEC"],    				//규격  
                "PSPEC": aItem["PSPEC"],  					//사양
                "ITGU": aItem["ITGU"],		                //구매형태
                "DEPOT_NO": aItem["DEPOT_NO"],				//창고
                "JEGO_QTY": aItem["JEGO_QTY"],    			//현재고                      
                "BALJU_QTY": aItem["BALJU_QTY"],    		//발주량                      
                "GUMDE": aItem["GUMDE"],    				//검사대기량                      
                "DAEGI": aItem["DAEGI"],    				//입고대기량                      
                "LAST_IN_DATE": aItem["LAST_IN_DATE"],      //최종입고일                      
                "LAST_OUT_DATE": aItem["LAST_OUT_DATE"],    //최종출고일                      
            });
        }
        $("#tbl_wrap_excel").show();
        
        $("#tbl_body_excel").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap_excel")[0].tBodies[0];

		// format        
        for (let i = 0; i < vBody.rows.length; i++) {
			// 현재고
			vBody.rows[i].cells[7].innerText = cfNumberFormat(vBody.rows[i].cells[7].innerText);
			// 발주량
            vBody.rows[i].cells[8].innerText = cfNumberFormat(vBody.rows[i].cells[8].innerText);
			// 검사대기량           
            vBody.rows[i].cells[9].innerText = cfNumberFormat(vBody.rows[i].cells[9].innerText);
			// 입고대기량           
			vBody.rows[i].cells[10].innerText = cfNumberFormat(vBody.rows[i].cells[10].innerText);            
			// 최종입고일           
			vBody.rows[i].cells[11].innerText = cfStringFormat(vBody.rows[i].cells[11].innerText,"D2");            
			// 최종출고일           
			vBody.rows[i].cells[12].innerText = cfStringFormat(vBody.rows[i].cells[12].innerText,"D2");            
        }
        
        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/ord_jego_q", "message", "110");
        cfClearData("tbl_wrap_excel", "oPaginate");
		pgLoadDataS();
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
                    const oDatas = {
                        SearchGubun:"inputItnbr",
                        Itnbr: vItnbr
                    };
                    cfAjaxAsync("GET","scm/ord_jego_q",oDatas,"txt_itnbr");                    
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
//------------------------------------------------------------------------------
// 기능 : 조회조건에 사용할 창고 Select박스 데이터 가져오기
//		 VNDMST 테이블 사용하기때문에 맞춤으로 다시 만듬
// 인자 : fileName -> Select박스를 사용하는 프로그램의 java파일이름 ex) ord_chul_e
//       gubun -> java에서 데이터를 찾기위한 구분값
//       id -> Select 박스의 아이디  
// 반환 : Select박스에 option 추가
// 작성 : 2021.04.02 by dykim
// 수정 : 2021.08.27 by 김준형
// 예시 : cfGetHeadCombo_D("ord_chul_e", "saupj", "sel_saupj"); //사업장
//------------------------------------------------------------------------------
function cfGetHeadCombo_D(fileName,gubun, id){
    $.ajax ({
        type: "GET",
        url: "../" + fileName,
        data: {SearchGubun:gubun},
        success: function (response) {
            let vListHTML = "";
            const aResponse = jQuery.parseJSON(response);
            for(let i = 0; i < aResponse.DATA.length; i++) {
                const vObject = aResponse.DATA[i];
                vListHTML += "<option value='"+vObject.CVCOD+"'>" +vObject.CVNAS2+"</option>";
            }
            $("#" + id).html(vListHTML);
        },
        error : function(request,status,error) {
			Swal.fire({
				title: "code = " + request.status + "message = " + request.responseText + " error = " + error,
				icon: 'warning',
				confirmButtonColor: '#007aff',
				confirmButtonText: '확인'
			});
        }
   });
};

// 테이블 형태 출력
function pgLoadDataS() {
    const sData = {
        ActGubun: "S"
    }
    oResponse = cfAjaxSync("POST", "scm/ord_jego_q", sData, "startSelectS");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","scm/ord/ord_jego_q.txt",null,"table"); //테이블 정보 읽어오기
    
//    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;
    if (oResult.length > 0) {
		// header
        vListHTML = sTable.split("|")[2];
        vListHTML += "</tr>";
        $("#tbl_head").html(vListHTML); // 하단 테이블 헤드
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

        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); // 테이블 몸체
        
    } else {
        cfGetMessage("scm/ord_jego_q", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
    }
}