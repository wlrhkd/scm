var modalObj;

window.addEventListener('load', function() { 
    
    //서브 shhet scrollbar
    $(".y-scroll").mCustomScrollbar({
        theme: "minimal-dark"
    });

    $(".x-scroll").mCustomScrollbar({
        theme: "minimal-dark",
        axis:"x"  
    });

    $(".xy-scroll").mCustomScrollbar({
        theme: "minimal-dark",
        axis:"yx",
    });

    //file uploader
    if(document.querySelector('#basic_drop_zone')){
        $('#basic').simpleUpload({    
            dropZone: '#basic_drop_zone',
        }).on('upload:end', function(e, file, i) {
            console.log(file);
            $('#basic_message').prepend("<div class='dropfile-txt'><div class='checkbox02 nolabel'><input type='checkbox' id='checkboxId"+i+"'><label for='checkboxId"+i+"'></label><i></i></div><span>"+ file.name + '</span></div>');
        });
    }

    //서브페이지 즐겨찾기 레이어
    var favoriteObj = {
        favoriteBtn : document.querySelector('.favorite-btn'),
        favoriteLayer : document.querySelector('.favorite-layer'),
        setEvent : function(){
            if(this.favoriteBtn){
                this.favoriteBtn.onclick = this.favoriteOnOff.bind(favoriteObj);
            }
        },
        favoriteOnOff : function(){
            if(this.favoriteBtn.classList.contains('on')){
                this.favoriteLayer.classList.remove('on');
                this.favoriteBtn.classList.remove('on');
                this.favoriteBtn.innerHTML = "<span>열기</span>"
            } else {
                this.favoriteLayer.classList.add('on');
                this.favoriteBtn.classList.add('on');
                this.favoriteBtn.innerHTML = "<span>닫기</span>"
            }  
        },
        init : function() {
            this.setEvent()
        }
    }
    favoriteObj.init();
    

    //gnb
    var gnbObj = {
        gnbDepth1 : document.querySelectorAll('.depth01 li a'),
        subMenu : document.querySelector('.sub-menu'),
        gnbDepth2Div : document.querySelectorAll('.sub-menu .inner > div'),  
        gnbDepth2 : document.querySelectorAll('.depth02 > li > a'),  
        gnbDepth2Ul : document.querySelectorAll('.depth03'),   
        gnbDepth3 : document.querySelectorAll('.depth03 > li > a'), 
        contentWrap : document.querySelector('.content-wrap'),
        menuOnOff : document.querySelector('.main-menu .btn-menu'),

        setEvent : function(){
            for(var i=0; i<this.gnbDepth1.length; i++){
                this.gnbDepth1[i].onclick = this.gnbDepth1Click.bind(gnbObj, i);                
            };
            for(var j=0; j<this.gnbDepth2.length; j++){
                this.gnbDepth2[j].onclick = this.gnbDepth2Click.bind(gnbObj, j); 
            };
            for(var k=0; k<this.gnbDepth3.length; k++){
                this.gnbDepth3[k].onclick = this.gnbDepth3Click.bind(gnbObj, k);  
            };
            this.menuOnOff.onclick = this.menuOnOffClick.bind(gnbObj);
        },

        gnbDepth1Click : function(i){
            this.Depth1_remove();
            this.Depth2_remove();
            this.Depth2Ul_remove();
            this.Depth2Div_remove();
            this.Depth3_remove();
            this.gnbDepth1[i].classList.add('on');
            this.subMenu.classList.add('on');
            this.contentWrap.classList.add('on');
            this.menuOnOff.classList.add('on');
//	            this.gnbDepth2Div[i].classList.add('on');  // on 클래스 추가로 인한 주석처리 -2021/12/08 by jhkim
        },
        gnbDepth2Click : function(j){      
            if(this.gnbDepth2[j].classList.contains('on')){                    
                this.gnbDepth2[j].classList.remove('on');                
                this.gnbDepth2[j].nextSibling.nextSibling.classList.remove('on');
            } else {                    
                this.Depth2_remove();
                this.Depth2Ul_remove();
                this.Depth3_remove();
                this.gnbDepth2[j].classList.add('on');                
                this.gnbDepth2[j].nextSibling.nextSibling.classList.add('on');
            }                            
        },
        gnbDepth3Click : function(k){             
            this.Depth3_remove();
            this.gnbDepth3[k].classList.add('on');             
        },
        menuOnOffClick : function(){
            if(this.menuOnOff.classList.contains('on')){
                this.Depth1_remove();
                this.Depth2_remove();                
                this.Depth2Ul_remove();
                this.Depth2Div_remove();
                this.Depth3_remove();
                this.subMenu.classList.remove('on');
                this.contentWrap.classList.remove('on');
                this.menuOnOff.classList.remove('on')
            } else {                
                this.gnbDepth1[0].classList.add('on');
                this.gnbDepth2Div[0].classList.add('on');
                this.subMenu.classList.add('on');
                this.contentWrap.classList.add('on');
                this.menuOnOff.classList.add('on')
            }
        },

        Depth1_remove : function() {
            for(var i=0; i<this.gnbDepth1.length; i++){                        
                this.gnbDepth1[i].classList.remove('on');            
            }
        },
        Depth2_remove : function() {
            for(var i=0; i<this.gnbDepth2.length; i++){                        
                this.gnbDepth2[i].classList.remove('on');            
            }
        },        
        Depth3_remove : function() {
            for(var i=0; i<this.gnbDepth3.length; i++){                        
                this.gnbDepth3[i].classList.remove('on');            
            }
        },
        Depth2Div_remove : function() {
            for(var i=0; i<this.gnbDepth2Div.length; i++){                        
                this.gnbDepth2Div[i].classList.remove('on');            
            }
        },
        Depth2Ul_remove : function() {
            for(var i=0; i<this.gnbDepth2Ul.length; i++){                        
                this.gnbDepth2Ul[i].classList.remove('on');            
            }
        },
        init : function() {
            this.setEvent()
        }
    }    
    gnbObj.init();    

    //table event
    var tableObj = {
        tableTr : document.querySelectorAll('table[class^="table-type"] tbody tr'),

        setEvent : function(){       
            for(var i=0; i<this.tableTr.length; i++){
                this.tableTr[i].onclick = this.tableTrClick.bind(tableObj);
            }    
        },
        tableTrClick : function(e) {
            if(e.currentTarget.classList.contains('on')){
                e.currentTarget.classList.remove('on');
            } else {
                this.removeTrOn();
                e.currentTarget.classList.add('on');
            }
        },
        removeTrOn : function(){
            for(var i=0; i<this.tableTr.length; i++){
                this.tableTr[i].classList.remove('on');
            } 
        },
        init : function() {
            this.setEvent()
        }
    }
    tableObj.init(); 

    const resizeObserver = new ResizeObserver(entries => {
        //for (let entry of entries) {
            // form multi line
            if (document.querySelector('.sheet-box .form-block') && document.querySelector('.sheet-box .paginate')){
                var formObj = {
                    formBlockHeight : document.querySelector('.sheet-wrap .form-block').offsetHeight,
                    pagingHeight : document.querySelector('.sheet-wrap .paginate').offsetHeight,    
                    sheetBoxHeight: document.querySelector('.sheet-wrap .sheet-box').offsetHeight,         
                    tableWrap :  document.querySelector('.sheet-wrap .table-box-wrap'),
                    sheetInner: document.querySelector('.sheet-wrap .sheet-box-inner'),
                    tableHeight: document.querySelector('.sheet-wrap .table-box-wrap table').offsetHeight,
                    graphWrap : document.querySelector('.sheet-wrap .graph-wrap'),
                    autoHeight : function(){
                        if (this.sheetInner) {
                            this.sheetInner.style.height = 'calc(100% - ' + (this.formBlockHeight + this.pagingHeight) + 'px)';
                        } else if(this.graphWrap) {
                            this.graphWrap.style.height = 'calc(100% - ' + (this.formBlockHeight + this.pagingHeight) + 'px)';
                        } else {                    
                            if (this.tableHeight > ((this.sheetBoxHeight - 10) - (this.formBlockHeight + this.pagingHeight))){
                                this.tableWrap.style.height = 'calc(100% - ' + (this.formBlockHeight + this.pagingHeight) + 'px)';
                            } else {
                                this.tableWrap.style.height = 'auto';
                            }
                        }          
                    },
                    init : function() {
                        this.autoHeight()
                    }       
                }
                formObj.init(); 
            } else if (!document.querySelector('.sheet-box .form-block') && !document.querySelector('.sheet-box .paginate') && document.querySelector('.sheet-wrap .sheet-box-inner')) {
                var formObj = {            
                    sheetInner: document.querySelector('.sheet-wrap .sheet-box-inner'),
                    autoHeight: function () {
                            this.sheetInner.style.height = '100%';
                    },
                    init: function () {
                        this.autoHeight()
                    }
                }
                formObj.init();
            }            
        //}
    });
    resizeObserver.observe(document.querySelector(".table-box-wrap"));
    
    if (document.querySelector('.sheet-box .form-block') && document.querySelector('.sheet-box .paginate')){
        var formObj = {
            formBlockHeight : document.querySelector('.sheet-wrap .form-block').offsetHeight,
            pagingHeight : document.querySelector('.sheet-wrap .paginate').offsetHeight,    
            sheetBoxHeight: document.querySelector('.sheet-wrap .sheet-box').offsetHeight,         
            tableWrap :  document.querySelector('.sheet-wrap .table-box-wrap'),
            sheetInner: document.querySelector('.sheet-wrap .sheet-box-inner'),
            tableHeight: document.querySelector('.sheet-wrap .table-box-wrap table').offsetHeight,
            graphWrap : document.querySelector('.sheet-wrap .graph-wrap'),
            autoHeight : function(){
                if (this.sheetInner) {
                    this.sheetInner.style.height = 'calc(100% - ' + (this.formBlockHeight + this.pagingHeight) + 'px)';
                } else if(this.graphWrap) {
                    this.graphWrap.style.height = 'calc(100% - ' + (this.formBlockHeight + this.pagingHeight) + 'px)';
                } else {                    
                    if (this.tableHeight > ((this.sheetBoxHeight - 10) - (this.formBlockHeight + this.pagingHeight))){
                        this.tableWrap.style.height = 'calc(100% - ' + (this.formBlockHeight + this.pagingHeight) + 'px)';
                    } else {
                        this.tableWrap.style.height = 'auto';
                    }
                }          
            },
            init : function() {
                this.autoHeight()
            }       
        }
        formObj.init(); 
    } else if (!document.querySelector('.sheet-box .form-block') && !document.querySelector('.sheet-box .paginate') && document.querySelector('.sheet-wrap .sheet-box-inner')) {
        var formObj = {            
            sheetInner: document.querySelector('.sheet-wrap .sheet-box-inner'),
            autoHeight: function () {
                    this.sheetInner.style.height = '100%';
            },
            init: function () {
                this.autoHeight()
            }
        }
        formObj.init();
    }
    
    //detail page
    if (document.querySelector('.detail-wrap .detail-division')) {
        var detailObj = {
            divisionHeight: document.querySelector('.detail-wrap .detail-division').offsetHeight,
            innerWrap: document.querySelector('.detail-wrap .inner'),
            autoHeight: function () {                
                this.innerWrap.style.height = 'calc(100% - ' + (this.divisionHeight + 10) + 'px)';
            },
            init: function () {
                this.autoHeight()
            }
        }
        detailObj.init();
    }

    //table tbody th fixed
    // if(document.querySelector('table tbody th')){
    //     var tbodyTh01Width = document.querySelector('table tbody tr:nth-child(1) th:nth-child(1)').offsetWidth;        
    //     var tbodyTh02Width;
    //     var tbodyTh02;
    //     var tbodyTh03;
    //     var theadTh01 = document.querySelector('table thead tr:nth-child(1) th:nth-child(1)');
    //     var theadTh02 = document.querySelector('table thead tr:nth-child(1) th:nth-child(2)');
    //     var theadTh03 = document.querySelector('table thead tr:nth-child(1) th:nth-child(3)');

    //     theadTh01.style.left = 0;
    //     theadTh01.style.zIndex = 20;
    //     theadTh02.style.left = tbodyTh01Width +'px';
    //     theadTh02.style.zIndex = 20;
        
    //     if(document.querySelector('table tbody tr:nth-child(1) th:nth-child(2)')){
    //         tbodyTh02 = document.querySelectorAll('table tbody th:nth-child(2)');
    //         for(var i=0; i<tbodyTh02.length; i++){
    //             tbodyTh02[i].style.left = tbodyTh01Width +'px';
    //         }
    //     } 
    //     if(document.querySelector('table tbody tr:nth-child(1) th:nth-child(3)')) {
    //         tbodyTh02Width = document.querySelector('table tbody tr:nth-child(1) th:nth-child(2)').offsetWidth;
    //         tbodyTh03 = document.querySelectorAll('table tbody th:nth-child(3)')
    //         for(var i=0; i<tbodyTh03.length; i++){
    //             tbodyTh03[i].style.left = tbodyTh01Width + tbodyTh02Width  +'px';
    //         }
    //     }        
    // }
    
    //Tree menu
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        }
    };   

    var zNodes = [
        {
            name: "Tree Menu", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png",
            children: [
                {
                    name: "menu01", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png",
                    children: [
                        { name: "menu01-1", icon: "../assets/css/img/icon/xls.png" },
                        { name: "menu01-2", icon: "../assets/css/img/icon/xls.png" },
                    ],
                },
                {
                    name: "menu02", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png",
                    children: [
                        { 
                            name: "menu02-1", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png", 
                            children: [
                                { name: "menu02-1-1", icon: "../assets/css/img/icon/picture.png" },
                                { name: "menu02-1-2", icon: "../assets/css/img/icon/picture.png" },
                            ],
                        },
                        { 
                            name: "menu02-2", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png", 
                            children: [
                                { name: "menu02-2-1", icon: "../assets/css/img/icon/doc.png" },
                                { name: "menu02-2-2", icon: "../assets/css/img/icon/doc.png" },
                            ],
                        },                        
                    ],
                },
                {
                    name: "menu03", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png",
                    children: [
                        { name: "menu03-1", icon: "../assets/css/img/icon/pdf.png" },
                        { name: "menu03-2", icon: "../assets/css/img/icon/pdf.png" },
                    ],
                },                
            ]
        },
    ];   
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);    

    var setting2 = {
        data: {
            simpleData: {
                enable: true
            }
        }
    };

    var zNodes2 = [
        {
            name: "Tree Menu", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png",
            children: [
                {
                    name: "menu01", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png",
                    children: [
                        { name: "menu01-1", icon: "../assets/css/img/icon/xls.png" },
                        { name: "menu01-2", icon: "../assets/css/img/icon/xls.png" },
                    ],
                },
                {
                    name: "menu02", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png",
                    children: [
                        {
                            name: "menu02-1", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png",
                            children: [
                                { name: "menu02-1-1", icon: "../assets/css/img/icon/picture.png" },
                                { name: "menu02-1-2", icon: "../assets/css/img/icon/picture.png" },
                            ],
                        },
                        {
                            name: "menu02-2", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png",
                            children: [
                                { name: "menu02-2-1", icon: "../assets/css/img/icon/doc.png" },
                                { name: "menu02-2-2", icon: "../assets/css/img/icon/doc.png" },
                            ],
                        },
                    ],
                },
                {
                    name: "menu03", open: true, iconOpen: "../assets/css/img/icon/folder_open.png", iconClose: "../assets/css/img/icon/directory.png",
                    children: [
                        { name: "menu03-1", icon: "../assets/css/img/icon/pdf.png" },
                        { name: "menu03-2", icon: "../assets/css/img/icon/pdf.png" },
                    ],
                },
            ]
        },
    ];
    $.fn.zTree.init($("#treeDemo2"), setting2, zNodes2);  
    //DatePicker
    if($.datepicker){
        //오늘 날짜를 출력
        $("#today").text(new Date().toLocaleDateString());

        //datepicker 한국어로 사용하기 위한 언어설정
        $.datepicker.setDefaults($.datepicker.regional['ko']); 
        $.datepicker.setDefaults({
            monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'] //달력의 월 부분 텍스트
            ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
            ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
            ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
        });
        
        // 시작일(fromDate)은 종료일(toDate) 이후 날짜 선택 불가
        // 종료일(toDate)은 시작일(fromDate) 이전 날짜 선택 불가

        //시작일.
        $('#fromDate').datepicker({
            showOn: "button",                     // 달력을 표시할 타이밍 (both: focus or button)
            buttonImage: "../images/contents/icon_calendar.png", // 버튼 이미지
            buttonImageOnly : true,             // 버튼 이미지만 표시할지 여부
            buttonText: "날짜선택",             // 버튼의 대체 텍스트
            dateFormat: "yy-mm-dd",             // 날짜의 형식
            changeMonth: true,                  // 월을 이동하기 위한 선택상자 표시여부
            //minDate: 0,                       // 선택할수있는 최소날짜, ( 0 : 오늘 이전 날짜 선택 불가)
            onClose: function( selectedDate ) {
                // 시작일(fromDate) datepicker가 닫힐때
                // 종료일(toDate)의 선택할수있는 최소 날짜(minDate)를 선택한 시작일로 지정
                $("#toDate").datepicker( "option", "minDate", selectedDate );
            }                
        });

        //종료일
        $('#toDate').datepicker({
            showOn: "button", 
            buttonImage: "../images/contents/icon_calendar.png", 
            buttonImageOnly : true,
            buttonText: "날짜선택",
            dateFormat: "yy-mm-dd",
            changeMonth: true,
            //minDate: 0, // 오늘 이전 날짜 선택 불가
            onClose: function( selectedDate ) {
                // 종료일(toDate) datepicker가 닫힐때
                // 시작일(fromDate)의 선택할수있는 최대 날짜(maxDate)를 선택한 종료일로 지정 
                $("#fromDate").datepicker( "option", "maxDate", selectedDate );
            }                
        });
        
        //시작일.
        $('#txt_fromDate').datepicker({
            showOn: "button",                     // 달력을 표시할 타이밍 (both: focus or button)
            buttonImage: "../img/contents/icon_calendar.png", // 버튼 이미지
            buttonImageOnly : true,             // 버튼 이미지만 표시할지 여부
            buttonText: "날짜선택",             // 버튼의 대체 텍스트
            dateFormat: "yy-mm-dd",             // 날짜의 형식
            changeMonth: true,                  // 월을 이동하기 위한 선택상자 표시여부
            //minDate: 0,                       // 선택할수있는 최소날짜, ( 0 : 오늘 이전 날짜 선택 불가)
            onClose: function( selectedDate ) {    
                // 시작일(fromDate) datepicker가 닫힐때
                // 종료일(toDate)의 선택할수있는 최소 날짜(minDate)를 선택한 시작일로 지정
                $("#txt_toDate").datepicker( "option", "minDate", selectedDate );
            }                
        });
        $('#txt_toDate').datepicker ({
            showOn: "button",
            buttonImage: "../img/contents/icon_calendar.png",
            buttonImageOnly: true,
            buttonText: "날짜선택",
            dateFormat: "yy-mm-dd",
            changeMonth: true,
            //minDate: 0, // 오늘 이전 날짜 선택 불가
            onClose: function (selectedDate) {
                // 종료일(toDate) datepicker가 닫힐때
                // 시작일(fromDate)의 선택할수있는 최대 날짜(maxDate)를 선택한 종료일로 지정 
                $("#txt_fromDate").datepicker("option", "maxDate", selectedDate);
            }
        });
		// 년월 달력표시
		$('#txt_Yymm').datepicker({
		    showOn: "button",                     // 달력을 표시할 타이밍 (both: focus or button)
		    buttonImage: "../img/contents/icon_calendar.png", // 버튼 이미지
		    buttonImageOnly : true,             // 버튼 이미지만 표시할지 여부
		    buttonText: "날짜선택",             // 버튼의 대체 텍스트
		    dateFormat: "yy-mm",             // 날짜의 형식
		    changeMonth: true,                  // 월을 이동하기 위한 선택상자 표시여부
		    //minDate: 0,                       // 선택할수있는 최소날짜, ( 0 : 오늘 이전 날짜 선택 불가)
		    onClose: function( selectedDate ) {    
		        // 시작일(fromDate) datepicker가 닫힐때
		        // 종료일(toDate)의 선택할수있는 최소 날짜(minDate)를 선택한 시작일로 지정
		        $("#txt_toDate").datepicker( "option", "minDate", selectedDate );
		    }                
		});
		// 년도 달력표시
		$('#txt_Yyyy').datepicker({
		    showOn: "button",                     // 달력을 표시할 타이밍 (both: focus or button)
		    buttonImage: "../img/contents/icon_calendar.png", // 버튼 이미지
		    buttonImageOnly : true,             // 버튼 이미지만 표시할지 여부
		    buttonText: "날짜선택",             // 버튼의 대체 텍스트
		    dateFormat: "yy",             // 날짜의 형식
		    changeMonth: true,                  // 월을 이동하기 위한 선택상자 표시여부
		    //minDate: 0,                       // 선택할수있는 최소날짜, ( 0 : 오늘 이전 날짜 선택 불가)
		    onClose: function( selectedDate ) {    
		        // 시작일(fromDate) datepicker가 닫힐때
		        // 종료일(toDate)의 선택할수있는 최소 날짜(minDate)를 선택한 시작일로 지정
		        $("#txt_toDate").datepicker( "option", "minDate", selectedDate );
		    }                
		});
        /*$("#txt_fromDate").datepicker('setDate','-7D'); //7일전 설정 //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
        $("#txt_toDate").datepicker('setDate', 'today');*/
    }

    //modal
    modalObj = {
        modalOpens : document.querySelectorAll('[id^="modal_open"]'),
        checkModalOpen : document.querySelector('#wrap'),
        modalID : null,
        //setEvent : function(){
        //    for(var i=0; i<this.modalOpens.length; i++){     
        //        var modalNum = this.modalOpens[i].getAttribute('id').replace(/[^0-9]/g,'');
        //        this.modalOpens[i].onclick = this.modalOpenFunc.bind(modalObj, Number(modalNum))  
        //    } 
        //    var checkModal = document.querySelector('#checkModal').getAttribute('id');
        //    this.checkModalOpen.onclick = this.modalOpenFunc.bind(modalObj, checkModal); 
        //},
        modalOpenFunc : function(modalNum){  
            //if(typeof modalNum === 'number') {
            //    this.modalID = document.querySelector('#modal'+modalNum);
            //} else {
            //    this.modalID = document.querySelector(modalNum);
            //}
            //console.log(this.modalID);

			this.modalID = document.querySelector('#'+modalNum);
            this.modalID.style.display = 'block';
            // 화면의 중앙에 레이어를 띄운다.       
            if (this.modalID.offsetHeight < document.documentElement.offsetHeight){
                // temp.css('margin-top', '-' + temp.outerHeight() / 2 + 'px');
                this.modalID.style.marginTop = '-' + this.modalID.offsetHeight / 2 + 'px'
            } else {
                //temp.css('top', '0px');
                this.modalID.style.top = '0px';
            }
            
            if (this.modalID.offsetWidth < document.documentElement.offsetWidth){
                //temp.css('margin-left', '-' + temp.outerWidth() / 2 + 'px');
                this.modalID.style.marginLeft = '-' + this.modalID.offsetWidth / 2 + 'px';
            }  else {
                //temp.css('left', '0px');
                this.modalID.style.left = '0px';
            } 

            // Disable browser scrolling
            document.querySelector("html").style.overflow = "hidden";

            //Show & hide dialog
            for(var i=0; i<this.modalID.querySelectorAll('.cbtn').length; i++){
                this.modalID.querySelectorAll('.cbtn')[i].onclick = this.modalClose.bind(modalObj);
            }            

            //modal background dark
            document.querySelector('.modal-layer-wrap').classList.add('on');

            //modal form multi line
            var modalLayer = this.modalID;
            if(modalLayer.querySelector('.search-wrap')){    
                var searchWrapHeight = modalLayer.querySelector('.search-wrap').offsetHeight;
                var btnLineHeight = modalLayer.querySelector('.btn-line').offsetHeight;                
                var botWrap = modalLayer.querySelector('.bot-wrap');
                var tableBox = modalLayer.querySelector('.table-box-wrap');
                if(botWrap) {
                    var botHeight = modalLayer.querySelector('.bot-wrap').offsetHeight;
                    tableBox.style.height = 'calc(100% - ' + (searchWrapHeight + botHeight + 10) + 'px)';     
                } else {
                    tableBox.style.height = 'calc(100% - ' + (searchWrapHeight + btnLineHeight + 70) + 'px)';
                }              
            }
        },
        modalClose : function(){
            this.modalID.style.display = 'none';     
            document.querySelector('html').style.overflow = "hidden auto";
            document.querySelector('.modal-layer-wrap').classList.remove('on');
        },
        //init : function() {
        //    this.setEvent()
        //}
    }
    //modalObj.init()
});

