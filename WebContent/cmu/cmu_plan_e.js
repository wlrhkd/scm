//----------------------------------------------------------------
// Document : 공지사항
// 작성자 : 이지현
// 작성일자 : 2021-10-08
//----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
//let gvHeightChk = true; //처음 조회시와 조회된 후 페이지만 넘길시에 디자인이 틀려져서 사용
let gvAdded = true;
let gvGubun = "I";
let gvChk = 0;

let gvNo = "";

let gvAuth;
//페이지 오픈시 실행
function setCondition() { 
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
	cfBtnHide("insert","modify","help","excel","print");
	setInitValue();
	pgLoadData(1);
	
//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
}
//----------------------------------------------------------------
// 초기값 설정
//----------------------------------------------------------------
function setInitValue() {
	let vChgid = cfGetLoginId();
    let vChgname = cfGetLoginCvnas();

	// 관리자/사용자
	cfGetAuth();
	if(gvAuth == "0"){
		$("#bg_private").addClass("gray");
		cfSetValue("txt_chg_ids", vChgid);
		cfSetValue("txt_chg_name", vChgname);
		$("#txt_chg_ids").prop('readonly', true);
		$("#btn_loginModal").prop('disabled', true);
	}
}
//----------------------------------------------------------------
// 2.버튼 그룹 이벤트
//----------------------------------------------------------------
//조회 버튼
function onSearch() {
    pgLoadData(1);
}

