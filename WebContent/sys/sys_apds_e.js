//----------------------------------------------------------------
// Document : 자료실등록
// 작성자 : 염지광
// 작성일자 : 2021-09-08
//----------------------------------------------------------------

//전역 변수 설정
let gvOrgData = new Array();	//데이터 변경전의 원본데이터배열
let gPno = 0;
let gvGubun = "I";
let gvPno = "";
//페이지 오픈시 실행
function setCondition() { 
//----------------------------------------------------------------------------------------------------------------------------
// 1.초기화면 설정
//----------------------------------------------------------------------------------------------------------------------------
    cfBtnHide("insert","modify","print","excel","search","help","add");
	setInitValue();
	pgLoadData(1);
	pgLoadDataRs();
	pgLoadDataT();
	
//----------------------------------------------------------------
}
//----------------------------------------------------------------
// 초기값 설정
function setInitValue() {

	//관리자 
    const vUserid = cfGetLoginId();
   	const vUsername = cfGetLoginCvnas();
    cfSetValue("txt_userid", vUserid); 
    cfSetValue("txt_username", vUsername); 
	//거래처
	cfSetValue("txt_cvcod","TOTAL");   
    cfSetValue("txt_cvnas","전체");
	
	//작성자
    cfSetValue("txt_cre_id", vUserid); 
    cfSetValue("txt_cname", vUsername); 
	//수신처
	cfSetValue("txt_chg_id","TOTAL");   
    cfSetValue("txt_vname","전체");

	//작성일자
	let today = new Date();   

	let year = today.getFullYear(); 	
	let month = today.getMonth() + 1;  
	let date = today.getDate();  		
	
	let hours = ('0' + today.getHours()).slice(-2); 		
	let minutes = ('0' + today.getMinutes()).slice(-2);   
	let seconds = ('0' + today.getSeconds()).slice(-2);  
	
	cfSetValue("txt_cre_dt", year + '.' + month + '.' + date + ' ' + hours + ':' + minutes + ':' + seconds);
}
//----------------------------------------------------------------

