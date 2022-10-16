$(document).ready(function(){
    $(document).on("click", "#btn_search_vndmst_p" ,function(){
        pgLoadVndmstData(1);
    });
    //업체리스트 가져오기
    function pgLoadVndmstData(pageno){
        const vSearchVal = cfGetValue("txt_search_vndmst_p");
        
        const vCheckGubun = cfGetValue("rbt_gubun_vndmst_p1");
        
        const oData = {
            "SearchGubun" : "vndmst",
            "Page" : pageno,
            "CheckGubun" : vCheckGubun,
            "SearchValue" : vSearchVal
        }
		$("#tbl_tbody_vndmst_p").empty();
        let oResponse = cfAjaxSync("GET","comm_vndmst_f", oData, "vndmstPopup");
        oResponse = JSON.parse(oResponse);
        oResponse = JSON.parse(JSON.stringify(oResponse).replace(/\:null/gi, "\:\"\""));
        let nTotalRecords = oResponse.TOTAL;
        let nRecordPerPage = oResponse.PAGEROW;
        let nPage = oResponse.PageNo;
        let nRowId = 1;
        
        for (let i = 0; i < oResponse.DATA.length; i++) {
            let aItem = oResponse.DATA[i];
            let vRows = "";
            let nPageNo = (Number(pageno) - 1) * nRecordPerPage + nRowId;
            nRowId++;
            vRows = "<tr>";
            vRows += "<td id='" + aItem.SEQ + "'>" + nPageNo + "</td>";
            vRows += "<td class='left' id='" + aItem.CVCOD + "'>" + aItem.CVCOD + "</td>";
            vRows += "<td class='left'>" + aItem.CVNAS + "</td>";
            vRows += "</tr>";
            $("#tbl_tbody_vndmst_p").append(vRows);
        }
        if (nTotalRecords > nRecordPerPage) {
            const oPageNav = cfDrawPageNavV(nTotalRecords, nRecordPerPage, nPage);
            $("#oPaginate_vndmst_p").html(oPageNav);
            $("#oPaginate_vndmst_p span a").each(function(i){
                //console.log($(this));
                $(this).addClass("page-vndmst-link");
                $(this).removeClass("page-vndmst-link");
            });
        };
    };
    //업체리스트 page click
    $(document).on("click",".page-linkV",function(event){
        const nPagenum =  $(this).attr("id");
        //console.log(nPagenum);
        //$("#msg").html(ytno+","+pagenum+","+blkcnt);
        pgLoadVndmstData(nPagenum);
    });
	//이전페이지 클릭
	$(document).on('click','.prevV', function(event){
		 const nPagenum =  $(this).attr("id");
	 pgLoadVndmstData(nPagenum);
	 	if(pageNo == 1){
			
		}
	});  
	
	//다음페이지 클릭
	$(document).on('click','.nextV', function(event){
		 const nPagenum =  $(this).attr("id");
	 	pgLoadVndmstData(nPagenum);
	});  
});