//저장 버튼
function onSave(e) {
	if(gvNo == null || gvNo == ""){
		gvGubun = 'I';
	} else {
		gvGubun = 'U';
	}
	if(gvGubun == 'I'){
		Swal.fire({
		  title: "공지사항을 등록하시겠습니까?",
		  text: "",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#007aff',
		  cancelButtonColor: '#d33',
		  confirmButtonText: '확인',
		  cancelButtonText: '취소'
		}).then((result) => {
		  if (result.isConfirmed) {
//		    Swal.fire('Save!', 'Your file has been save.', 'success')
		    let aRowData = new Array();
			let bUpdateStat = true;
			let saveYear = cfGetToday().substr(0,4);
			
			let today = cfGetToday();
			let year = today.substr(0,4); 	
			let month = today.substr(4,2);  
			let date = today.substr(6,2);  	
				
			const tTime = new Date();
			let hours = ('0' + tTime.getHours()).slice(-2); 		
			let minutes = ('0' + tTime.getMinutes()).slice(-2);   
			let seconds = ('0' + tTime.getSeconds()).slice(-2);  
			
			let dateTime= year + month + date + hours + minutes + seconds;
			
			 const aTableData = {
					iNo    :   $("#txt_no").val(),			// NO
					iCre_id:   $("#txt_cre_idk").val(),		//작성자(CODE)
					iCre_name: cfGetLoginCvnas(),			//작성자(NAME)
					iChg_id:   $("#txt_chg_ids").val(),  	//수신처(CODE)
					iCvnas:    $("#txt_chg_name").val(),	//수신처(NAME)
					iSubject:  $("#txt_subject").val(),		//제목
					iContent:  $("#txt_content").val(),		//내용
					iFile:     $("#txt_file3").val(),		//첨부파일(테이블)
					iCre_dt:   dateTime		//작성일자(테이블)
				}
				
				if(aTableData.iNo.length > 11){
					aTableData.iNo.replace("0","");
				}
				
			    if (aTableData.iSubject == "" || aTableData.iSubject == null) {
			        $("#oCheckMessage").html("제목을 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
				if (aTableData.iChg_id == "" || aTableData.iChg_id == null) {
			        $("#oCheckMessage").html("수신처를 지정하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.iContent == "" || aTableData.iContent == null) {
			        $("#oCheckMessage").html("내용을 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
		
				if(bUpdateStat){
			        // 자료 저장
			        aRowData.push({
						"No" : aTableData.iNo.replace("-",""),
						"Cre_id" : aTableData.iCre_id,
						"Cre_name" : aTableData.iCre_name,
			            "Chg_id"  : aTableData.iChg_id,
			            "Subject"   : aTableData.iSubject,
			            "Content"  : aTableData.iContent,
						"File"    : aTableData.iFile,
			    		"Cre_dt" : aTableData.iCre_dt
				});
				cfSetValue("txt_no", aTableData.iNo);

				const oData = {
		            ActGubun: "I",
		            JsonData: JSON.stringify(aRowData)
		    	}
		        cfAjaxSync("POST", "scm/cmu_plan_e", oData, "startInsert");
				fileUploadNotice();
				pgLoadData(1);
			}
		  } else {
			return false;
		  }
		})
	} else if (gvGubun == 'U'){
		Swal.fire({
		  title: "저장하시겠습니까?",
		  text: "",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#007aff',
		  cancelButtonColor: '#d33',
		  confirmButtonText: '확인',
		  cancelButtonText: '취소'
		}).then((result) => {
		  if (result.isConfirmed) {
//		    Swal.fire('Save!', 'Your file has been save.', 'success')
		    let aRowData = new Array();
			let bUpdateStat = true;
			let saveYear = cfGetToday().substr(0,4);
			
			let today = cfGetToday();
			let year = today.substr(0,4); 	
			let month = today.substr(4,2);  
			let date = today.substr(6,2);  	
				
			const tTime = new Date();
			let hours = ('0' + tTime.getHours()).slice(-2); 		
			let minutes = ('0' + tTime.getMinutes()).slice(-2);   
			let seconds = ('0' + tTime.getSeconds()).slice(-2);  
			
			let dateTime= year + month + date + hours + minutes + seconds;
			
			 const aTableData = {
					iNo    :   $("#txt_no").val(),			// NO
					iCre_id:   $("#txt_cre_idk").val(),		//작성자(CODE)
					iCre_name: cfGetLoginCvnas(),			//작성자(NAME)
					iChg_id:   $("#txt_chg_ids").val(),  	//수신처(CODE)
					iCvnas:    $("#txt_chg_name").val(),	//수신처(NAME)
					iSubject:  $("#txt_subject").val(),		//제목
					iContent:  $("#txt_content").val(),		//내용
					iFile:     $("#txt_file3").val(),		//첨부파일(테이블)
					iCre_dt:   dateTime		//작성일자(테이블)
				}
				
				if(aTableData.iNo.length > 11){
					aTableData.iNo.replace("0","");
				}
				
			    if (aTableData.iSubject == "" || aTableData.iSubject == null) {
			        $("#oCheckMessage").html("제목을 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
				if (aTableData.iChg_id == "" || aTableData.iChg_id == null) {
			        $("#oCheckMessage").html("수신처를 지정하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.iContent == "" || aTableData.iContent == null) {
			        $("#oCheckMessage").html("내용을 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
		
				if(bUpdateStat){
			        // 자료 저장
			        aRowData.push({
						"No" : aTableData.iNo.replace("-",""),
						"Cre_id" : aTableData.iCre_id,
						"Cre_name" : aTableData.iCre_name,
			            "Chg_id"  : aTableData.iChg_id,
			            "Subject"   : aTableData.iSubject,
			            "Content"  : aTableData.iContent,
						"File"    : aTableData.iFile,
			    		"Cre_dt" : aTableData.iCre_dt
				});
				cfSetValue("txt_no", aTableData.iNo);
			        
				let oData = {
		        	ActGubun: "U",
		        	JsonData: JSON.stringify(aRowData)
				}
				cfAjaxSync("POST", "scm/cmu_plan_e", oData, "startUpdate");
				fileUploadNotice();
				pgLoadData(1);
			}
		  } else {
			return false;
		  }
		})
	}
	
}
// 추가 버튼
function onAdd() {	
	
	var no = document.getElementById("txt_no");
	var creids = document.getElementById("txt_cre_ids");
	var creid = document.getElementById("txt_cre_idk");
	var chgid = document.getElementById("txt_chg_ids");
//	var chgname = document.getElementById("txt_chg_name");
	var subject = document.getElementById("txt_subject");
	var content = document.getElementById("txt_content");
	var file = document.getElementById("txt_file3");
	var credt = document.getElementById("txt_cre_dt");
	
	no.value = "";
	creids.value = cfGetLoginCvnas();
	creid.value = cfGetLoginCvcod();
	chgid.value = "TOTAL";
//	chgname.value = "전체";
	subject.value = "";
	content.value = "";
	file.value = "";
	credt.value = "";
	
	gvNo = "";
	
	// 관리자/사용자
	cfGetAuth();
	if(gvAuth == "0"){
		cfSetValue("txt_chg_ids", cfGetLoginId());
		cfSetValue("txt_chg_name", cfGetLoginCvnas());
		$("#btn_loginModal").prop('disabled', true);
	}
}

//삭제 버튼
function onDelete(e) { //onclik후 값을 넘겨서 처리

        const vPk = $("#txt_no").val();
        const fName = $("#txt_file3").val();
	
		if(vPk != null && vPk != ''){
			Swal.fire({
			  title: '선택하신 게시물을 삭제하시겠습니까?',
			  text: "",
			  icon: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#007aff',
			  cancelButtonColor: '#d33',
			  confirmButtonText: '확인',
			  cancelButtonText: '취소'
			}).then((result) => {
			  if (result.isConfirmed) {
//			    Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
		        const aRowData = new Array();
				
		        aRowData.push({
		            "KEY": vPk.replace("-","") //문자열의 시작 부분과 끝 부분사이에 있는 공백문자를 빈 문자열로 바꾸는 정규식
		        });
		
		        if (aRowData.size == 0) {
		            $("#oCheckMessage").html("삭제할 게시물을 선택하세요.");
		            $("#checkType").attr("class", "modal-content panel-success");
		            modalObj.modalOpenFunc('oCheckModal');
		            return false;
		        }
		
		        const oData = {
		            ActGubun: "D",
		            JsonData: JSON.stringify(aRowData)
		        }
				const fData = {
									ActGubun: "deleteFileUrlNotice",
						            uploadUrl: fName
						        }
			    cfAjaxSync("POST", "scm/fileURL_delete", fData, "deleteFileUrlNotice");
		
		        cfAjaxSync("POST", "scm/cmu_plan_e", oData, "cancelDelete");
				pgLoadData(1);
			  } else {
				return false;
			  }
			})
			} else {
	            $("#oCheckMessage").html("삭제할 게시물을 선택하세요.");
	            $("#checkType").attr("class", "modal-content panel-success");
	            modalObj.modalOpenFunc('oCheckModal');
	            return false;
			}
//			if (confirm("선택하신 게시물을 삭제하시겠습니까?") != true) {
//	            return false;
//	        }
	
}

// 취소버튼
function onCancel(e){
	
	var no = document.getElementById("txt_no");
	var creid = document.getElementById("txt_cre_ids");
	var subject = document.getElementById("txt_subject");
	var content = document.getElementById("txt_content");
	var file = document.getElementById("txt_file3");
	
	no.value = "";
	creid.value = "";
	subject.value = "";
	content.value = "";
	file.value = "";
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
        case "startInsert":
			location.reload();
            break;
        case "startUpdate":
			location.reload();
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
        case "txt_chgId":
            response = JSON.parse(response);
            let vListHTML = "";
            
            if (response.DATA.length == 0) {
                cfSetValue("txt_chg_ids","");
                cfSetValue("txt_chg_name","");
                cfGetMessage("scm/cmu_plan_e", "message" ,"110");
                return false;
            }
            
            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CHG_NAME;
            }
            cfSetValue("txt_chg_name",vListHTML);
            break;

		case "noSelect":
            response = JSON.parse(response);
		
            let vNo; // NO
            let vCre_id; // 작성자
            let vChg_id2; // 수신처 code
            let vCvnas2; // 수신처 name
            let vSubject; // 제목
            let vContent; // 내용
            let vChg_file; // 첨부파일
            let vCre_dt; // 시간

            if (response.DATA.length == 0) {
                cfSetValue("txt_no","");
                cfSetValue("txt_cre_ids","");
                cfSetValue("txt_chg_ids","");
                cfSetValue("txt_chg_name","");
                cfSetValue("txt_subject","");
                cfSetValue("txt_content","");
                cfSetValue("txt_file3","");
                cfSetValue("txt_cre_dt","");

                cfGetMessage("scm/cmu_plan_e", "message" ,"110");
                return false;
			}
			for(let i=0; i<response.DATA.length; i++) {
				let vItem = response.DATA[i];
	
	            vNo = vItem.NO;
	            vCre_id = vItem.CRE_ID;
	            vChg_id2 = vItem.CHG_ID;
	            vCvnas2 = vItem.CVNAS;
	            vSubject = vItem.SUBJECT;
	            vContent = vItem.CONTENT;
	            vChg_file = vItem.CHG_FILENAME;
	            vCre_dt = vItem.CRE_DT;

				vCre_dt = cfStringFormat(vCre_dt,"DT");
				vNo = cfStringFormat(vNo,"PN");
				
	            cfSetValue("txt_no", vNo);
	            cfSetValue("txt_cre_ids", vCre_id);
	            cfSetValue("txt_chg_ids", vChg_id2);
	            cfSetValue("txt_chg_name", vCvnas2);
	            cfSetValue("txt_subject", vSubject);
	            cfSetValue("txt_content", vContent);
	            cfSetValue("txt_file3", vChg_file);
	            cfSetValue("txt_cre_dt", vCre_dt);
			}
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
    
	const vCrdate = cfGetToday();
	let vMonth = cfGetValue('sel_date');
	let vSubjt = cfGetValue("txt_subjt");
	
	if(vMonth == 1){
		vMonth = cfMonthCalc(vCrdate, -1).replaceAll("-","");
	}
	else if(vMonth == 2){
		vMonth = cfMonthCalc(vCrdate, -2).replaceAll("-","");
	}
	else if(vMonth == 3){
		vMonth = cfMonthCalc(vCrdate, -3).replaceAll("-","");
	}
	else if(vMonth == 4){
		vMonth = cfMonthCalc(vCrdate, -4).replaceAll("-","");
	}
	else if(vMonth == 5){
		vMonth = cfMonthCalc(vCrdate, -5).replaceAll("-","");
	}
	else if(vMonth == 6){
		vMonth = cfMonthCalc(vCrdate, -6).replaceAll("-","");
	}
	else if(vMonth == 7){
		vMonth = cfMonthCalc(vCrdate, -7).replaceAll("-","");		
	}
	else if(vMonth == 8){
		vMonth = cfMonthCalc(vCrdate, -8).replaceAll("-","");		
	}
	else if(vMonth == 9){
		vMonth = cfMonthCalc(vCrdate, -9).replaceAll("-","");		
	}
	else if(vMonth == 10){
		vMonth = cfMonthCalc(vCrdate, -10).replaceAll("-","");	
	}
	else if(vMonth == 11){
		vMonth = cfMonthCalc(vCrdate, -11).replaceAll("-","");
	}
	else if(vMonth == 12){
		vMonth = cfMonthCalc(vCrdate, -12).replaceAll("-","");
	}
    vMonth = vMonth.substr(0,6) + "01";

    //값 체크
    const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Month: vMonth,
		Subjt: vSubjt
    }
    
    let oResponse = cfAjaxSync("POST", "scm/cmu_plan_e", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));
    const vTable = cfAjaxSync("GET","scm/cmu/cmu_plan_e.txt",null,"table"); //테이블 정보 읽어오기
    
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
				"ROWNUM1": aItem["ROWNUM1"],      		// 번호
				"SUBJECT": aItem["SUBJECT"],      		// 제목
				"CRE_ID": aItem["CRE_ID"],     			// 공지업체
				"CRE_DT": aItem["CRE_DT"],      		// 작성일
				"CHG_FILE": aItem["CHG_FILE"],      	// 파일
				"NO": aItem["NO"]	      				// 키값
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];

		// format
        for (let i = 0; i < vBody.rows.length; i++) {
			vBody.rows[i].cells[3].innerText = cfStringFormat(vBody.rows[i].cells[3].innerText,"D2");
        }
        
        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/cmu_plan_e", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
    }
}
//테이블 헤더 출력
//function pgLoadDataRs() {
//
//    const sData = {
//        ActGubun: "Rs"
//    }
//    oResponse = cfAjaxSync("POST", "scm/cmu_plan_e", sData, "startSelectS");
//    if (!oResponse) {
//        return false;
//    }
//    let vListHTML = "";
//    oResponse = JSON.parse(oResponse);
//    oResponse = JSON.parse(JSON.stringify(oResponse));
//    const sTable = cfAjaxSync("GET","scm/cmu/cmu_plan_e.txt",null,"table"); //테이블 정보 읽어오기
//    
//    let nPageNo = oResponse.PageNo;
//    let oResult = oResponse.DATA;
//    if (oResult.length > 0) {
//		// header
//        vListHTML = sTable.split("|")[0];
//        vListHTML += "</tr>";
//        $("#tbl_head").html(vListHTML); // 하단 테이블 헤드
//        vListHTML = "";
//		// body
//        let vTr = sTable.split("|");
//        let oEdit;
//        let vRow;
//
//        for (i = 0; i < oResult.length; i++) {
//            let aItem = oResult[i];
//            
//            vListHTML = vTr[1];
//            vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
//            vRow += vListHTML;
//            vListHTML += "</tr>";
//        }
//
//        $("#tbl_wrap").show();
//        
//        $("#tbl_body").html(vRow); // 테이블 몸체
//        
//    } else {
//        cfGetMessage("scm/cmu_plan_e", "message", "110");
//        cfClearData("tbl_wrap", "oPaginate");
//    }
//}
//팝업 처리
function pgAfterPopup(id, data) {
    switch(id) {
        case "oVndmstModal":
            cfSetValue("txt_chg_id",data[1]);
            cfSetValue("txt_cvnas",data[2]);
            break;
    }
}

function pgAfterPopup02(id, data) {
    switch(id) {
        case "oLoginModal":
            cfSetValue("txt_chg_id_s",data[1]);
            cfSetValue("txt_chg_name_s",data[2]);
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
        case "txt_chg_ids":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vChgid = vEventValue;
                if (vChgid != "") {
                    const oDatas = {
                        SearchGubun:"inputChgid",
                        Chgid:vChgid
                    };
                    cfAjaxAsync("GET","scm/cmu_plan_e",oDatas,"txt_chgId");                
                } else {
					cfSetValue("txt_chg_name",'');
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

////업체리스트 모달 선택값 설정 후 종료
//$(document).on('dblclick', '#tbl_tbody_vndmst_p tr ', function () { 
//    const aTableData = $(this).children("td").map(function() {
//        return $(this).text();
//    })      
//    $("#txt_chg_ids").val(aTableData[1]);
//    $("#txt_chg_name").val(aTableData[2]);
//    $('.btn-modal-close').click();
//});

//수신처 리스트 모달 선택값 설정 후 종료
$(document).on('dblclick', '#tbl_tbody_login_p tr ', function () { 
    const bTableData = $(this).children("td").map(function() {
        return $(this).text();
    })      
    $("#txt_chg_ids").val(bTableData[1]);
    $("#txt_chg_name").val(bTableData[2]);
    $('.btn-modal-close').click();
});

$(document).on('click', 'input:radio[name=gubun]', function (e) {
/*    $("#tbl_wrap > thead").empty(); //테이블 Clear           
    $("#tbl_wrap > tbody").empty(); //테이블 Clear                    
    $("#oPaginate").html("");  // 페이징 Clear;*/
    cfClearData("tbl_wrap", "oPaginate");
    //gvHeightChk = true;
});

//테이블의 행에서 클릭시 우측 상세정보로 뿌리기
$(document).on('click','.click', function() {
	let tr = $(this);
	let td = tr.children();
	
	let No = td.eq(5).text().replace(" ", "");
	oData = {
		ActGubun: "noSelect",
        No: No
    };
	
	gvNo = No;
	
	cfAjaxAsync("POST", "scm/cmu_plan_e", oData, "noSelect");
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
	
	cfAjaxSync("POST", "scm/cmu_plan_e", aData, "getAuth");
}