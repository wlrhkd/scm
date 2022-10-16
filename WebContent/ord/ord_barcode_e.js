//----------------------------------------------------------------
// Document : LOT라벨 발행
// 작성자 : 김준형
// 작성일자 : 2021-09-28
//----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
//let gvHeightChk = true; //처음 조회시와 조회된 후 페이지만 넘길시에 디자인이 틀려져서 사용
let gvChk = 0;
let gvAuth;

//페이지 오픈시 실행
function setCondition() {
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("insert","modify","save","delete","add","help","cancel");
    // 날짜
    cfMaxLength("txt_fromDate", "L");   //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리
    cfMaxLength("txt_toDate", "L");   //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리

	pgLoadDataS();
//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
    cfGetHeadCombo("ord_barcode_e", "saupj", "sel_saupj");
    cfGetHeadCombo("ord_barcode_e", "ittyp", "sel_ittyp"); //품목구분
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

	// test
//	cfSetValue("txt_fromDate", "2021-04-01");
//	cfSetValue("txt_cvcod", "201021");
//    cfSetValue("txt_cvnas", "현대자동차(주)울산공장");
}
//----------------------------------------------------------------
// 2.버튼 그룹 이벤트
//----------------------------------------------------------------
//조회 버튼 
function onSearch() {
    pgLoadData(1);
	pgLoadDataAll(1);
}

//인쇄 버튼
function onPrint(){
	let arrJpno = new Array();
	let vToday  = cfGetToday();
	let vTotime = cfGetTime();

    const vChkBox = $("input[name=listChk]:checked");

    vChkBox.each(function (i) {
        const vTr = vChkBox.parent().parent().eq(i);
        const vTd = vTr.children();
        let vPk = vTd.eq(1).text();
		let vNadate = vTd.eq(13).text();
		let vNaqty = vTd.eq(5).text();
		let vPoqty = vTd.eq(6).text();
		let vItnbr = vTd.eq(2).text();
		vPk = "S" + vPk.substr(1);
		
        arrJpno.push({
			"JPNO"    : vPk.replaceAll("-",''),
			"NADATE"  : vNadate,
			"NAQTY"   : vNaqty,
			"POQTY"   : vPoqty,
			"ITNBR"   : vItnbr
		});
    });
    if (arrJpno.size == 0) {
        $("#oCheckMessage").html("인쇄할 납입전표를 선택하세요.");
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');

        return false;
    } else {
		//LOT 라벨 생성
		cfLabelCreate(arrJpno, vToday, vTotime);
		
		
		let ret = "as_date%23" + vToday + "%23ar_time%23" + vTotime + "%23";
		let file;
		
		if(cfGetValue("sel_size")== 1){
			file = "scm_ord_barcode_e_8r.jrf";
		} else{
			file = "scm_ord_barcode_e_1r.jrf";
		}
		
		openReportPop("../ubi4/ubihtml.jsp?file=" + file + "&arg=" + ret);
	}
}

//엑셀 변환
function onExcel() {	
	const vToday = cfGetToday();
	fnExcelReport('tbl_wrap_excel', 'LOT라벨발행-'+ cfStringFormat(vToday, "D1"));
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

		case "jpnoChk":
			response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {
                cfGetMessage("scm/ord_barcode_e", "message" ,"110");
                return false;
            }

            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CNT;
            }
            gvChk = vListHTML;

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
        Swal.fire({
			title: response,
			icon: 'warning',
			confirmButtonColor: '#007aff',
			confirmButtonText: '확인'
		});
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
                cfGetMessage("scm/ord_barcode_e", "message" ,"110");
                return false;
            }
            
            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CVNAS;
            }
            cfSetValue("txt_cvnas",vListHTML);
            break;

		case "txt_itnbr":
            response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {

                cfSetValue("txt_itnbr","");
                cfSetValue("txt_itdsc","");
                cfGetMessage("scm/ord_barcode_e", "message" ,"110");

                return false;
            }

            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.ITDSC;
            }
            cfSetValue("txt_itdsc",vListHTML);
            break;

		case "JpIns":
            break;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 데이터 조회 후 테이블 구성
