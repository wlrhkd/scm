//----------------------------------------------------------------
// Document : 자료실
// 작성자 : 이지현
// 작성일자 : 2021-09-29
//----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
//let gvHeightChk = true; //처음 조회시와 조회된 후 페이지만 넘길시에 디자인이 틀려져서 사용
let gvGubun = "I";
let gvPno = "";

let gvAuth;

//페이지 오픈시 실행
function setCondition() {
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("insert","modify","help");
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

	cfSetValue("txt_cvcod", vChgid);
    cfSetValue("txt_cvnas", vChgname);

	cfSetValue("txt_userid",vChgid);
	
	cfSetValue("txt_chg_id", vChgid);
    cfSetValue("txt_chg_name", vChgname);

	// 관리자/사용자
	cfGetAuth();
	if(gvAuth == "0"){
		cfSetValue("txt_chg_id_s", vChgid);
		cfSetValue("txt_chg_name_s", vChgname);
		$("#txt_chg_id_s").prop('readonly', true);
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
	if(gvPno == null || gvPno == ""){
		gvGubun = 'I';
	} else {
		gvGubun = 'U';
	}
	if(gvGubun == 'I'){
		Swal.fire({
		  title: "자료를 게시하시겠습니까?",
		  text: "",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#007aff',
		  cancelButtonColor: '#d33',
		  confirmButtonText: '확인',
		  cancelButtonText: '취소'
		}).then((result) => {
		  if (result.isConfirmed) {
			let aRowData = new Array();
			let bUpdateStat = true;
			
			let today = cfGetToday();
			let year = today.substr(0,4);
			let month = today.substr(4,2);
			let date = today.substr(6,2);
			
			const tTime = new Date();
			let hours = ('0' + tTime.getHours()).slice(-2);
			let minutes = ('0' + tTime.getMinutes()).slice(-2);
			let seconds = ('0' + tTime.getSeconds()).slice(-2);
			
			let vDatetime= year + month + date + hours + minutes + seconds;
			
			 const aTableData = {
					iPno    :  $("#txt_pno").val(),			// 번호
					iSubject:  $("#txt_subject").val(),		// 제목
					iChg_id:   $("#txt_chg_id").val(),		// 작성자(CODE)
					iChg_name: $("#txt_chg_name").val(),    // 작성자(NAME)
					iCre_dt:   vDatetime,					// 작성일자(테이블)
					iChg_ids:  $("#txt_chg_id_s").val(),  	// 수신처(CODE)
					iChg_names:$("#txt_chg_name_s").val(),	// 수신처(NAME)
					iFile:     $("#txt_file2").val(),		// 첨부파일(테이블)
					iContent:  $("#txt_content").val(),		// 내용
					iUsername: $("#txt_userid").val()		// ADMIN ID	
				}
				
				if(aTableData.iPno.length > 11){
					aTableData.iPno.replace("0","");
				}
				
			    if (aTableData.iSubject == "" || aTableData.iSubject == null) {
			        $("#oCheckMessage").html("제목을 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.iChg_ids == "" || aTableData.iChg_ids == null) {
			        $("#oCheckMessage").html("수신처를 지정하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
		
				if(bUpdateStat){
			        // 자료 저장
			        aRowData.push({ 
						"Pno" 	  : aTableData.iPno.replace("-",""),// 번호
						"Subject" : aTableData.iSubject,    		// 제목
			            "Cre_id"  : aTableData.iChg_id,    			// 작성자(CODE)
			            "Cre_name": aTableData.iChg_name,     		// 작성자(NAME)
			            "Cre_dt"  : aTableData.iCre_dt,    			// 작성일자(테이블)
			            "Chg_id"  : aTableData.iChg_ids,   			// 수신처(CODE)
			            "Chg_name": aTableData.iChg_names,      	// 수신처(NAME)
			            "File"    : aTableData.iFile,      			// 첨부파일(테이블)
			    		"Content" : aTableData.iContent,  			// 내용
						"Username":  aTableData.iUsername			// ADMIN ID
				});
					cfSetValue("txt_pno", aTableData.iPno);
					
					const oData = {
			            ActGubun: "I",
			            JsonData: JSON.stringify(aRowData)
			    	}
			        cfAjaxSync("POST", "scm/cmu_pds_e", oData, "startInsert");
					fileUploadPds();
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
			
			let aRowData = new Array();
			let bUpdateStat = true;
			
			let today = cfGetToday();
			let year = today.substr(0,4);
			let month = today.substr(4,2);
			let date = today.substr(6,2);
			
			const tTime = new Date();
			let hours = ('0' + tTime.getHours()).slice(-2);
			let minutes = ('0' + tTime.getMinutes()).slice(-2);
			let seconds = ('0' + tTime.getSeconds()).slice(-2);
			
			let vDatetime= year + month + date + hours + minutes + seconds;
			
			 const aTableData = {
					iPno    :  $("#txt_pno").val(),			// 번호
					iSubject:  $("#txt_subject").val(),		// 제목
					iChg_id:   $("#txt_chg_id").val(),		// 작성자(CODE)
					iChg_name: $("#txt_chg_name").val(),    // 작성자(NAME)
					iCre_dt:   vDatetime,					// 작성일자(테이블)
					iChg_ids:  $("#txt_chg_id_s").val(),  	// 수신처(CODE)
					iChg_names:$("#txt_chg_name_s").val(),	// 수신처(NAME)
					iFile:     $("#txt_file2").val(),		// 첨부파일(테이블)
					iContent:  $("#txt_content").val(),		// 내용
					iUsername: $("#txt_userid").val()		// ADMIN ID	
				}
				
				if(aTableData.iPno.length > 11){
					aTableData.iPno.replace("0","");
				}
				
			    if (aTableData.iSubject == "" || aTableData.iSubject == null) {
			        $("#oCheckMessage").html("제목을 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.iChg_ids == "" || aTableData.iChg_ids == null) {
			        $("#oCheckMessage").html("수신처를 지정하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
		
				if(bUpdateStat){
			        // 자료 저장
			        aRowData.push({ 
						"Pno" 	  : aTableData.iPno.replace("-",""),// 번호
						"Subject" : aTableData.iSubject,    		// 제목
			            "Cre_id"  : aTableData.iChg_id,    			// 작성자(CODE)
			            "Cre_name": aTableData.iChg_name,     		// 작성자(NAME)
			            "Cre_dt"  : aTableData.iCre_dt,    			// 작성일자(테이블)
			            "Chg_id"  : aTableData.iChg_ids,   			// 수신처(CODE)
			            "Chg_name": aTableData.iChg_names,      	// 수신처(NAME)
			            "File"    : aTableData.iFile,      			// 첨부파일(테이블)
			    		"Content" : aTableData.iContent,  			// 내용
						"Username":  aTableData.iUsername			// ADMIN ID
				});
				cfSetValue("txt_pno", aTableData.iPno);
					
				let oData = {
	            	ActGubun: "U",
	            	JsonData: JSON.stringify(aRowData)
			}
			cfAjaxSync("POST", "scm/cmu_pds_e", oData, "startUpdate");
			fileUploadPds();
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
	
	var pno = document.getElementById("txt_pno");
	var subject = document.getElementById("txt_subject");
	var chgid = document.getElementById("txt_chg_id");
	var chgname = document.getElementById("txt_chg_name");
	var credt = document.getElementById("txt_cre_dt");
	var chgids = document.getElementById("txt_chg_id_s");
	var chgnames = document.getElementById("txt_chg_name_s");
	var file = document.getElementById("txt_file2");
	var content = document.getElementById("txt_content");
	
	pno.value = "";
	subject.value = "";
	chgid.value = cfGetLoginId();
	chgname.value = cfGetLoginCvnas();
	credt.value = "";
	chgids.value = "";
	chgnames.value = "";
	file.value = "";
	content.value = "";
	gvPno = "";
	
	// 관리자/사용자
	cfGetAuth();
	if(gvAuth == "0"){
		cfSetValue("txt_chg_id_s", cfGetLoginId());
		cfSetValue("txt_chg_name_s", cfGetLoginCvnas());
		$("#btn_loginModal").prop('disabled', true);
	}
}

//삭제 버튼
function onDelete(e) { //onclik후 값을 넘겨서 처리 

        const vPk = $("#txt_pno").val();
        const fName = $("#txt_file2").val();

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
									ActGubun: "deleteFileUrlApds",
						            uploadUrl: fName
						        }
			    cfAjaxSync("POST", "scm/fileURL_delete", fData, "deleteFileUrlApds");
		
		        cfAjaxSync("POST", "scm/cmu_pds_e", oData, "cancelDelete");
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
}

// 취소버튼
function onCancel(e){
	
	var no = document.getElementById("txt_pno");
	var subject = document.getElementById("txt_subject");
	var chgid = document.getElementById("txt_chg_id");
	var chgname = document.getElementById("txt_chg_name");
	var credt = document.getElementById("txt_cre_dt");
	var chgids = document.getElementById("txt_chg_id_s");
	var chgnames = document.getElementById("txt_chg_name_s");
	var file = document.getElementById("txt_file2");
	var content = document.getElementById("txt_content");
	
	no.value = "";
	subject.value = "";
	chgid.value = "";
	chgname.value = "";
	credt.value = "";
	chgids.value = "";
	chgnames.value = "";
	file.value = "";
	content.value = "";
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

		case "txt_cvcod":
            response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {
                cfSetValue("txt_cvcod","");
                cfSetValue("txt_cvnas","");
                cfGetMessage("scm/cmu_pds_e", "message" ,"110");

                return false;
            }

            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CHG_NAME;
            }
            //$("#txt_cvnas").val(vListHTML);
            cfSetValue("txt_cvnas",vListHTML);
            break;

		case "txt_chgid":
            response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {
                cfSetValue("txt_chg_id_s","");
                cfSetValue("txt_chg_name_s","");
                cfGetMessage("scm/cmu_pds_e", "message" ,"110");

                return false;
            }

            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CHG_NAME;
            }
            //$("#txt_cvnas").val(vListHTML);
            cfSetValue("txt_chg_name_s",vListHTML);
            break;

		case "pnoSelect":
            response = JSON.parse(response);
		
            let vPno;
            let vSubject;
            let vChg_id;
            let vChg_name;
            let vCre_dt;
            let vChg_id_s;
            let vChg_name_s;
            let vChg_file;
            let vChg_con;

            if (response.DATA.length == 0) {
                cfSetValue("txt_pno","");
                cfSetValue("txt_subject","");
                cfSetValue("txt_chg_id","");
                cfSetValue("txt_chg_name","");
                cfSetValue("txt_cre_dt","");
                cfSetValue("txt_chg_id_s","");
                cfSetValue("txt_chg_name_s","");
                cfSetValue("txt_file2","");
                cfSetValue("txt_content","");
                cfGetMessage("scm/cmu_pds_e", "message" ,"110");
                return false;
			}
			for(let i=0; i<response.DATA.length; i++) {
				let vItem = response.DATA[i];
	
	            vPno = vItem.PNO;
	            vSubject = vItem.SUBJECT;
	            vChg_id = vItem.CRE_ID;
	            vChg_name = vItem.CNAME;
	            vCre_dt = vItem.CRE_DT;
	            vChg_id_s = vItem.CRE_ID;
				vChg_name_s = vItem.VNAME;
	            vChg_file = vItem.CHG_FILE;
	            vChg_con = vItem.CONTENT;
				
				vCre_dt = cfStringFormat(vCre_dt,"DT");
				vPno = cfStringFormat(vPno,"PN");
	            cfSetValue("txt_pno", vPno);
	            cfSetValue("txt_subject", vSubject);
	            cfSetValue("txt_chg_id", vChg_id);
	            cfSetValue("txt_chg_name", vChg_name);
	            cfSetValue("txt_cre_dt", vCre_dt);
                cfSetValue("txt_chg_id_s",vChg_id_s);
                cfSetValue("txt_chg_name_s",vChg_name_s);
	            cfSetValue("txt_file2", vChg_file);
	            cfSetValue("txt_content", vChg_con);

			}            
            break;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 데이터 조회 후 테이블 구성
//인자 : page, 선택된 현재 페이지
//반환 : JSONObject
//작성 : dykim
//수정 : jhlee
//---------------------------------------------------------------------------------------------------------------------------
function pgLoadData(page) {
    const nPageLength = 20; //페이지당 데이터를 보여줄 행의 갯수    
    
//  const vChg_id = cfGetValue("txt_chg_id_f");
//  const vChg_name = cfGetValue("txt_chg_name_f");

    let vChgid = cfGetValue("txt_cvcod");
	const vCrdate = cfGetToday();
	let vMonth = cfGetValue('sel_date');
	
	if(vMonth == 1){
		vMonth = cfMonthCalc(vCrdate, -1);
	}
	else if(vMonth == 2){
		vMonth = cfMonthCalc(vCrdate, -2);
	}
	else if(vMonth == 3){
		vMonth = cfMonthCalc(vCrdate, -3);
	}
	else if(vMonth == 4){
		vMonth = cfMonthCalc(vCrdate, -4);
	}
	else if(vMonth == 5){
		vMonth = cfMonthCalc(vCrdate, -5);
	}
	else if(vMonth == 6){
		vMonth = cfMonthCalc(vCrdate, -6);
	}
	else if(vMonth == 7){
		vMonth = cfMonthCalc(vCrdate, -7);		
	}
	else if(vMonth == 8){
		vMonth = cfMonthCalc(vCrdate, -8);		
	}
	else if(vMonth == 9){
		vMonth = cfMonthCalc(vCrdate, -9);		
	}
	else if(vMonth == 10){
		vMonth = cfMonthCalc(vCrdate, -10);	
	}
	else if(vMonth == 11){
		vMonth = cfMonthCalc(vCrdate, -11);
	}
	else if(vMonth == 12){
		vMonth = cfMonthCalc(vCrdate, -12);
	}
	vMonth = vMonth.substr(0,6) + "01";
    //값 체크
  	if (vChgid == "") {
        cfGetMessage("scm/cmu_pds_e", "message", "203");
        return false;
    }
    const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
		Month: vMonth,
        Chgid: vChgid
    }
    let oResponse = cfAjaxSync("POST", "scm/cmu_pds_e", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/cmu/cmu_pds_e.txt",null,"table"); //테이블 정보 읽어오기
    
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
                "ROWNUM1": aItem["ROWNUM1"],					//관리번호
                "SUBJECT2": aItem["SUBJECT2"],    			//제목
                "CHG_NAME": aItem["CHG_NAME"],    			//작성자
				"CHG_FILE" : aItem["CHG_FILE"],				//파일
                "CRE_DT": aItem["CRE_DT"],	  				//작성일
                "PNO": aItem["PNO"]							//키값
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        

        let vBody = $("#tbl_wrap")[0].tBodies[0];

		for (let i = 0; i < vBody.rows.length; i++) {
			vBody.rows[i].cells[4].innerText = cfStringFormat(vBody.rows[i].cells[4].innerText,"D2");
		}
        //페이징

        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/cmu_pds_e", "message", "110");
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
		//거래처
        case "txt_cvcod":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vCvcod = vEventValue;
                if (vCvcod != "") {
                    const oData = {
                        SearchGubun:"inputChgid",
                        Chgid:vCvcod
                    };
                    cfAjaxAsync("GET","scm/cmu_pds_e",oData,"txt_cvcod");               
                } else {
					cfSetValue("txt_cvnas","");
				}
            }
            break;
		//수신처
		case "txt_chg_id_s":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vChgid = vEventValue;
                if (vChgid != "") {
                    const tData = {
                        SearchGubun:"inputChgid",
                        Chgid:vChgid
                    };
                    cfAjaxAsync("GET","scm/cmu_pds_e",tData,"txt_chgid");               
                } else {
					cfSetValue("txt_chg_name_s","");
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
    $("#txt_chg_id").val(aTableData[1]);
    $("#txt_chg_name").val(aTableData[2]);
    $('.btn-modal-close').click();
});

//수신처 리스트 모달 선택값 설정 후 종료
$(document).on('dblclick', '#tbl_tbody_login_p tr ', function () { 
    const bTableData = $(this).children("td").map(function() {
        return $(this).text();
    })      
    $("#txt_chg_id_s").val(bTableData[1]);
    $("#txt_chg_name_s").val(bTableData[2]);
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
//테이블의 행에서 클릭시 우측 상세정보로 뿌리기
$(document).on('click','.click', function() {
	let tr = $(this);
	let td = tr.children();
	
	let vPno = td.eq(5).text().replace(" ", "");
	
	oData = {
		ActGubun: "pnoSelect",
        pno: vPno
    };
	
	gvPno = vPno;
	
	//console.log("클릭한 Row의 모든 데이터 : " + tr.text());
	cfAjaxAsync("POST", "scm/cmu_pds_e", oData, "pnoSelect");
});
// 사용자 ID 중복 유효성 검사
//function chgIdCheck(id) {
//	let chg_id = id;
//	
//	oData = {
//		SearchGubun: "chgIdCheck",
//        Chg_id: chg_id
//    };
//	
//	cfAjaxAsync("GET", "scm/cmu_pds_e", oData, "chgIdCheck");
//}

// 휴대폰, 전화, 팩스 데이터 포맷 ( 하이픈 자동 생성 ) 
$(document).on('keyup','#txt_chg_fax', function () {
  let val = this.value.trim();
  this.value = autoHypenTel(val);
});

$(document).on('keyup','#txt_chg_tel', function () {
  let val = this.value.trim();
  this.value = autoHypenTel(val);
});

$(document).on('keyup','#txt_chg_hp', function () {
  let val = this.value.trim();
  this.value = autoHypenTel(val);
});

// 자동 하이픈 (휴대폰, 전화, 팩스)
function autoHypenTel(str) {
  str = str.replace(/[^0-9]/g, '');
  var tmp = '';

  if (str.substring(0, 2) == 02) {
    // 서울 전화번호일 경우 10자리까지만 나타나고 그 이상의 자리수는 자동삭제
    if (str.length < 3) {
      return str;
    } else if (str.length < 6) {
      tmp += str.substr(0, 2);
      tmp += '-';
      tmp += str.substr(2);
      return tmp;
    } else if (str.length < 10) {
      tmp += str.substr(0, 2);
      tmp += '-';
      tmp += str.substr(2, 3);
      tmp += '-';
      tmp += str.substr(5);
      return tmp;
    } else {
      tmp += str.substr(0, 2);
      tmp += '-';
      tmp += str.substr(2, 4);
      tmp += '-';
      tmp += str.substr(6, 4);
      return tmp;
    }
  } else {
    // 핸드폰 및 다른 지역 전화번호 일 경우
    if (str.length < 4) {
      return str;
    } else if (str.length < 7) {
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3);
      return tmp;
    } else if (str.length < 11) {
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 3);
      tmp += '-';
      tmp += str.substr(6);
      return tmp;
    } else {
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 4);
      tmp += '-';
      tmp += str.substr(7);
      return tmp;
    }
  }

  return str;
}
// 시스템관리자 / 사용자 구분
function cfGetAuth() {
	let aData = {
		ActGubun : "getAuth",
		ID : cfGetLoginId()
	};
	
	cfAjaxSync("POST", "scm/cmu_pds_e", aData, "getAuth");
}