FrontStar.init({
    api: {},
    storage: {
        namespace: '2sea'
    },
    router: {
        captureLinks: true,
        default: 'index',
        error: '404',
        routes: [{
            route: '',
            module: 'index'
        }, {
            route: 'some-page/:userId/videos/:hitman',
            module: 'video',
            defaults: {
                param: 'value'
            }
        }, {
            route: '404',
            module: '404'
        }]
    }
},function(){
    FrontStar.get('router').start();
});