//인자 : page, 선택된 현재 페이지
//반환 : JSONObject
//작성 : jhkim
//---------------------------------------------------------------------------------------------------------------------------
function pgLoadData(page) {
    const nPageLength = 20; //페이지당 데이터를 보여줄 행의 갯수    
    
    const vFromDate = cfGetValue("txt_fromDate").replace(/-/gi, "");
    const vToDate = cfGetValue("txt_toDate").replace(/-/gi, "");
    const vCvcod = cfGetValue("txt_cvcod");    
    const vSaupj = cfGetValue("sel_saupj");
	const vIttyp = cfGetValue("sel_ittyp");
	const vJpno = cfGetValue("txt_jpno");
    
    //값 체크
    if (vCvcod == "" || vCvcod == null) {
        cfGetMessage("scm/ord_barcode_e", "message", "250");
        return false;
    }
    const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        FromDate: vFromDate,
        ToDate: vToDate,
        Cvcod: vCvcod,
        Saupj: vSaupj,
        Ittyp: vIttyp,
        Jpno: vJpno
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/ord_barcode_e", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/ord/ord_barcode_e.txt",null,"table"); //테이블 정보 읽어오기
    
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
                "JPNO": aItem["JPNO"],    		// 납품번호
                "ITNBR": aItem["ITNBR"],    	// 품번
                "ITDSC": aItem["ITDSC"],    	// 품명  
                "ISPEC": aItem["ISPEC"],    	// 규격                      
				"NAQTY": aItem["NAQTY"],		// 수량       
                "IO_TXT": aItem["IO_TXT"],		// 입고상태  
                "POQTY": aItem["POQTY"],  		// 용기적입수
                "POJQTY": aItem["POJQTY"],  	// 용기수량
                "LOTNO": aItem["LOTNO"],  		// LOT-NO
                "BIGO": aItem["BIGO"],  		// 비고
                "ORDER_NO": aItem["ORDER_NO"],  // 고객발주번호
                "BALJPNO": aItem["BALJPNO"],  	// 발주번호
                "BALSEQ": aItem["BALSEQ"],  	// 순번
                "NADATE": aItem["NADATE"]  		// 납기일
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];
		
		//format
        for (let i = 0; i < vBody.rows.length; i++) {
			// 납품번호
            vBody.rows[i].cells[1].innerText = cfStringFormat(vBody.rows[i].cells[1].innerText, "J");
			// 수량
            vBody.rows[i].cells[5].innerText = cfStringFormat(vBody.rows[i].cells[5].innerText, "N");
			// 용기적입수
            vBody.rows[i].cells[6].innerText = cfStringFormat(vBody.rows[i].cells[6].innerText, "N");
			// 발주번호
            vBody.rows[i].cells[11].innerText = cfStringFormat(vBody.rows[i].cells[11].innerText, "J");
        }

        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/ord_barcode_e", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
		pgLoadDataS();
    }        
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 데이터 조회 후 테이블 구성 ( 엑셀 변환용 )
//인자 : page, 선택된 현재 페이지
//반환 : JSONObject
//작성 : jhkim
//---------------------------------------------------------------------------------------------------------------------------
function pgLoadDataAll(page) {
    const nPageLength = 1048576; //페이지당 데이터를 보여줄 행의 갯수    
    
    const vFromDate = cfGetValue("txt_fromDate").replace(/-/gi, "");
    const vToDate = cfGetValue("txt_toDate").replace(/-/gi, "");
    const vCvcod = cfGetValue("txt_cvcod");    
    const vSaupj = cfGetValue("sel_saupj");
	const vIttyp = cfGetValue("sel_ittyp");
	const vJpno = cfGetValue("txt_jpno");
    
    //값 체크
    if (vCvcod == "" || vCvcod == null) {
        cfGetMessage("scm/ord_barcode_e", "message", "250");
        return false;
    }
    const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        FromDate: vFromDate,
        ToDate: vToDate,
        Cvcod: vCvcod,
        Saupj: vSaupj,
        Ittyp: vIttyp,
        Jpno: vJpno
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/ord_barcode_e", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/ord/ord_barcode_e.txt",null,"table"); //테이블 정보 읽어오기
    
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
                "JPNO": aItem["JPNO"],    		// 납품번호
                "ITNBR": aItem["ITNBR"],    	// 품번
                "ITDSC": aItem["ITDSC"],    	// 품명  
                "ISPEC": aItem["ISPEC"],    	// 규격                      
				"NAQTY": aItem["NAQTY"],		// 수량       
                "IO_TXT": aItem["IO_TXT"],		// 입고상태  
                "POQTY": aItem["POQTY"],  		// 용기적입수
                "POJQTY": aItem["POJQTY"],  	// 용기수량
                "LOTNO": aItem["LOTNO"],  		// LOT-NO
                "BIGO": aItem["BIGO"],  		// 비고
                "ORDER_NO": aItem["ORDER_NO"],  // 고객발주번호
                "BALJPNO": aItem["BALJPNO"],  	// 발주번호
                "BALSEQ": aItem["BALSEQ"]    	// 순번
            });
        }
        $("#tbl_wrap_excel").show();
        
        $("#tbl_body_excel").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap_excel")[0].tBodies[0];
		
		//format
        for (let i = 0; i < vBody.rows.length; i++) {
			// 납품번호
            vBody.rows[i].cells[0].innerText = cfStringFormat(vBody.rows[i].cells[0].innerText, "J");
			// 수량
            vBody.rows[i].cells[4].innerText = cfStringFormat(vBody.rows[i].cells[4].innerText, "N");
			// 용기적입수
            vBody.rows[i].cells[5].innerText = cfStringFormat(vBody.rows[i].cells[5].innerText, "N");
			// 발주번호
            vBody.rows[i].cells[10].innerText = cfStringFormat(vBody.rows[i].cells[10].innerText, "J");
        }

        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/ord_barcode_e", "message", "110");
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
        case "txt_cvcod":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vCvcod = vEventValue;
                if (vCvcod != "") {
                    const oData = {
                        SearchGubun:"inputCvcod",
                        Cvcod:vCvcod
                    };
                    cfAjaxAsync("GET","scm/ord_barcode_e",oData,"txt_cvcod");                    
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
                    const oDatas = {
                        SearchGubun:"inputItnbr",
                        Itnbr: vItnbr
                    };
                    cfAjaxAsync("GET","scm/ord_barcode_e",oDatas,"txt_itnbr");                    
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

//선택 컬럼 선택시 전체 선택/해제
$(document).on('click', '#cbx_checkAll', function(){
	if($('#cbx_checkAll').prop('checked')){
		$('.listChk').prop('checked',true);
	}else{
		$('.listChk').prop('checked',false);
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
    cfClearData("tbl_wrap", "oPaginate");
});

// 5.사용자 정의 함수
function cfLabelCreate(arrJpno, vToday, vTotime){
	let jInData, jUpData;
	let nCnt = 0;
	let vJpno, vBarno, vLotno, vNadate;
	let nNaqty, nLotqty, nItnbr;
	let aRowInData = new Array();
	let aRowUpData = new Array();
	
	for (let i=0; i<arrJpno.length; i++){
		//기 발행된 라벨인지 확인
		vJpno = arrJpno[i].JPNO;
		nItnbr = arrJpno[i].ITNBR;
		
		jpnoCheck(vJpno);
		
		//기 발행정보가 없으면 라벨 생성
		if(gvChk == 0){
			vBarno = "S" + vToday + cfGetJunPyo(vToday, "B1");
			vNadate= arrJpno[i].NADATE;
			nNaqty = arrJpno[i].NAQTY;
			vLotno = vNadate;
			nLotqty= arrJpno[i].POQTY;

			//용기적입수로 납품수량을 나눠서 라벨발행수를 결정
			if (nLotqty <= 0 || nNaqty <= 0) return ;
			nCnt = Math.ceil(nNaqty / nLotqty);
			
			for (var j=1; j<=nCnt; j++){
				if (nNaqty <= 0) break;
				
				// insert 구문
				let iBarno  = vBarno + cfNumToStr(j,3);
				let iIoJpno = "S" + vJpno.substring(1);
				let iLotno = vLotno;
				let iLotQty = 0;
				
				if (nNaqty > nLotqty){
					iLotQty = nLotqty;
				} else {
					iLotQty = nNaqty;
				}
				
				let iIoDate = vNadate;
				let iCrtDate = vToday;
				let iCrtTime = vTotime;
				let iCrtUser = cfGetLoginCvcod();
				let iUpdDate = vToday;
				let iUpdTime = vTotime;
				let iUpdUser = cfGetLoginCvcod();
				let iItnbr   = nItnbr; 
				
				aRowInData.push({
					"BARNO"   : iBarno,
			        "IOJPNO"  : iIoJpno,
			        "LOTNO"   : iLotno,
			        "LOTQTY"  : iLotQty,
			        "IODATE"  : iIoDate,
			        "CRTDATE" : iCrtDate,
			        "CRTTIME" : iCrtTime,
			        "CRTUSER" : iCrtUser,
			        "UPDDATE" : iUpdDate,
			        "UPDTIME" : iUpdTime,
			        "UPDUSER" : iUpdUser,
					"ITNBR"   : iItnbr
				});
				
				nNaqty = nNaqty - nLotqty;
			}
		//기 발행정보가 있으면 업데이트 
		} 
		else {
			let iIoJpno = "S" + vJpno.substring(1);
			let iUpdDate = vToday;
			let iUpdTime = vTotime;
			let iUpdUser = cfGetLoginCvcod();
			let iItnbr   = nItnbr; 
			
			aRowUpData.push({
				"UPDDATE"   : iUpdDate,
		        "UPDTIME"   : iUpdTime,
		        "UPDUSER"   : iUpdUser,
				"IOJPNO"    : iIoJpno,
				"ITNBR"     : iItnbr
			});
			
		}
	}
	if(aRowUpData.length > 0){
		jUpData = {
			ActGubun: "JpUpd",
	        JsonData: JSON.stringify(aRowUpData)
	    };
	
		cfAjaxSync("POST", "scm/ord_barcode_e", jUpData, "JpUpd");
	}
	
	if(aRowInData.length > 0) {
		jInData = {
			ActGubun: "JpIns",
	        JsonData: JSON.stringify(aRowInData)
	    };
		cfAjaxSync("POST", "scm/ord_barcode_e", jInData, "JpIns");
	}	
}

function jpnoCheck(jpno) {
	let sJpno = jpno;
	
	let cData = {
		SearchGubun: "JP",
        Jpno: sJpno
    };
	
	cfAjaxSync("GET", "scm/ord_barcode_e", cData, "jpnoChk");
}

// 년월 입력 시 '-' 자동입력
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
  this.value = autoHypenYymm( this.value ) ;  
});
$(document).on('keyup', "#txt_toDate", function(){
  this.value = autoHypenYymm( this.value ) ;  
});

// 테이블 형태 출력
function pgLoadDataS() {
    const sData = {
        ActGubun: "S"
    }
    oResponse = cfAjaxSync("POST", "scm/ord_barcode_e", sData, "startSelectS");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","scm/ord/ord_barcode_e.txt",null,"table"); //테이블 정보 읽어오기
    
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
        cfGetMessage("scm/ord_barcode_e", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
    }
}

// 시스템관리자 / 사용자 구분
function cfGetAuth() {
	let aData = {
		ActGubun : "getAuth",
		ID : cfGetLoginId()
	};
	
	cfAjaxSync("POST", "scm/ord_barcode_e", aData, "getAuth");
}