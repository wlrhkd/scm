window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function(){
        //notice 슬라이더
        var noticeSwiper = new Swiper('.notice-box', {
            slidesPerView: 4,
            spaceBetween: 0,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        })

        //자료실 슬라이더
        var dataSwiper = new Swiper('.data-box', {
            slidesPerView: 3,
            spaceBetween: 0,
            loop: false,
			clickable: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }, 800);   
      
    //오른쪽 상단 선택메뉴
    var selMenuObj = {
        etcMenu : document.querySelector('.etc-menu'),
        selMenu : document.querySelector('.sel-menu'),
        btnClose : document.querySelector('.sel-menu .btn-close'),
        setEvent : function(){
            this.etcMenu.onclick = this.etcMenuOpen.bind(selMenuObj);
            this.btnClose.onclick = this.etcMenuClose.bind(selMenuObj);
        },
        etcMenuOpen : function(){
            this.selMenu.classList.add('on')
        },
        etcMenuClose : function(){
            this.selMenu.classList.remove('on')
        },
        init : function(){
            this.setEvent();
        }
    }
    selMenuObj.init();
});