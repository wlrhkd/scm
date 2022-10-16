//----------------------------------------------------------------
// Document : 사용자 정보
// 작성자 : 염지광
// 작성일자 : 2021-09-13
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
    cfBtnHide("insert","modify","delete","add","help","excel","print","search");
    setInitValue();
	pgLoadData(1);
}

// 초기값 설정
function setInitValue() {

    const vCvcod = cfGetLoginCvcod();
    const vCvnas = cfGetLoginCvnas();
	
    cfSetValue("txt_cvcod", vCvcod); // vCvcod
    cfSetValue("txt_cvnas", vCvnas);
    

}

// 조회 클릭없이 화면에 나타나기
function onSearch() {
	pgLoadData(1);
}

//동기방식
function pgCallBackSync(response, name, status) {
    let oData;
    if (!status) {
        alert(response);
        return false;
    }
    switch (name) {
        case "startSelect":
            break;        
    }
}

function pgLoadData(page) {
    const nPageLength = 20; //페이지당 데이터를 보여줄 행의 갯수    

    const vCvcod = cfGetValue("txt_cvcod");
    const vCvnas = cfGetValue("txt_cvnas");
    
    //값 체크
    const oData = {
		ActGubun: "R",		// 구분
        Page: page,
        PageLength: nPageLength,
        Cvcod: vCvcod, 				// 조회 조건
        Cvnas: vCvnas 
    } 
    let oResponse = cfAjaxSync("POST", "cmu_vndmst_e", oData, "startSelect");

	oResponse = JSON.parse(oResponse);
	//oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));
	let oResult = oResponse.DATA;
	if (oResponse.RecordCount > 0){
		for (let i=0; i < oResult.length; i++){
			let aItem = oResult[i];
			
			cfSetValue("txt_cvcod2", aItem["CVCOD"]); 
			cfSetValue("txt_cvnas3", aItem["CVNAS"]);
			cfSetValue("txt_sano", aItem["SANO"].substr(0,3) + "-" + aItem["SANO"].substr(3,2) + "-" + aItem["SANO"].substr(5,5));
			cfSetValue("txt_telnum", aItem["TELNO1"]+ "-" + aItem["TELNO2"] + "-" + aItem["TELNO3"]);
			cfSetValue("txt_uptae", aItem["UPTAE"]);
			cfSetValue("txt_juso", aItem["ADDR1"]+aItem["ADDR2"]);
			cfSetValue("txt_jikyin", aItem["CVCOD"] + ".jpg");
			cfSetValue("txt_cvnas2", aItem["CVNAS2"]);
			cfSetValue("txt_ownam", aItem["OWNAM"]);
			cfSetValue("txt_faxnum", aItem["FAXNO1"] + "-" + aItem["FAXNO2"] + "-" + aItem["FAXNO3"]);
			cfSetValue("txt_upjong", aItem["JONGK"]);
			cfSetValue("txt_codenum", aItem["POSNO"]);
//			cfSetValue("txt_codenum", aItem["POSNO"].substr(0,3) + "-" + aItem["POSNO"].substr(3,3));
			
		}
	}

}

//사용자 정의(취소)
function onCancel(e){
	
	var p_pass = document.getElementById("pass_p_password");
	var n_pass = document.getElementById("pass_n_password");
	var c_pass = document.getElementById("pass_c_password");
	
	p_pass.value = "";
	n_pass.value = "";
	c_pass.value = "";
	
//	alert("취소하시겠습니까?");
}

// 비밀번호 변경 후 저장
function onSave(e) {
	
	const p_pass = $("#pass_p_password").val();
	const n_pass = $("#pass_n_password").val();
	const c_pass = $("#pass_c_password").val();
	const Chg_id = cfGetLoginId();   // 세션에 담긴 아이디 가져옴

	 const eData = {
            ActGubun: "C",
            chg_id: Chg_id
    }
    const present = cfAjaxSync("POST", "cmu_vndmst_e", eData, "checkPass");
	const obj = JSON.parse(present);
	if (obj.DATA.length == 0) {
	   cfGetMessage("cmu_vndmst_e", "message" ,"50");
	   return false;
	}
    for(let i=0; i<obj.DATA.length;i++) {
	   let vItem = obj.DATA[i];
	   pass = vItem.CHG_PW;
	}
    
    if(p_pass != pass)
    {	
		$("#oCheckMessage").html("현재 비밀번호가 일치하지 않습니다.");
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');  
		p_pass.focus();
		return;	
    }

	if (p_pass == "")
	{
		$("#oCheckMessage").html("현재 비밀번호가 입력되지 않았습니다.");
        $("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');  
		p_pass.focus();
		return;	
	}
	if (n_pass == "")
	{
		$("#oCheckMessage").html("신규 비밀번호가 입력되지 않았습니다");
        $("#checkType").attr("class", "modal-content panel-success");
		modalObj.modalOpenFunc('oCheckModal');
		n_pass.focus();
		return;
	}
	if (c_pass == "")
	{
		$("#oCheckMessage").html("확인 비밀번호가 입력되지 않았습니다.");
        $("#checkType").attr("class", "modal-content panel-success");
		modalObj.modalOpenFunc('oCheckModal');
		c_pass.focus();
		return;
	}
	if (n_pass != c_pass)
	{
		$("#oCheckMessage").html("변경할 비밀번호를 확인하십시오..");
        $("#checkType").attr("class", "modal-content panel-success");
		modalObj.modalOpenFunc('oCheckModal');
		n_pass.focus();
		return;
	}
	
	if (p_pass == n_pass)
	{
		$("#oCheckMessage").html("같은 비밀번호로는 변경할 수 없습니다.");
        $("#checkType").attr("class", "modal-content panel-success");
		modalObj.modalOpenFunc('oCheckModal');
		n_pass.focus();
		return;
	}
	
	let aRowData = new Array();
	let bUpdateStat = true;
	
	const pData = {
		vPass: n_pass,
		vChg_id: Chg_id
	}
	if(bUpdateStat){
        // 자료 저장 (jsondata로 담으려고)
        aRowData.push({
            "n_password"  : pData.vPass,     //새로운 비밀번호
            "Chg_id"      : pData.vChg_id         //세션 id
         
        });
		 const oData = {
            ActGubun: "U",
            JsonData: JSON.stringify(aRowData)
    	}

        cfAjaxSync("POST", "cmu_vndmst_e", oData, "startSaveU");
	}

	$("#oCheckMessage").html("비밀번호 변경이 완료되었습니다.");
    $("#checkType").attr("class", "modal-content panel-success");
	modalObj.modalOpenFunc('oCheckModal');
	onCancel();
}
















