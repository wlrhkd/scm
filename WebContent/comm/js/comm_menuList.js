//----------------------------------------------------------------
// Document : 메뉴리스트
// 작성자 : 이지현
//  수정 : 
// 작성일자 : 2021.12.03
// 수정일자 : 
//----------------------------------------------------------------
let response;
$(document).ready(function() {
	cfGetmenulist();
});
//좌측 상단메뉴 버튼 클릭 시 계획관리 출력
$(document).on("click",".btn-menu",function(){
		const dData = {
			ActGubun: "getMenuDetail",
			DID : "10",
			CHG_ID : cfGetLoginId()
	};
	response = cfAjaxSync("POST", "comm_menuList", dData, "getMenuDetail");
	
	if (!response) {
    	return false;
	}
	
	let dListHTML;
	
	$("#sub2-id div").remove();
	
	response = JSON.parse(response);
	response = JSON.parse(JSON.stringify(response).replace(/\:null/gi, "\:\"\""));

	let dItem;
	
    dListHTML = "";
	
    dListHTML += "<div class='sm10 on' id='10'>";
    dListHTML += "<p class='sub-menu-tit'>" + $(".icon10").text() + "</p>";
    dListHTML += "<div class='scroll-wrap y-scroll'>";
    dListHTML += "	<ul class='depth02'>";

    for (let i = 0; i < response.DATA.length; i++) {
        dItem = response.DATA[i];
		dListHTML += "	<li id='"+ dItem.SUB2_ID +"'><a href='"+ dItem.PAGE_URL + "'><span>" + dItem.SUB2_NAME + "</span></a></li>"            
    }

    dListHTML += "	</ul>";
    dListHTML += "</div>";
    dListHTML += "</div>";
   
	$("#sub2-id").append(dListHTML);
});

//***************************************/
$(document).on("click","#depth1 li",function(){
	const dData = {
			ActGubun: "getMenuDetail",
			DID : this.id,
			CHG_ID : cfGetLoginId()
	};
	response = cfAjaxSync("POST", "comm_menuList", dData, "getMenuDetail");
	
	if (!response) {
    	return false;
	}
	
	let dListHTML;
	
	$("#sub2-id div").remove();
	
	response = JSON.parse(response);
	response = JSON.parse(JSON.stringify(response).replace(/\:null/gi, "\:\"\""));

	let dItem;
	
    dListHTML = "";
	
    dListHTML += "<div class='sm" + this.id + " on' id='" + this.id + "'>";
    dListHTML += "<p class='sub-menu-tit'>" + $(".icon" + this.id).text() + "</p>";
    dListHTML += "<div class='scroll-wrap y-scroll'>";
    dListHTML += "	<ul class='depth02'>";

    for (let i = 0; i < response.DATA.length; i++) {
        dItem = response.DATA[i];
		dListHTML += "	<li id='"+ dItem.SUB2_ID +"'><a href='"+ dItem.PAGE_URL + "'><span>" + dItem.SUB2_NAME + "</span></a></li>"            
    }

    dListHTML += "	</ul>";
    dListHTML += "</div>";
    dListHTML += "</div>";
   
	$("#sub2-id").append(dListHTML);
});

function cfGetmenulist(){
	const mData = {
			ActGubun: "getMenuList",
			MID : cfGetLoginId()
	};
	cfAjaxSync("POST", "comm_menuList", mData, "getMenuList");
}
//동기방식
	function pgCallBackSyncMenu(response, name, status) {
	    if (!status) {
	        return false;
	    }
	    switch (name) {
	        case "getMenuList": // 중분류
				if (!response) {
		        	return false;
		    	}
				let mListHTML = "";
				response = JSON.parse(response);
				response = JSON.parse(JSON.stringify(response).replace(/\:null/gi, "\:\"\""));
			
				let mItem;
				let j = 0;
				
			    mListHTML = "";
			    mListHTML += "<ul id='depth1' class='depth01 y-scroll'>";
			    for (let i = 0; i < response.DATA.length; i++) {
			        mItem = response.DATA[i];
					j++;
			        mListHTML += "	<li id='"+ mItem.SUB1_ID +"' value='"+ mItem.SUB1_ID +"'><a href='#!'><span class='icon" + mItem.SUB1_ID +"'>" + mItem.SUB2_NAME + "</span></a></li> ";                 
//					alert(mItem.SUB1_ID);
			    }
			    mListHTML += "</ul>";
			    $("#sub1-id").append(mListHTML);
    	    	break;
		
			case "getMenuDetail": // 소분류
	        	break;
		}
	}