FrontStar.get('module').registerModule('index', function () {

    return {

        layout: true,

        init: function () {

            this.initCompleted();

            var view = FrontStar.get('view');

            view.render('index/view/index', {data: "somedata"}, (function(tpl){

                this.element.html(tpl);

                new Swiper('main > .swiper-container', {
                    centeredSlides: true,
                    autoplay: 3000,
                    autoplayDisableOnInteraction: false
                });

                $(window).scroll(function(){
                    if ($(this).scrollTop() > 400) {
                        $('header').addClass('middle');
                    } else {
                        $('header').removeClass('middle');
                    }
                });
                $(window).scroll();

                $('[data-menu-button]').on('click', function(){
                    if ($('body').hasClass('menu-opened')) {
                        $('body').removeClass('menu-opened');
                    } else {
                        $('body').addClass('menu-opened');
                    }
                });

            }).bind(this));
        },

        unload: function () {
            this.element.remove();
            this.unloadCompeted();
        }
    }
});