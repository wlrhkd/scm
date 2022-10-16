//----------------------------------------------------------------
//  Document : 사용자 메뉴 등록
//	작성자 : 이지현
//	작성일자 : 2021-10-12
//----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
//let gvHeightChk = true; //처음 조회시와 조회된 후 페이지만 넘길시에 디자인이 틀려져서 사용
let gvAdded = true;
let gvGubun = "I";
let gvChk = 0;
let gvCnt = 0;
//중분류 소분류 유무 체크
let vChgId = '';

			
let mduCnt = 0;
let smlCnt = 0;
let subSml = '';
let dNum ='';
let dCnt= 1;

//페이지 오픈시 실행
function setCondition() { 
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("search","insert","modify","help","print","excel","add");

//	setInitValue();
	
	pgLoadData();
//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
//----------------------------------------------------------------
// 초기값 설정
//----------------------------------------------------------------
	cfSetValue("txt_chg_id", cfGetLoginId());
	cfSetValue("txt_chg_name", cfGetLoginCvnas());
	pgLoadDataC();
}
//----------------------------------------------------------------
// 2.버튼 그룹 이벤트
//----------------------------------------------------------------
//조회 버튼 
function onSearch() {
    pgLoadData();
}

//저장 버튼
function onSave(e) {
	
	let aRowData = new Array();
    let bUpdateStat = true;
	let mainId = '';
	let sub1Id = '';
	let sub2Id = '';
	let sub2Name = '';
	let mSub2Name = '';
	let windowName = '';
	
	let vChkBox1 = $("input[name=listChk]").is(":checked");
	let vChkBox2 = $("input[name=listChk02]").is(":checked");
	
	if(vChkBox1 == false || vChkBox2){
		Swal.fire({
			title:"좌측 메뉴를 선택해주세요.",
			icon: 'success',
			confirmButtonColor: '#007aff',
			confirmButtonText: '확인'
		});
		pgLoadData();
		return false;
	}
	
	//head를 초과한 객체들을 반복선택
    $("#tbl_wrap tr:gt(0)").each(function (row, tr) {
        //tr의 자식요소인 td들의 배열
        const aTableData = $(this).children("td").map(function () {
            return $(this).text();
        });
		
		let vChk = $("#cbx_listChk" + row).is(":checked");
		let chkCnt = 1;
		
		vChgId = cfGetValue("txt_chg_id");
		mainId = aTableData[6];
		sub1Id = aTableData[7];
		sub2Id = aTableData[8];
		sub2Name = aTableData[5];  //소분류 네임
		mSub2Name = aTableData[3]; // 중분류 네임
		windowName = aTableData[9];
		
		if(vChk){
			mediumCheck(vChgId, mainId, sub1Id);	
//			console.log("mduCnt = " + mduCnt);	
			if(mduCnt == 0){
//				console.log("중분류 추가 시작");
		        const iData = {
		            ActGubun: "InMdu",
					id : vChgId,
					mainId : mainId,
					sub1Id : sub1Id,
					sub2Name : mSub2Name
		        }
				cfAjaxSync("POST", "scm/sys_menuuser_e", iData, "InMdu");
//				console.log("중분류 추가 종료");	
			}
			//소분류 체크해서 있으면 다음 루프로 넘어가고 없으면 자료 저장해서 추가
			sub2Check(vChgId, mainId, sub1Id, sub2Id);
            if (gvCnt == 1) {  
                return true;
            } else {
	            //Table 자료 저장
	            aRowData.push({
	                "CHG_ID" : vChgId,       
	                "MAIN_ID" : mainId,   
	                "SUB1_ID" : sub1Id,    
	                "SUB2_ID" : sub2Id,   
	                "SUB2_NAME" : sub2Name,    
	                "WINDOW_NAME" : windowName
	            });
			}
        }
	});
	
	if (bUpdateStat) {
        const oData = {
            ActGubun: "I",
            JsonData: JSON.stringify(aRowData)
        }
        cfAjaxSync("POST", "scm/sys_menuuser_e", oData, "startSave");
    }
}
//삭제 버튼
function onDelete(e) {
    let vChk = $("input[name=listChk02]").is(":checked"); // boolean return = true or false
	let vChkbx = $("input[name=listChk02]:checked"); // check된 체크박스를 인식하는 것.
	dCnt= 1;
	
	if(vChk){
	    Swal.fire({
			  title: '선택하신 메뉴를 삭제하시겠습니까?',
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

				$(vChkbx).each(function(i) {
					const vTr = vChkbx.parent().parent().eq(i);
			        const vTd = vTr.children();

					vChgId = cfGetValue("txt_chg_id");
			        const vMainId = vTd.eq(6).text();
			        const vSub1Id = vTd.eq(7).text();
			        const vSub2Id = vTd.eq(8).text();
					
			        aRowData.push({
						"CHG_ID": vChgId,
			            "MAIN_ID": vMainId,
			            "SUB1_ID": vSub1Id,
			            "SUB2_ID": vSub2Id
			        });
					// 소분류 삭제 시 중분류 여부 확인 후 남아있으면 삭제
					smallCheck(vChgId, vMainId, vSub1Id);
					mediumCheck(vChgId, vMainId, vSub1Id);
					
//					console.log("smlCnt = " + smlCnt);
//					console.log("dCnt = " + dCnt);
//					console.log("mduCnt = " + mduCnt);
					
					if(smlCnt-dCnt == 0) {
						if(mduCnt == 0){
							return false;
						} else {
//							console.log("중분류 삭제 실행");
							const deData = {
			    	    		ActGubun: "MduDe",
				    	        CHG_ID  : vChgId,
				        	    MAIN_ID : vMainId,
				            	SUB1_ID : vSub1Id
			    			}
			    			cfAjaxSync("POST", "scm/sys_menuuser_e", deData, "MduDe");
//							console.log("중분류 삭제 종료");
						}
					}
					dCnt++;
				});
			
			    if (aRowData.size == 0) {
			        $("#oCheckMessage").html("삭제할 메뉴를 선택하세요.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        return false;
			    }
			
			    const oData = {
			        ActGubun: "D",
			        JsonData: JSON.stringify(aRowData)
			    }
			    cfAjaxSync("POST", "scm/sys_menuuser_e", oData, "startDelete");
				pgLoadData();
				
			} else {
				return false;
			}
			})
			} else {
				let vChkBox1 = $("input[name=listChk]").is(":checked");
				if(vChkBox1){
					Swal.fire({
					title:"사용자 메뉴에서 삭제할 메뉴를 선택하세요.",
					icon: 'warning',
					confirmButtonColor: '#007aff',
					confirmButtonText: '확인'
				});
				pgLoadDataC();
				return false;
				} else {
					Swal.fire({
					title:"삭제할 메뉴를 선택하세요.",
					icon: 'warning',
					confirmButtonColor: '#007aff',
					confirmButtonText: '확인'
				});
				pgLoadDataC();
				return false;
				}
			} 
			
}

