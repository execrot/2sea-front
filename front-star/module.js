FrontStar.registerComponent('module', {

    __modules: {},
    __loadedModules: {},
    __activeModuleName: null,

    registerModule: function (name, module) {
        this.__modules[name] = module;
    },

    exceptions: {

        TryingToLoadUndefinedModule: function (module) {
            return {
                type: 'TryingToLoadUndefinedModule',
                module: module
            };
        },

        TryingToUnloadUndefinedModule: function (module) {
            return {
                type: 'TryingToUnloadUndefinedModule',
                module: module
            };
        }
    },

    load : function (name, params, element, callback) {

        if (!this.__modules[name]) {
            throw this.exceptions.TryingToLoadUndefinedModule(name);
        }

        var module = this.__modules[name]();

        if (this.__activeModuleName && module.layout) {

            this.unload(this.__activeModuleName, (function (n, p, e, c) {

                return (function () {

                    this.__load(n, p, e, c);

                }).bind(this);

            }).bind(this)(name, params, element, callback));
        }
        else {
            this.__load(name, params, element, callback);
        }
    },

    __load: function (name, params, element, callback) {

        this.__loadedModules[name] = this.__modules[name]();

        if (this.__loadedModules[name].layout) {
            this.__activeModuleName = name;
        }

        if (!element) {

            var moduleDiv = '<div data-module="' + name + '"></div>';
            var rootDiv = 'body';

            if (FrontStar.getConfig().router.layout && name != FrontStar.getConfig().router.layout) {
                rootDiv = '#' + FrontStar.getConfig().router.layout;
            }

            if (this.__loadedModules[name].layout) {
                $(rootDiv).html(moduleDiv);
            }
            else {
                $(rootDiv).append(moduleDiv);
            }

            element = FrontStar.get('dom')('[data-module=' + name + ']');
        }

        this.__loadedModules[name].element = element;
        this.__loadedModules[name].params = params ? params : {};

        if (this.__loadedModules[name].init) {

            if (callback) {
                this.__loadedModules[name].initCompleted = callback;
            }
            else {
                this.__loadedModules[name].initCompleted = function () {};
            }

            this.__loadedModules[name].init();
        }
        else if (callback) {
            callback();
        }
    },

    unload : function (module, callback) {

        if (!this.__loadedModules[module]) {
            throw this.exceptions.TryingToUnloadUndefinedModule(module);
        }

        if (this.__loadedModules[module].unload) {

            if (callback) {

                this.__loadedModules[module].unloadCompeted = (function(){

                    delete this.__loadedModules[module];

                    (callback.bind(this))();

                }).bind(this);
            }
            else {
                this.__loadedModules[module].unloadCompeted = (function(){

                    delete this.__loadedModules[module];

                }).bind(this);
            }

            this.__loadedModules[module].unload();
        }

        else if (callback) {
            delete this.__loadedModules[module];
            callback();
        }

        else {
            delete this.__loadedModules[module];
        }
    },

    isLoaded : function (module) {
        return !!this.__loadedModules[module];
    },

    isExists : function (module) {
        return !!this.__modules[module];
    }
});