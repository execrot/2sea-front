FrontStar.getService().registerService('wow', {
    init: function(){
        (new WOW()).init();
        this.initCompleted('wow');
    }
});