//----------------------------------------------------------------
// Document : 출발 처리
// 작성자 : 김대영
//  수정 : 김준형
// 작성일자 : 2021-03-02
// 수정일자 : 2021-09-24
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
	if($("#rbt_gubunI").is(":checked")) {
	    cfBtnHide("add","delete","insert","print","modify","help");
		pgLoadDataS();
	}
	
	$(document).on("click", "#rbt_gubunI", function() {
	    cfBtnHide("add","delete","insert","print","modify","help");
		cfBtnShow("save");
		pgLoadDataS();
	});
	$(document).on("click", "#rbt_gubunD", function() {
	    cfBtnHide("save");
		cfBtnShow("delete");
		pgLoadDataC();
	});
	
    // 날짜
    cfMaxLength("txt_fromDate", "L"); //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리
    cfMaxLength("txt_toDate", "L");   //최대길이 설정 "S" 4자리, "M" 7자리, "L" 10자리
	
//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
    cfGetHeadCombo("ord_chul_e", "saupj", "sel_saupj"); //사업장
    cfGetHeadCombo("ord_chul_e", "ittyp", "sel_ittyp"); //품목구분
    gvPojang = "<option></option>" + cfGetTableCombo("ord_chul_e", "pojang");   //포장용기
    
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
	//test
