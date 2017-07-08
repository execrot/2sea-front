FrontStar.get('module').registerModule('layout', function () {

    return {

        scrollInterval: null,

        init: function () {

            this.initCompleted();

            var view = FrontStar.get('view');

            view.render('layout/view/layout', {}, (function(tpl){

                this.element.html(tpl);

                $(window).scroll((function(){

                    if ($(window).scrollTop() > 100) {
                        $('header').addClass('middle');
                    } else {
                        $('header').removeClass('middle');
                    }

                }).bind(this));

                $(window).scroll();




                $(window).resize((function (){

                    clearTimeout(this.scrollInterval);

                    $('[data-menu]').removeClass('transitory');

                    this.scrollInterval = setTimeout((function(){

                        $('[data-menu]').addClass('transitory');

                    }).bind(this), 1000);

                }).bind(this));

                $(window).resize();



                $('[data-menu-button]').on('click', function(){
                    if ($('body').hasClass('menu-opened')) {
                        $('body').removeClass('menu-opened');
                    } else {
                        $('body').addClass('menu-opened');
                    }
                });

                $('[data-menu-item]').on('click', function () {

                    if ($('body').hasClass('menu-opened')) {
                        $('body').removeClass('menu-opened');
                    }

                    $(window).scrollTop(0);
                });

                $('[data-lang]').on('click', function () {

                    FrontStar.getService().get('translate').changeLanguage($(this).data('lang'));

                    $('[data-lang]').removeClass('active');
                    $(this).addClass('active');
                });

                var lang = FrontStar.getService().get('translate').getActiveLanguage();

                $('[data-lang=' + lang + ']').addClass('active');

            }).bind(this));
        }
    }
});