// 취소 버튼
function onCancel() {
	location.reload();
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
            if (status != true) {
                $("#oCheckMessage").html(oData.Message);
                $("#checkType").attr("class", "modal-content panel-success");
                modalObj.modalOpenFunc('oCheckModal');
            } else {
				Swal.fire({
					title:"저장을 완료하였습니다.",
					icon: 'success',
					confirmButtonColor: '#007aff',
					confirmButtonText: '확인'
				});
				pgLoadDataC();
            }
            break;

         case "startDelete":
            oData = JSON.parse(response);
            if (status != true) {
                $("#oCheckMessage").html(oData.Message);
                $("#checkType").attr("class", "modal-content panel-success");
                modalObj.modalOpenFunc('oCheckModal');
            } else {
				Swal.fire({
					title:"삭제를 완료하였습니다.",
					icon: 'success',
					confirmButtonColor: '#007aff',
					confirmButtonText: '확인'
				});
				pgLoadDataC();
            }
            break;
    
		case "sub2IdCheck":
			response = JSON.parse(response);
            vListHTML = "";
            
            if (response.DATA.length == 0) {
                cfGetMessage("scm/sys_menuuser_e", "message" ,"110");
                return false;
            }
            
            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.COUNT;
            }
            gvCnt = vListHTML;
            break;

		case "mediumCheck": // 중분류 유무 체크
			response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {
                return false;
            }

            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.SUB_MDU;
            }
            mduCnt = vListHTML;

            break;
		case "smallCheck": // 소분류 유무 체크
			response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {
                return false;
            }

            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.SUB_SML;
				smlCnt = vItem.CNT_SML;
            }
			
