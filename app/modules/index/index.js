FrontStar.get('module').registerModule('index', function () {

    return {

        layout: true,

        init: function () {

            this.initCompleted();

            var view = FrontStar.get('view');

            view.render('index/view/index', {}, (function(tpl){

                this.element.html(tpl);

                FrontStar.get('module').load('filter', {}, $('[data-module=filter]'));

            }).bind(this));
        },

        unload: function () {
            this.element.remove();
            this.unloadCompeted();
        }
    }
});