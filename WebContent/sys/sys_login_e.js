//----------------------------------------------------------------
// Document : 사용자등록
// 작성자 : 김준형
// 작성일자 : 2021-08-31
//----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gvPojang = "";
let gvTmpVal;
//let gvHeightChk = true; //처음 조회시와 조회된 후 페이지만 넘길시에 디자인이 틀려져서 사용
let gvAdded = true;
let gvGubun = "U";
let gvChk = 0;

//페이지 오픈시 실행
function setCondition() { 
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("insert","modify","help","print","excel");
	pgLoadData(1);
//----------------------------------------------------------------
// 콤보박스
//----------------------------------------------------------------
    //cfGetHeadCombo("sys_login_e", "gubun", "sel_gubun"); //사용자구분  
    cfGetHeadCombo("sys_login_e", "saupj", "sel_saupj"); //사업장
         
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
}

//저장 버튼
function onSave(e) {
	Swal.fire({
		  title: "사용자ID " + $("#txt_chg_id").val() + " 를 저장하시겠습니까?",
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
				
				chgIdCheck(1);
				if(gvChk == '0'){	 // 신규 사용자가 없으면 
				   gvGubun = 'U';
				} else {        	 // 신규 사용자가 있으면
				   gvGubun = 'I';
				}
					
				// 중복 아이디 있음 -> 기존 사용자
				if(gvGubun == 'U'){
				    let aTableData = {
						uChg_id: $("#txt_chg_id").val(),
						uChg_name: $("#txt_chg_name").val(),
						uCvcod: $("#txt_cvcod").val(),
						uCvnas: $("#txt_cvnas").val(),
						uChg_pw: $("#txt_chg_pw").val(),
						uChg_birth: $("#txt_chg_birth").val(),
						uChg_fax: $("#txt_chg_fax").val(),
						uChg_hp: $("#txt_chg_hp").val(),
						uChg_tel: $("#txt_chg_tel").val(),
						uChg_mail: $("#txt_chg_mail").val(),
						uAuth: $("input[id='chg_auth_s']:checked").val(),
						uGubun: $("#sel_gubun").val(),
						uSaupj: $("#sel_saupj").val(),
						uCopy_id: $("#txt_copy_id").val(),
						uChg_id2: $("#txt_chg_id2").val()
					}
				    if (aTableData.uCvcod == "" || aTableData.uCvcod == null) {
				        $("#oCheckMessage").html("거래처를 입력하지 않으셨습니다.");
				        $("#checkType").attr("class", "modal-content panel-success");
				        modalObj.modalOpenFunc('oCheckModal');
				        bUpdateStat = false;
				        return false;
				    }
				    if (aTableData.uChg_pw == "" || aTableData.uChg_pw == null) {
				        $("#oCheckMessage").html("비밀번호를 입력하지 않으셨습니다.");
				        $("#checkType").attr("class", "modal-content panel-success");
				        modalObj.modalOpenFunc('oCheckModal');
				        bUpdateStat = false;
				        return false;
				    }
				
					if(bUpdateStat){
				        // 자료 저장
				        aRowData.push({
				            "Chg_id"     : aTableData.uChg_id,      //사용자ID
				            "Chg_name"   : aTableData.uChg_name,    //사용자명칭
				            "Cvcod"      : aTableData.uCvcod,       //거래처코드
				            "Cvnas"      : aTableData.uCvnas,       //거래처명
				            "Chg_pw"     : aTableData.uChg_pw,      //비밀번호
				            "Chg_birth"  : aTableData.uChg_birth,   //생성일자
				            "Chg_fax"    : aTableData.uChg_fax,     //담당자팩스
				            "Chg_hp"     : aTableData.uChg_hp,      //담당자핸드폰
				            "Chg_tel"    : aTableData.uChg_tel,     //담당자전화
				            "Chg_mail"   : aTableData.uChg_mail,    //담당자메일
				            "Auth"       : aTableData.uAuth,        //시스템관리자여부
				            "Gubun"      : aTableData.uGubun,       //사용자구분
				            "Saupj"      : aTableData.uSaupj,       //사업장
							"Chg_id2"    : aTableData.uChg_id2      //사용자ID 키 값
				        });
				
				        const oData = {
				            ActGubun: "U",
				            JsonData: JSON.stringify(aRowData)
				    	}
				
				        cfAjaxSync("POST", "scm/sys_login_e", oData, "startSaveU");
					}
					gvAdded = true;
					
				// 중복 아이디 없음 -> 신규 추가된 사용자
				} else if (gvGubun == 'I'){
					let aTableData = {
						uChg_id: $("#txt_chg_id").val(),
						uChg_name: $("#txt_chg_name").val(),
						uCvcod: $("#txt_cvcod").val(),
						uCvnas: $("#txt_cvnas").val(),
						uChg_pw: $("#txt_chg_pw").val(),
						uChg_birth: $("#txt_chg_birth").val(),
						uChg_fax: $("#txt_chg_fax").val(),
						uChg_hp: $("#txt_chg_hp").val(),
						uChg_tel: $("#txt_chg_tel").val(),
						uChg_mail: $("#txt_chg_mail").val(),
						uAuth: $("input[id='chg_auth_s']:checked").val(),
						uGubun: $("#sel_gubun").val(),
						uSaupj: $("#sel_saupj").val(),
						uCopy_id: $("#txt_copy_id").val(),
						uChg_id2: $("#txt_chg_id2").val()
					}
					chgIdCheck(uChg_id);
					if (gvChk == '1'){
						$("#oCheckMessage").html("중복된 사용자 ID 입니다.");
				        $("#checkType").attr("class", "modal-content panel-success");
				        modalObj.modalOpenFunc('oCheckModal');
				        bUpdateStat = false;
				        return false;
					}
				    if (aTableData.uChg_id == "" || aTableData.uChg_id == null) {
				        $("#oCheckMessage").html("사용자ID를 입력하지 않으셨습니다.");
				        $("#checkType").attr("class", "modal-content panel-success");
				        modalObj.modalOpenFunc('oCheckModal');
				        bUpdateStat = false;
				        return false;
				    }
				    if (aTableData.uCvcod == "" || aTableData.uCvcod == null) {
				        $("#oCheckMessage").html("거래처를 입력하지 않으셨습니다.");
				        $("#checkType").attr("class", "modal-content panel-success");
				        modalObj.modalOpenFunc('oCheckModal');
				        bUpdateStat = false;
				        return false;
				    }
				    if (aTableData.uChg_pw == "" || aTableData.uChg_pw == null) {
				        $("#oCheckMessage").html("비밀번호를 입력하지 않으셨습니다.");
				        $("#checkType").attr("class", "modal-content panel-success");
				        modalObj.modalOpenFunc('oCheckModal');
				        bUpdateStat = false;
				        return false;
				    }
				
					if(bUpdateStat){
				        // 자료 저장
				        aRowData.push({
				            "Chg_id"     : aTableData.uChg_id,      //사용자ID
				            "Chg_name"   : aTableData.uChg_name,    //사용자명칭
				            "Cvcod"      : aTableData.uCvcod,       //거래처코드
				            "Cvnas"      : aTableData.uCvnas,       //거래처명
				            "Chg_pw"     : aTableData.uChg_pw,      //비밀번호
				            "Chg_birth"  : aTableData.uChg_birth,   //생성일자
				            "Chg_fax"    : aTableData.uChg_fax,     //담당자팩스
				            "Chg_hp"     : aTableData.uChg_hp,      //담당자핸드폰
				            "Chg_tel"    : aTableData.uChg_tel,     //담당자전화
				            "Chg_mail"   : aTableData.uChg_mail,    //담당자메일
				            "Auth"       : aTableData.uAuth,        //시스템관리자여부
				            "Gubun"      : aTableData.uGubun,       //사용자구분
				            "Saupj"      : aTableData.uSaupj,       //사업장
							"Chg_id2"    : aTableData.uChg_id2      //사용자ID 키 값
				        });
				
				        const oData = {
				            ActGubun: "U",
				            JsonData: JSON.stringify(aRowData)
				    	}
				
				        cfAjaxSync("POST", "scm/sys_login_e", oData, "startSaveU");
					}
					gvAdded = true;
				}
			} else {
				return false;
			}
		});
}
	
