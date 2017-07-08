FrontStar.init({
    api: {},
    storage: {
        namespace: '2sea'
    },
    router: {
        captureLinks: true,
        default: 'index',
        layout: 'layout',
        error: '404',
        routes: [{
            route: '',
            module: 'index'
        }, {
            route: 'locality/:locality',
            module: 'index'
        }, {
            route: '404',
            module: '404'
        }]
    }
},function(){
    FrontStar.get('router').start();
});