//			console.log("callback subSml = " + subSml);
			if(subSml == null || subSml == ''){
				subSml = vListHTML; // 중분류 아이디값 
			} else {
				dNum = vListHTML;
				
//			console.log("callback dNum = " + dNum);
				if(dNum != subSml){
					dCnt = 1;
				}
		        subSml = dNum;
//			console.log("callback after dNum = " + dNum);
			}

            break;

        case "InMdu":
            break;

        case "MduDe":
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
    	case "infoSelect":
            break;

		case "txt_chgId":
            response = JSON.parse(response);
		    vListHTML = "";
            
            if (response.DATA.length == 0) {
                cfSetValue("txt_chg_id","");
                cfSetValue("txt_chg_name","");
                cfGetMessage("scm/sys_menuuser_e", "message" ,"110");
                return false;
            }
            
            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CHG_NAME;
            }
            cfSetValue("txt_chg_name",vListHTML);
            break;
    }

}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 데이터 조회 후 테이블 구성
//인자 : page, 선택된 현재 페이지
//반환 : JSONObject
//작성 : dykim
//---------------------------------------------------------------------------------------------------------------------------
// 메뉴 테이블
function pgLoadData() {
    //값 체크
    const oData = {
		ActGubun: "R"
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/sys_menuuser_e", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/sys/sys_menuuser_e.txt",null,"table"); //테이블 정보 읽어오기
    
    let oResult = oResponse.DATA;
    if (oResult.length > 0) {
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
				"TIT1": aItem["TIT1"],      			
                "SORT3": aItem["SORT3"],    			
                "TIT2": aItem["TIT2"],    				
                "SORT4": aItem["SORT4"],    			 
                "TIT3": aItem["TIT3"],  				
                "MAIN_ID": aItem["MAIN_ID"],  				
                "SUB1_ID": aItem["SUB1_ID"],  				
                "SUB2_ID": aItem["SUB2_ID"],  				
				"WINDOW_NAME": aItem["WINDOW_NAME"],    
				"IO_GUBUN": aItem["IO_GUBUN"],          
				"SUB2_NAME": aItem["SUB2_NAME"],          
				"PAGE_URL": aItem["PAGE_URL"]
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
    } else {
        cfGetMessage("scm/sys_menuuser_e", "message", "110");
        cfClearData("tbl_wrap", "oPaginate");
    }        
}