//삭제 버튼
function onDelete(e) {
	Swal.fire({
		  title: "선택하신 사용자를 삭제하시겠습니까?",
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
	        const vPk = $("#txt_chg_id").val();
	
	        aRowData.push({
	            "KEY": vPk.replace(/^\s+|\s+$/gm, '') //문자열의 시작 부분과 끝 부분사이에 있는 공백문자를 빈 문자열로 바꾸는 정규식
	        });
	
	        if (aRowData.size == 0) {
	            $("#oCheckMessage").html("삭제할 사용자를 선택하세요.");
	            $("#checkType").attr("class", "modal-content panel-success");
	            modalObj.modalOpenFunc('oCheckModal');
	            return false;
	        }
	
	        const oData = {
	            ActGubun: "D",
	            JsonData: JSON.stringify(aRowData)
	        }
	
	        cfAjaxSync("POST", "scm/sys_login_e", oData, "cancelDelete");
		} else {
            return false;
		}
	});
}

//추가 버튼
function onAdd() {
	chgIdCheck(1);
	if(gvChk == '0'){ 
		gvAdded = true;
	} else {
	    gvAdded = false;
	}
	
	if(gvChk == '0' || gvChk == null){
		if(gvAdded){
			Swal.fire({
			    title: "사용자를 추가하시겠습니까?",
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
					
				    const aTableData = {
						iChg_id: '1',
						iChg_name: '',
						iCvcod: '1',
						iCvnas: '',
						iChg_pw: '1',
						iChg_fax: '',
						iChg_hp: '',
						iChg_tel: '',
						iChg_mail: '',
						iAuth: '0',
						iGubun: '1',
						iSaupj: '10',
						iChg_id2: '1'
					}
				
			        // 자료 저장
			        aRowData.push({
			            "Chg_id"     : aTableData.iChg_id,      //사용자ID
			            "Chg_name"   : aTableData.iChg_name,    //사용자명칭
			            "Cvcod"      : aTableData.iCvcod,       //거래처코드
			            "Cvnas"      : aTableData.iCvnas,       //거래처명
			            "Chg_pw"     : aTableData.iChg_pw,      //비밀번호
			            "Chg_fax"    : aTableData.iChg_fax,     //담당자팩스
			            "Chg_hp"     : aTableData.iChg_hp,      //담당자핸드폰
			            "Chg_tel"    : aTableData.iChg_tel,     //담당자전화
			            "Chg_mail"   : aTableData.iChg_mail,    //담당자메일
			            "Auth"       : aTableData.iAuth,        //시스템관리자여부
			            "Gubun"      : aTableData.iGubun,       //사용자구분
			            "Saupj"      : aTableData.iSaupj,       //사업장
						"Chg_id2"    : aTableData.iChg_id2      //사용자ID 키 값
			        });
			
			        const oData = {
			            ActGubun: "I",
			            JsonData: JSON.stringify(aRowData)
			    	}
			
			        cfAjaxAsync("POST", "scm/sys_login_e", oData, "startInsert");
		
					chgIdCheck(1);
					gvAdded = false;
					
					location.reload();
				
					
				} else {
		            return false;
				}
			});
		} else {
			$("#oCheckMessage").html('연속으로 추가하실 수 없습니다.');
	        $("#checkType").attr("class", "modal-content panel-success");
	        modalObj.modalOpenFunc('oCheckModal');
	
			return;
		}
	} else {
		$("#oCheckMessage").html('이미 추가된 신규 사용자가 있습니다.');
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');

		return;
	}
}