//report
function openReportPop(url, name) {
    var nWidth = "940";
    var nHeight = "900";

    // 듀얼 모니터 고려한 윈도우 띄우기
    var curX = window.screenLeft;
    var curY = window.screenTop;
    var curWidth = document.body.clientWidth;
    var curHeight = document.body.clientHeight;

    var nLeft = curX + (curWidth / 2) - (nWidth / 2);
    var nTop = curY + (curHeight / 2) - (nHeight / 2);

    var strOption = "";
    strOption += "left=" + nLeft + "px,";
    strOption += "top=" + nTop + "px,";
    strOption += "width=" + nWidth + "px,";
    strOption += "height=" + nHeight + "px,";
    strOption += "toolbar=no,menubar=no,location=no,status=no";
    strOption += "resizable=yes,status=yes";

    var winObj = window.open(url, name, strOption);
    if (winObj == null) {
        alert("팝업 차단을 해제해주세요.");
        return false;
    }
}


//function checkModalFunc(){
//    modalObj.modalOpenFunc('#checkModal')
//}

//------------------------------------------------------------------------------
// 기능 : 테이블의 높이를 추가 설정하는 함수
// 인자 : height -> 테이블의 높이 추가 지정
// 반환 : 테이블의 높이값 조절
// 작성 : 2021.03.11 by dykim
// 예시 : cfAutoHeight(10);
// ※ 옵저버를 통해 테이블 변경이 일어나면 자동으로 높이가 설정되나 그외에 높이가 정말 안맞을 때만 사용할 것

