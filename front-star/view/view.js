FrontStar.registerComponent('view', {

    __plugins: {},
    registerPlugin: function (name, plugin) {
        this.__plugins[name] = plugin;
    },

    __templates: {},
    registerTemplate: function (name, template) {
        this.__templates[name] = template;
    },

    exceptions: {

        TryingToRenderUndefinedTemplate: function (template) {
            return {
                type: 'TryingToRenderUndefinedTemplate',
                template: template
            };
        },

        TemplateRenderError: function (template, exception) {
            return {
                type: 'TemplateRenderError',
                template: template,
                exception: exception
            };
        }
    },

    init: function () {

        var templates = document.querySelectorAll('[data-fs-view][data-view][data-src]');

        if (templates.length == 0 || Object.keys(this.__templates).length == templates.length) {
            this.initCompleted('view');
            return;
        }

        var index = 0;

        var loadTemplate = (function () {

            var template = templates[index];

            var src = template.getAttribute('data-src');
            var view = template.getAttribute('data-view');

            var ajax = new XMLHttpRequest();
            ajax.open('GET', src);

            ajax.onreadystatechange = (function () {

                if (ajax.readyState == 4) {

                    this.registerTemplate(view, ajax.responseText);

                    if (Object.keys(this.__templates).length == templates.length) {
                        this.initCompleted('view');
                        return;
                    }

                    index++;
                    loadTemplate(index);
                }

            }).bind(this);

            ajax.send();

        }).bind(this);

        loadTemplate(index);
    },

    renderByTemplateSource: function (templateSource, data, callback, templateName) {

        var template = "var p=[],print=function(){p.push.apply(p,arguments);};" +
            "with(obj){p.push('" +
            templateSource
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'")
            + "');} return p.join('');";

        if (!data) {
            data = {};
        }

        var copy = data.constructor();
        for (var attr in data) {
            if (data.hasOwnProperty(attr)) copy[attr] = data[attr];
        }

        copy.plugins = this.plugins;

        var renderedTemplate = null;

        try {
            renderedTemplate = (new Function("obj", template))(copy);
        }

        catch (exception) {
            throw this.exceptions.TemplateRenderError(templateName, exception);
        }

        if (!callback) {
            return renderedTemplate;
        }

        callback(renderedTemplate);
    },

    /**
     * @param template
     * @param data
     * @param callback
     *
     * @throws UndefinedTemplateException
     *
     * @returns {null, String}
     */
    render: function (template, data, callback) {

        if (!this.__templates[template]) {
            throw this.exceptions.TryingToRenderUndefinedTemplate(template);
        }

        return this.renderByTemplateSource(this.__templates[template], data, callback, template);
    }
});