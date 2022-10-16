$(document).ready(function() {
	$(document).on("click", "#btn_search_favorite_p" ,function(){
		search_menu2();
    });
	$(document).on("dblclick", "#btn_search_favorite_p" ,function(){
		$("#tbl_tbody_favorite_p").empty();
		pgLoadFavData();
		cfSetValue("txt_search_favorite_p","");
    });
	pgLoadFavData();
	//동기방식
	function pgCallBackSyncFav(response, name, status) {
		let oData;
	    if (!status) {
//	        alert(response);
	        return false;
	    }
	    switch (name) {
	        case "startSelect":
	            break;
		}
	}
	//즐겨찾기 메뉴
	function pgLoadFavData() {
		
		const vUserid = cfGetLoginId();
//		alert(vUserid);
		
		const oData = {
			ActGubun: "R",
			Userid: vUserid
		}
		
		let oResponse = cfAjaxSync("POST", "comm_favorite_f", oData, "startSelect");
		
		if (!oResponse) {
        	return false;
    	}
		let vListHTML = "";
		oResponse = JSON.parse(oResponse);
		oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));
		
		let nTotalRecords = oResponse.TOTAL;
    	let nRowId = 1;

    for (let i = 0; i < oResponse.DATA.length; i++) {
        let aItem = oResponse.DATA[i];
        let vRows = "";

        vRows = "<tr>";
		vRows += "<td><input type='checkbox' id='savecheck' name='chk' style='width: 20px;'></td>";
		vRows += "<td class='center'>" + aItem.PLAG2 + "</td>";
		vRows += "<td class='center'>" + aItem.PLAG + "</td>";
        vRows += "<td class='center'>" + aItem.SUB2_NAME2 + "</td>";
        vRows += "<td class='center'>" + aItem.PAGE_URL.replace("/","") + "</td>";
        vRows += "<td class='hidden'>" + aItem.WINDOW_NAME + "</td>";
        vRows += "<td class='hidden'>" + aItem.SUB1_ID + "</td>";
        vRows += "</tr>";
        $("#tbl_tbody_favorite_p").append(vRows);
    }

 }
	//메뉴이름 검색
	function search_menu2() {
		
		const vname = "%"+cfGetValue("txt_search_favorite_p")+"%";
		const vUserid = cfGetLoginId();
		
//		alert(vname);
		
		const oDataA = {
			ActGubun: "S",
			Name: vname,
			Userid: vUserid
		}
		$("#tbl_tbody_favorite_p").empty();
		let oResponse = cfAjaxSync("POST", "comm_favorite_f", oDataA, "searchSelect");
		
		if (!oResponse) {
        	return false;
    	}
		let vListHTML = "";
		oResponse = JSON.parse(oResponse);
		oResponse = JSON.parse(JSON.stringify(oResponse));
		
		let nTotalRecords = oResponse.TOTAL;
    	let nRowId = 1;

		let oResult =  oResponse.DATA;
		
    for (let i = 0; i < oResult.length; i++) {
        let aItem = oResponse.DATA[i];
        let vRows = "";

		vRows = "<tr>";
		vRows += "<td><input type='checkbox' id='savecheck' name='chk' style='width: 20px;'></td>";
		vRows += "<td class='center'>" + aItem.SUB1_ID + "</td>";
		vRows += "<td class='center'>" + aItem.SUB2_NAME + "</td>";
        vRows += "<td class='center'>" + aItem.SUB2_NAME2 + "</td>";
        vRows += "<td class='center'>" + aItem.PAGE_URL.replace("/","") + "</td>";
        vRows += "<td class='hidden'>" + aItem.WINDOW_NAME + "</td>";
        vRows += "<td class='hidden'>" + aItem.SUB1_ID + "</td>";
        vRows += "</tr>";
        $("#tbl_tbody_favorite_p").append(vRows);
    }

}
	
})

//전체선택&해제
$(document).ready(function() {
	$("#totalchk").click(function() {
		if($("#totalchk").is(":checked")) $("input[name=chk]").prop("checked", true);
		else $("input[name=chk]").prop("checked", false);
	});
			
	$("input[name=chk]").click(function() {
		var total = $("input[name=chk]").length;
		var checked = $("input[name=chk]:checked").length;
				
		if(total != checked) $("#totalchk").prop("checked", false);
		else $("#totalchk").prop("checked", true); 
	});
});