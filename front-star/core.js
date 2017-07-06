FrontStar = {

    __initialized: false,
    __appInitCompletedCallback: null,
    __components: {},
    __service: null,
    __initializedComponents: [],
    __config: {},

    __appInitCompleted: function () {

        this.__initialized = true;

        if (this.__appInitCompletedCallback) {
            this.__appInitCompletedCallback();
        }
    },

    __componentInitCompleted: function (name) {

        this.__initializedComponents.push(name);

        if (this.__initializedComponents.length == Object.keys(this.__components).length) {

            if (this.__service) {

                this.__service.initCompleted = (function(){

                    this.__appInitCompleted();

                }).bind(this);

                this.__service.init();
            }
            else {
                this.__appInitCompleted();
            }
        }
    },

    registerComponent: function (name, component) {
        this.__components[name] = component;
    },

    registerService: function (service) {
        this.__service = service;
    },

    get: function (name) {
        return this.__components[name];
    },

    getService: function () {
        return this.__service;
    },

    getConfig: function () {
        return this.__config;
    },

    init: function (config, callback){

        if (this.__initialized) {
            this.__appInitCompleted();
            return;
        }

        this.__appInitCompletedCallback = callback;
        this.__config = config;

        for (var componentName in this.__components) {

            var component = this.__components[componentName];

            if (component.init) {

                component.initCompleted = function(name){
                    this.__componentInitCompleted(name);
                }.bind(this);
                component.init();
            }
            else {
                this.__componentInitCompleted(componentName);
            }
        }
    }
};