// 사용자 메뉴 테이블
function pgLoadDataC() {
   
	const vChg_id = cfGetValue("txt_chg_id");
	
	//값 체크
    if (vChg_id == "" || vChg_id == null) {
        cfGetMessage("sys_menuuser", "message", "250");
        return false;
    }

    const oData = {
		ActGubun: "C",
		Chg_id:vChg_id
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/sys_menuuser_e", oData, "infoSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/sys/sys_menuuser_e.txt",null,"table"); //테이블 정보 읽어오기
    
    let oResult = oResponse.DATA;
    if (oResult.length > 0) {
		// header 만들기 
        vListHTML = vTable.split("|")[2];            
        vListHTML += "</tr>";
        $("#tbl_head_02").html(vListHTML); //테이블 헤드
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
				"TIT1": aItem["TIT1"],      			
                "SORT3": aItem["SORT3"],    			
                "TIT2": aItem["TIT2"],    				
                "SORT4": aItem["SORT4"],    			 
                "TIT3": aItem["TIT3"],  				
                "MAIN_ID": aItem["MAIN_ID"],  				
                "SUB1_ID": aItem["SUB1_ID"],  				
                "SUB2_ID": aItem["SUB2_ID"],  				
				"WINDOW_NAME": aItem["WINDOW_NAME"],    
				"IO_GUBUN": aItem["IO_GUBUN"],          
				"SUB2_NAME": aItem["SUB2_NAME"],          
				"PAGE_URL": aItem["PAGE_URL"],
				"SUB2_NAME": aItem["SUB2_NAME"]
            });
        }
        $("#tbl_wrap_02").show();
        
        $("#tbl_body_02").html(vRow); //테이블 몸체
    } else {
        cfGetMessage("scm/sys_menuuser_e", "message", "110");
        cfClearData("tbl_wrap_02", "oPaginate");
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
        case "txt_chg_id":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
//				pgLoadDataC();
                let vChgid = vEventValue;
                if (vChgid != "") {
                    const oDatas = {
                        SearchGubun:"inputChgid",
                        Chgid:vChgid
                    };
                    cfAjaxAsync("GET","scm/sys_menuuser_e",oDatas,"txt_chgId");
                	pgLoadDataC();
                } else {
					cfGetMessage("scm/sys_menuuser_e", "message", "250");
					cfSetValue("txt_chg_name", '');
//				    $(vEventId).focus();
				}
            }
            break;
    }
});

$(document).keydown(function (e) { 
    const vEventId = e.target.id;
    const vEventValue = e.target.value;
    const vEventCode = e.which? e.which : e.keyCode;
    switch(vEventId) {
    }
});

//페이지 클릭 시 데이터 
//$(document).on("click", ".page-link", function (event) {
//    const pagenum = $(this).attr("id");
//    pgLoadData(pagenum);
//});

//테이블의 행에서 입력가능한 Column에 클릭시 테두리 생성
//$(document).on('click','.row_data',function(e) {
//    e.preventDefault();
//    //console.log(e.type);
//    vTmpVal = $(this).text();
//    $(this).closest('div').attr('contenteditable', 'true');
//   //add bg css
//    $(this).addClass('pd5');
//    $(this).focus();
//});

//테이블의 행에서 입력가능한 Column에서 입력후 포커스가 벗어날시
//$(document).on('blur', '.row_data', function(e) {
//    //console.log(e);
//    $(this).attr('contenteditable', false);
//    //$(this).css('background', '');
//    $(this).removeClass('pd5');
//    const vText = $(this).text();               
//    //const vTrid = $(this).parent().parent().attr("id"); //row id가져오기
//    //console.log($(this).parent().parent()[0].cells[9].innerText);
//    //this는 입력한 박스 object이다.
//    //this.parent()는 td이다.
//    //this.parent()는 tr이다.
//    const nBal = $(this).parent().parent()[0].cells[9].innerText;
//    //$(this).closest('tr')[0].cells[9].innerText; 위의 선택자와 같음
//    if(Number(vText) < 0 ){
//        $("#oCheckMessage").html("납입 수량은 0보다 작을 수 없습니다.");
//        $("#checkType").attr("class", "modal-content panel-success");
//        modalObj.modalOpenFunc('oCheckModal');  
//        $(this).text(0); //원값으로 복귀
//        return false;
//    }
//    if(Number(vText) > Number(nBal)){
//        $("#oCheckMessage").html("잔량보다 큽니다. 다시 입력하세요.");
//        $("#checkType").attr("class", "modal-content panel-success");
//        modalObj.modalOpenFunc('oCheckModal');
//        $(this).text(0);
//        return false;    
//    }
//});

//업체리스트 모달 선택값 설정 후 종료
$(document).on('dblclick', '#tbl_tbody_vndmst_p tr ', function () { 
    const aTableData = $(this).children("td").map(function() {
        return $(this).text();
    })      
    $("#txt_chg_id").val(aTableData[1]);
    $("#txt_chg_name").val(aTableData[2]);
    $('.btn-modal-close').click();
});
//$(document).on('click', 'input:radio[name=gubun]', function (e) {
///*    $("#tbl_wrap > thead").empty(); //테이블 Clear           
//    $("#tbl_wrap > tbody").empty(); //테이블 Clear                    
//    $("#oPaginate").html("");  // 페이징 Clear;*/
//    cfClearData("tbl_wrap", "oPaginate");
//    //gvHeightChk = true;
//});