//    cfSetValue("txt_fromDate", "2014-01-02");
//    cfSetValue("txt_cvcod", "300051");
}
//----------------------------------------------------------------
// 2.버튼 그룹 이벤트
//----------------------------------------------------------------
//조회 버튼 
function onSearch() {
    pgLoadData(1);
	pgLoadDataAll(1);
}
//저장 버튼
function onSave(e) {
    if (jfUpdateChk(e.target.id)) {
        let aRowData = new Array();
        let bUpdateStat = true;
		const vToday = cfGetToday();
		const vDate = new Date();
		const vHour = vDate.getHours();
		const vMin = vDate.getMinutes();
		const vSec = vDate.getSeconds();
        const vCrtdt = cfGetToday() + cfNumToStr(vHour, 2) + cfNumToStr(vMin, 2) + cfNumToStr(vSec, 2);
        const vCvcod = cfGetLoginCvcod();

		// 루프 돌기전에 전표 채번
		let vJunpyo = cfGetJunPyo(vToday, "P1");
		let vJpCnt = 1;
		
        //head를 초과한 객체들을 반복선택
        $("#tbl_wrap tr:gt(0)").each(function (row, tr) {
            //tr의 자식요소인 td들의 배열 
            const aTableData = $(this).children("td").map(function () {
                return $(this).text();
            });
			
			let vChk = $("#cbx_listChk" + row).is(":checked");
			if(vChk){
	            if (gvOrgData[row].NAQTY == aTableData[10]) {
	                return false;
	            }

	            //tr td dropdown에서 값 가져오기
	            let vSelectBoxes = cfGetValue("sel_pojang" + row );
	            let vIpdpt = '' + aTableData[17]; //공장코드 IPDPT
	            //Uncaught TypeError: Cannot read property 'substring' of undefined
	            //Uncaught TypeError: Cannot read property 'substr' of undefined
	            //위 에러 발생하면 변수 앞메 '' 연결하여 받은 변수로 substr 사용 정확하게 문자 변환이 안되어 발생함.
	            vIpdpt = vIpdpt.substring(0, 2);
	
	            if (vIpdpt == "ZZ") {
	                if (vIpdpt == "") {
	                    $("#oCheckMessage").html("공장코드를 선택하세요.");
	                    $("#checkType").attr("class", "modal-content panel-success");
	                    modalObj.modalOpenFunc('oCheckModal');
	                    bUpdateStat = false;
	                    return false;
	                }
	            }
	            if (aTableData[10] == "" || aTableData[10] == 0) {
	                $("#oCheckMessage").html("출발 처리할 납품수량을 입력하지 않으셨습니다.");
	                $("#checkType").attr("class", "modal-content panel-success");
	                modalObj.modalOpenFunc('oCheckModal');
	                bUpdateStat = false;
	                return false;
	            }
	            if (aTableData[12] == "" || aTableData[12] == 0) {
	                $("#oCheckMessage").html("용기적입수를 입력하지 않으셨습니다.");
	                $("#checkType").attr("class", "modal-content panel-success");
	                modalObj.modalOpenFunc('oCheckModal');
	                bUpdateStat = false;
	                return false;
	            }
				
	            if (aTableData[11].length > 0) {
	                if (vSelectBoxes.length == 0 || vSelectBoxes == null || vSelectBoxes == '') {
	                    $("#oCheckMessage").html("포장용기를 선택하여 주십시오.");
	                    $("#checkType").attr("class", "modal-content panel-success");
	                    modalObj.modalOpenFunc('oCheckModal');
	                    bUpdateStat = false;
	                    return false;
	                }
	            }

	            let vJunpyoNum = vToday + vJunpyo + cfNumToStr(vJpCnt, 3);
//				console.log("vJunpyoNum = " + vJunpyoNum);
				
				vJpCnt++;
				
				if(aTableData[8] == 0 || aTableData[8] == null){
					aTableData[8] = cfGetToday();
				}
				
	            //Table 자료 저장
	            aRowData.push({
	                "1" : vJunpyoNum,       //전표
	                "2" : aTableData[18],   //업체코드
	                "3" : aTableData[1],    //발주번호
	                "4" : aTableData[19],   //발주항번
	                "5" : aTableData[2],    //품번
	                "6" : aTableData[10],   //납품수량
	                "7" : aTableData[8],    //납기일
	                "8" : "0",
	                "9" : "",
	                "10" : "0",
	                "11" : "0",
	                "12" : "0",
	                "13" : "0",
	                "14" : "",
	                "15" : vCrtdt,
	                "16" : vCvcod,
	                "17" : aTableData[21],
	                "18" : "Y",
	                "19" : vToday + vJunpyo,
	                "20" : aTableData[20],
	                "21" : aTableData[22],
	                "22" : aTableData[16], 
	                "23" : "",
	                "24" : aTableData[17],
	                "25" : vSelectBoxes,
	                "26" : aTableData[12],
	                "27" : aTableData[15]
	            });
	        }
		});
        if (bUpdateStat) {
            const oData = {
                ActGubun: "I",
                JsonData: JSON.stringify(aRowData)
            }
            cfAjaxSync("POST", "scm/ord_chul_e", oData, "startSave");
        }
    }
}
//삭제 버튼
function onDelete(e) {
    if (jfUpdateChk(e.target.id)) {
		Swal.fire({
		  title: "선택하신 자료를 삭제하시겠습니까?",
		  text: "",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#007aff',
		  cancelButtonColor: '#d33',
		  confirmButtonText: '확인',
		  cancelButtonText: '취소'
		}).then((result) => {
			if (result.isConfirmed) {
		        const aRowData = new Array();
		        const vChkBox = $("input[name=listChk]:checked");
		
		        vChkBox.each(function (i) {
		            // vChkbox.parent() : vChkBox의 부모는 <td> 태그이다.
		            // vChkbox.parent().parent() : <td>의 부모이므로 <tr>이다.
		            const vTr = vChkBox.parent().parent().eq(i);
		            const vTd = vTr.children();
		            // vTd.eq(0)은 체크박스이다.
		            const vPk = vTd.eq(15).text();
		            aRowData.push({
		                "KEY": vPk.replace(/^\s+|\s+$/gm, '') //문자열의 시작 부분과 끝 부분사이에 있는 공백문자를 빈 문자열로 바꾸는 정규식
		            });
		        });
		        if (aRowData.size == 0) {
		            $("#oCheckMessage").html("삭제할 납입전표를 선택하세요.");
		            $("#checkType").attr("class", "modal-content panel-success");
		            modalObj.modalOpenFunc('oCheckModal');
		            return false;
		        }
		        const oData = {
		            ActGubun: "D",
		            JsonData: JSON.stringify(aRowData)
		        }
		        cfAjaxSync("POST", "scm/ord_chul_e", oData,"cancelDelete" );
			} else {
            	return false;
			}
		});
    }
}

//취소 버튼
function onCancel() {
	location.reload();
}

