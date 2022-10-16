//----------------------------------------------------------------
// Document : 발주번호 조회 팝업
// 작성자 : 염지광
// 작성일자 : 2021-10-15
//----------------------------------------------------------------
$(document).ready(function(){

	$(document).on("click", "#btn_search_balju_f" ,function(){
        pgLoadBaljuData(1);
    });
	
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
    //발주번호 리스트
    function  pgLoadBaljuData(page){
		
		const vBaljuno = cfGetValue("baljpno");
        const vBalseq = cfGetValue("balseq");
        const nPageLength = 20; //페이지당 데이터를 보여줄 행의 갯수    

	 const oData = {
		ActGubun: "balju",
        Page: page,
        PageLength: nPageLength,
		Baljuno: vBaljuno,
		Balseq: vBalseq
	} 
    
    let oResponse = cfAjaxSync("POST", "ord_balju_f", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse));	//.replace(/\:null/gi, "\:\"\"")

	let nTotalRecords = oResponse.TOTAL;
    let nRecordPerPage = oResponse.PAGEROW;
    let nPage = oResponse.PageNo;
    let nRowId = 1;
    
	if (oResponse.RecordCount > 0) {
    for (let i = 0; i < oResponse.DATA.length; i++) {
        let aItem = oResponse.DATA[i];
        let vRows = "";

        vRows = "<tr>";
        vRows += "<td class='center'>" + aItem.JPNO + "</td>";
        vRows += "<td class='center'>" + aItem.NAQTY + "</td>";
        vRows += "<td class='center'>" + aItem.NADATE + "</td>";
        vRows += "<td class='center'>" + aItem.RCQTY + "</td>";
        vRows += "<td class='center'>" + aItem.RDATE + "</td>";
        vRows += "<td class='center'>" + aItem.YIBHA + "</td>";
        vRows += "</tr>";
        $("#tbl_tbody_balju_p").append(vRows);
    }
    if (nTotalRecords > nRecordPerPage) {
        const oPageNav = cfDrawPageNav(nTotalRecords, nRecordPerPage, nPage);
        $("#oPaginate_balju_p").html(oPageNav);
        $("#oPaginate_balju_p span a").each(function(i){
            //console.log($(this));
            $(this).addClass("page-itemas-link");
            $(this).removeClass("page-link");    
        });
    }; 
	} else {
////		 cfGetMessage("ord_balju_f", "message", "300");
//		 $("#oCheckMessage").html("현재 비밀번호가 입력되지 않았습니다.");
//        $("#checkType").attr("class", "modal-content panel-success");
//        modalObj.modalOpenFunc('oCheckModal');  
	alert("조회 및 출력할 자료가 없습니다.");
//		return;	
	}
	};

});
    $(document).on('click', '#click_modal_close', function() { 
        cfClosePopup();
    });