//----------------------------------------------------------------
// 2.버튼 그룹 이벤트
//----------------------------------------------------------------
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
        alert(response);
        return false;
    }
    switch (name) {
        case "startSelectA":
            break;
    	case "startSelectS":
			break;
    	case "cancelDelete":
			break;
    	case "startSaveU":
			break;
		case "GetPno":
			const obj = JSON.parse(response);
			
			 if (obj.DATA.length == 0) {
	                cfGetMessage("sys_apds_e", "message" ,"50");
	                return false;
	            }
	
	            for(let i=0; i<obj.DATA.length;i++) {
	                let vItem = obj.DATA[i];
		            gPno = vItem.PNO.substr(0,4) + "-" + vItem.PNO.substr(4,6);
	            }
				cfSetValue("txt_pno", gPno);
			break;
	}
}
//비동기 방식
function pgCallBackAsync(response, name, status) {
	let vListHTML; 
	   
	if (!status) {
        alert(response);
        return false;
    }
    switch (name) {
		case "chgSelect":
			response = JSON.parse(response);
			
			let vCvcod;
            let vCvnas;

			 if (response.DATA.length == 0) {
                cfSetValue("txt_cvcod","");   
                cfSetValue("txt_cvnas","");   
                cfGetMessage("sys_apds_e", "message" ,"50");
                return false;
			}
				
			for(let i=0; i<response.DATA.length; i++) {
				let vItem = response.DATA[0];
	
	            vCvcod = vItem.CVCOD;
	            vCvnas = vItem.CHG_NAME;

	            cfSetValue("txt_cvcod", vCvcod);   
	            cfSetValue("txt_cvnas", vCvnas);  
	            cfSetValue("txt_chg_id", vCvcod);   
	            cfSetValue("txt_vname", vCvnas);  
			}
			break;	
		case "pnoSelectT":
			response = JSON.parse(response);
			
			let tPno;
            let tSUBJECT;
            let tCRE_ID;
            let tCNAME;
            let tCRE_DT;
            let tCHG_ID;
            let tVNAME;
			let tCHG_FILE;

			for(let i=0; i<response.DATA.length; i++) {
				let vItem = response.DATA[i];
	
	            tPno = vItem.PNO.substr(0,4) + "-" + vItem.PNO.substr(4,6);
	            tSUBJECT = vItem.SUBJECT;
	            tCRE_ID = vItem.CRE_ID;
	            tCNAME = cfGetLoginCvnas();
	            tCRE_DT = vItem.CRE_DT.substr(0,4) + "." + vItem.CRE_DT.substr(4,2) + "." + vItem.CRE_DT.substr(6,2) + " " + vItem.CRE_DT.substr(8,2) +  ":" + vItem.CRE_DT.substr(10,2) + ":" + vItem.CRE_DT.substr(12,2);
	            tCHG_ID = vItem.CHG_ID;
	            tVNAME = '전체';
	            tCHG_FILE = vItem.CHG_FILE;
				tCONTENT = vItem.CONTENT;

	            cfSetValue("txt_pno", tPno);   
                cfSetValue("txt_subject",tSUBJECT);   
                cfSetValue("txt_cre_id",tCRE_ID);   
                cfSetValue("txt_cname",tCNAME);   
                cfSetValue("txt_cre_dt",tCRE_DT);   
                cfSetValue("txt_chg_id",tCHG_ID);   
                cfSetValue("txt_vname", tVNAME);   
                cfSetValue("txt_file", tCHG_FILE);   
                cfSetValue("txt_content", tCONTENT);   
			}
			break;	
		case "pnoSelect":
			response = JSON.parse(response);
			
			let vPno;
            let vSUBJECT;
            let vCRE_ID;
            let vCNAME;
            let vCRE_DT;
            let vCHG_ID;
            let vVNAME;
			let vCHG_FILE;

			for(let i=0; i<response.DATA.length; i++) {
				let vItem = response.DATA[i];
	
	            vPno = vItem.PNO.substr(0,4) + "-" + vItem.PNO.substr(4,6);
	            vSUBJECT = vItem.SUBJECT;
	            vCRE_ID = vItem.CRE_ID;
	            vCNAME = cfGetLoginCvnas();
	            vCRE_DT = vItem.CRE_DT.substr(0,4) + "." + vItem.CRE_DT.substr(4,2) + "." + vItem.CRE_DT.substr(6,2) + " " + vItem.CRE_DT.substr(8,2) +  ":" + vItem.CRE_DT.substr(10,2) + ":" + vItem.CRE_DT.substr(12,2);
	            vCHG_ID = vItem.CHG_ID;
	            vVNAME = vItem.CHG_NAME;
	            vCHG_FILE = vItem.CHG_FILE;
				vCONTENT = vItem.CONTENT;

	            cfSetValue("txt_pno", vPno);   
                cfSetValue("txt_subject",vSUBJECT);   
                cfSetValue("txt_cre_id",vCRE_ID);   
                cfSetValue("txt_cname",vCNAME);   
                cfSetValue("txt_cre_dt",vCRE_DT);   
                cfSetValue("txt_chg_id",vCHG_ID);   
                cfSetValue("txt_vname", vVNAME);   
                cfSetValue("txt_file", vCHG_FILE);   
                cfSetValue("txt_content", vCONTENT);   
			}
			break;	
		case "txt_cvcod":
            response = JSON.parse(response);
            let vListHTML = "";
            
            if (response.DATA.length == 0) {
                cfSetValue("txt_cvcod","");
                cfSetValue("txt_cvnas","");
                cfGetMessage("sys_apds_e", "message" ,"50");
                return false;
            }
            
            for(let i=0; i<response.DATA.length;i++) {
                let vItem = response.DATA[i];
                vListHTML = vItem.CVNAS;
            }
            cfSetValue("txt_cvnas",vListHTML);
            break;
		case "deleteFile":
			 pgLoadDataA();
			 cfSetValue("txt_file", "");
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

	 const oDataA = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength
    } 
    
    let oResponse = cfAjaxSync("POST", "sys_apds_e", oDataA, "startSelectA");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse));	//.replace(/\:null/gi, "\:\"\"")
    const vTable = cfAjaxSync("GET","sys/sys_apds_e.txt",null,"table"); //테이블 정보 읽어오기
    
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
        
        for (let i = 0; i < oResult.length; i++) {
            let aItem = oResult[i];
            
			vListHTML = vTr[1];
            vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
            vRow += vListHTML;                
            vListHTML += "</tr>";
            //Table 원본 자료 저장
            gvOrgData.push({
                "CVCOD": aItem["CVCOD"],    				    //거래처
                "CHG_NAME": aItem["CHG_NAME"]    				//거래처명   [] : txt에 들어간거 => txt 들어간 값을 가져와서 ""으로 부르겠다
            });
        }
        $("#tbl_wrap").show();
        
        $("#tbl_body").html(vRow); //테이블 몸체
        
        let vBody = $("#tbl_wrap")[0].tBodies[0];

        //페이징
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPageNo);
        $("#oPaginate").html(oPageNav);
    } else {
        cfGetMessage("sys_apds_e", "message", "300");
        cfClearData("tbl_wrap", "oPaginate");
    }        
}
function pgLoadDataA(){
	// 테이블 생성
	const vCre_dt = cfGetValue("txt_cre_dt");
	const vChg_id = cfGetValue("txt_chg_id");
    const vUserid = cfGetValue("txt_userid");

	const oData = {
			ActGubun: "R3",
			Cre_dt: vCre_dt,
			Chg_id: vChg_id,
			Userid: vUserid
	    } 
		
	dResponse = cfAjaxSync("POST", "sys_apds_e", oData, "detailSelect");
	
    dResponse = JSON.parse(dResponse);
    dResponse = JSON.parse(JSON.stringify(dResponse));

	 const dTable = cfAjaxSync("GET","sys/sys_apds_e.txt",null,"table");

	let vListHTML = "";
	let dResult = dResponse.DATA;
		if (dResult.length > 0) {

		// header
	    vListHTML = dTable.split("|")[2];
	    vListHTML += "</tr>";
	    $("#tbl_head2").html(vListHTML); //테이블 헤드
	    vListHTML = "";
		// body
	    let vTr = dTable.split("|");
	    let oEdit;
	    let vRow;

	    for (i = 0; i < dResult.length; i++) {
	        let aItem = dResult[i];
	        vListHTML = vTr[3];
	        vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
	        vRow += vListHTML;
	        vListHTML += "</tr>";
			
			gvOrgData.push({
				"ROWNUM1": aItem["ROWNUM1"],
            	"PNO": aItem["PNO"],
            	"SUBJECT": aItem["SUBJECT"],
            	"CRE_ID": aItem["CRE_ID"],
            	"FILE": aItem["FILE"],
            	"CRE_DT": aItem["CRE_DT"],
            	"CONTENT": aItem["CONTENT"]
			});
	    }
	
	    $("#tbl_wrap2").show();
	    
	    $("#tbl_body2").html(vRow); // 테이블 몸체

		let vBody = $("#tbl_wrap2")[0].tBodies[0];
		// format
        for (let i = 0; i < vBody.rows.length; i++) {
              vBody.rows[i].cells[5].innerText = cfStringFormat(vBody.rows[i].cells[5].innerText,"DT");
            }
	
	}else {
		location.reload();
	} 
}