function cfAutoHeight(height){
	formBlockHeight = document.querySelector('.sheet-wrap .form-block').offsetHeight;
    pagingHeight = document.querySelector('.sheet-wrap .paginate').offsetHeight; 
    sheetBoxHeight = document.querySelector('.sheet-wrap .sheet-box').offsetHeight;         
    tableWrap =  document.querySelector('.sheet-wrap .table-box-wrap');
    sheetInner = document.querySelector('.sheet-wrap .sheet-box-inner');
    tableHeight = document.querySelector('.sheet-wrap .table-box-wrap table').offsetHeight;
    graphWrap = document.querySelector('.sheet-wrap .graph-wrap');
    
	if (this.sheetInner) {
		this.sheetInner.style.height = 'calc(100% - ' + (this.formBlockHeight + this.pagingHeight) + 'px)';
	} else if(this.graphWrap) {
		this.graphWrap.style.height = 'calc(100% - ' + (this.formBlockHeight + this.pagingHeight) + 'px)';
	} else {                    
		if (this.tableHeight > ((this.sheetBoxHeight - 10) - (this.formBlockHeight + this.pagingHeight))){

			this.tableWrap.style.height = 'calc(100% - ' + (this.formBlockHeight + this.pagingHeight + height) + 'px)';
		} else {
			this.tableWrap.style.height = 'auto';
		}
	}          
}

