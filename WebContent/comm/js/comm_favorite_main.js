let favgvChk = 0;
$(document).ready(function(){
	pgLoadFavData2();
}); //ready 닫기
	$(document).on("click", "#mainfavBtn" ,function(){
		search_menu();
    });
	$(document).on("dblclick", "#mainfavBtn" ,function(){
		cfSetValue("top_search","");
		$("#tbl_tbody_favorite_p2").empty();
		pgLoadFavData2();
//		location.reload();
    });
	//동기방식
	function pgCallBackSyncFav(response, name, status) {
		let oData;
	    if (!status) {
	        alert(response);
	        return false;
	    }
	    switch (name) {
	       case "startSelect":
	            break;
		   case "favCheck":
				response = JSON.parse(response);
            	vListHTML = "";

	            if (response.DATA.length == 0) {
	                cfGetMessage("comm_favorite", "message" ,"50");
	                return false;
	            }
	
	            for(let i=0; i<response.DATA.length;i++) {
	                let vItem = response.DATA[i];
	                vListHTML = vItem.COUNT;
	            }
	            favgvChk = vListHTML;
				break;
		}
	}
	function pgLoadFavData2() {
		
		const sUserid = cfGetLoginId();
		
		const oData = {
			ActGubun: "R",
			Userid: sUserid
		}
		
		let oResponse = cfAjaxSync("POST", "comm_favorite", oData, "startSelect");
		
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
        vRows += "<td class='favtd'><div class='img_left2'><img src='../../img/main/icon_arrow_dot.png'></div><span class='favsp'>" + aItem.SUB2_NAME + "</span><img src='../../img/common/icon_gnb_on.png' class='favimg'></td>";
        vRows += "<td class='hidden'>" + aItem.PAGE_URL + "</td>";
        vRows += "</tr>";
        $("#tbl_tbody_favorite_p2").append(vRows);
    }
 }

//링크이동
$(document).on('click', '#tbl_tbody_favorite_p2 td span', function () {
	// 클릭 => 페이지 이동
	let span = $(this);
	let td = span.parent();
	let tr = td.parent();
	let td2 = tr.children();
	let url = td2.eq(1).text();
	
	const link = "/" + url.replaceAll("aspx","jsp").replaceAll("nap","ord").replaceAll("qa","qlt").replaceAll("soje","soj");
	location.href = link;
//	alert(link);
});

//삭제
$(document).on('click', '#tbl_tbody_favorite_p2 td .favimg', function(){
	let img = $(this);
	let td = img.parent();
	let page_name = td.text();

	Swal.fire({
        title: "즐겨찾기 삭제하시겠습니까?",
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
		            "KEY": page_name
		        });
		
		  const oData = {
		      ActGubun: "D",
		      JsonData: JSON.stringify(aRowData)
		  }
		
		  cfAjaxSync("POST", "comm_favorite", oData, "delete");
		  location.reload();
      } else {
         return false;
      }
   })
	 
});

//모달창 오픈시 favorite.jsp화면 닫히기
$(document).on('click', '#btn_favoriteModal', function() {
	$('#open').click();
});
// 메뉴 이름 검색
function search_menu() {
		
		const vname = "%"+cfGetValue("top_search")+"%";
		
		const oDataA = {
			ActGubun: "S",
			Name: vname
		}
		$("#tbl_tbody_favorite_p2").empty();
		let oResponse = cfAjaxSync("POST", "comm_favorite", oDataA, "searchSelect");
		
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
        vRows += "<td class='favtd'><div class='img_left2'><img src='../../img/main/icon_arrow_dot.png'></div><span class='favsp'>" + aItem.SUB2_NAME + "</span><img src='../../img/common/icon_gnb_on.png' class='favimg'></td>";
        vRows += "<td class='hidden'>" + aItem.PAGE_URL + "</td>";
        vRows += "</tr>";
        $("#tbl_tbody_favorite_p2").append(vRows);
    }
}
//즐겨찾기 등록
$(document).on('click', '#favo', function() {

	Swal.fire({
        title: "즐겨찾기 등록 하시겠습니까?",
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007aff',
        cancelButtonColor: '#d33',
        confirmButtonText: '확인',
        cancelButtonText: '취소'
   }).then((result) => {
      if (result.isConfirmed) {
		var aRowData = new Array();
	let bUpdateStat = true;
	var checkbox = $("input[name=chk]:checked");
	checkbox.each(function(i) {
		
		var tr = checkbox.parent().parent().eq(i);
		var td = tr.children();
		
		var vName = td.eq(3).text();
		var vUrl = td.eq(4).text();
		var vWindowname = td.eq(5).text();
		var vSub1id = td.eq(6).text();
		const vUserid = cfGetLoginId();
		
		const aTableData = {
				uName: vName,
				uUrl: vUrl,
				uWindowname: vWindowname,
				uSub1id: vSub1id,
				uUserid: vUserid
		}
		if(bUpdateStat){
			// 즐겨찾기 클릭 => insert
			aRowData.push({
				            "Name"   : aTableData.uName,
							"Url"    : aTableData.uUrl,    
				            "Windowname" : aTableData.uWindowname,
				            "Sub1id" : aTableData.uSub1id,
				            "Userid" : aTableData.uUserid
			});
		}
	});
			const oData = {
			       			 ActGubun: "I",
			        		 JsonData: JSON.stringify(aRowData)
			 }
			 cfAjaxSync("POST", "comm_favorite", oData, "favInsert");
			 location.reload();
      } else {
         return false;
      }
   })
	
});