// 왼쪽 테이블 total 클릭
function pgLoadDataT(){

	const R2Data = {
		ActGubun: "R2"
    }

    dResponse = cfAjaxSync("POST", "sys_apds_e", R2Data, "totalSelect");
    dResponse = JSON.parse(dResponse);
    dResponse = JSON.parse(JSON.stringify(dResponse));

	const dTable = cfAjaxSync("GET","sys/sys_apds_e.txt",null,"table");

	let vListHTML = "";
	let dResult = dResponse.DATA;
		if (dResult.length > 0) {

		// header
	    vListHTML = dTable.split("|")[2];
	    vListHTML += "</tr>";
	    $("#tbl_head2").html(vListHTML); //테이블 헤드
	    vListHTML = "";
		// body
	    let vTr = dTable.split("|");
	    let oEdit;
	    let vRow;

	    for (i = 0; i < dResult.length; i++) {
	        let aItem = dResult[i];
	        vListHTML = vTr[3];
	        vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
	        vRow += vListHTML;
	        vListHTML += "</tr>";
			
			gvOrgData.push({
				"ROWNUM1": aItem["ROWNUM1"],
            	"PNO": aItem["PNO"],
            	"SUBJECT": aItem["SUBJECT"],
            	"CRE_ID": aItem["CRE_ID"],
            	"FILE": aItem["FILE"],
            	"CRE_DT": aItem["CRE_DT"],
            	"CONTENT": aItem["CONTENT"]
			});
	    }
	
	    $("#tbl_wrap2").show();
	    
	    $("#tbl_body2").html(vRow); // 테이블 몸체

		let vBody = $("#tbl_wrap2")[0].tBodies[0];
		// format
        for (let i = 0; i < vBody.rows.length; i++) {
              vBody.rows[i].cells[5].innerText = cfStringFormat(vBody.rows[i].cells[5].innerText,"DT");
            }
	
	}else {
//		location.reload();
	} 
}
//2번 테이블 헤더
function pgLoadDataRs() {

    const sData = {
        ActGubun: "Rs"
    }
    oResponse = cfAjaxSync("POST", "sys_apds_e", sData, "startSelectS");
    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
    oResponse = JSON.parse(oResponse);
    oResponse = JSON.parse(JSON.stringify(oResponse));
    const sTable = cfAjaxSync("GET","sys/sys_apds_e.txt",null,"table"); //테이블 정보 읽어오기
    
    let oResult = oResponse.DATA;
    if (oResult.length > 0) {
		// header
        vListHTML = sTable.split("|")[2];
        vListHTML += "</tr>";
        $("#tbl_head2").html(vListHTML); // 하단 테이블 헤드
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

        $("#tbl_wrap2").show();
        
        $("#tbl_body2").html(vRow); // 테이블 몸체
        
    } 
}
//페이지 클릭 시 데이터(페이징 클릭)
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

