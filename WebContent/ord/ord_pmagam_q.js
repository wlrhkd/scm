//----------------------------------------------------------------
// Document : 월 마감 전 현황
// 작성자 : 김준형
// 작성일자 : 2021-08-30
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
    cfGetHeadCombo("ord_pmagam_q", "saupj", "sel_saupj");

  	pgLoadDataS();

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
	pgLoadDataAll(1);
}

//엑셀 변환
function onExcel() {	
	const vToday = cfGetToday();
	fnExcelReport('tbl_wrap_excel', '월마감전현황-'+ cfStringFormat(vToday, "D1"));
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
    switch (name) {
        case "txt_cvcod":
            response = JSON.parse(response);
            let vListHTML = "";
            
            if (response.DATA.length == 0) {
                cfSetValue("txt_cvcod","");
                cfSetValue("txt_cvnas","");
                cfGetMessage("scm/ord_pmagam_q", "message" ,"110");
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
    if (vCvcod == "" || vCvcod == null) {
        cfGetMessage("scm/ord_pmagam_q", "message", "250");
        return false;
    }
    const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Yymm: sYymm,
        Cvcod: vCvcod,
        Saupj: vSaupj
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/ord_pmagam_q", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/ord/ord_pmagam_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
                "ITNBR": aItem["ITNBR"],    	// 품번
                "ITDSC": aItem["ITDSC"],    	// 품명
                "TITNM": aItem["TITNM"],    	// 분류  
                "IOAMT": aItem["IOAMT"],    	// 입고금액                      
				"IOQTY": aItem["IOQTY"],		// 입고수량       
				"IOPRC": aItem["IOPRC"],    	// 단가                     
                "CARTYPE": aItem["CARTYPE"],	// 차종  
                "IWQTY": aItem["IWQTY"],  		// 이월분
                "QTY1": aItem["QTY1"],  		// 1
                "QTY2": aItem["QTY2"],  		// 2
                "QTY3": aItem["QTY3"],  		// 3
                "QTY4": aItem["QTY4"],  		// 4
                "QTY5": aItem["QTY5"],  		// 5
                "QTY6": aItem["QTY6"],  		// 6
                "QTY7": aItem["QTY7"],  		// 7
                "QTY8": aItem["QTY8"],  		// 8
                "QTY9": aItem["QTY9"],  		// 9
                "QTY10": aItem["QTY10"],  		// 10
                "QTY11": aItem["QTY11"],  		// 11
                "QTY12": aItem["QTY12"],  		// 12
                "QTY13": aItem["QTY13"],  		// 13
                "QTY14": aItem["QTY14"],  		// 14
                "QTY15": aItem["QTY15"],  		// 15
                "QTY16": aItem["QTY16"],  		// 16
                "QTY17": aItem["QTY17"],  		// 17
                "QTY18": aItem["QTY18"],  		// 18
                "QTY19": aItem["QTY19"],  		// 19
                "QTY20": aItem["QTY20"],  		// 20
                "QTY21": aItem["QTY21"],  		// 21
                "QTY22": aItem["QTY22"],  		// 22
                "QTY23": aItem["QTY23"],  		// 23
                "QTY24": aItem["QTY24"],  		// 24
                "QTY25": aItem["QTY25"],  		// 25
                "QTY26": aItem["QTY26"],  		// 26
                "QTY27": aItem["QTY27"],  		// 27
                "QTY28": aItem["QTY28"],  		// 28
                "QTY29": aItem["QTY29"],  		// 29
                "QTY30": aItem["QTY30"],    	// 30
                "QTY31": aItem["QTY31"],     	// 31
                "QTY30": aItem["QTY30"],  		// 30
                "QTY31": aItem["QTY31"]  		// 31
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];
		
		//format
        for (let i = 0; i < vBody.rows.length; i++) {
			// 입고금액
            vBody.rows[i].cells[3].innerText = cfStringFormat(vBody.rows[i].cells[3].innerText, "N");
			// 입고수량
            vBody.rows[i].cells[4].innerText = cfNumberFormat(vBody.rows[i].cells[4].innerText);
			// 단가
            vBody.rows[i].cells[5].innerText = cfNumberFormat(vBody.rows[i].cells[5].innerText);
			// 이월분
            vBody.rows[i].cells[7].innerText = cfNumberFormat(vBody.rows[i].cells[7].innerText);

			///////// 1~31
			
			// 1~10
            vBody.rows[i].cells[8].innerText = cfStringFormat(vBody.rows[i].cells[8].innerText, "N");
            vBody.rows[i].cells[9].innerText = cfStringFormat(vBody.rows[i].cells[9].innerText, "N");
            vBody.rows[i].cells[10].innerText = cfStringFormat(vBody.rows[i].cells[10].innerText, "N");
            vBody.rows[i].cells[11].innerText = cfStringFormat(vBody.rows[i].cells[11].innerText, "N");
            vBody.rows[i].cells[12].innerText = cfStringFormat(vBody.rows[i].cells[12].innerText, "N");
            vBody.rows[i].cells[13].innerText = cfStringFormat(vBody.rows[i].cells[13].innerText, "N");
            vBody.rows[i].cells[14].innerText = cfStringFormat(vBody.rows[i].cells[14].innerText, "N");
            vBody.rows[i].cells[15].innerText = cfStringFormat(vBody.rows[i].cells[15].innerText, "N");
            vBody.rows[i].cells[16].innerText = cfStringFormat(vBody.rows[i].cells[16].innerText, "N");
            vBody.rows[i].cells[17].innerText = cfStringFormat(vBody.rows[i].cells[17].innerText, "N");
			
			// 11~20
            vBody.rows[i].cells[18].innerText = cfStringFormat(vBody.rows[i].cells[18].innerText, "N");
            vBody.rows[i].cells[19].innerText = cfStringFormat(vBody.rows[i].cells[19].innerText, "N");
            vBody.rows[i].cells[20].innerText = cfStringFormat(vBody.rows[i].cells[20].innerText, "N");
            vBody.rows[i].cells[21].innerText = cfStringFormat(vBody.rows[i].cells[21].innerText, "N");
            vBody.rows[i].cells[22].innerText = cfStringFormat(vBody.rows[i].cells[22].innerText, "N");
            vBody.rows[i].cells[23].innerText = cfStringFormat(vBody.rows[i].cells[23].innerText, "N");
            vBody.rows[i].cells[24].innerText = cfStringFormat(vBody.rows[i].cells[24].innerText, "N");
            vBody.rows[i].cells[25].innerText = cfStringFormat(vBody.rows[i].cells[25].innerText, "N");
            vBody.rows[i].cells[26].innerText = cfStringFormat(vBody.rows[i].cells[26].innerText, "N");
            vBody.rows[i].cells[27].innerText = cfStringFormat(vBody.rows[i].cells[27].innerText, "N");
			
			// 21~31
            vBody.rows[i].cells[28].innerText = cfStringFormat(vBody.rows[i].cells[28].innerText, "N");
            vBody.rows[i].cells[29].innerText = cfStringFormat(vBody.rows[i].cells[29].innerText, "N");
            vBody.rows[i].cells[30].innerText = cfStringFormat(vBody.rows[i].cells[30].innerText, "N");
            vBody.rows[i].cells[31].innerText = cfStringFormat(vBody.rows[i].cells[31].innerText, "N");
            vBody.rows[i].cells[32].innerText = cfStringFormat(vBody.rows[i].cells[32].innerText, "N");
            vBody.rows[i].cells[33].innerText = cfStringFormat(vBody.rows[i].cells[33].innerText, "N");                
			vBody.rows[i].cells[34].innerText = cfStringFormat(vBody.rows[i].cells[34].innerText, "N");
            vBody.rows[i].cells[35].innerText = cfStringFormat(vBody.rows[i].cells[35].innerText, "N");
            vBody.rows[i].cells[36].innerText = cfStringFormat(vBody.rows[i].cells[36].innerText, "N");
            vBody.rows[i].cells[37].innerText = cfStringFormat(vBody.rows[i].cells[37].innerText, "N");
            vBody.rows[i].cells[38].innerText = cfStringFormat(vBody.rows[i].cells[38].innerText, "N");
        }

        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/ord_pmagam_q", "message", "110");
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
    
    const sYymm = cfGetValue("txt_Yymm").replace(/-/gi, "");
    const vCvcod = cfGetValue("txt_cvcod");    
    const vSaupj = cfGetValue("sel_saupj");
    
    //값 체크
    if (vCvcod == "" || vCvcod == null) {
        cfGetMessage("scm/ord_pmagam_q", "message", "250");
        return false;
    }
    const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Yymm: sYymm,
        Cvcod: vCvcod,
        Saupj: vSaupj
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/ord_pmagam_q", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/ord/ord_pmagam_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
                "ITNBR": aItem["ITNBR"],    	// 품번
                "ITDSC": aItem["ITDSC"],    	// 품명
                "TITNM": aItem["TITNM"],    	// 분류  
                "IOAMT": aItem["IOAMT"],    	// 입고금액                      
				"IOQTY": aItem["IOQTY"],		// 입고수량       
				"IOPRC": aItem["IOPRC"],    	// 단가                     
                "CARTYPE": aItem["CARTYPE"],	// 차종  
                "IWQTY": aItem["IWQTY"],  		// 이월분
                "QTY1": aItem["QTY1"],  		// 1
                "QTY2": aItem["QTY2"],  		// 2
                "QTY3": aItem["QTY3"],  		// 3
                "QTY4": aItem["QTY4"],  		// 4
                "QTY5": aItem["QTY5"],  		// 5
                "QTY6": aItem["QTY6"],  		// 6
                "QTY7": aItem["QTY7"],  		// 7
                "QTY8": aItem["QTY8"],  		// 8
                "QTY9": aItem["QTY9"],  		// 9
                "QTY10": aItem["QTY10"],  		// 10
                "QTY11": aItem["QTY11"],  		// 11
                "QTY12": aItem["QTY12"],  		// 12
                "QTY13": aItem["QTY13"],  		// 13
                "QTY14": aItem["QTY14"],  		// 14
                "QTY15": aItem["QTY15"],  		// 15
                "QTY16": aItem["QTY16"],  		// 16
                "QTY17": aItem["QTY17"],  		// 17
                "QTY18": aItem["QTY18"],  		// 18
                "QTY19": aItem["QTY19"],  		// 19
                "QTY20": aItem["QTY20"],  		// 20
                "QTY21": aItem["QTY21"],  		// 21
                "QTY22": aItem["QTY22"],  		// 22
                "QTY23": aItem["QTY23"],  		// 23
                "QTY24": aItem["QTY24"],  		// 24
                "QTY25": aItem["QTY25"],  		// 25
                "QTY26": aItem["QTY26"],  		// 26
                "QTY27": aItem["QTY27"],  		// 27
                "QTY28": aItem["QTY28"],  		// 28
                "QTY29": aItem["QTY29"],  		// 29
                "QTY30": aItem["QTY30"],    	// 30
                "QTY31": aItem["QTY31"],     	// 31
                "QTY30": aItem["QTY30"],  		// 30
                "QTY31": aItem["QTY31"]  		// 31
            });
        }
        $("#tbl_wrap_excel").show();
        
        $("#tbl_body_excel").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap_excel")[0].tBodies[0];
		
		//format
        for (let i = 0; i < vBody.rows.length; i++) {
			// 입고금액
            vBody.rows[i].cells[3].innerText = cfStringFormat(vBody.rows[i].cells[3].innerText, "N");
			// 입고수량
            vBody.rows[i].cells[4].innerText = cfNumberFormat(vBody.rows[i].cells[4].innerText);
			// 단가
            vBody.rows[i].cells[5].innerText = cfNumberFormat(vBody.rows[i].cells[5].innerText);
			// 이월분
            vBody.rows[i].cells[7].innerText = cfNumberFormat(vBody.rows[i].cells[7].innerText);

			///////// 1~31
			
			// 1~10
            vBody.rows[i].cells[8].innerText = cfStringFormat(vBody.rows[i].cells[8].innerText, "N");
            vBody.rows[i].cells[9].innerText = cfStringFormat(vBody.rows[i].cells[9].innerText, "N");
            vBody.rows[i].cells[10].innerText = cfStringFormat(vBody.rows[i].cells[10].innerText, "N");
            vBody.rows[i].cells[11].innerText = cfStringFormat(vBody.rows[i].cells[11].innerText, "N");
            vBody.rows[i].cells[12].innerText = cfStringFormat(vBody.rows[i].cells[12].innerText, "N");
            vBody.rows[i].cells[13].innerText = cfStringFormat(vBody.rows[i].cells[13].innerText, "N");
            vBody.rows[i].cells[14].innerText = cfStringFormat(vBody.rows[i].cells[14].innerText, "N");
            vBody.rows[i].cells[15].innerText = cfStringFormat(vBody.rows[i].cells[15].innerText, "N");
            vBody.rows[i].cells[16].innerText = cfStringFormat(vBody.rows[i].cells[16].innerText, "N");
            vBody.rows[i].cells[17].innerText = cfStringFormat(vBody.rows[i].cells[17].innerText, "N");
			
			// 11~20
            vBody.rows[i].cells[18].innerText = cfStringFormat(vBody.rows[i].cells[18].innerText, "N");
            vBody.rows[i].cells[19].innerText = cfStringFormat(vBody.rows[i].cells[19].innerText, "N");
            vBody.rows[i].cells[20].innerText = cfStringFormat(vBody.rows[i].cells[20].innerText, "N");
            vBody.rows[i].cells[21].innerText = cfStringFormat(vBody.rows[i].cells[21].innerText, "N");
            vBody.rows[i].cells[22].innerText = cfStringFormat(vBody.rows[i].cells[22].innerText, "N");
            vBody.rows[i].cells[23].innerText = cfStringFormat(vBody.rows[i].cells[23].innerText, "N");
            vBody.rows[i].cells[24].innerText = cfStringFormat(vBody.rows[i].cells[24].innerText, "N");
            vBody.rows[i].cells[25].innerText = cfStringFormat(vBody.rows[i].cells[25].innerText, "N");
            vBody.rows[i].cells[26].innerText = cfStringFormat(vBody.rows[i].cells[26].innerText, "N");
            vBody.rows[i].cells[27].innerText = cfStringFormat(vBody.rows[i].cells[27].innerText, "N");
			
			// 21~31
            vBody.rows[i].cells[28].innerText = cfStringFormat(vBody.rows[i].cells[28].innerText, "N");
            vBody.rows[i].cells[29].innerText = cfStringFormat(vBody.rows[i].cells[29].innerText, "N");
            vBody.rows[i].cells[30].innerText = cfStringFormat(vBody.rows[i].cells[30].innerText, "N");
            vBody.rows[i].cells[31].innerText = cfStringFormat(vBody.rows[i].cells[31].innerText, "N");
            vBody.rows[i].cells[32].innerText = cfStringFormat(vBody.rows[i].cells[32].innerText, "N");
            vBody.rows[i].cells[33].innerText = cfStringFormat(vBody.rows[i].cells[33].innerText, "N");                
			vBody.rows[i].cells[34].innerText = cfStringFormat(vBody.rows[i].cells[34].innerText, "N");
            vBody.rows[i].cells[35].innerText = cfStringFormat(vBody.rows[i].cells[35].innerText, "N");
            vBody.rows[i].cells[36].innerText = cfStringFormat(vBody.rows[i].cells[36].innerText, "N");
            vBody.rows[i].cells[37].innerText = cfStringFormat(vBody.rows[i].cells[37].innerText, "N");
            vBody.rows[i].cells[38].innerText = cfStringFormat(vBody.rows[i].cells[38].innerText, "N");
        }

        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/ord_pmagam_q", "message", "110");
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
                    cfAjaxAsync("GET","scm/ord_pmagam_q",oData,"txt_cvcod");                    
                } else {
					cfSetValue("txt_cvnas","");
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

$(document).on('keyup', "#txt_Yymm", function(){
//  console.log(this.value);
  this.value = autoHypenYymm( this.value ) ;  
});

// 테이블 형태 출력
function pgLoadDataS() {
    const sData = {
        ActGubun: "S"
    }
    oResponse = cfAjaxSync("POST", "scm/ord_pmagam_q", sData, "startSelectS");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","scm/ord/ord_pmagam_q.txt",null,"table"); //테이블 정보 읽어오기
    
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
        cfGetMessage("scm/ord_pmagam_q", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
    }
}

// 시스템관리자 / 사용자 구분
function cfGetAuth() {
	let aData = {
		ActGubun : "getAuth",
		ID : cfGetLoginId()
	};
	
	cfAjaxSync("POST", "scm/ord_pmagam_q", aData, "getAuth");
}