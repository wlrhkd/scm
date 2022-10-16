$(document).ready(function(){
    $(document).on("click", "#btn_search_login_p" ,function(){
        pgLoadLoginData(1);
    });
    //업체리스트 가져오기
    function pgLoadLoginData(pageno){
        const vSearchVal = cfGetValue("txt_search_login_p");
        
        const vCheckGubun = cfGetValue("rbt_gubun_login_p1");
        
        const oData = {
            "SearchGubun" : "login",
            "Page" : pageno,
            "CheckGubun" : vCheckGubun,
            "SearchValue" : vSearchVal
        }
		$("#tbl_tbody_login_p").empty();
        let oResponse = cfAjaxSync("GET","comm_login_f", oData, "loginPopup");
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
            vRows += "<td class='left' id='" + aItem.CHG_ID + "'>" + aItem.CHG_ID + "</td>";
            vRows += "<td class='left'>" + aItem.CHG_NAME + "</td>";
            vRows += "</tr>";
            $("#tbl_tbody_login_p").append(vRows);
        }
        if (nTotalRecords > nRecordPerPage) {
            const oPageNav = cfDrawPageNavC(nTotalRecords, nRecordPerPage, nPage);
            $("#oPaginate_login_p").html(oPageNav);
            $("#oPaginate_login_p span a").each(function(i){
                //console.log($(this));
                $(this).addClass("page-login-link");
                $(this).removeClass("page-login-link");    
            });
        };
    };
    
    //업체리스트 page click
    $(document).on("click",".page-linkC",function(event){
        //alert("클릭입니다");
        const nPagenum =  $(this).attr("id");
        //console.log(nPagenum);
        //$("#msg").html(ytno+","+pagenum+","+blkcnt);
        pgLoadLoginData(nPagenum);
    });
    //이전페이지 클릭
	$(document).on('click','.prevC', function(event){
		 const nPagenum =  $(this).attr("id");
	 pgLoadLoginData(nPagenum);
	 	if(pageNo == 1){
		}
	});  
	//다음페이지 클릭
	$(document).on('click','.nextC', function(event){
		 const nPagenum =  $(this).attr("id");
	 pgLoadLoginData(nPagenum);
	});
});