// 테이블의 행에서 클릭시 우측 상세정보로 뿌리기
$(document).on('click','.click', function() {
	let tr = $(this);
	let td = tr.children();
	let cvcod = td.eq(0).text().replace(" ", "");
	// 작성자
	if(cvcod != null) {
		const vUserid = cfGetLoginId();
    	cfSetValue("txt_cre_id", vUserid); 
    
		const vUsername = cfGetLoginCvnas();
    	cfSetValue("txt_cname", vUsername); 
	}
	
	// 작성일자
	let today = cfGetToday();
	let year = today.substr(0,4); 	
	let month = today.substr(4,2);  
	let date = today.substr(6,2);  	
		
	const tTime = new Date();
	let hours = ('0' + tTime.getHours()).slice(-2); 		
	let minutes = ('0' + tTime.getMinutes()).slice(-2);   
	let seconds = ('0' + tTime.getSeconds()).slice(-2);  
	
	cfSetValue("txt_cre_dt", year + '.' + month + '.' + date + ' ' + hours + ':' + minutes + ':' + seconds);
	
	// 번호
	cfSetValue("txt_pno", "");
	// 제목
	cfSetValue("txt_subject", "");
	// 수신처
	const vCre_dt = cfGetValue("txt_cre_dt");
	const vUserid = cfGetValue("txt_userid");
	
	if(cvcod == 'TOTAL') {
      cfSetValue("txt_chg_id","TOTAL");
      cfSetValue("txt_vname","전체");
      cfSetValue("txt_cvcod","TOTAL");
      cfSetValue("txt_cvnas","전체");
    
      if(cvcod == 'TOTAL') {
			cvcod = '%';
		}
		
	  const R2Data = {
			ActGubun: "R2"
//			Cre_dt: vCre_dt,
//			Chg_id: cvcod,  // 위에 선언 되있음
//			Userid: vUserid
	    } 

	  dResponse = cfAjaxSync("POST", "sys_apds_e", R2Data, "totalSelect");
		
	}else {  // 여기
		oData = {
			ActGubun: "chgSelect",
	        Cvcod: cvcod
	    };

		cfAjaxAsync("POST", "sys_apds_e", oData, "chgSelect");
		
		const R3Data = {
			ActGubun: "R3",
			Cre_dt: vCre_dt,
			Chg_id: cvcod,  // 위에 선언 되있음
			Userid: vUserid
	    } 
        dResponse = cfAjaxSync("POST", "sys_apds_e", R3Data, "detailSelect");
	}	
	    dResponse = JSON.parse(dResponse);
	    dResponse = JSON.parse(JSON.stringify(dResponse));
	
		const dTable = cfAjaxSync("GET","sys/sys_apds_e.txt",null,"table");
	
		let vListHTML = "";
		let dResult = dResponse.DATA;
			if (dResult.length > 0) {
	
			// header
		    vListHTML = dTable.split("|")[2];
		    vListHTML += "</tr>";
		    $("#tbl_head2").html(vListHTML); //테이블 헤드
		    vListHTML = "";
			// body
		    let vTr = dTable.split("|");
		    let oEdit;
		    let vRow;

		    for (i = 0; i < dResult.length; i++) {
		        let aItem = dResult[i];
		        vListHTML = vTr[3];
		        vListHTML = cfDrawTable(vListHTML, aItem, i, oEdit);
		        vRow += vListHTML;
		        vListHTML += "</tr>";
				
				gvOrgData.push({
					"NO": aItem["NO"],
	            	"PNO": aItem["PNO"],
	            	"SUBJECT": aItem["SUBJECT"],
	            	"CRE_ID": aItem["CRE_ID"],
	            	"FILE": aItem["CHG_FILE"],
	            	"CRE_DT": aItem["CRE_DT"],
	            	"CONTENT": aItem["CONTENT"]
				});
			}
		    $("#tbl_wrap2").show();
		    
		    $("#tbl_body2").html(vRow); // 테이블 몸체
		
		let vBody = $("#tbl_wrap2")[0].tBodies[0];
		// format
        for (let i = 0; i < vBody.rows.length; i++) {
              vBody.rows[i].cells[5].innerText = cfStringFormat(vBody.rows[i].cells[5].innerText,"DT");
            }
		
		} else {
			pgLoadDataRs();			
		}
		
		// 파일 업로드
		cfSetValue("txt_file", "");
		// 내용(메모)
		cfSetValue("txt_content", "");
});