// 취소 버튼
function onCancel() {
	$("#txt_chg_id_f").val('');
	$("#txt_chg_id").val('');
	$("#txt_chg_name").val('');
	$("#txt_cvcod").val('');
	$("#txt_cvnas").val('');
	$("#txt_chg_pw").val('');
	$("#txt_chg_birth").val('');
	$("#txt_chg_fax").val('');
	$("#txt_chg_hp").val('');
	$("#txt_chg_tel").val('');
	$("#txt_chg_mail").val('');
	$("#sel_gubun").val('');
	$("#sel_saupj").val('');
	$("#txt_copy_id").val('');
	
    pgLoadData(1);  //재조회
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

		case "startSaveU":
            oData = JSON.parse(response);
            if (status != true) {
                $("#oCheckMessage").html(oData.Message);
                $("#checkType").attr("class", "modal-content panel-success");
                modalObj.modalOpenFunc('oCheckModal');
            } else {
                $("#oCheckMessage").html('저장을 완료하였습니다.');
		        $("#checkType").attr("class", "modal-content panel-success");
		        modalObj.modalOpenFunc('oCheckModal');

				// 상세정보 초기화
				$("#txt_chg_id_f").val('');
				$("#txt_chg_id").val('');
				$("#txt_chg_name").val('');
				$("#txt_cvcod").val('');
				$("#txt_cvnas").val('');
				$("#txt_chg_pw").val('');
				$("#txt_chg_birth").val('');
				$("#txt_chg_fax").val('');
				$("#txt_chg_hp").val('');
				$("#txt_chg_tel").val('');
				$("#txt_chg_mail").val('');
				$("#sel_gubun").val('');
				$("#sel_saupj").val('');
				$("#txt_copy_id").val('');
				
                pgLoadData(1);  //재조회
            }
            break;

         case "cancelDelete":
            oData = JSON.parse(response);
            if (status != true) {
                $("#oCheckMessage").html(oData.Message);
                $("#checkType").attr("class", "modal-content panel-success");
                modalObj.modalOpenFunc('oCheckModal');
            } else {
                $("#oCheckMessage").html('삭제를 완료하였습니다.');
		        $("#checkType").attr("class", "modal-content panel-success");
		        modalObj.modalOpenFunc('oCheckModal');
				
				// 상세정보 초기화
				$("#txt_chg_id_f").val('');
				$("#txt_chg_id").val('');
				$("#txt_chg_name").val('');
				$("#txt_cvcod").val('');
				$("#txt_cvnas").val('');
				$("#txt_chg_pw").val('');
				$("#txt_chg_birth").val('');
				$("#txt_chg_fax").val('');
				$("#txt_chg_hp").val('');
				$("#txt_chg_tel").val('');
				$("#txt_chg_mail").val('');
				$("#sel_gubun").val('');
				$("#sel_saupj").val('');
				$("#txt_copy_id").val('');
					
				pgLoadData(1);  //재조회
            }
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
		case "txt_chg_id":
            response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {
                cfSetValue("txt_chg_id","");
                cfSetValue("txt_chg_name","");
                cfGetMessage("scm/sys_login_e", "message" ,"110");
                return false;
            }
            
            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CHG_NAME;
            }
            //$("#txt_cvnas").val(vListHTML);
            cfSetValue("txt_chg_name",vListHTML);
            break;

		case "txt_cvcod":
            response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {

                cfSetValue("txt_cvcod","");
                cfSetValue("txt_cvnas","");
                cfGetMessage("scm/sys_login_e", "message" ,"110");

                return false;
            }

            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CVNAS;
            }
            //$("#txt_cvnas").val(vListHTML);
            cfSetValue("txt_cvnas",vListHTML);
            break;

        case "txt_chg_id_f":
            response = JSON.parse(response);
            vListHTML = "";
            
            if (response.DATA.length == 0) {
                cfSetValue("txt_chg_id_f","");   
                cfSetValue("txt_chg_name_f","");   
                cfGetMessage("scm/sys_login_e", "message" ,"110");
                return false;
			}
            
            for(let i=0; i<response.DATA.length; i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CHG_NAME_F;
            }
            cfSetValue("txt_chg_name_f",vListHTML);

            break;

		case "chgSelect":
            response = JSON.parse(response);
		
            let vChg_id;
            let vChg_name;
            let vCvcod;
            let vCvnas;
            let vChg_pw;
            let vChg_birth;
            let vChg_fax;
            let vChg_hp;
            let vChg_tel;
            let vChg_mail;
			let vAuth;
			let vGubun;
			let vSaupj;
            let vCopy_id;
			let vChg_id2;
            
            if (response.DATA.length == 0) {
                cfSetValue("txt_chg_id","");   
                cfSetValue("txt_chg_name","");   
                cfSetValue("txt_cvcod","");   
                cfSetValue("txt_cvnas","");   
                cfSetValue("txt_chg_pw","");   
                cfSetValue("txt_chg_birth","");   
                cfSetValue("txt_chg_fax","");   
                cfSetValue("txt_chg_hp","");   
                cfSetValue("txt_chg_tel","");   
                cfSetValue("txt_chg_mail","");   
                cfSetValue("txt_copy_id","");
				cfSetValue("sel_saupj","10");   
				cfSetValue("chg_auth","0");   
                cfGetMessage("scm/sys_login_e", "message" ,"110");
                return false;
			}
			
			for(let i=0; i<response.DATA.length; i++) {
				let vItem = response.DATA[i];
	
	            vChg_id = vItem.CHG_ID;
	            vChg_name = vItem.CHG_NAME;
	            vCvcod = vItem.CVCOD;
	            vCvnas = vItem.CVNAS;
	            vChg_pw = vItem.CHG_PW;
	            vChg_birth = vItem.CHG_BIRTH;
	            vChg_fax = vItem.CHG_FAX;
	            vChg_hp = vItem.CHG_HP;
	            vChg_tel = vItem.CHG_TEL;
	            vChg_mail = vItem.CHG_MAIL;
				vAuth = vItem.AUTH;
				vGubun = vItem.GUBUN;
				vSaupj = vItem.SAUPJ;
	            vCopy_id = vItem.COPY_ID;
				vChg_id2 = vItem.CHG_ID2;
				
				if(vSaupj == null || vSaupj == ''){
					vSaupj = '10';
				}
				if(vGubun == null || vGubun == ''){
					vGubun = '0';
				}
				if(vAuth == null || vAuth == ''){
					vAuth = '0';
				}
				
				if(vGubun == '0') {
					$("#sel_gubun option:eq[0]").attr("selected",true);
				} else if(vGubun == '1'){
					$("#sel_gubun option:eq[1]").attr("selected",true);
				} else if(vGubun == '2'){
					$("#sel_gubun option:eq[2]").attr("selected",true);
				} else if(vGubun == '8'){
					$("#sel_gubun option:eq[3]").attr("selected",true);
				} else if(vGubun == '9'){
					$("#sel_gubun option:eq[4]").attr("selected",true);
				}
				
				if(vAuth == '0' || vAuth == 0){
					$("#chg_auth[value='0']").prop("checked",true);
//					$("input:radio[id='chg_auth']:radio[value='0']").prop("checked",true);
				} else if (vAuth == '1' || vAuth == 1){
					$("#chg_auth[value='1']").prop("checked",true);
//					$("input:radio[id='chg_auth']:radio[value='1']").prop("checked",true);
				}
				
				vChg_birth = cfStringFormat(vChg_birth,"D2");
				
	            cfSetValue("txt_chg_id", vChg_id);   
	            cfSetValue("txt_chg_name", vChg_name);   
	            cfSetValue("txt_cvcod", vCvcod);   
	            cfSetValue("txt_cvnas", vCvnas);   
	            cfSetValue("txt_chg_pw", vChg_pw);   
	            cfSetValue("txt_chg_birth", vChg_birth);   
	            cfSetValue("txt_chg_fax", vChg_fax);   
	            cfSetValue("txt_chg_hp", vChg_hp);   
	            cfSetValue("txt_chg_tel", vChg_tel);   
	            cfSetValue("txt_chg_mail", vChg_mail);
				cfSetValue("chg_auth_s", vAuth);   
				cfSetValue("sel_gubun", vGubun);
				cfSetValue("sel_saupj", vSaupj);   
	            cfSetValue("txt_copy_id", vCopy_id);
				cfSetValue("txt_chg_id2", vChg_id2);
				
				if($("#txt_chg_id").val() == '1'){
					$("#txt_chg_id").attr("readonly", false);
					$("#txt_chg_name").attr("readonly", false);
					gvAdded = false;
					gvGubun = 'I';
				} else if($("#txt_chg_id").val() != '1'){
					$("#txt_chg_id").attr("readonly", true);
					gvAdded = true;
					gvGubun = 'U';
				}
			}            
            break;
     
		case "startInsert":
			response = JSON.parse(response);
		
            let iChg_id;
            let iChg_name;
            let iCvcod;
            let iChg_pw;
            let iChg_fax;
            let iChg_hp;
            let iChg_tel;
            let iChg_mail;
			let iAuth;
			let iGubun;
			let iSaupj;
            
            if (response.DATA.length == 0) {
                cfSetValue("txt_chg_id","1");   
                cfSetValue("txt_chg_name","");   
                cfSetValue("txt_cvcod","1");   
                cfSetValue("txt_cvnas","");   
                cfSetValue("txt_chg_pw","1");   
                cfSetValue("txt_chg_birth","");   
                cfSetValue("txt_chg_fax","");   
                cfSetValue("txt_chg_hp","");   
                cfSetValue("txt_chg_tel","");   
                cfSetValue("txt_chg_mail","");   
                cfSetValue("txt_copy_id","");
				cfSetValue("sel_saupj","10");   
				cfSetValue("chg_auth","0");
                cfGetMessage("scm/sys_login_e", "message" ,"110");
                return false;
			}
			
			for(let i=0; i<response.DATA.length; i++) {
				let vItem = response.DATA[i];
	
	            iChg_id = vItem.CHG_ID;
	            iChg_name = vItem.CHG_NAME;
	            iCvcod = vItem.CVCOD;
	            iChg_pw = vItem.CHG_PW;
	            iChg_fax = vItem.CHG_FAX;
	            iChg_hp = vItem.CHG_HP;
	            iChg_tel = vItem.CHG_TEL;
	            iChg_mail = vItem.CHG_MAIL;
				iAuth = vItem.AUTH;
				iGubun = vItem.GUBUN;
				iSaupj = vItem.SAUPJ;

				if(iSaupj == null || iSaupj == ''){
					iSaupj = '10';
				}
				if(iGubun == null || iGubun == ''){
					iGubun = '0';
				}
				if(iAuth == null || iAuth == ''){
					iAuth = '0';
				}
				
	            cfSetValue("txt_chg_id", iChg_id);   
	            cfSetValue("txt_chg_name", iChg_name);   
	            cfSetValue("txt_cvcod", iCvcod);   
	            cfSetValue("txt_chg_pw", iChg_pw);   
	            cfSetValue("txt_chg_fax", iChg_fax);   
	            cfSetValue("txt_chg_hp", iChg_hp);   
	            cfSetValue("txt_chg_tel", iChg_tel);   
	            cfSetValue("txt_chg_mail", iChg_mail);
				cfSetValue("chg_auth", iAuth);   
				cfSetValue("sel_gubun", iGubun);
				cfSetValue("sel_saupj", iSaupj);   
			}         
            break;

		case "chgIdCheck":
			response = JSON.parse(response);
            vListHTML = "";

            if (response.DATA.length == 0) {
                cfGetMessage("scm/sys_login_e", "message" ,"110");
                return false;
            }

            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.COUNT;
            }
            gvChk = vListHTML;

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
    
    const vChg_id = cfGetValue("txt_chg_id_f");
    const vChg_name = cfGetValue("txt_chg_name_f");
    
    //값 체크
    const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
        Chg_id: vChg_id,
        Chg_name: vChg_name
    } 
    
    let oResponse = cfAjaxSync("POST", "scm/sys_login_e", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));	
    const vTable = cfAjaxSync("GET","scm/sys/sys_login_e.txt",null,"table"); //테이블 정보 읽어오기
    
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
				"CHG_ID": aItem["CHG_ID"],      			//사용자ID
                "CHG_NAME": aItem["CHG_NAME"],    			//사용자명칭
                "CVCOD": aItem["CVCOD"],    				//거래처
                "CVNAS": aItem["CVNAS"],    				//거래처명 
                "SAUPJ": aItem["SAUPJ"],  					//사업장
				"CHG_ID2": aItem["CHG_ID2"]                 //사용자ID 키 값
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];

        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("scm/sys_login_e", "message", "110");
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
                    cfAjaxAsync("GET","scm/sys_login_e",oData,"txt_cvcod");                    
                } else {
					cfSetValue("txt_cvnas","");
				}
            }
            break;

        case "txt_chg_id":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vChg_id = vEventValue;
                if (vChg_id != "") {
                    const oData = {
                        SearchGubun:"inputChg_id",
                        Chg_id:vChg_id
                    };
                    cfAjaxAsync("GET","scm/sys_login_e",oData,"txt_chg_id");                    
                } else {
					cfSetValue("txt_chg_name","");
				}
            }
            break;

        case "txt_chg_id_f":
            // 13 = Enter 키 , 9 = Tab
            if (vEventCode == 13 || vEventCode == 9) {
                let vChg_id_f = vEventValue;
                if (vChg_id_f != "") {
                    const oData = {
                        SearchGubun:"inputChg_id_f",
                        Chg_id_f:vChg_id_f
                    };
                    cfAjaxAsync("GET","scm/sys_login_e",oData,"txt_chg_id_f");                    
                } else {
					cfSetValue("txt_chg_name_f","");
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
//테이블의 행에서 클릭시 우측 상세정보로 뿌리기
$(document).on('click','.click', function() {
	let tr = $(this);
	let td = tr.children();
	
	let chg_id = td.eq(0).text().replace(" ", "");
	
	oData = {
		ActGubun: "chgSelect",
        Chg_id: chg_id
    };

	//console.log("클릭한 Row의 모든 데이터 : " + tr.text());
	cfAjaxAsync("POST", "scm/sys_login_e", oData, "chgSelect");
});

// 사용자 ID 중복 유효성 검사
function chgIdCheck(id) {
	let chg_id = id;
	
	oData = {
		SearchGubun: "chgIdCheck",
        Chg_id: chg_id
    };
	
	cfAjaxAsync("GET", "scm/sys_login_e", oData, "chgIdCheck");
}

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