//엑셀 변환
function onExcel() {	
	const vToday = cfGetToday();
	fnExcelReport('tbl_wrap_excel', '출발처리-'+ cfStringFormat(vToday, "D1"));
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
        case "startSave":
            oData = JSON.parse(response);
            if (oData.Result != true) {
                $("#oCheckMessage").html(oData.Message);
                $("#checkType").attr("class", "modal-content panel-success");
                modalObj.modalOpenFunc('oCheckModal');
            } else {
				Swal.fire({
					title: oData.InsertCnt + "건 처리 완료했습니다",
					icon: 'success',
					confirmButtonColor: '#007aff',
					confirmButtonText: '확인'
				});
                pgLoadData(1);  //재조회
            }
            break;
         case "cancelDelete":
            oData = JSON.parse(response);
            if (oData.Result != true) {
                $("#oCheckMessage").html(oData.Message);
                $("#checkType").attr("class", "modal-content panel-success");
                modalObj.modalOpenFunc('oCheckModal');
            } else {
                Swal.fire({
					title: oData.DeleteCnt + "건 처리 완료했습니다",
					icon: 'success',
					confirmButtonColor: '#007aff',
					confirmButtonText: '확인'
				});
                pgLoadData(1);  //재조회
            }
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
                cfGetMessage("scm/ord_chul_e", "message" ,"110");
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
                cfGetMessage("scm/ord_chul_e", "message" ,"110");

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
let oResponse;
function pgLoadData(page) {
//	let chkimg = $("#swal2-title");
//	chkimg.removeClass("chk-img");
	
    const nPageLength = 20; //페이지당 데이터를 보여줄 행의 갯수
    const vGubun = cfGetValue("rbt_gubunI");
    const nFdate = cfGetValue("txt_fromDate").replace(/-/gi, "");
    const nTdate = cfGetValue("txt_toDate").replace(/-/gi, "");
    const vCvcod = cfGetValue("txt_cvcod");
    const vCvnas = cfGetValue("txt_cvnas");
    const vSaupj = cfGetValue("sel_saupj");
    const vItnbr = cfGetValue("txt_itnbr");
    const vItdsc = cfGetValue("txt_itdsc");
    const vIttyp = cfGetValue("sel_ittyp");

    //값 체크
    if (vCvcod == "" || vCvcod == null) {
        cfGetMessage("scm/ord_chul_e", "message", "250");
        return false;
    }
    const oData = {
        ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Gubun: vGubun,
        Fdate: nFdate,
        Tdate: nTdate,
        Cvcod: vCvcod,
        Cvnas: vCvnas,
        Saupj: vSaupj, 
        Itnbr: vItnbr, 
        Itdsc: vItdsc, 
        Ittyp: vIttyp
    }
    
    oResponse = cfAjaxSync("POST", "scm/ord_chul_e", oData, "startSelect");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));
    const vTable = cfAjaxSync("GET","scm/ord/ord_chul_e.txt",null,"table"); //테이블 정보 읽어오기
    
    const nTotalRecords = oResponse.RecordCount;    //데이터 총 갯수
    const nRecordPerPage = oResponse.PageLength;    //페이지의 갯수
    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;

    if (oResponse.RecordCount > 0) {
        //vListHTML += "<tr>";
        if (vGubun == "I") {
            vListHTML = vTable.split("|")[0];
        } else {
            vListHTML = vTable.split("|")[2];
        }

        vListHTML += "</tr>";
        $("#tbl_head").html(vListHTML); //테이블 헤드
        vListHTML = "";

        let vTr = vTable.split("|");
        let oEdit = {
            "pojang" : gvPojang
        }

        let vRow;
        let oPojang = cfAjaxSync("GET","scm/ord_chul_e", {"SearchGubun" : "pojang"});
        oPojang = JSON.parse(oPojang);
        oPojang = oPojang.DATA;

        for (i = 0; i < oResult.length; i++) {
            let aItem = oResult[i];
			if(aItem["POQTY"] == null || aItem["POQTY"] == ''){
				aItem["POQTY"] = 0;
			}
            
            if (vGubun == "I") {
                vListHTML = vTr[1];
                vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
                vRow += vListHTML;
            } else {
                vListHTML = vTr[3];
                vListHTML = cfDrawTable(vListHTML, aItem, i);
                vRow += vListHTML;
            }
            vListHTML += "</tr>";
            //Table 원본 자료 저장
            gvOrgData.push({
                "BALJPNO": aItem["BALJPNO"],//발주번호  
                "ITNBR": aItem["ITNBR"],    //품번
                "ITDSC": aItem["ITDSC"],    //품명
                "ISPEC": aItem["ISPEC"],    //규격  
                "JIJIL": aItem["JIJIL"],    //재질                      
                "JANRU": aItem["JANRU"],    //발주량                     
                "GUDAT": aItem["GUDAT"],    //납기요구일
                "NAPDATE": aItem["NAPDATE"],//납기일
                "WBALQTY": aItem["WBALQTY"],//발주잔량  
                "NAQTY": aItem["NAQTY"],    //납품수량 
                "POJANG": "",               //포장용기    
                "POQTY": aItem["POQTY"],    //용기적입수
                "UNMSR": aItem["UNMSR"],    //단위
                "ORDER_NO": aItem["ORDER_NO"], //고객발주번호
                "BIGO": aItem["BIGO"],      //비고
                "LOTNO": aItem["LOTNO"],    //LOTNO
                "CVCOD": aItem["CVCOD"],    //업체코드
                "BALSEQ": aItem["BALSEQ"],  //발주순번    
                "PSPEC": aItem["PSPEC"],    //
                "PFILE": aItem["PFILE"],
                "BALRATE": aItem["BALRATE"],//발주단위    
                "IPSAUPJ": aItem["IPSAUPJ"],//사업장코드
                "IPDPT": aItem["IPDPT"]     //창고코드                    
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];
        if (cfGetValue("rbt_gubunI") == "I") {
            for (let i = 0; i < vBody.rows.length; i++) {
                vBody.rows[i].cells[1].innerText = cfStringFormat(vBody.rows[i].cells[1].innerText,"J");
                vBody.rows[i].cells[6].innerText = cfStringFormat(vBody.rows[i].cells[6].innerText,"N");
                vBody.rows[i].cells[7].innerText = cfStringFormat(vBody.rows[i].cells[7].innerText,"D2");
                vBody.rows[i].cells[8].innerText = cfStringFormat(vBody.rows[i].cells[8].innerText,"D2");
                vBody.rows[i].cells[9].innerText = cfStringFormat(vBody.rows[i].cells[9].innerText,"N");
            }
        } else {
            let vPojang;
            for (let i = 0; i < vBody.rows.length; i++) {
                vBody.rows[i].cells[2].innerText = cfStringFormat(vBody.rows[i].cells[2].innerText,"J");
                vBody.rows[i].cells[7].innerText = cfStringFormat(vBody.rows[i].cells[7].innerText,"N");
                vBody.rows[i].cells[8].innerText = cfStringFormat(vBody.rows[i].cells[8].innerText,"J");
                vPojang = oPojang.find(findPojang);
                
                if (vPojang === undefined) {
                    continue;
                }
                //find에 대한 콜백함수
                function findPojang(object) {
                    if (object.RFGUB == vBody.rows[i].cells[11].innerText) {
                        return true;
                    }
                }
                vBody.rows[i].cells[11].innerText = vPojang.RFNA1;
            }
        }
        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/ord_chul_e", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
		if (cfGetValue("rbt_gubunI") == "I") {
			pgLoadDataS();
		} else {
			pgLoadDataC();
		}
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
    const vGubun = cfGetValue("rbt_gubunI");
    const nFdate = cfGetValue("txt_fromDate").replace(/-/gi, "");
    const nTdate = cfGetValue("txt_toDate").replace(/-/gi, "");
    const vCvcod = cfGetValue("txt_cvcod");
    const vCvnas = cfGetValue("txt_cvnas");
    const vSaupj = cfGetValue("sel_saupj");
    const vItnbr = cfGetValue("txt_itnbr");
    const vItdsc = cfGetValue("txt_itdsc");
    const vIttyp = cfGetValue("sel_ittyp");

    //값 체크
    if (vCvcod == "" || vCvcod == null) {
        cfGetMessage("scm/ord_chul_e", "message", "250");
        return false;
    }
    const oData = {
        ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Gubun: vGubun,
        Fdate: nFdate,
        Tdate: nTdate,
        Cvcod: vCvcod,
        Cvnas: vCvnas,
        Saupj: vSaupj, 
        Itnbr: vItnbr, 
        Itdsc: vItdsc, 
        Ittyp: vIttyp
    }
    
    oResponse = cfAjaxSync("POST", "scm/ord_chul_e", oData, "startSelect");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));
    const vTable = cfAjaxSync("GET","scm/ord/ord_chul_e.txt",null,"table"); //테이블 정보 읽어오기
    
    const nTotalRecords = oResponse.RecordCount;    //데이터 총 갯수
    const nRecordPerPage = oResponse.PageLength;    //페이지의 갯수
    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;

    if (oResponse.RecordCount > 0) {
        //vListHTML += "<tr>";
        if (vGubun == "I") {
            vListHTML = vTable.split("|")[8];
        } else {
            vListHTML = vTable.split("|")[10];
        }

        vListHTML += "</tr>";
        $("#tbl_head_excel").html(vListHTML); //테이블 헤드
        vListHTML = "";

        let vTr = vTable.split("|");
        let oEdit = {
            "pojang" : gvPojang
        }

        let vRow;
        let oPojang = cfAjaxSync("GET","scm/ord_chul_e", {"SearchGubun" : "pojang"});
        oPojang = JSON.parse(oPojang);
        oPojang = oPojang.DATA;

        for (i = 0; i < oResult.length; i++) {
            let aItem = oResult[i];
			if(aItem["POQTY"] == null || aItem["POQTY"] == ''){
				aItem["POQTY"] = 0;
			}
            
            if (vGubun == "I") {
                vListHTML = vTr[9];
                vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
                vRow += vListHTML;
            } else {
                vListHTML = vTr[11];
                vListHTML = cfDrawTable(vListHTML, aItem, i);
                vRow += vListHTML;
            }
            vListHTML += "</tr>";
            //Table 원본 자료 저장
            gvOrgData.push({
                "BALJPNO": aItem["BALJPNO"],//발주번호  
                "ITNBR": aItem["ITNBR"],    //품번
                "ITDSC": aItem["ITDSC"],    //품명
                "ISPEC": aItem["ISPEC"],    //규격  
                "JIJIL": aItem["JIJIL"],    //재질                      
                "JANRU": aItem["JANRU"],    //발주량                     
                "GUDAT": aItem["GUDAT"],    //납기요구일
                "NAPDATE": aItem["NAPDATE"],//납기일
                "WBALQTY": aItem["WBALQTY"],//발주잔량  
                "NAQTY": aItem["NAQTY"],    //납품수량 
                "POJANG": "",               //포장용기    
                "POQTY": aItem["POQTY"],    //용기적입수
                "UNMSR": aItem["UNMSR"],    //단위
                "ORDER_NO": aItem["ORDER_NO"], //고객발주번호
                "BIGO": aItem["BIGO"],      //비고
                "LOTNO": aItem["LOTNO"]     //LOTNO
            });
        }
        $("#tbl_wrap_excel").show();
        
        $("#tbl_body_excel").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap_excel")[0].tBodies[0];
        if (cfGetValue("rbt_gubunI") == "I") {
            for (let i = 0; i < vBody.rows.length; i++) {
                vBody.rows[i].cells[0].innerText = cfStringFormat(vBody.rows[i].cells[0].innerText,"J");
                vBody.rows[i].cells[5].innerText = cfStringFormat(vBody.rows[i].cells[5].innerText,"N");
                vBody.rows[i].cells[6].innerText = cfStringFormat(vBody.rows[i].cells[6].innerText,"D2");
                vBody.rows[i].cells[7].innerText = cfStringFormat(vBody.rows[i].cells[7].innerText,"D2");
                vBody.rows[i].cells[8].innerText = cfStringFormat(vBody.rows[i].cells[8].innerText,"N");
            }
        } else {
            let vPojang;
            for (let i = 0; i < vBody.rows.length; i++) {
                vBody.rows[i].cells[1].innerText = cfStringFormat(vBody.rows[i].cells[1].innerText,"J");
                vBody.rows[i].cells[6].innerText = cfStringFormat(vBody.rows[i].cells[6].innerText,"N");
                vBody.rows[i].cells[7].innerText = cfStringFormat(vBody.rows[i].cells[7].innerText,"J");
                vPojang = oPojang.find(findPojang);
                
                if (vPojang === undefined) {
                    continue;
                }
                //find에 대한 콜백함수
                function findPojang(object) {
                    if (object.RFGUB == vBody.rows[i].cells[10].innerText) {
                        return true;
                    }
                }
                vBody.rows[i].cells[10].innerText = vPojang.RFNA1;
            }
        }
        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/ord_chul_e", "message", "110");
        cfClearData("tbl_wrap_excel", "oPaginate");
		if (cfGetValue("rbt_gubunI") == "I") {
			pgLoadDataS();
		} else {
			pgLoadDataC();
		}
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
                cfAjaxAsync("GET","scm/ord_chul_e",oData,"txt_cvcod");
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
                    cfAjaxAsync("GET","scm/ord_chul_e",oDatas,"txt_itnbr");                    
                } else {
					cfSetValue("txt_itdsc","");
				}
            }
            break;
    }
});