// 2번테이블 행에서 클릭시 우측 상세정보로 뿌리기
$(document).on('click','.click2', function() {
	let tr = $(this);
	let td = tr.children();
	let pno = td.eq(1).text().replace(" ", "");
	const vUserid = cfGetLoginId();
	let chg_id = td.eq(7).text().replace(" ", "");

	const oData = {
			ActGubun: "pnoSelect",
	        Userid: vUserid,
			PNO: pno
	    };
	const tData = {
			ActGubun: "pnoSelectT",
	        Userid: vUserid,
			PNO: pno
	    };
	
   if(chg_id == "TOTAL") {
        cfAjaxAsync("POST", "sys_apds_e", tData, "pnoSelectT");
   } else {
		cfAjaxAsync("POST", "sys_apds_e", oData, "pnoSelect");
   }	
});


// 취소버튼
function onCancel(e){
	cfSetValue("txt_subject","");
	cfSetValue("txt_content","");
	cfSetValue("txt_pno","");
	cfSetValue("txt_file","");
}

// 저장 & 수정
function onSave(e) {

	gvPno = cfGetValue("txt_pno");
	
	if(gvPno == null || gvPno == ""){
		gvGubun = 'I';
	} else {
		gvGubun = 'M';
	}
	
	if(gvGubun == 'I'){
		Swal.fire({
        title: "자료를 등록하시겠습니까?",
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
		
		 const aTableData = {
				uPno: $("#txt_pno").val().replace("-",""),			//번호
				uSubject: $("#txt_subject").val(),  //제목(테이블)
				uCre_id: $("#txt_cre_id").val(),	//작성자(테이블)
				uCname: $("#txt_cname").val(),		//작성자
//				uCre_dt: $("#txt_cre_dt").val(),
				uCre_dt: $("#txt_cre_dt").val().replaceAll(".","").replaceAll(":","").replaceAll(" ",""),	//작성일자(테이블)
				uChg_id: $("#txt_chg_id").val(),	//수신처
				uVname: $("#txt_vname").val(),		//수신처
				uFile: $("#txt_file").val(),		//첨부파일(테이블)
				uContent: $("#txt_content").val(),		
				uUsername: $("#txt_userid").val(),		
			}
			
			if(aTableData.uPno.length > 11){
				aTableData.uPno.replace("0","");
			}
			
		    if (aTableData.uSubject == "" || aTableData.uSubject == null) {
		        $("#oCheckMessage").html("제목을 입력하지 않으셨습니다.");
		        $("#checkType").attr("class", "modal-content panel-success");
		        modalObj.modalOpenFunc('oCheckModal');
		        bUpdateStat = false;
		        return false;
		    }
	
			if(bUpdateStat){
		        // 자료 저장
		        aRowData.push({
		            "Pno" : aTableData.uPno,
					"Subject" : aTableData.uSubject,    
		            "Cre_id"  : aTableData.uCre_id,    
		            "Cname"   : aTableData.uCname,     
		            "Cre_dt"   : aTableData.uCre_dt,    
		            "Chg_id"  : aTableData.uChg_id,   	
		            "Vname"    : aTableData.uVname,      
		            "File"    : aTableData.uFile,      
		    		"Content" : aTableData.uContent,  
					"Username":  aTableData.uUsername  
					
			});
				const oData = {
		            ActGubun: "U", //저장
		            JsonData: JSON.stringify(aRowData)
		    	}
	
				const oDataA = {
		            ActGubun: "GetPno",
		    		"Subject" : aTableData.uSubject
				}
				cfAjaxSync("POST", "sys_apds_e", oData, "startSaveU");
				cfAjaxSync("POST", "sys_apds_e", oDataA, "GetPno");
				fileUploadApds();
				
			}
				pgLoadDataA();
      } else {
         return false;
      }
   })
	} else if (gvGubun == 'M'){
		Swal.fire({
			        title: "자료를 수정하시겠습니까?",
			        text: "",
			        icon: 'warning',
			        showCancelButton: true,
			        confirmButtonColor: '#007aff',
			        cancelButtonColor: '#d33',
			        confirmButtonText: '확인',
			        cancelButtonText: '취소'
     }).then((result) => {
		      if (result.isConfirmed) {
				 let aRowDataA = new Array();
				 let bUpdateStatA = true;
		
				 const aTableDataA = {
						uPno: $("#txt_pno").val().replace("-",""),			//번호
						uSubject: $("#txt_subject").val(),  //제목(테이블)
						uCre_id: $("#txt_cre_id").val(),	//작성자(테이블)
						uCname: $("#txt_cname").val(),		//작성자
						uCre_dt: $("#txt_cre_dt").val().replaceAll(".","").replaceAll(":","").replaceAll(" ",""),	//작성일자(테이블)
						uChg_id: $("#txt_chg_id").val(),	//수신처
						uVname: $("#txt_vname").val(),		//수신처
						uFile: $("#txt_file").val(),		//첨부파일(테이블)
						uContent: $("#txt_content").val(),		
						uUsername: $("#txt_userid").val(),		
					}
					
					if(aTableDataA.uPno.length > 11){
						aTableData.uPno.replace("0","");
					}
					
				    if (aTableDataA.uSubject == "" || aTableDataA.uSubject == null) {
				        $("#oCheckMessage").html("제목을 입력하지 않으셨습니다.");
				        $("#checkType").attr("class", "modal-content panel-success");
				        modalObj.modalOpenFunc('oCheckModal');
				        bUpdateStatA = false;
				        return false;
				    }
			
					if(bUpdateStatA){
				        // 자료 저장
				        aRowDataA.push({
				            "Pno" : aTableDataA.uPno,
							"Subject" : aTableDataA.uSubject,    
				            "Cre_id"  : aTableDataA.uCre_id,    
				            "Cname"   : aTableDataA.uCname,     
				            "Cre_dt"   : aTableDataA.uCre_dt,    
				            "Chg_id"  : aTableDataA.uChg_id,   	
				            "Vname"    : aTableDataA.uVname,      
				            "File"    : aTableDataA.uFile,      
				    		"Content" : aTableDataA.uContent,  
							"Username":  aTableDataA.uUsername  
							
					});
			
						const oDataA = {
				            ActGubun: "I", //수정
				            JsonData: JSON.stringify(aRowDataA)
				    	}
			
						cfAjaxSync("POST", "sys_apds_e", oDataA, "startUpdate");
						fileUploadApds();
					}
						pgLoadDataA();	
		      } else {
		         return false;
		      }
   		})
	}
}

