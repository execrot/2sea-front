FrontStar.get('module').registerModule('filter', function () {

    return {

        init: function () {

            this.initCompleted();

            var view = FrontStar.get('view');

            view.render('index/view/filter', {}, (function(tpl){

                this.element.html(tpl);

            }).bind(this));
        },

        unload: function () {
            this.element.remove();
            this.unloadCompeted();
        }
    }
});