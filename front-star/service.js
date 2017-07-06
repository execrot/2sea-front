FrontStar.registerService({

    __services: {},

    __statusNew: 'new',
    __statusInit: 'init',
    __statusFinished: 'finished',

    __serviceContainerStatus: 'new',

    exceptions: {
        TryingToGetUndefinedService: function (name) {
            return {
                type: 'TryingToLoadUndefinedModule',
                name: name
            };
        },
        ServiceNameRedefinition: function (name) {
            return {
                type: 'ServiceNameRedefinition',
                name: name
            };
        },
        TryingToInitUndefinedService: function (name) {
            return {
                type: 'TryingToInitUndefinedService',
                name: name
            };
        },
        TryingToInitServicesAgain: function () {
            return {
                type: 'TryingToInitServicesAgain'
            };
        },
        OnRunRegistrationCantBeProceededBeforeAppInitialization: function (name) {
            return {
                type: 'OnRunRegistrationCantBeProceededBeforeAppInitialization',
                name: name
            };
        }
    },

    __init: function () {
        for (var name in this.__services) {
            this.__initService(name);
        }
    },

    __initService: function (name) {

        if (!this.__services[name]) {
            throw this.exceptions.TryingToInitUndefinedService(name);
        }

        var service = this.__services[name];

        if (service.status != this.__statusNew) {
            return;
        }

        if (!this.__isDependenciesLoadedFor(name)) {

            service.dependencies.forEach((function (dependency) {

                this.__initService(dependency);

            }).bind(this));
        }
        else if (service.service.init) {

            service.status = this.__statusInit;

            service.service.initCompleted = this.__serviceInitCompleted.bind(this);
            service.service.init() && (delete service.service.init);
        }
        else {
            this.__serviceInitCompleted(name);
        }
    },

    __serviceInitCompleted: function (name) {

        var service = this.__services[name];
        service.status = this.__statusFinished;

        if (service.callback) {
            service.callback();
        }

        if (this.__isAllServicesLoaded()) {

            if (this.__serviceContainerStatus != this.__statusFinished) {
                this.__serviceContainerStatus = this.__statusFinished;
                this.initCompleted();
            }
        }
        else {
            this.__init();
        }
    },

    __isAllServicesLoaded: function () {

        for (var service in this.__services) {
            if (this.__services[service].status != this.__statusFinished) {
                return false;
            }
        }

        return true;
    },

    __isDependenciesLoadedFor: function (name) {

        var loaded = true;

        this.__services[name].dependencies.forEach((function (service) {

            if (this.__services[service].status != this.__statusFinished) {
                loaded = false;
            }

        }).bind(this));

        return loaded;
    },

    onRunRegisterService: function (name, dependencies, service, callback) {

        if (this.__serviceContainerStatus != this.__statusFinished) {
            throw this.exceptions.OnRunRegistrationCantBeProceededBeforeAppInitialization(name);
        }

        this.registerService(name, dependencies, service, callback);
        this.__init(name);
    },

    registerService: function (name, dependencies, service, callback) {

        if (Object.keys(this.__services).indexOf(name) != -1) {
            throw this.exceptions.ServiceNameRedefinition(name);
        }

        if (dependencies instanceof Array) {

            this.__services[name] = {
                service: service,
                dependencies: dependencies,
                status: this.__statusNew,
                callback: callback
            };

            return;
        }

        this.__services[name] = {
            service: dependencies,
            dependencies: [],
            status: this.__statusNew,
            callback: service
        };
    },

    get: function (name) {

        if (this.__services[name]) {
            return this.__services[name].service;
        }

        throw this.exceptions.TryingToGetUndefinedService(name);
    },

    init: function () {

        if (this.__serviceContainerStatus != this.__statusNew) {
            throw this.exceptions.TryingToInitServicesAgain();
        }

        this.__serviceContainerStatus = this.__statusInit;

        this.__init();
    }
});