// 추가 버튼
function onAdd() {	
	
	var subject = document.getElementById("txt_subject");
	var content = document.getElementById("txt_content");
	var pno = document.getElementById("txt_pno");
	
	subject.value = "";
	pno.value = "";
	content.value = "";
}
//삭제 버튼
function onDelete(e) { //onclik후 값을 넘겨서 처리 

		const vPk = $("#txt_pno").val();
		const fName = $("#txt_file").val();
		
		if(vPk == null || vPk == ''){
		    $("#oCheckMessage").html("삭제할 대상을 선택하지 않으셨습니다.");
	        $("#checkType").attr("class", "modal-content panel-success");
	        modalObj.modalOpenFunc('oCheckModal');
		}
		else {
				Swal.fire({
		        title: "삭제하시겠습니까?",
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
			
			        aRowData.push({
			            "KEY": vPk.replace("-", "") 
			        });
			
			        const oData = {
			            ActGubun: "D",
			            JsonData: JSON.stringify(aRowData)
			        }
					const fData = {
									ActGubun: "deleteFileUrlApds",
						            uploadUrl: fName
						        }

			        cfAjaxSync("POST", "sys_apds_e", oData, "cancelDelete");
			        cfAjaxSync("POST", "fileURL_delete", fData, "deleteFileUrlApds");
					cfSetValue("txt_pno", "");
					cfSetValue("txt_subject", "");
					pgLoadDataA();
		      } else {
		         return false;
		      }
		   });
	       
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
                cfAjaxAsync("GET","sys_apds_e",oData,"txt_cvcod");
                } else {
					cfSetValue("txt_cvnas","");
				}
            }
            break;
    }
});
$(document).on('click','.CHG_FILE', function(event) {
	
	let img = $(this);
	let td = img.parent();
	let tr = td.parent();
	let original_tr = tr.children();
	let pno = original_tr.eq(1).text();
	
	const oData = {
					ActGubun: "filePno",
					fPno: pno
	}
	const file = JSON.parse(cfAjaxSync("POST", "sys_apds_e", oData, "filePno"));
	
	if (file.DATA.length == 0) {
		cfGetMessage("sys_apds_e", "message", "50");
		return false;
	}

	for (let i = 0; i < file.DATA.length; i++) {
		let vItem = file.DATA[i];
		fName = vItem.CHG_FILE
	}
	
	Swal.fire({
		title: "다운로드 하시겠습니까?",
		text: "",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#007aff',
		cancelButtonColor: '#d33',
		confirmButtonText: '확인',
		cancelButtonText: '취소'
	}).then((result) => {
		if (result.isConfirmed) {
			if(fName.trim() == null || fName.trim() == '') {
				event.stoplmmediatePropagation();   // 이벤트막기
			} else {
				var sName = encodeURIComponent(fName);
				window.location.href = "../Upload/apds_download.jsp?file_name=" + sName;
			}
		} else {
			return false;
		}
	});
});









