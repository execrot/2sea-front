FrontStar.registerComponent('router', {

    lastRoute: null,
    interval: null,

    start: function () {

        this.interval = setInterval(this.scheduler.bind(this));

        if (FrontStar.getConfig().router.captureLinks) {

            var dom = FrontStar.get('dom');

            dom().live('click', 'a[href]', (function(e){

                e.preventDefault() && e.stopPropagation();

                this.go(dom(e.target).attr('href'));
                return false;

            }).bind(this));

        }
    },

    scheduler: function () {

        if (location.pathname != this.lastRoute) {

            this.lastRoute = location.pathname;
            this.loadModule(this.lastRoute);
        }
    },

    loadModule: function (url) {

        url = url.split('/').filter(function(value){
            return value.length;
        });

        var matchModule = null;
        var matchRouteIndex = -1;
        var params = {};
        var router = FrontStar.getConfig().router.routes;

        for (var routerIndex = 0; routerIndex < router.length; routerIndex ++) {

            var moduleName = router[routerIndex].module;
            var routeComponents = router[routerIndex].route.split('/');
            var vars = 0, static = 0, match = 0, potentialParams = {};

            for (var i = 0; i < routeComponents.length; i ++) {

                if (routeComponents[i][0] == ':') {
                    potentialParams[routeComponents[i].substr(1)] = url[i];
                    vars++;
                }
                else {
                    static++;

                    if (url[i] == routeComponents[i]) {
                        match++;
                    }
                }
            }

            if (match == static) {
                matchModule = moduleName;
                params = potentialParams;
                matchRouteIndex = routerIndex;
            }
        }

        if (!matchModule) {

            if (!url.length) {
                matchModule = FrontStar.getConfig().router.default;
            }
            else {
                matchModule = url[0];

                for (var i = 1; i < url.length; i+=2) {
                    if (url[i+1]) {
                        params[url[i]] = url[i+1];
                    }
                }
            }
        }

        if (FrontStar.get('module').isExists(matchModule)) {

            if (router[matchRouteIndex] && router[matchRouteIndex].defaults) {

                for (var defaults in router[matchRouteIndex].defaults) {

                    if (!params[defaults]) {
                        params[defaults] = router[matchRouteIndex].defaults[defaults];
                    }
                }
            }

            FrontStar.get('module').load(matchModule, params);
        }
        else {
            FrontStar.get('module').load(FrontStar.getConfig().router.error);
        }
    },

    go: function (url) {

        if (location.pathname == url) {
            this.loadModule(url);
        }
        history.pushState({}, null, url);
    },

    set: function (url) {

        if (url[0] != '/') {
            url = '/' + url;
        }

        this.lastRoute = url;
        history.pushState({}, null, url);
    }
});