//----------------------------------------------------------------
//  Document : 프로그램 등록
//	작성자 : 김준형
//	작성일자 : 2021-10-12
//----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
//let gvHeightChk = true; //처음 조회시와 조회된 후 페이지만 넘길시에 디자인이 틀려져서 사용
let gvAdded = true;
let gvGubun = "I";
let gvMainId = "";
let gvSub1Id = "";
let gvSub2Id = "";

//페이지 오픈시 실행
function setCondition() { 
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("insert","modify","help","print","excel","add");
	pgLoadData();
//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
}
//----------------------------------------------------------------
// 초기값 설정
//----------------------------------------------------------------
//----------------------------------------------------------------
// 2.버튼 그룹 이벤트
//----------------------------------------------------------------
//조회 버튼 
function onSearch() {
    pgLoadData();
}
	
//저장 버튼
function onSave(e) {
	let mainId = $("#txt_main_id").val();
	let sub1Id = $("#txt_sub1_id").val();
	let sub2Id = $("#txt_sub2_id").val();
	
	if(gvMainId == mainId && gvSub1Id == sub1Id && gvSub2Id == sub2Id){
		gvGubun = 'U';
	} else {
		gvGubun = 'I';
	}
	
	if(gvGubun == 'I'){
		Swal.fire({
		 	title: "프로그램을 추가하시겠습니까?",
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
				let aTableData = new Array();
				
			    aTableData = {
					uMainId: $("#txt_main_id").val(),
					uSub1Id: $("#txt_sub1_id").val(),
					uSub2Id: $("#txt_sub2_id").val(),
					uSub2Name: $("#txt_sub2_name").val(),
					uWindowName: $("#txt_window_name").val(),
					uPageUrl: $("#txt_page_url").val(),
					uOldGubun: $("input[name='btn_radio_m']:checked").val(),
					uIoGubun: $("input[name='btn_radio_m2']:checked").val(),
					uRmks: $("#txt_rmks").val()
				}
				
			    if (aTableData.uMainId == "" || aTableData.uMainId == null) {
			        $("#oCheckMessage").html("대분류를 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.uSub1Id == "" || aTableData.uSub1Id == null) {
			        $("#oCheckMessage").html("중분류를 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.uSub2Id == "" || aTableData.uSub2Id == null) {
			        $("#oCheckMessage").html("소분류를 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.uSub2Name == "" || aTableData.uSub2Name == null) {
			        $("#oCheckMessage").html("Page 명을 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.uWindowName == "" || aTableData.uWindowName == null) {
			        $("#oCheckMessage").html("Page ID를 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			
				if(bUpdateStat){
			        // 자료 저장
			        aRowData.push({
			            "MainId"     	  : aTableData.uMainId,      //사용자ID
			            "Sub1Id"   		  : aTableData.uSub1Id,      //사용자명칭
			            "Sub2Id"      	  : aTableData.uSub2Id,      //거래처코드
			            "uSub2Name"       : aTableData.uSub2Name,    //거래처명
			            "uWindowName"     : aTableData.uWindowName,  //비밀번호
			            "uPageUrl"  	  : aTableData.uPageUrl,     //생성일자
			            "uOldGubun"    	  : aTableData.uOldGubun,    //담당자팩스
			            "uIoGubun"     	  : aTableData.uIoGubun,     //담당자핸드폰
			            "uRmks"    		  : aTableData.uRmks         //담당자전화
			        });
					let oData = {
			            ActGubun: "I",
			            JsonData: JSON.stringify(aRowData)
			    	}
			        cfAjaxSync("POST", "scm/sys_menupage_e", oData, "startInsert");
				}
			} else {
				return false;
			}
		});
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
				let aTableData = new Array();
				
			    aTableData = {
					uMainId: $("#txt_main_id").val(),
					uSub1Id: $("#txt_sub1_id").val(),
					uSub2Id: $("#txt_sub2_id").val(),
					uSub2Name: $("#txt_sub2_name").val(),
					uWindowName: $("#txt_window_name").val(),
					uPageUrl: $("#txt_page_url").val(),
					uOldGubun: $("input[name='btn_radio_m']:checked").val(),
					uIoGubun: $("input[name='btn_radio_m2']:checked").val(),
					uRmks: $("#txt_rmks").val()
				}
				
			    if (aTableData.uMainId == "" || aTableData.uMainId == null) {
			        $("#oCheckMessage").html("대분류를 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.uSub1Id == "" || aTableData.uSub1Id == null) {
			        $("#oCheckMessage").html("중분류를 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.uSub2Id == "" || aTableData.uSub2Id == null) {
			        $("#oCheckMessage").html("소분류를 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.uSub2Name == "" || aTableData.uSub2Name == null) {
			        $("#oCheckMessage").html("Page 명을 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			    if (aTableData.uWindowName == "" || aTableData.uWindowName == null) {
			        $("#oCheckMessage").html("Page ID를 입력하지 않으셨습니다.");
			        $("#checkType").attr("class", "modal-content panel-success");
			        modalObj.modalOpenFunc('oCheckModal');
			        bUpdateStat = false;
			        return false;
			    }
			
				if(bUpdateStat){
			        // 자료 저장
			        aRowData.push({
			            "MainId"     	  : aTableData.uMainId,      //사용자ID
			            "Sub1Id"   		  : aTableData.uSub1Id,      //사용자명칭
			            "Sub2Id"      	  : aTableData.uSub2Id,      //거래처코드
			            "uSub2Name"       : aTableData.uSub2Name,    //거래처명
			            "uWindowName"     : aTableData.uWindowName,  //비밀번호
			            "uPageUrl"  	  : aTableData.uPageUrl,     //생성일자
			            "uOldGubun"    	  : aTableData.uOldGubun,    //담당자팩스
			            "uIoGubun"     	  : aTableData.uIoGubun,     //담당자핸드폰
			            "uRmks"    		  : aTableData.uRmks         //담당자전화
			        });
					let oData = {
			            ActGubun: "U",
			            JsonData: JSON.stringify(aRowData)
			    	}
	        		cfAjaxSync("POST", "scm/sys_menupage_e", oData, "startUpdate");
				}
			} else {
				return false;
			}
		});
	}
}
	
//삭제 버튼
function onDelete(e) {
		Swal.fire({
			  title: "선택하신 프로그램을 삭제하시겠습니까?",
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
		        const vMainId = $("#txt_main_id").val();
		        const vSub1Id = $("#txt_sub1_id").val();
		        const vSub2Id = $("#txt_sub2_id").val();
		
		        aRowData.push({
		            "MainId": vMainId,
		            "Sub1Id": vSub1Id,
		            "Sub2Id": vSub2Id
		        });
		
		        if (aRowData.size == 0) {
		            $("#oCheckMessage").html("삭제할 프로그램을 선택하세요.");
		            $("#checkType").attr("class", "modal-content panel-success");
		            modalObj.modalOpenFunc('oCheckModal');
		            return false;
		        }
		
		        const oData = {
		            ActGubun: "D",
		            JsonData: JSON.stringify(aRowData)
		        }
		
		        cfAjaxSync("POST", "scm/sys_menupage_e", oData, "startDelete");
			} else {
				return false;
			}
		});

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

		case "startUpdate": 
		case "startInsert":
            oData = JSON.parse(response);
            if (status != true) {
                $("#oCheckMessage").html(oData.Message);
                $("#checkType").attr("class", "modal-content panel-success");
                modalObj.modalOpenFunc('oCheckModal');
            } else {
                $("#oCheckMessage").html('저장을 완료하였습니다.');
		        $("#checkType").attr("class", "modal-content panel-success");
		        modalObj.modalOpenFunc('oCheckModal');

				pgLoadData();
            }
            break;

         case "startDelete":
            oData = JSON.parse(response);
            if (status != true) {
                $("#oCheckMessage").html(oData.Message);
                $("#checkType").attr("class", "modal-content panel-success");
                modalObj.modalOpenFunc('oCheckModal');
            } else {
                $("#oCheckMessage").html('삭제를 완료하였습니다.');
		        $("#checkType").attr("class", "modal-content panel-success");
		        modalObj.modalOpenFunc('oCheckModal');
				
				pgLoadData();
            }
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
    	case "infoSelect":
            response = JSON.parse(response);
		
            let vMainId;
            let vSub1Id;
            let vSub2Id;
            let vSub2Name;
            let vWindowName;
            let vPageUrl;
            let vIoGubun;
            let vOldGubun;
            let vRmks;
            
            if (response.DATA.length == 0) {
                cfSetValue("txt_main_id","");   
                cfSetValue("txt_sub1_id","");   
                cfSetValue("txt_sub2_id","");   
                cfSetValue("txt_sub2_name","");   
                cfSetValue("txt_window_name","");   
                cfSetValue("txt_page_url","");   
                cfSetValue("txt_old_gubun","");   
                cfSetValue("txt_rmks","");   
                cfGetMessage("scm/sys_menupage_e", "message" ,"110");
                return false;
			}
			
			for(let i=0; i<response.DATA.length; i++) {
				let vItem = response.DATA[i];
	
	            vMainId = vItem.MAIN_ID;
	            vSub1Id = vItem.SUB1_ID;
	            vSub2Id = vItem.SUB2_ID;
	            vSub2Name = vItem.SUB2_NAME;
	            vWindowName = vItem.WINDOW_NAME;
	            vPageUrl = vItem.PAGE_URL;
	            vIoGubun = vItem.IO_GUBUN;
	            vOldGubun = vItem.OLD_GUBUN;
	            vRmks = vItem.RMKS;

				if(vOldGubun == 'E'){
					$("#rdo_io_gubun[value='E']").prop("checked",true);
				} else if (vOldGubun == 'R'){
					$("#rdo_io_gubun[value='R']").prop("checked",true);
				} else if (vOldGubun == 'Q'){
					$("#rdo_io_gubun[value='Q']").prop("checked",true);
				} else if (vOldGubun == 'A'){
					$("#rdo_io_gubun[value='A']").prop("checked",true);
				} else if (vOldGubun == 'T'){
					$("#rdo_io_gubun[value='T']").prop("checked",true);
				}
				
				if(vOldGubun == 'E'){
					$("#rdo_io_gubun2[value='E']").prop("checked",true);
				} else if (vOldGubun == 'R'){
					$("#rdo_io_gubun2[value='R']").prop("checked",true);
				} else if (vOldGubun == 'Q'){
					$("#rdo_io_gubun2[value='Q']").prop("checked",true);
				} else if (vOldGubun == 'A'){
					$("#rdo_io_gubun2[value='A']").prop("checked",true);
				} else if (vOldGubun == 'T'){
					$("#rdo_io_gubun2[value='T']").prop("checked",true);
				}
				
	            cfSetValue("txt_main_id", vMainId);   
	            cfSetValue("txt_sub1_id", vSub1Id);   
	            cfSetValue("txt_sub2_id", vSub2Id);   
	            cfSetValue("txt_sub2_name", vSub2Name);   
	            cfSetValue("txt_window_name", vWindowName);   
	            cfSetValue("txt_page_url", vPageUrl);   
	            cfSetValue("txt_old_gubun", vOldGubun);   
	            cfSetValue("txt_rmks", vRmks);   
			}            
            break;

		case "sub2IdCheck":
			break;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 데이터 조회 후 테이블 구성
//인자 : page, 선택된 현재 페이지
//반환 : JSONObject
//작성 : dykim
//---------------------------------------------------------------------------------------------------------------------------
function pgLoadData() {
    //값 체크
    const oData = {
		ActGubun: "R"
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/sys_menupage_e", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/sys/sys_menupage_e.txt",null,"table"); //테이블 정보 읽어오기
    
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
                "SORT1": aItem["SORT1"],    			 
                "SORT2": aItem["SORT2"],    			 
                "MAIN_ID": aItem["MAIN_ID"],  				
                "SUB1_ID": aItem["SUB1_ID"],  				
                "SUB2_ID": aItem["SUB2_ID"],  				
				"WINDOW_NAME": aItem["WINDOW_NAME"],    
				"IO_GUBUN": aItem["IO_GUBUN"],          
				"PAGE_URL": aItem["PAGE_URL"]
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
    } else {
        cfGetMessage("scm/sys_menupage_e", "message", "110");
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


//$(document).keydown(function (e) { 
//    const vEventId = e.target.id;
//    const vEventValue = e.target.value;
//    const vEventCode = e.which? e.which : e.keyCode;
//    switch(vEventId) {
//    }
//});

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
//$(document).on('click', 'input:radio[name=gubun]', function (e) {
///*    $("#tbl_wrap > thead").empty(); //테이블 Clear           
//    $("#tbl_wrap > tbody").empty(); //테이블 Clear                    
//    $("#oPaginate").html("");  // 페이징 Clear;*/
//    cfClearData("tbl_wrap", "oPaginate");
//    //gvHeightChk = true;
//});

// 5.사용자 정의 함수
//테이블의 행에서 클릭시 우측 상세정보로 뿌리기
$(document).on('click','.click', function() {
	let tr = $(this);
	let td = tr.children();
	
	let main_id = td.eq(5).text();
	let sub1_id = td.eq(6).text();
	let sub2_id = td.eq(7).text();
	
	gvMainId = main_id;
	gvSub1Id = sub1_id;
	gvSub2Id = sub2_id;
	
	let oData = {
		ActGubun: "infoSelect",
        Main_id: main_id,
        Sub1_id: sub1_id,
        Sub2_id: sub2_id
    };
	cfAjaxAsync("POST", "scm/sys_menupage_e", oData, "infoSelect");
	
});

// 소분류 ID 중복 유효성 검사
function sub2Check(main, id1, id2) {
	let oData = {
		SearchGubun: "sub2IdCheck",
		mainId: main,
		sub1Id: id1,
        sub2Id: id2
    };
	
	cfAjaxAsync("GET", "scm/sys_menupage_e", oData, "sub2IdCheck");
}