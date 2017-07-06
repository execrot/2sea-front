FrontStar.registerComponent('storage', {

    namespace: null,
    adapter: window.localStorage,

    __namespace: function (key) {
        return this.namespace + ":" + key;
    },

    init: function () {
        this.namespace = FrontStar.getConfig().storage.namespace;
        this.initCompleted('storage');
    },

    setItem: function (key, value) {

        return this.adapter.setItem(
            this.__namespace(key),
            window.btoa(JSON.stringify(value))
        );
    },

    getItem: function (key) {

        var value = this.adapter.getItem(
            this.__namespace(key)
        );

        if (value) {
            return JSON.parse(window.atob(value));
        }
        return value;
    },

    removeItem: function (key) {
        return this.adapter.removeItem(
            this.__namespace(key)
        );
    },

    clear: function () {
        return this.adapter.clear();
    }
});