//------------------------------------------------------------------------------
// 기능 : 문자열의 포멧을 지정해주는 함수
// 인자 : string -> 포멧 변환이 필요한 문자
//        type -> 지정해줄 포맷 타입
// 반환 : String, 포맷 변환이 완료된 문자열
// 작성 : 2021.03.11 by dykim
// 예시 : cfStringFormat(20210311,"D");
//------------------------------------------------------------------------------
function cfStringFormat(string,type) {

    let formatStr = '';
    try {
        if (type == "N") {
            formatStr = new Intl.NumberFormat().format(string);
            return formatStr;
        } else if (type == "T") {
            if (string.length == 6) {
                formatStr = string.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
                return formatStr;   
            } else if (string.length == 4) {
                fformatStr = string.replace(/(\d{2})(\d{2})/, '$1:$2');
                return formatStr;
            }
        }
        if (string.length == 15) {
            //15자리 전표번호
            if(type == "J")
            {
                formatStr = string.replace(/(\d{8})(\d{4})(\d{3})/, '$1-$2-$3');
            }
        } else if (string.length == 8) {
            //8자리
			if(type == "D1") {
				formatStr = string.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			} else if (type == "D2") {
                formatStr = string.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
            }
		} else if (string.length == 12) {
            if (type == "J") {
                formatStr = string.replace(/(\d{8})(\d{4})/, '$1-$2');
            }
        }
		//14자리 날짜시간
		if(type == "DT") {
				formatStr = string.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1.$2.$3 $4:$5:$6');
				return formatStr;
		}
		//0000-000000
		if(type == "PN") {
				formatStr = string.replace(/(\d{4})(\d{6})/, '$1-$2');
				return formatStr;				
		}
		
    } catch (e) {
        formatStr = string;
        //console.log(e);
    }

    return formatStr;
};