//선택 컬럼 선택시 전체 선택/해제
$(document).on('click', '#cbx_checkAll', function(){
	if($('#cbx_checkAll').prop('checked')){
		$('.listChk').prop('checked',true);
	}else{
		$('.listChk').prop('checked',false);
	}
});

// 테이블 체크 박스
$(document).on('click','.listChk', function(){
	const vGubun = cfGetValue("rbt_gubunI");
	if(vGubun == 'I'){
		let rowData = new Array();
		let checkbox = $(this);
		let isChk = checkbox.is(":checked");
		let tr = checkbox.parent().parent();
		let vBal = tr[0].cells[9].innerText;
		let vNaq = tr[0].cells[10];
		let vNaqDate = tr[0].cells[8];
		
		if(isChk == true){  // 체크 시
			if(vNaq.innerText == 0) {  // 납품수량이 0일 때
				vNaq.innerHTML = "<td class='edit right'><div class='row_data'>" + vBal + "</div></td>";
				let vTodate = cfGetToday();
				vNaqDate.innerHTML = "<td class='edit center'><div class='row_data'>" + cfStringFormat(vTodate, "D2") + "</div></td>";
			}
		} else { // 체크 해제 시
			vNaq.innerHTML = "<td class='edit right'><div class='row_data'>" + 0 + "</div></td>";
			vNaqDate.innerText = "";
		}
		
		// 체크된 행 데이터 담기
		rowData.push(tr.text());
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

//Enter키 방지
$(document).keypress(function(e) {
	if(e.keyCode == 13)
	{
		e.preventDefault();		
		
	}
});

//테이블의 행에서 입력가능한 Column 문자 방지
//테이블의 행에서 입력가능한 Column에서 입력후 포커스가 벗어날시
$(document).on('blur', '.row_data', function(e) {
	cfItemChg_Naqty(this);
});




// 업체리스트 모달 선택값 설정 후 종료
$(document).on('dblclick', '#tbl_tbody_vndmst_p tr ', function () { 
    const aTableData = $(this).children("td").map(function() {
        return $(this).text();
    })      
    $("#txt_cvcod").val(aTableData[1]);
    $("#txt_cvnas").val(aTableData[2]);
    $('.btn-modal-close').click();
});
// 품번 모달
$(document).on('dblclick', '#tbl_tbody_itemas_p tr ', function () { 
    const aTableData = $(this).children("td").map(function() {
        return $(this).text();
    })      
    $("#txt_itnbr").val(aTableData[0]);
    $("#txt_itdsc").val(aTableData[1]);
    $('.btn-modal-close').click();
});

$(document).on('click', 'input:radio[name=gubun]', function (e) {
    cfClearData("tbl_wrap", "oPaginate");
});

// 5.사용자 정의 함수
function jfUpdateChk(id)
{   
    const vGubun = cfGetValue("rbt_gubunI");
    
    if (id == "btn_save") {
        if (vGubun == "D") {
            $("#oCheckMessage").html("취소모드에서는 저장이 불가능합니다.");
            $("#checkType").attr("class", "modal-content panel-success");
            modalObj.modalOpenFunc('oCheckModal');
            return false;
        }
    } else if (id == "btn_delete") {
        if (vGubun == "I"){
            $("#oCheckMessage").html("저장모드에서는 삭제가 불가능합니다.");
            $("#checkType").attr("class", "modal-content panel-success");
            modalObj.modalOpenFunc('oCheckModal');
            return false;	
        }
    }
    return true;
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
  this.value = autoHypenYymm( this.value ) ;  
});
$(document).on('keyup', "#txt_toDate", function(){
  this.value = autoHypenYymm( this.value ) ;  
});


// 납품수량 및 용기적입수 유효성검사
function cfItemChg_Naqty(data) {
    $(data).attr('contenteditable', false);
    $(data).removeClass('pd5');
    const vText = $(data).text().replace(",","");
	let vTodate = cfGetToday();
	const nDate = $(data).parent().parent()[0].cells[8];
    //data는 입력한 박스 object이다.
    //data.parent()는 td이다.
    //data.parent()는 tr이다.
    const nBal = $(data).parent().parent()[0].cells[9].innerText.replace(",","");
    //$(data).closest('tr')[0].cells[10].innerText; 위의 선택자와 같음
	
	//행 번호와 각 행 체크박스 아이디
	let cIdx = data.parentElement.parentElement.rowIndex - 1;
	let cChkId = document.getElementById("cbx_listChk" + cIdx);
	
	if(vText == '' || vText == null){
        $("#oCheckMessage").html("수량을 입력하지 않으셨습니다.");
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');
        $(data).text(0); //원값으로 복귀
		$(cChkId).prop("checked", false);
        return false;
	}
	if(Number(vText) < 0){
        $("#oCheckMessage").html("수량은 0보다 작을 수 없습니다.");
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');
        $(data).text(0);
		$(cChkId).prop("checked", false);
        return false;
    }
    if(Number(vText) > Number(nBal)){
        $("#oCheckMessage").html("잔량보다 큽니다. 다시 입력하세요.");
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');
        $(data).text(0);
		$(cChkId).prop("checked", false);
        return false;    
    }
	
	// 수정된 납기일
		const mnDate = 
	
	// 소수점 포맷
	$(data).text(cfStringFormat($(data).text().replace(",",""), "N"));
	// 수량 입력 시 자동 체크
	if(Number(vText) > 0 && Number(vText) <= Number(nBal)){
		$(cChkId).prop("checked", true);
		nDate.innerText = cfStringFormat(vTodate, "D2");
	} else {
		$(cChkId).prop("checked", false);
		nDate.innerText = "";
	}	
}

// 처리 상태 테이블 형태 출력
function pgLoadDataS() {
    const sData = {
        ActGubun: "S"
    }
    oResponse = cfAjaxSync("POST", "scm/ord_chul_e", sData, "startSelectS");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","scm/ord/ord_chul_e.txt",null,"table"); //테이블 정보 읽어오기
    
//    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;
    if (oResult.length > 0) {
		// header
        vListHTML = sTable.split("|")[4];
        vListHTML += "</tr>";
        $("#tbl_head").html(vListHTML); // 하단 테이블 헤드
        vListHTML = "";
		// body
        let vTr = sTable.split("|");
        let vRow;

        for (i = 0; i < oResult.length; i++) {
            let aItem = oResult[i];
            
            vListHTML = vTr[5];
            vListHTML = cfDrawTable(vListHTML, aItem, i);
            vRow += vListHTML;
            vListHTML += "</tr>";
        }

        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); // 테이블 몸체
        
    } else {
        cfGetMessage("scm/ord_chul_e", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
    }
}

// 취소 상태 테이블 형태 출력
function pgLoadDataC() {
    const sData = {
        ActGubun: "C"
    }
    oResponse = cfAjaxSync("POST", "scm/ord_chul_e", sData, "startSelectC");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","scm/ord/ord_chul_e.txt",null,"table"); //테이블 정보 읽어오기
    
//    let nPageNo = oResponse.PageNo;
    let oResult = oResponse.DATA;
    if (oResult.length > 0) {
		// header
        vListHTML = sTable.split("|")[6];
        vListHTML += "</tr>";
        $("#tbl_head").html(vListHTML); // 하단 테이블 헤드
        vListHTML = "";
		// body
        let vTr = sTable.split("|");
        let vRow;

        for (i = 0; i < oResult.length; i++) {
            let aItem = oResult[i];
            
            vListHTML = vTr[7];
            vListHTML = cfDrawTable(vListHTML, aItem, i);
            vRow += vListHTML;
            vListHTML += "</tr>";
        }

        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); // 테이블 몸체
        
    } else {
        cfGetMessage("scm/ord_chul_e", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
    }
}

// 시스템관리자 / 사용자 구분
function cfGetAuth() {
	let aData = {
		ActGubun : "getAuth",
		ID : cfGetLoginId()
	};
	
	cfAjaxSync("POST", "scm/ord_chul_e", aData, "getAuth");
}