// 5.사용자 정의 함수

//선택 컬럼 선택시 전체 선택/해제
$(document).on('click', '#cbx_checkAll', function(){
	if($('#cbx_checkAll').prop('checked')){
		$('.listChk').prop('checked',true);
	}else{
		$('.listChk').prop('checked',false);
	}
});

$(document).on('click', '#cbx_checkAll_02', function(){
	if($('#cbx_checkAll_02').prop('checked')){
		$('.listChk02').prop('checked',true);
	}else{
		$('.listChk02').prop('checked',false);
	}
});

//// 행 클릭 시 체크박스 체크    해결 안됨   다중 체크 안되며 한번 체크해제 된 행은 다시 체크 안됨
//$(document).on('click', '.click', function(){
//	//행 번호와 각 행 체크박스 아이디
//	
//	$(cChkId).prop("checked", true);
//	
//	if($(cChkId).is(":checked")){
//		$(document).on('click', '.click', function(){
//			$(cChkId).prop("checked", false);
//		});
//	}
//});
//
//$(document).on('click', '.click02', function(){
//	//행 번호와 각 행 체크박스 아이디
//	let cIdx = this.rowIndex - 1;
//	let cChkId = document.getElementById("cbx_listChk02" + cIdx);
//	
//	$(cChkId).prop("checked", true);
//});

// 테이블 체크 박스
$(document).on('click','.listChk', function(){
	let cIdx = this.rowIndex - 1;
	let cChkId = document.getElementById("cbx_listChk" + cIdx);
	let checkbox = $(this);
	let isChk = checkbox.is(":checked");
	
	if(isChk == true){  // 체크 되어 있을 때
		$(document).on('click', '.listChk', function(){
			$(cChkId).prop("checked", false);
		});
	} 
});

$(document).on('click','.listChk02', function(){
	let cIdx = this.rowIndex - 1;
	let cChkId = document.getElementById("cbx_listChk" + cIdx);
	let checkbox = $(this);
	let isChk = checkbox.is(":checked");
	
	if(isChk == true){  // 체크 되어 있을 때
		$(document).on('click', '.listChk02', function(){
			$(cChkId).prop("checked", false);
		});
	}
});

// 소분류 ID 중복 유효성 검사
function sub2Check(chgId, main, id1, id2) {
	let cChgId = chgId;
	let mainId = main;
	let sub1Id = id1;
	let sub2Id = id2;
	
	oData = {
		SearchGubun: "sub2IdCheck",
		chgId: cChgId,
		mainId: mainId,
		sub1Id: sub1Id,
        sub2Id: sub2Id
    };
	
	cfAjaxSync("GET", "scm/sys_menuuser_e", oData, "sub2IdCheck");
}

// 중분류 유무 체크
function mediumCheck(mcId, mcMain, mcSub1) {
	let mcChgId = mcId;
	let mcMainId = mcMain;
	let mcSub1Id = mcSub1;
	
	let mcData = {
		ActGubun: "mediumCheck",
		mcId: mcChgId,
		mcMain: mcMainId,
		mcSub1: mcSub1Id
    };
	
	cfAjaxSync("POST", "scm/sys_menuuser_e", mcData, "mediumCheck");
}

// 소분류 유무 체크
function smallCheck(scId, scMain, scSub1) {
	let scChgId = scId;
	let scMainId = scMain;
	let scSub1Id = scSub1;
	
	let scData = {
		ActGubun: "smallCheck",
		scId: scChgId,
		scMain: scMainId,
		scSub1: scSub1Id
    };
	
	cfAjaxSync("POST", "scm/sys_menuuser_e", scData, "smallCheck");
}