//------------------------------------------------------------------------------
// 기능 : 숫자의 천 단위 , 표기
// 인자 : num 숫자 
// 반환 : String, 포맷 변환이 완료된 숫자
// 작성 : 2021.08.18 by jwlee
// 예시 : cfNumberFormat(1540000);  // 1,540,000
//------------------------------------------------------------------------------
function cfNumberFormat(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


//------------------------------------------------------------------------------
// 기능 : 입력한 날짜의 년도 계산 
// 인자 : 년도, 추가 또는 감소값
// 반환 : 입력한 인자에 따라 계산된 날짜(포멧 포함)
// 작성 : 2021.08.27 jwlee
// 예시 : cfYearCalc(2021,5) = 2026
// 예시 : cfYearCalc(2021,-3) = 2018
//------------------------------------------------------------------------------
function cfYearCalc(date, year){	
	var date = new Date(date, "01", "01"); 	
	var rs = date.getFullYear() + year; 
	console.log("1 : "+rs);
	return rs;
}
//------------------------------------------------------------------------------
// 기능 : 입력한 날짜의 월 계산 
// 인자 : 년월, 추가 또는 감소값
// 반환 : 입력한 인자에 따라 계산된 날짜(포멧 포함)
// 작성 : 2021.08.27 jwlee
// 예시 : cfMonthCalc(202108,5) = 2022-01
// 예시 : cfMonthCalc(20210804,-3) = 2021-05-04
//------------------------------------------------------------------------------
function cfMonthCalc(date, month){	
	if(date.length == 8){
		console.log(date.substr(0,4), date.substr(4,2), date.substr(6,2));
		var vDate = new Date(date.substr(0,4), date.substr(4,2), date.substr(6,2));
	}else{
		var vDate = new Date(date.substr(0,4), date.substr(4,2), "01");
	}
	if(date.length == 8) {
		var rs = vDate.getFullYear() +"-"+ ( vDate.getMonth() + month ) +"-"+ vDate.getDate();
		let vMonth = vDate.getMonth() + month;
		let vGetDate = vDate.getDate();
		
		if(vMonth.toString().length == 1){
			vMonth = "0" + vMonth;
		}
		if(vGetDate.toString().length == 1){
			vGetDate = "0" + vGetDate;
		}
		var rs = vDate.getFullYear() +"-"+ vMonth +"-"+ vGetDate;
		
		if(rs.substr(5,2) == '00'){ // 기간이 마이너스 됐을 때 00으로 딱 떨어질 때
			let year = Number(rs.substr(0,4)) - 1;
			let month = '12';
			rs = year+"-"+month+"-"+rs.substr(8,2);
		}
		
		if(rs.length == 9){
			rs = rs.substr(0,4)+"-0"+rs.substr(5,1)+"-"+rs.substr(7,2);
			
			if(rs.substr(5,2) == '00'){ // 기간이 마이너스 됐을 때 00으로 딱 떨어질 때
				let year = Number(rs.substr(0,4)) - 1;
				let month = '12';
				rs = year+"-"+month+"-"+rs.substr(8,2);
			}
			
		} else if(rs.substr(5,1) == '-'){ // 기간이 마이너스 되서 월 이 -(마이너스)숫자가 될 때 , 길이가 9 초과
			let year = Number(rs.substr(0,4)) - 1;
			let month = '12' - Number(rs.substr(6,1));
			rs = year+"-"+month+"-"+rs.substr(8,2);
		}
		
	}else{
		alert(7);
		var rs = vDate.getFullYear() +"-"+ ( vDate.getMonth() + month );
		if(rs.length == 6){
		alert(8);
			rs = rs.substr(0,4)+"-0"+rs.substr(5,1);
		}
	}
	
	console.log("2 : "+rs);	
	return 	rs;	
}
//------------------------------------------------------------------------------
// 기능 : 입력한 날짜의 일자 계산 
// 인자 : 년월일, 추가 또는 감소값
// 반환 : 입력한 인자에 따라 계산된 날짜(포멧 포함)
// 작성 : 2021.08.27 jwlee
// 예시 : cfDateCalc(20211230, 5) = 2022-01-04
// 예시 : cfDateCalc(20211230,-3) = 2021-12-27
//------------------------------------------------------------------------------
function cfDateCalc(date, day){
	var date = new Date(date.substr(0,4), date.substr(4,2), date.substr(6,2));
	var rs = date.getFullYear() +"-"+ date.getMonth() +"-"+ ( date.getDate() + day );
	if(rs.length == 9){
			rs = rs.substr(0,4)+"-0"+rs.substr(5,1)+"-"+rs.substr(7,2);
		}
	else if(rs.length == 8){
			rs = rs.substr(0,4)+"-0"+rs.substr(5,1)+"-0"+rs.substr(7,2);		
	}
	console.log("3 : "+rs);			 	
	return rs;
}

//------------------------------------------------------------------------------
// 기능 : 버튼 그룹에 존재하는 버튼들을 보이지 않게 하는 함수
// 인자 : ...id -> 전달받은 매개변수의 배열
// 반환 : 전달받은 ID가 있는 태그에 hidden css 추가
// 작성 : 2021.03.25 by dykim
// 예시 : cfBtnHide("insert","print","modify");
//------------------------------------------------------------------------------
function cfBtnHide(...id) {
    let vBtnId;    
    for (let i = 0; i < id.length; i++) {
        vBtnId = document.querySelector("#btn_" + id[i]);
        //console.log(document.querySelector(`#btn_${id[i]}`));
        vBtnId.classList.add("hidden");
    }    
};

//------------------------------------------------------------------------------
// 기능 : 버튼 그룹에 존재하는 버튼들을 보이게 하는 함수
// 인자 : ...id -> 전달받은 매개변수의 배열
// 반환 : 전달받은 ID가 있는 태그에 hidden css 제거
// 작성 : 2021.03.25 by dykim
// 예시 : cfBtnShow("insert","print","modify");
//------------------------------------------------------------------------------
function cfBtnShow(...id) {
    let vBtnId;    
    for (let i = 0; i < id.length; i++) {
        vBtnId = document.querySelector("#btn_" + id[i]);
        vBtnId.classList.remove("hidden");
    }    
};

//------------------------------------------------------------------------------
// 기능 : 조회조건에 사용할 Select박스 데이터 가져오기
// 인자 : fileName -> Select박스를 사용하는 프로그램의 java파일이름 ex) ord_chul_e
//       gubun -> java에서 데이터를 찾기위한 구분값
//       id -> Select 박스의 아이디  
// 반환 : Select박스에 option 추가
// 작성 : 2021.04.02 by dykim
// 예시 : cfGetHeadCombo("ord_chul_e", "saupj", "sel_saupj"); //사업장
//------------------------------------------------------------------------------
function cfGetHeadCombo(fileName,gubun, id){
    $.ajax ({
        type: "GET",
        url: "../" + fileName,
        data: {SearchGubun:gubun},
        success: function (response) {
            let vListHTML = "";
            const aResponse = jQuery.parseJSON(response);
			if(gubun == 'ittyp'){
	            vListHTML += "<option value='%'>전체</option>";
			}
            for(let i = 0; i < aResponse.DATA.length; i++) {
                const vObject = aResponse.DATA[i];
                vListHTML += "<option value='"+vObject.RFGUB+"'>" +vObject.RFNA1+"</option>";
            }
            $("#" + id).html(vListHTML);
        },
        error : function(request,status,error) {
            alert("code = " + request.status + "message = " + request.responseText + " error = " + error); // 실패 시 처리
        }
   });
};

//------------------------------------------------------------------------------
// 기능 : table에 사용할 Select박스 데이터 동기식으로 가져오기
// 인자 : fileName -> Select박스를 사용하는 프로그램의 java파일이름 ex) ord_chul_e
//       gubun -> java에서 데이터를 찾기위한 구분값  
// 반환 : Select박스에 option 추가
// 작성 : 2021.04.05 by dykim
// 예시 : cfGetTableCombo("ord_chul_e", "pojang");
//------------------------------------------------------------------------------
function cfGetTableCombo(fileName,gubun){
    let aTableHTML = "";
    $.ajax ({
        type: "GET",
        url: "../" + fileName,
        data: {SearchGubun:gubun},
        async : false,
        success: function (response) {
            let vListHTML = "";
            const aResponse = jQuery.parseJSON(response);
            //console.log(aResponse);
            for(let i = 0; i < aResponse.DATA.length; i++) {
                const vObject = aResponse.DATA[i];
                vListHTML += "<option value='"+vObject.RFGUB+"'>" +vObject.RFNA1+"</option>";
                vListHTML += "\n";
            }
            aTableHTML = vListHTML;
        },
        error : function(request,status,error) {
            alert("code = " + request.status + "message = " + request.responseText + " error = " + error); // 실패 시 처리
        }
   });
   return aTableHTML;
};

//------------------------------------------------------------------------------
// 기능 : 메시지 정보 가져오기
// 인자 : fileName -> java파일이름 ex) ord_chul_e
//       gubun -> java에서 데이터를 찾기위한 구분값  
//       code -> 메시지 코드값       
// 반환 : 메시지 팝업 출력
// 작성 : 2021.04.05 by dykim
// 예시 : cfGetMessage("ord_chul_e", "message" ,"203");
//------------------------------------------------------------------------------
function cfGetMessage(fileName, gubun, code) {
	let vFileName = fileName.replace("" , "");
    $.ajax ({
        type : "GET",
        url : "/" + vFileName,
        data : {SearchGubun:gubun, Code:code},
        success: function (response) {
            const aResponse = jQuery.parseJSON(response);
            //console.log(aResponse);
            const vMsg = aResponse.DATA[0]["MSG_TXT1"];
            $("#oCheckMessage").html(vMsg);
            $("#checkType").attr("class", "modal-content panel-success");
            modalObj.modalOpenFunc('oCheckModal');
        },
        error : function(request, status, error) {
            alert("code = " + request.status + "message = " + request.responseText + " error = " + error);
        } 
    })
}

//------------------------------------------------------------------------------
// 기능 : 메시지 정보 가져오기
// 인자 : fileName -> java파일이름 ex) ord_chul_e
//       gubun -> java에서 데이터를 찾기위한 구분값  
//       code -> 메시지 코드값       
// 반환 : 메시지 팝업 컨펌 형식으로 출력
// 작성 : 2021.11.03 by jhlee
// 예시 : cfGetMessage("ord_chul_e", "message" ,"203");
//------------------------------------------------------------------------------
function cfcGetMessage(fileName, gubun, code) {
    $.ajax ({
        type : "GET",
        url : "/" + fileName,
        data : {SearchGubun:gubun, Code:code},
        success: function (response) {
            const aResponse = jQuery.parseJSON(response);
            //console.log(aResponse);
            const vMsg = aResponse.DATA[0]["MSG_TXT1"];
            $("#cCheckMessage").html(vMsg);
            $("#checkType").attr("class", "modal-content panel-success");
            modalObj.modalOpenFunc('cCheckModal');
        },
        error : function(request, status, error) {
            alert("code = " + request.status + "message = " + request.responseText + " error = " + error);
        }
    })
}

//------------------------------------------------------------------------------
// 기능 : 빈 값 체크
// 인자 : data -> 빈 값을 체크할 데이터
// 반환 : 빈 값일 시 false, 값이 있으면 true
// 작성 : 2021.05.04 by dykim
// 예시 : cfEmptyChk();
//------------------------------------------------------------------------------
function cfEmptyChk(data) {
    if (data == "undefined" || data == "" || data == null) {
        return false;
    }
    return true;
}

//------------------------------------------------------------------------------
// 기능 : 날짜 정보 동기 방식으로 가져오기       
// 반환 : 문자열의 날짜 출력 ex)20210504
// 작성 : 2021.05.04 by dykim
// 예시 : const vToday = cfGetToday();
//------------------------------------------------------------------------------
function cfGetToday() {
    const oData = {
        "SearchGubun" : "date"
    };
    const vSysDate = cfAjaxSync("GET","comm_util", oData, "date");
    return vSysDate;
}
//------------------------------------------------------------------------------
// 기능 : 시간 정보 동기 방식으로 가져오기       
// 반환 : 문자열의 시간 출력 ex)20210504
// 작성 : 2021.05.21 by dykim
// 예시 : const vDate = cfGetTime();
//------------------------------------------------------------------------------
function cfGetTime() {
    const oData = {
        "SearchGubun" : "time"
    };
    const vTime = cfAjaxSync("GET","comm_util", oData, "time");
    return vTime; 
}

//------------------------------------------------------------------------------
// 기능 : 팝업창 닫기       
// 반환 : 없음
// 작성 : 2021.05.12 by dykim
// 예시 : cfClosePopup();
//------------------------------------------------------------------------------
function cfClosePopup() {
    $('.btn-modal-close').click();
}

//------------------------------------------------------------------------------
// 기능 : 테이블 초기화
// 인자 : tableId -> 테이블의 ID
//       pageNavId -> 페이지 네비게이션 ID                
// 반환 : 없음
// 작성 : 2021.05.12 by dykim
// 예시 : cfClearData(tbl_wrap, oPaginate);
//------------------------------------------------------------------------------
function cfClearData(tableId, pageNavId) {
    $("#" + tableId + " > thead").empty(); //테이블 Head Clear           
    $("#" + tableId + " > tbody").empty(); //테이블 Body Clear                    
    $("#" + pageNavId).html("");  // 페이지 네비게이션 Clear;
}

//------------------------------------------------------------------------------
// 기능 : 버튼 기능 비활성화
// 인자 : ...id -> 전달받은 매개변수의 배열                
// 반환 : 없음
// 작성 : 2021.05.12 by dykim
// 예시 : cfBtnDisable("insert","modify");
//------------------------------------------------------------------------------
function cfBtnDisable(...id) {
    let vBtnId;    
    for (let i = 0; i < id.length; i++) {
        vBtnId = document.querySelector("#btn_" + id[i]);
        vBtnId.disabled = true;
    }    
}
//------------------------------------------------------------------------------
// 기능 : 버튼 기능 활성화
// 인자 : ...id -> 전달받은 매개변수의 배열                
// 반환 : 없음
// 작성 : 2021.05.12 by dykim
// 예시 : cfBtnEnable("insert","modify");
//------------------------------------------------------------------------------
function cfBtnEnable(...id) {
    let vBtnId;    
    for (let i = 0; i < id.length; i++) {
        vBtnId = document.querySelector("#btn_" + id[i]);
        vBtnId.disabled = false;
    }  
}

//------------------------------------------------------------------------------
// 기능 : 버튼 추가
// 인자 : id -> 추가되는 버튼에 지정할 id
//       name -> 추가되는 버튼에 지정할 버튼명칭                 
// 반환 : 없음
// 작성 : 2021.05.12 by dykim
// 예시 : cfBtnAdd("bar","BAR");
//------------------------------------------------------------------------------
function cfBtnAdd(id, name) {
    const vBtn = "<button class='btn white' id='btn_"+id+"'>" + name + "</button>";
    $(".btn-group").prepend(vBtn);
}

//------------------------------------------------------------------------------
// 기능 : 전달 받은 자릿수 값만큼 숫자앞에 0 생성
// 인자 : endNum -> 0을 제외하고 붙일 숫자
//       dights -> 총 자리수                 
// 반환 : 총 자리수 - 전달받은 수의 길이만큼 0이 붙은 숫자 
// 작성 : 2021.05.12 by dykim
// 수정 : 2021.12.07 by jhkim
// 예시 : cfNumToStr(1,3); --> 출력시 001
//------------------------------------------------------------------------------
function cfNumToStr(endNum, dights) {
    let vNum = "";
	let endStr = endNum.toString();
	let endLength = endStr.length;
    for (let i = 0; i < dights - endLength; i++) {
        vNum += "0";
    }
    return vNum + endNum;
}

//------------------------------------------------------------------------------
// 기능 : 테이블에 행 추가
// 인자 : id -> 테이블 아이디                 
// 반환 : 없음 
// 작성 : 2021.05.12 by dykim
// 예시 : cfAddRow("tbl_wrap")
// 유의점 : 테이블 행 추가전에 행이 하나라도 있어야 실행이됨. 존재하는 행의 css속성과 자식요소를 가져오기 때문
//------------------------------------------------------------------------------
function cfAddRow(id) {
    const vTable = document.querySelector("#" + id);
    //console.log(vTable.tBodies[0].rows[0].cells[0].classList.value);
    //console.log(vTable.tBodies[0].rows[0].children);
    //console.log(vTable.tBodies[0].rows[0].cells[11]);
    const nColLength = vTable.tHead.rows[0].cells.length;   //head부분에 디자인된 Column의 수
    let vChildren = null;
    let vClass = null;
    let vCell = null;
    const vNewRow = vTable.insertRow(1); //0은 head
 
    
    for (let i = 0; i < nColLength; i++) {
        vClass = vTable.tBodies[0].rows[1].cells[i].classList.value;    //td의 class속성을 가져옴
        //console.log(vTable.tBodies[0].rows[1].cells[i].classList.value);
        vCell = vNewRow.insertCell(i);      
        vCell.setAttribute('class', vClass);    //class 설정
        if (vTable.tBodies[0].rows[1].cells[i].children.length > 0){    //td안에 div태그나 select박스등의 자식요소가 있을경우
            vChildren = vTable.tBodies[0].rows[1].cells[i]; 
            //console.log(vTable.tBodies[0].rows[1].cells[i].innerHTML);
            vCell.innerHTML = vChildren.innerHTML;      //자식요소의 HTML태그 복사    
        }
    }
    vTable.tBodies[0].rows[0].cells[0].innerHTML;
}
//------------------------------------------------------------------------------
// 기능 : 테이블에 행 제거
// 인자 : id -> 테이블의 id
//       row -> 삭제할 행                 
// 반환 : 없음 
// 작성 : 2021.05.18 by dykim
// 예시 : cfDeleteRow("tbl_wrap",1);
//------------------------------------------------------------------------------
function cfDeleteRow(id, row) {
    const vTable = document.querySelector("#" + id);
    vTable.deleteRow(row); //0은 head
}
//------------------------------------------------------------------------------
// 기능 : 테이블의 특정 Cell에 값 설정
// 인자 : id -> 테이블의 id
//       rows -> 지정할 행의 번호
//       cells -> 지정할 Cell의 순번
//       value -> 설정할 값                  
// 반환 : 없음 
// 작성 : 2021.05.17 by dykim
// 예시 : cfSetHtml("tbl_wrap",0,0,"긴급");
//------------------------------------------------------------------------------
function cfSetHtml(id, rows, cells, value) {
    const vTable = document.querySelector("#" + id);
   
    vTable.tBodies[0].rows[rows].cells[cells].innerHTML = value; 
}
//------------------------------------------------------------------------------
// 기능 : 테이블의 특정 Cell에 값 가져오기
// 인자 : id -> 테이블의 id
//       rows -> 지정할 행의 번호
//       cells -> 지정할 Cell의 순번          
// 반환 : 없음 
// 작성 : 2021.05.17 by dykim
// 예시 : cfGetHtml("tbl_wrap",0,0);
// 유의점 : 해당 함수로는 테이블안에 입력박스나 select박스가 있을경우 해당 값은 가져오지 못함
//------------------------------------------------------------------------------
function cfGetHtml(id, rows, cells) {
    const vTable = document.querySelector("#" + id);
    return vTable.tBodies[0].rows[rows].cells[cells].innerHTML;
}
//------------------------------------------------------------------------------
// 기능 : 전표번호 채번
// 인자 : date -> 채번대상 날짜
//       code -> 전표구분                
// 반환 : 전표번호 4자리
// 작성 : 2021.05.21 by dykim
// 예시 : cfGetJunPyo("20210521", "P1");
//------------------------------------------------------------------------------
function cfGetJunPyo(date, code) {
    let vJunpyo;
    const oData = {
        "SearchGubun" : "junpyo",
        "Date" : date,
        "JunpyoGubun" : code
    }
    vJunpyo = cfAjaxSync("GET", "comm_util", oData, "junpyo");
    return vJunpyo;
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 동기방식으로 ajax 통신 실행
//인자 : type -> GET방식인지 POST방식인지 설정
//      url -> 경로
//      data -> JSONObject 형식의 데이터
//      name -> 콜백함수에서 구분되는 명칭
//반환 : servlet파일에서 넘겨받은 데이터
//작성 : 2021.05.19 by dykim
//예시 : const oData = {
//        "SearchGubun" : "date"
//      }; 
//      cfAjaxSync("GET", "comm_util", oData, "sysdate");
//---------------------------------------------------------------------------------------------------------------------------
function cfAjaxSync(type, url, data, name) {
    let vData;
	let vUrl = url.replace("", "");
    $.ajax({
        type: type,             //GET,POST 방식 지정
        url: "/" + vUrl + "",  //호출할 파일의 url설정
        data: data,             //통신 시도시 백엔드에 넘겨줄 데이터
        async : false,          //동기 방식으로 설정
        success: function (response) {
            //const aResponse = jQuery.parseJSON(response);
            const bStatus = true;
            vData = response;
			if(url == "comm_favorite") {
				pgCallBackSyncFav(response, name, bStatus);
			} else if(url == "comm_menuList"){
				pgCallBackSyncMenu(response, name, bStatus);
			} else {
	            pgCallBackSync(response, name, bStatus); 
			} 
        },
        error: function (request, status, error) {
            const bStatus = false;
            vData = bStatus;
            pgCallBackSync(request.status, name, bStatus);
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
            //$("#oCheckMessage").html("[DB Error: " + error + "] 시스템 로그를 확인 또는 전산실 연락바랍니다.");
            //$("#checkType").attr("class", "modal-content panel-success");
            //modalObj.modalOpenFunc('oCheckModal');
       },
    });
    return vData;
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 비동기방식으로 ajax 통신 실행
//인자 : type -> GET방식인지 POST방식인지 설정
//      url -> 경로
//      data -> JSONObject 형식의 데이터
//      name -> 콜백함수에서 구분되는 명칭
//반환 : JSONObject
//작성 : 2021.05.19 by dykim
//예시 : const oData = {
//        "SearchGubun" : "date"
//      }; 
//      cfAjaxAsync("GET", "comm_util", oData, "sysdate");
//---------------------------------------------------------------------------------------------------------------------------
function cfAjaxAsync(type, url, data, name) {
    let vData;
	let vUrl = url.replace("", "");
    $.ajax({
        type: type,                 //GET, POST 방식 지정
        url: "/" + vUrl + "",      //호출할 파일의 url설정
        data: data,                 //통신 시도시 백엔드에 넘겨줄 데이터
        async : true,               //비동기 방식으로 설정
        success: function (response) {
            //const aResponse = jQuery.parseJSON(response);
            const bStatus = true;
            vData = response;
            pgCallBackAsync(response, name, bStatus);
        },
		beforeSend: function(){ //보여주기 처리
			$('.loading-wrap').removeClass('display-none');
		},
		complete: function(){ // 감추기 처리
			$('.loading-wrap').addClass('display-none');
		},
        error: function (request, status, error) {
            const bStatus = false;
            vData = bStatus;
            pgCallBackAsync(request.status, name, bStatus);
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
            //$("#oCheckMessage").html("[DB Error: " + error + "] 시스템 로그를 확인 또는 전산실 연락바랍니다.");
            //$("#checkType").attr("class", "modal-content panel-success");
            //modalObj.modalOpenFunc('oCheckModal');
        },
	    timeout:100000
    });
    return vData;
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 입력가능한 태그의 값 가져오기
//인자 : selector -> 아이디 값
//반환 : String -> 입력된 값
//작성 : 2021.05.25 by dykim
//예시 : const vCvcod = cfGetValue("#txt_cvcod");
//---------------------------------------------------------------------------------------------------------------------------
function cfGetValue(selector) {
    const oId = document.querySelector("#" + selector); //아이디 선택
    let vVal = null;
    
    if (oId.attributes[0].value == "text") { //선택한 DOM이 <input type="text"> 일 때
        vVal = document.querySelector("#" + selector).value;
    } else if (oId.attributes[0].value == "radio"){ //선택한 DOM이 <input type="radio"> 일 때
        const vName = oId.name;
        vVal = document.querySelector("input[name="+vName+"]:checked").value; //체크된 라디오 버튼의 값
    } else if (oId.tagName == "SELECT") {
        vVal = document.querySelector("#" + selector).value; //선택한 DOM이 <select> 일 때
    }
    return vVal;
};
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 선택한 ID를 가진 object의 값 변경
//인자 : selector -> 아이디 값
//      value -> 변경할 값
//반환 : 없음
//작성 : 2021.05.25 by dykim
//예시 : cfSetValue("#txt_cvcod",cfGetLoginCvcod());
//---------------------------------------------------------------------------------------------------------------------------
function cfSetValue(selector, value) {
    const oId = document.querySelector("#" + selector);     //아이디 선택
    
    if (oId.attributes[0].value == "radio") {
        oId.checked = value;
    } else {
        oId.value = value;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 날짜 입력란 최대길이 설정
//인자 : id -> 아이디 값
//      size -> 설정할 길이
//반환 : 없음
//작성 : 2021.05.25 by dykim
//예시 : cfMaxLength("txt_toDate", "L");
//---------------------------------------------------------------------------------------------------------------------------
function cfMaxLength(id, size) {
    if (size == "S") {
        $("#" + id).attr('maxlength', 4); //2021    
    }
    else if (size == "M") {
        $("#" + id).attr('maxlength', 7); //2021-05
    }
    else if (size == "L") {
        $("#" + id).attr('maxlength', 10); //2021-05-25
    }
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 현황 페이지 네비게이션 설정
//인자 : total -> 총 데이터수
//      record -> 페이지당 표시할 행의 수
//      pageNo -> 페이지번호 
//반환 : 없음
//작성 : 2021.05.25 by dykim
//예시 : cfDrawPageNav(oResponse.RecordCount,oResponse.PageLength,oResponse.PageNo);
//---------------------------------------------------------------------------------------------------------------------------
function cfDrawPageNav(total, record, pageNo) {
    let vListHTML;
    //console.log(cfEmptyChk(name));
    if (!cfEmptyChk(name)) {
        name = "";
    } else {
        name = name + "-";
    }
    //console.log(name);
    if (total > record) {
        const nTotalpage = Math.ceil(total * 1.0 / record);   //총페이지          
        const nBlock = 10;
        //const blockNum = Math.ceil(nTotalpage * 1.0 / nBlock); //페이지번호 10개까지 표시 총블록
        const nNowBlock = parseInt((Number(pageNo) - 1) / nBlock) + 1;
        let nSpage = (nNowBlock - 1) * nBlock + 1; //시작페이지
        if (nSpage <= 1) {
            nSpage = 1;
        }
        let nEpage = nSpage + nBlock - 1;
        if (nTotalpage < nEpage) {
            nEpage = nTotalpage;
        };
        vListHTML = "";
        //console.log(nTotalpage);
        //앞페이지 이동(블럭)
        if (pageNo == 1) {
            vListHTML = "<a href='#' class='prev hidden' title='이전 페이지'><span class='icon-chevron-left'></span></a>";
        } else {
            const nPrevpage = Number(pageNo) - 1;
            vListHTML = "<a href='#' class='page-link prev' title='이전 페이지' id='" + nPrevpage + "'><span class='icon-chevron-left'></span></a>";
        }
        vListHTML = vListHTML + "<span>";
        for (i = nSpage; i <= nEpage; i++) {
            if (pageNo == i) {
                vListHTML = vListHTML + "<a href='#' class='page-link active' title='" + i + " 페이지'  id='" + i + "'>" + i + "</a>";
            } else {
                vListHTML = vListHTML + "<a href='#' class='page-link' title=" + i + " 페이지'  id='" + i + "'>" + i + "</a>";
            }
        }
        vListHTML = vListHTML + "</span>";
        //뒤페이지 이동(블럭)
        //console.log(nEpage, nTotalpage, nPageno);
        if (pageNo >= nTotalpage) {
            vListHTML = vListHTML + "<a href='#' class='next hidden' title='다음페이지'><span class='icon-chevron-right'></span></a>";
        } else {
            const nNextpage = Number(pageNo) + 1;
            vListHTML = vListHTML + "<a href='#' class='page-link next' title='다음페이지' id='" + nNextpage + "'><span class='icon-chevron-right'></span></a>";
        }
            //테이블의 길이때문에 페이지 네비게이션이 안보일경우 사용
            //if (gvHeightChk == true){
            //  cfAutoHeight(15);
            //  gvHeightChk = false; 
            //} else {
            //  cfAutoHeight(-14);
            //}
    } else {
        vListHTML = "";
    }
    return vListHTML;
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 거래처 팝업 페이지 네비게이션 설정
//인자 : total -> 총 데이터수
//      record -> 페이지당 표시할 행의 수
//      pageNo -> 페이지번호 
//반환 : 없음
//작성 : 2021.11.10 by jhlee
//예시 : cfDrawPageNav(oResponse.RecordCount,oResponse.PageLength,oResponse.PageNo);
//---------------------------------------------------------------------------------------------------------------------------
function cfDrawPageNavV(total, record, pageNo) {
    let vListHTML;
    //console.log(cfEmptyChk(name));
    if (!cfEmptyChk(name)) {
        name = "";
    } else {
        name = name + "-";
    }
    //console.log(name);
    if (total > record) {
        const nTotalpage = Math.ceil(total * 1.0 / record);   //총페이지          
        const nBlock = 10;
        //const blockNum = Math.ceil(nTotalpage * 1.0 / nBlock); //페이지번호 10개까지 표시 총블록
        const nNowBlock = parseInt((Number(pageNo) - 1) / nBlock) + 1;
        let nSpage = (nNowBlock - 1) * nBlock + 1; //시작페이지
        if (nSpage <= 1) {
            nSpage = 1;
        }
        let nEpage = nSpage + nBlock - 1;
        if (nTotalpage < nEpage) {
            nEpage = nTotalpage;
        };
        vListHTML = "";
        //console.log(nTotalpage);
        //앞페이지 이동(블럭)
        if (pageNo == 1) {
            vListHTML = "<a href='#' class='prevV hidden' title='이전 페이지'><span class='icon-chevron-left'></span></a>";
        } else {
            const nPrevpage = Number(pageNo) - 1;
            vListHTML = "<a href='#' class='page-vndmst-link prevV' title='이전 페이지' id='" + nPrevpage + "'><span class='icon-chevron-left'></span></a>";
        }
        vListHTML = vListHTML + "<span>";
        for (i = nSpage; i <= nEpage; i++) {
            if (pageNo == i) {
                vListHTML = vListHTML + "<a href='#' class='page-linkV active' title='" + i + " 페이지'  id='" + i + "'>" + i + "</a>";
            } else {
                vListHTML = vListHTML + "<a href='#' class='page-linkV' title=" + i + " 페이지'  id='" + i + "'>" + i + "</a>";
            }
        }
        vListHTML = vListHTML + "</span>";
        //뒤페이지 이동(블럭)
        //console.log(nEpage, nTotalpage, nPageno);
        if (pageNo >= nTotalpage) {
            vListHTML = vListHTML + "<a href='#' class='nextV hidden' title='다음페이지'><span class='icon-chevron-rightv'></span></a>";
        } else {
            const nNextpage = Number(pageNo) + 1;
            vListHTML = vListHTML + "<a href='#' class='page-vndmst-link nextV' title='다음페이지' id='" + nNextpage + "'><span class='icon-chevron-right'></span></a>";
        }
            //테이블의 길이때문에 페이지 네비게이션이 안보일경우 사용
            //if (gvHeightChk == true){
            //  cfAutoHeight(15);
            //  gvHeightChk = false; 
            //} else {
            //  cfAutoHeight(-14);
            //}
    } else {
        vListHTML = "";
    }
    return vListHTML;
}//---------------------------------------------------------------------------------------------------------------------------
//기능 : 품번 팝업 페이지 네비게이션 설정
//인자 : total -> 총 데이터수
//      record -> 페이지당 표시할 행의 수
//      pageNo -> 페이지번호 
//반환 : 없음
//작성 : 2021.11.10 by jhlee
//예시 : cfDrawPageNav(oResponse.RecordCount,oResponse.PageLength,oResponse.PageNo);
//---------------------------------------------------------------------------------------------------------------------------
function cfDrawPageNavI(total, record, pageNo) {
    let vListHTML;
    //console.log(cfEmptyChk(name));
    if (!cfEmptyChk(name)) {
        name = "";
    } else {
        name = name + "-";
    }
    //console.log(name);
    if (total > record) {
        const nTotalpage = Math.ceil(total * 1.0 / record);   //총페이지          
        const nBlock = 10;
        //const blockNum = Math.ceil(nTotalpage * 1.0 / nBlock); //페이지번호 10개까지 표시 총블록
        const nNowBlock = parseInt((Number(pageNo) - 1) / nBlock) + 1;
        let nSpage = (nNowBlock - 1) * nBlock + 1; //시작페이지
        if (nSpage <= 1) {
            nSpage = 1;
        }
        let nEpage = nSpage + nBlock - 1;
        if (nTotalpage < nEpage) {
            nEpage = nTotalpage;
        };
        vListHTML = "";
        //console.log(nTotalpage);
        //앞페이지 이동(블럭)
        if (pageNo == 1) {
            vListHTML = "<a href='#' class='prevI hidden' title='이전 페이지'><span class='icon-chevron-left'></span></a>";
        } else {
            const nPrevpage = Number(pageNo) - 1;
            vListHTML = "<a href='#' class='page-itemas-link prevI' title='이전 페이지' id='" + nPrevpage + "'><span class='icon-chevron-left'></span></a>";
        }
        vListHTML = vListHTML + "<span>";
        for (i = nSpage; i <= nEpage; i++) {
            if (pageNo == i) {
                vListHTML = vListHTML + "<a href='#' class='page-linkI active' title='" + i + " 페이지'  id='" + i + "'>" + i + "</a>";
            } else {
                vListHTML = vListHTML + "<a href='#' class='page-linkI' title=" + i + " 페이지'  id='" + i + "'>" + i + "</a>";
            }
        }
        vListHTML = vListHTML + "</span>";
        //뒤페이지 이동(블럭)
        //console.log(nEpage, nTotalpage, nPageno);
        if (pageNo >= nTotalpage) {
            vListHTML = vListHTML + "<a href='#' class='nextI hidden' title='다음페이지'><span class='icon-chevron-right'></span></a>";
        } else {
            const nNextpage = Number(pageNo) + 1;
            vListHTML = vListHTML + "<a href='#' class='page-itemas-link nextI' title='다음페이지' id='" + nNextpage + "'><span class='icon-chevron-right'></span></a>";
        }
            //테이블의 길이때문에 페이지 네비게이션이 안보일경우 사용
            //if (gvHeightChk == true){
            //  cfAutoHeight(15);
            //  gvHeightChk = false; 
            //} else {
            //  cfAutoHeight(-14);
            //}
    } else {
        vListHTML = "";
    }
    return vListHTML;
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 수신처 팝업 네비게이션 설정
//인자 : total -> 총 데이터수
//      record -> 페이지당 표시할 행의 수
//      pageNo -> 페이지번호 
//반환 : 없음
//작성 : 2021.11.10 by jhlee
//예시 : cfDrawPageNav(oResponse.RecordCount,oResponse.PageLength,oResponse.PageNo);
//---------------------------------------------------------------------------------------------------------------------------
function cfDrawPageNavC(total, record, pageNo) {
    let vListHTML;
    //console.log(cfEmptyChk(name));
    if (!cfEmptyChk(name)) {
        name = "";
    } else {
        name = name + "-";
    }
    //console.log(name);
    if (total > record) {
        const nTotalpage = Math.ceil(total * 1.0 / record);   //총페이지          
        const nBlock = 10;
        //const blockNum = Math.ceil(nTotalpage * 1.0 / nBlock); //페이지번호 10개까지 표시 총블록
        const nNowBlock = parseInt((Number(pageNo) - 1) / nBlock) + 1;
        let nSpage = (nNowBlock - 1) * nBlock + 1; //시작페이지
        if (nSpage <= 1) {
            nSpage = 1;
        }
        let nEpage = nSpage + nBlock - 1;
        if (nTotalpage < nEpage) {
            nEpage = nTotalpage;
        };
        vListHTML = "";
        //console.log(nTotalpage);
        //앞페이지 이동(블럭)
        if (pageNo == 1) {
            vListHTML = "<a href='#' class='prevC hidden' title='이전 페이지'><span class='icon-chevron-left'></span></a>";
        } else {
            const nPrevpage = Number(pageNo) - 1;
            vListHTML = "<a href='#' class='page-login-link prevC' title='이전 페이지' id='" + nPrevpage + "'><span class='icon-chevron-left'></span></a>";
        }
        vListHTML = vListHTML + "<span>";
        for (i = nSpage; i <= nEpage; i++) {
            if (pageNo == i) {
                vListHTML = vListHTML + "<a href='#' class='page-linkC active' title='" + i + " 페이지'  id='" + i + "'>" + i + "</a>";
            } else {
                vListHTML = vListHTML + "<a href='#' class='page-linkC' title=" + i + " 페이지'  id='" + i + "'>" + i + "</a>";
            }
        }
        vListHTML = vListHTML + "</span>";
        //뒤페이지 이동(블럭)
        //console.log(nEpage, nTotalpage, nPageno);
        if (pageNo >= nTotalpage) {
            vListHTML = vListHTML + "<a href='#' class='nextC hidden' title='다음페이지'><span class='icon-chevron-right'></span></a>";
        } else {
            const nNextpage = Number(pageNo) + 1;
            vListHTML = vListHTML + "<a href='#' class='page-login-link nextC' title='다음페이지' id='" + nNextpage + "'><span class='icon-chevron-right'></span></a>";
        }
            //테이블의 길이때문에 페이지 네비게이션이 안보일경우 사용
            //if (gvHeightChk == true){
            //  cfAutoHeight(15);
            //  gvHeightChk = false; 
            //} else {
            //  cfAutoHeight(-14);
            //}
    } else {
        vListHTML = "";
    }
    return vListHTML;
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 테이블 내용 보여주기
//인자 : table -> 총 데이터수
//      data -> 데이터 오브젝트
//      i -> 행
//      obj -> 콤보박스를 사용할 Object
//반환 : 없음
//작성 : 2021.05.25 by dykim
//예시 : cfDrawPageTable(vListHTML, aItem, i, oEdit);
//---------------------------------------------------------------------------------------------------------------------------
function cfDrawTable(table, data, i, obj) {
    const vCol = table.split("\n");
    let vListHTML = '';
    let vRow = '';
    let regEx;
    let vInput;
    
    //console.log(vCol[1].match(/\">(?=).+/));
    //console.log(vCol[1].match(/\">(?=).+/)[0].replace('">','').replace('</td>',''));
    //console.log(vCol[1].replace(/\">(?=).+/,"123456"));
    vCol.forEach(function(item, row, array){
        vListHTML = vCol;
        //<tr>의 아이디 값 설정
        if(row == 0) { 
            vListHTML = vListHTML[row].replace(/\id(?=).+/,'id="' + i + '">');
//console.log("1. "+vListHTML);
            vRow += vListHTML;
            //행<td>에 대해서 설정
        } else if (row != 0 && !(vCol.length-1 == row)) {
            //console.log(vCol);
//            console.log(vListHTML[row]);
            //console.log(row);
            //console.log(vCol.length);
            //<td class="">에 ">를 포함한 뒤에 문자를 모두 찾고 <td></td>사이에 있는 문자를 추출  
            vListHTML = vListHTML[row].match(/\">(?=).+/)[0].replace('">','').replace('</td>','');
//console.log("2. "+vListHTML);
            //추출한 문자를 replace하기 위해 정규식에 추출한 문자 추가
            regEx = new RegExp('\">'+vListHTML+'(?=).+');
//console.log("3. "+regEx);
            //class에 dropdown이 있을 때
            if (vCol[row].search("dropdown") != -1) {
                vInput = "<select id='sel_"+ vListHTML + i + "'>" + obj[vListHTML];
                //console.log(vInput);
                vListHTML = vListHTML.replace(vListHTML,vInput);
            //class에 edit이 있을 때
            } else if (vCol[row].search("edit") != -1) {
                vInput = "<div class='row_data' id='" + vListHTML + i + "'>" + data[vListHTML] + "</div>";
                vListHTML = vListHTML.replace(vListHTML, vInput);
			//class에 popup이 있을 때
 			} else if (vCol[row].search("popup") != -1) {
      			vInput = "<div class='row_popup' id='" + vListHTML + i + "'>" + data[vListHTML] + "</div>";
      			vListHTML = vListHTML.replace(vListHTML, vInput);
			//class에 popup이 있을 때
 			} else if (vCol[row].search("click") != -1) {
      			vInput = "<div class='row_click' id='" + vListHTML + i + "'>" + data[vListHTML] + "</div>";
      			vListHTML = vListHTML.replace(vListHTML, vInput);
            //class에 chkbox가 있을 때    
            } else if (vCol[row].search("chkbox") != -1) {
                vInput = "<input type='checkbox' class=" + vListHTML + " name='" + vListHTML +"' id='cbx_"+ vListHTML + i + "'>";
                vListHTML = vListHTML.replace(vListHTML, vInput);
            //class에 chkbox02가 있을 때    
            } else if (vCol[row].search("chkbox02") != -1) {
                vInput = "<input type='checkbox' class=" + vListHTML + " name='" + vListHTML +"2' id='cbx2_"+ vListHTML + i + "'>";
                vListHTML = vListHTML.replace(vListHTML, vInput);
            //class에 chgFile가 있을 때    
            } else if (vCol[row].search("chgFile") != -1) {
				if(data[vListHTML].trim().length > 0){
	                vInput = "<div class='" + vListHTML + " file_img' name='" + vListHTML +"' id='"+ vListHTML + i + "'>";
				} else {
	                vInput = "<div class=" + vListHTML + " name='" + vListHTML +"' id='"+ vListHTML + i + "'>";
				}
                vListHTML = vListHTML.replace(vListHTML, vInput);
			} else {
//console.log("4. "+vListHTML);

                vListHTML = vListHTML.replace(vListHTML,data[vListHTML]);    
//console.log("5. "+vListHTML);

            }
//console.log("6. "+vRow);

            vRow += vCol[row].replace(regEx,'">' + vListHTML + '</td>');
//console.log("7. "+vRow);
        } else if (vCol.length -1 == row) {
            vRow += "</tr>"; 
        }
    });
//console.log("8. "+vRow);
    return vRow;
}
//---------------------------------------------------------------------------------------------------------------------------
//기능 : 지정한 문자 모두 변경
//인자 : data -> 원본 문자열
//      searchVal -> 찾을 문자열
//      replaceVal -> 바꿀 문자열
//반환 : 없음
//작성 : 2021.06.04 by dykim
//예시 : cfReplaceAll(data,searchVal,replaceVal);
//---------------------------------------------------------------------------------------------------------------------------
function cfReplaceAll(data,searchVal, replaceVal) {
    let regEx = new RegExp(searchVal,"gi");
    return data.replace(regEx, replaceVal);
}

//---------------------------------------------------------------------------------------------------------------------------
//기능 : URL의 Origin주소 가져오기
//인자 : 없음
//반환 : origin주소
//작성 : 2021.06.07 by dykim
//예시 : cfGetOriginURL();
//---------------------------------------------------------------------------------------------------------------------------
function cfGetOriginURL() {
    return document.location.origin;
}
//-----------------------------------------------------//
//기능 : 페이지 처리가 넘어가도 클릭 시 테두리 생성
//인자 : 없음
//반환 : 없음
//작성 : 2021.09.14 by jhlee
//예시 : 테이블 데이터 tr 클래스에 click을 넣으면 모든 tr에 작동함
//-----------------------------------------------------//
$(document).on('click','.click',function(e) {
    $('.click').removeClass('on');
    $(this).addClass('on');
    $(this).focus();
});

//-----------------------------------------------------//
//기능 : 테이블 내용을 엑셀 파일로 다운로드
//인자 : 테이블 아이디, 엑셀파일 제목
//반환 : 없음
//작성 : 2021.10.22 by jwlee
//예시 : function onExcel() {	fnExcelReport('tbl_wrap', '출발처리-2021.10.22');}
//-----------------------------------------------------//
function fnExcelReport(id, title) {
    var tab_text
             = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
    tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';
    tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
    tab_text = tab_text + "<table border='1px'>";

    var exportTable = $('#' + id).clone();
    exportTable.find('input').each(function (index, elem) { $(elem).remove(); });
    exportTable.find('select').each(function (index, elem) { $(elem).remove(); });
	
	if(exportTable.text().trim() == null || exportTable.text().trim() == ' '|| exportTable.text().trim() == ''){
		$("#oCheckMessage").html("변환할 데이터가 없습니다.");
    	$("#checkType").attr("class", "modal-content panel-success");
        modalObj.modalOpenFunc('oCheckModal');
		return false;
	} 

    tab_text = tab_text + exportTable.html();
    tab_text = tab_text + '</table></body></html>';

    var data_type = 'data:application/vnd.ms-excel';
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var fileName = title + '.xls';
    //Explorer 환경에서 다운로드
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
	    if (window.navigator.msSaveBlob) {
	        var blob = new Blob([tab_text], {
	        	type: "application/csv;charset=utf-8;"
	        });
	        navigator.msSaveBlob(blob, fileName);
	    }
    } else {
    var blob2 = new Blob([tab_text], {
    	type: "application/csv;charset=utf-8;"
    });
    var filename = fileName;
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob2);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
    }
}