	$(document).ready(function(){
	cfGetHeadCombo("comm_itemas_f", "saupj", "sel_saupj_m"); //사업장
	cfGetHeadCombo("comm_itemas_f", "ittyp", "sel_ittyp_m"); //사업장
    
	$(document).on("click", "#btn_search_itemas_p" ,function(){
        pgLoadItemasData(1);
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
	
	// 품목 리스트
	function pgLoadItemasData(page) {
    const nPageLength = 20; //페이지당 데이터를 보여줄 행의 갯수    

	const vSaupj = cfGetValue("sel_saupj_m");		// 사업장
	const vIttyp = cfGetValue("sel_ittyp_m");		// 품목구분
	const vGubun = cfGetValue("rbt_gubun");			// 사용구분
	const vITCLS = cfGetValue("modal3-form01-03");  // 품목분류
	const vITNBR = cfGetValue("modal3-form02-01");	// 품번
	const vITDSC = cfGetValue("modal3-form02-02");	// 품명
	
	 const oData = {
		ActGubun: "R",
        Page: page,
        PageLength: nPageLength,
		Saupj: vSaupj,
		Ittyp: vIttyp,
		Gubun: vGubun,
		ITCLS: vITCLS,
		ITNBR: vITNBR,
		ITDSC: vITDSC
} 
    
	$("#tbl_tbody_itemas_p").empty();
    
    let oResponse = cfAjaxSync("POST", "comm_itemas_f", oData, "startSelect");

    if (!oResponse) {
        return false;
    }
    let vListHTML = "";
	oResponse = JSON.parse(oResponse);
    //{DATA : null} 같은 형태의 오브젝트에서 String형식으로 변경하고 null값을 공백값으로 치환한 후 다시 Object형식으로 변경
    oResponse = JSON.parse(JSON.stringify(oResponse));	//.replace(/\:null/gi, "\:\"\"")

	if (oResponse.RecordCount < 1){
		Swal.fire({
					title: '조회 및 출력할 자료가 없습니다.',
					icon: 'warning',
					confirmButtonColor: '#007aff',
					confirmButtonText: '확인'
				 });
	}

	const nTotalRecords = oResponse.RecordCount;
    const nRecordPerPage = oResponse.PageLength;    //페이지의 갯수
    let nPageNo = oResponse.PageNo;
	let nRowId = 1;

    for (let i = 0; i < oResponse.DATA.length; i++) {
        let aItem = oResponse.DATA[i];
        let vRows = "";
		
        vRows = "<tr>";
        vRows += "<td class='center'>" + aItem.ITNBR + "</td>";			//품번
        vRows += "<td class='center'>" + aItem.ITDSC + "</td>";			//품명
        vRows += "<td class='center'>" + aItem.USEYN + "</td>";			//사용유무(구분)
        vRows += "<td class='center'>" + aItem.FILSK + "</td>";			//재고관리
        vRows += "<td class='center'>" + aItem.TITNM + "</td>";			//품목분류명
        vRows += "<td class='center'>" + aItem.UNMSR + "</td>";         //단위
//        vRows += "<td class='center'>" + aItem.PUSE_YN + "</td>";
        vRows += "<td class='center'>" + aItem.ROUTNG_YN + "</td>";		//표준공정
        vRows += "</tr>";
        $("#tbl_tbody_itemas_p").append(vRows);
		
    }
	//페이징
	if (nTotalRecords > nRecordPerPage) {
            const oPageNav = cfDrawPageNavI(nTotalRecords, nRecordPerPage, nPageNo);
            $("#favoPaginate").html(oPageNav);
            $("#favoPaginate span a").each(function(i){
                $(this).addClass("page-itemas-link");
                $(this).removeClass("page-itemas-link");    
            });
        };
}
    
	//페이지 클릭 시 데이터 
	$(document).on("click", ".page-linkI", function (event) {
	    const pagenum = $(this).attr("id");
	    pgLoadItemasData(pagenum);
	});

	$(document).on('click', '#a', function() { 
        cfClosePopup();
    });

	//이전페이지 클릭
	$(document).on('click','.prevI', function(event){
		 const nPagenum =  $(this).attr("id");
	 pgLoadItemasData(nPagenum);
	 	if(pageNo == 1){
		}
	});  
	//다음페이지 클릭
	$(document).on('click','.nextI', function(event){
		 const nPagenum =  $(this).attr("id");
	 pgLoadItemasData(nPagenum);
	});  
});	