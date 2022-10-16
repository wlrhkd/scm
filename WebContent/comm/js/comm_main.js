function setCondition() {
    const oNoticeData = {
        SearchGubun : "notice"
    };
    const oPdsData = {
        SearchGubun : "pds"
    };
    const oChul = {
        SearchGubun : "chul",
		CVCOD : cfGetLoginCvcod()
    };
    const oPrebul = {
        SearchGubun : "prebul",
		CVCOD : cfGetLoginCvcod()
    };
    const oJunsu = {
        SearchGubun : "junsu",
		CVCOD : cfGetLoginCvcod()
    };
	
    cfAjaxAsync("POST", "comm_main", oNoticeData,"notice");
    cfAjaxAsync("POST", "comm_main", oPdsData, "pds");
    cfAjaxAsync("POST", "comm_main", oChul, "chul");
    cfAjaxAsync("POST", "comm_main", oPrebul, "prebul");
    cfAjaxAsync("POST", "comm_main", oJunsu, "junsu");
    
    setInitValue();
}

function setInitValue() {
    
}

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
}

function pgCallBackAsync(response, name, status) {
    let oData;
    let vListHTML = "";
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
        case "notice":
			oData = JSON.parse(response);
			vListHTML = "";
			
			vListHTML += " <span class='notice_cnt'>최근&nbsp;<span class='notice_txt'>"+oData.DATA.length+"건</span>의 공지사항이 있습니다.</span> ";
			$("#notice_cnt").html(vListHTML);
			vListHTML = "";
			
            for (let i = 0; i < oData.DATA.length; i++) {
                const vItem = oData.DATA[i];

                vListHTML += "<li class='left-line swiper-slide'>";                 
                vListHTML += "  <span class='tag total'><span>전체공지</span></span>";
                //listHTML += "  <span class='tag urgent'>긴급공지</span>";
                vListHTML += "  <p class='tit'><a href='../../cmu/cmu_plan_e.jsp'>"+vItem.SUBJECT+"</a></p>";
                vListHTML += "  <p class='txt'>"+vItem.CONTENT+"</p>";
                if (vItem.CRE_DT.substr(0,8) == cfGetToday()) {
					vListHTML += "  <span class='date front_date'>"+cfStringFormat(vItem.CRE_DT.substr(0,8),"D2")+"</span>";
                    vListHTML += "  <span class='date front_date'>"+cfStringFormat(vItem.CRE_DT.substr(8,6),"T")+"</span>";  
                } else {
                    vListHTML += "  <span class='date front_date'>"+cfStringFormat(vItem.CRE_DT.substr(0,8),"D2")+"</span>";
                }
                vListHTML += "</li>";
            }
            $("#notice").html(vListHTML);
            break;

        case "pds":
            oData = JSON.parse(response);
            vListHTML= "";

			vListHTML += " <span class='pds_cnt'>최근&nbsp;<span class='pds_txt'>"+oData.DATA.length+"건</span>의 자료가 있습니다.</span> ";
			$("#pds_cnt").html(vListHTML);
			vListHTML = "";
			
            for(var i =0;i < oData.DATA.length;i++) {
                const vItem = oData.DATA[i];
			
                 vListHTML += "<li class='swiper-slide'>";
                 vListHTML += "  <span class='pds_tag total'><span>"+vItem.CHG_NAME+"</span></span>";
                 vListHTML += "  <p class='tit'><a href='../../cmu/cmu_pds_e.jsp'>"+vItem.SUBJECT+"</a></p>";
                 if (vItem.CRE_DT.substr(0,8) == cfGetToday()) {
					vListHTML += "  <span class='date'>"+cfStringFormat(vItem.CRE_DT.substr(0,8),"D2")+"</span>";
                    vListHTML += "  <span class='date'>"+cfStringFormat(vItem.CRE_DT.substr(8,6),"T")+"</span>";  
                 } else {
                    vListHTML += "  <span class='date'>"+cfStringFormat(vItem.CRE_DT.substr(0,8),"D2")+"</span>";
                 }
                 vListHTML += "</li>";
            }
            $("#pds").html(vListHTML);
            break;

		case "chul":
			oData = JSON.parse(response);
            vListHTML= "";
            for(var i =0; i < oData.DATA.length; i++) {
                const vItem = oData.DATA[i];
				vListHTML += "<span class='res_chul'>"+vItem.JPNO+"</span><span>건</span>";
			}
			$("#chul").html(vListHTML);
			break;
			
		case "prebul":
			oData = JSON.parse(response);
            vListHTML= "";
            for(var i =0; i < oData.DATA.length; i++) {
                const vItem = oData.DATA[i];
				vListHTML += "<span class='res_prebul'>"+vItem.BFAQTY+"</span><span>건</span>";
			}
			$("#prebul").html(vListHTML);
			break;
			
		case "junsu":
			oData = JSON.parse(response);
            vListHTML= "";
            for(var i =0; i < oData.DATA.length; i++) {
                const vItem = oData.DATA[i];
				vListHTML += "<span class='res_junsu'>"+vItem.NAPJUNSU+"</span><span>%</span>";
			}
			$("#junsu").html(vListHTML);
			break;
	}
}
//
$(document).on("click", "#logOut", function(event) {
//        cfAjaxSync("GET", "comm_logOut", '',"logOut" );
        cfClearAllStorage(); 
        location.href = "/comm/jsp/comm_login.jsp";
/*        $.ajax({
            type : "GET",
            url  : "../LogOut", //자바 서블릿의 URL명       
            data:{},//자바로 전송할 값                 
            success : function(msg) {
                $(location).attr('href','../html/login.jsp');
            },
            error : function(request,status,error) {
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            }
        });             */
});

//
//function menuList(){
//	let <li id="list-pln hidden"><a href="#!"><span class="icon01">계획관리</span></a></li>
//}